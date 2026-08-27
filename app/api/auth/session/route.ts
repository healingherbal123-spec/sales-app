import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    console.log("[Session API] Checking session...");
    const supabase = createClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[Session API] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!session) {
      console.log("[Session API] No session found");
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 401 }
      );
    }

    console.log("[Session API] User found:", session.user.email);

    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError && profileError.code === "PGRST116") {
      console.log("[Session API] Creating profile for:", session.user.email);
      
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email,
            role: "admin",
            status: "active",
            department: "Management",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("[Session API] Profile creation error:", insertError.message);
        return NextResponse.json(
          { success: false, error: "Failed to create profile" },
          { status: 500 }
        );
      }

      profile = newProfile;
    } else if (profileError) {
      console.error("[Session API] Profile error:", profileError.message);
      return NextResponse.json(
        { success: false, error: "Profile error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: session.user,
        profile: profile,
      },
    });
  } catch (error) {
    console.error("[Session API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}