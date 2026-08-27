import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   GET /api/leads/[id]
   ========================================================= */

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found.",
        },
        { status: 403 }
      );
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        assigned_profile:profiles!leads_assigned_to_fkey(
          id,
          full_name,
          email
        )
        `
      )
      .eq("id", id)
      .eq("company_id", profile.company_id)
      .single();

    if (error || !lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("GET LEAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH /api/leads/[id]

   Update a lead.
   ========================================================= */

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------------------
       CHECK LEAD EXISTS
       ----------------------------------------------------- */

    const { data: existingLead, error: existingError } =
      await supabase
        .from("leads")
        .select("id")
        .eq("id", id)
        .eq("company_id", profile.company_id)
        .single();

    if (existingError || !existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      "name",
      "phone",
      "email",
      "source",
      "product",
      "status",
      "value",
      "notes",
      "assigned_to",
      "last_contact_at",
      "next_follow_up_at",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    updates.updated_at = new Date().toISOString();

    /* -----------------------------------------------------
       UPDATE
       ----------------------------------------------------- */

    const { data: lead, error: updateError } =
      await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .eq("company_id", profile.company_id)
        .select(
          `
          *,
          assigned_profile:profiles!leads_assigned_to_fkey(
            id,
            full_name,
            email
          )
          `
        )
        .single();

    if (updateError) {
      console.error(
        "UPDATE LEAD ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    console.error(
      "UPDATE LEAD SERVER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE /api/leads/[id]
   ========================================================= */

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found.",
        },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("company_id", profile.company_id);

    if (deleteError) {
      console.error(
        "DELETE LEAD ERROR:",
        deleteError
      );

      return NextResponse.json(
        {
          success: false,
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE LEAD SERVER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}