import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    console.log("[Customers API] Starting request...");
    
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[Customers API] Session error:", sessionError);
      return NextResponse.json(
        { success: false, error: "Session error: " + sessionError.message },
        { status: 401 }
      );
    }
    
    if (!session) {
      console.log("[Customers API] No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Customers API] User:", session.user.email);

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("[Customers API] Profile error:", profileError);
      // If no company yet, return empty array instead of error
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    if (!profile?.company_id) {
      console.log("[Customers API] No company found for user");
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    // Fetch customers
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", profile.company_id)
      .order("name", { ascending: true });

    if (error) {
      console.error("[Customers API] Database error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`[Customers API] Found ${data?.length || 0} customers`);
    return NextResponse.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error("[Customers API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("[Customers API] POST request started...");
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("[Customers API] Body:", body);
    
    const { name, email, phone, address, tax_id, notes } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    // Insert customer
    const { data, error } = await supabase
      .from("customers")
      .insert([{
        company_id: profile.company_id,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        tax_id: tax_id || null,
        notes: notes || null,
        status: "active",
      }])
      .select()
      .single();

    if (error) {
      console.error("[Customers API] Insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error("[Customers API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}