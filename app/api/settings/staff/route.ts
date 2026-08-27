import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// GET - Fetch all staff members
// ============================================================
export async function GET() {
  try {
    console.log("[Staff API] Starting GET request...");
    const supabase = createClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[Staff API] Session error:", sessionError.message);
      return NextResponse.json(
        { success: false, error: "Session error: " + sessionError.message },
        { status: 401 }
      );
    }

    if (!session) {
      console.log("[Staff API] No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Staff API] User authenticated:", session.user.email);

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("[Staff API] Profile error:", profileError.message);
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    if (!profile || profile.role !== "admin") {
      console.log("[Staff API] Not admin:", profile?.role);
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all staff members
    const { data: staff, error: staffError } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (staffError) {
      console.error("[Staff API] Staff fetch error:", staffError.message);
      return NextResponse.json(
        { success: false, error: staffError.message },
        { status: 500 }
      );
    }

    console.log(`[Staff API] Found ${staff?.length || 0} staff members`);
    return NextResponse.json({
      success: true,
      data: staff || [],
      count: staff?.length || 0,
    });
  } catch (error) {
    console.error("[Staff API] GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Create a staff invitation
// ============================================================
export async function POST(request: Request) {
  try {
    console.log("[Staff API] Starting POST request...");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("[Staff API] No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Staff API] User authenticated:", session.user.email);

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      console.log("[Staff API] Not admin:", profile?.role);
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, full_name, role, department } = body;

    console.log("[Staff API] Creating invitation for:", email);

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email required" },
        { status: 400 }
      );
    }

    if (!full_name) {
      return NextResponse.json(
        { success: false, error: "Full name required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new staff profile
    const { data: newStaff, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          email,
          full_name,
          role: role || "sales",
          department: department || "Sales",
          status: "inactive",
          invited_by: session.user.id,
          invited_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("[Staff API] Insert error:", insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    console.log("[Staff API] Staff created successfully:", newStaff.id);

    return NextResponse.json({
      success: true,
      data: newStaff,
      message: "Staff created successfully",
    });
  } catch (error) {
    console.error("[Staff API] POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH - Update staff member
// ============================================================
export async function PATCH(request: Request) {
  try {
    console.log("[Staff API] Starting PATCH request...");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("[Staff API] No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Staff API] User authenticated:", session.user.email);

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      console.log("[Staff API] Not admin:", profile?.role);
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, full_name, phone, role, department, job_title, employee_number, status } = body;

    console.log("[Staff API] Updating staff:", id);

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID required" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (job_title !== undefined) updateData.job_title = job_title;
    if (employee_number !== undefined) updateData.employee_number = employee_number;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    // Update staff member
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Staff API] Update error:", updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    console.log("[Staff API] Staff updated successfully:", id);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Staff updated successfully",
    });
  } catch (error) {
    console.error("[Staff API] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE - Remove staff member
// ============================================================
export async function DELETE(request: Request) {
  try {
    console.log("[Staff API] Starting DELETE request...");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("[Staff API] No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Staff API] User authenticated:", session.user.email);

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      console.log("[Staff API] Not admin:", profile?.role);
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID required" },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete staff member
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Staff API] Delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    console.log("[Staff API] Staff deleted successfully:", id);

    return NextResponse.json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("[Staff API] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}