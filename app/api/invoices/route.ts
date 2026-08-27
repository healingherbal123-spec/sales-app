import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", session.user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 });
  }
}