import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   AI SALESOS
   LEADS API
   ---------------------------------------------------------
   GET  /api/leads
   POST /api/leads

   Uses Supabase Auth.
   No NextAuth.
   ========================================================= */


/* =========================================================
   GET /api/leads
   ========================================================= */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    /* -------------------------------------------------------
       1. GET AUTHENTICATED USER
       ------------------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);

      return NextResponse.json(
        {
          success: false,
          error: "Authentication error.",
          details: authError.message,
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    /* -------------------------------------------------------
       2. GET USER PROFILE
       ------------------------------------------------------- */

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, company_id, role, email, full_name")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load user profile.",
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    /* -------------------------------------------------------
       3. PROFILE DOES NOT EXIST
       ------------------------------------------------------- */

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account does not have a profile yet.",
          user_id: user.id,
          email: user.email ?? null,
          action:
            "Create or repair the user's profile in Supabase.",
        },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
       4. COMPANY DOES NOT EXIST
       ------------------------------------------------------- */

    if (!profile.company_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile is not connected to a company.",
          user_id: user.id,
          profile_id: profile.id,
          action:
            "Connect this profile to a company in Supabase.",
        },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
       5. READ QUERY PARAMETERS
       ------------------------------------------------------- */

    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status") || "";

    const assignedTo =
      searchParams.get("assigned_to") || "";

    /* -------------------------------------------------------
       6. BUILD LEADS QUERY
       ------------------------------------------------------- */

    let query = supabase
      .from("leads")
      .select("*", {
        count: "exact",
      })
      .eq("company_id", profile.company_id)
      .order("created_at", {
        ascending: false,
      });

    /* -------------------------------------------------------
       STATUS FILTER
       ------------------------------------------------------- */

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    /* -------------------------------------------------------
       ASSIGNED USER FILTER
       ------------------------------------------------------- */

    if (assignedTo && assignedTo !== "all") {
      query = query.eq(
        "assigned_to",
        assignedTo
      );
    }

    /* -------------------------------------------------------
       SEARCH
       ------------------------------------------------------- */

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    /* -------------------------------------------------------
       7. EXECUTE QUERY
       ------------------------------------------------------- */

    const {
      data: leads,
      error: leadsError,
      count,
    } = await query;

    if (leadsError) {
      console.error(
        "LEADS DATABASE ERROR:",
        leadsError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load leads.",
          details: leadsError.message,
        },
        { status: 500 }
      );
    }

    /* -------------------------------------------------------
       8. SUCCESS
       ------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      data: leads ?? [],

      count: count ?? 0,

      company_id: profile.company_id,

      user: {
        id: user.id,
        email: user.email ?? null,
        full_name:
          profile.full_name ?? null,
        role: profile.role ?? null,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/leads ERROR:",
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
   POST /api/leads
   ========================================================= */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    /* -------------------------------------------------------
       1. GET AUTHENTICATED USER
       ------------------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);

      return NextResponse.json(
        {
          success: false,
          error: "Authentication error.",
          details: authError.message,
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    /* -------------------------------------------------------
       2. GET PROFILE
       ------------------------------------------------------- */

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, company_id, role, email, full_name")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error(
        "PROFILE LOOKUP ERROR:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load your profile.",
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account does not have a profile yet.",
          user_id: user.id,
          email: user.email ?? null,
        },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
       3. CHECK COMPANY
       ------------------------------------------------------- */

    if (!profile.company_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile is not connected to a company.",
          user_id: user.id,
          profile_id: profile.id,
        },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
       4. READ REQUEST BODY
       ------------------------------------------------------- */

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
       5. EXTRACT DATA
       ------------------------------------------------------- */

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : null;

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : null;

    const source =
      typeof body.source === "string"
        ? body.source.trim()
        : null;

    const product =
      typeof body.product === "string"
        ? body.product.trim()
        : null;

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : null;

    const status =
      typeof body.status === "string"
        ? body.status
        : "new";

    const assignedTo =
      typeof body.assigned_to === "string" &&
      body.assigned_to.length > 0
        ? body.assigned_to
        : user.id;

    const nextFollowUp =
      typeof body.next_follow_up_at === "string" &&
      body.next_follow_up_at.length > 0
        ? body.next_follow_up_at
        : null;

    const value =
      body.value === undefined ||
      body.value === null ||
      body.value === ""
        ? 0
        : Number(body.value);

    /* -------------------------------------------------------
       6. VALIDATION
       ------------------------------------------------------- */

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead name is required.",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(value)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Lead value must be a valid number.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "new",
      "contacted",
      "interested",
      "qualified",
      "proposal",
      "won",
      "lost",
      "converted",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid lead status: ${status}`,
        },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
       7. CREATE LEAD
       ------------------------------------------------------- */

    const { data: lead, error: leadError } =
      await supabase
        .from("leads")
        .insert({
          company_id:
            profile.company_id,

          assigned_to:
            assignedTo,

          name,

          phone,

          email,

          source,

          product,

          status,

          value,

          notes,

          next_follow_up_at:
            nextFollowUp,
        })
        .select("*")
        .single();

    if (leadError) {
      console.error(
        "CREATE LEAD DATABASE ERROR:",
        leadError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create lead.",
          details: leadError.message,
        },
        { status: 500 }
      );
    }

    /* -------------------------------------------------------
       8. CREATE FOLLOW-UP IF REQUESTED
       ------------------------------------------------------- */

    let followUp = null;

    if (nextFollowUp) {
      const {
        data: createdFollowUp,
        error: followUpError,
      } = await supabase
        .from("follow_ups")
        .insert({
          company_id:
            profile.company_id,

          lead_id:
            lead.id,

          assigned_to:
            assignedTo,

          channel:
            "whatsapp",

          reason:
            "Initial lead follow-up",

          priority:
            "medium",

          status:
            "pending",

          scheduled_for:
            nextFollowUp,

          requires_approval:
            true,
        })
        .select("*")
        .single();

      if (followUpError) {
        console.error(
          "CREATE FOLLOW-UP ERROR:",
          followUpError
        );

        /*
          We don't delete the lead here.

          The lead was successfully created.
          The follow-up can be created later.
        */
      } else {
        followUp = createdFollowUp;
      }
    }

    /* -------------------------------------------------------
       9. RETURN SUCCESS
       ------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        message:
          "Lead created successfully.",

        data: {
          lead,

          follow_up:
            followUp,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/leads ERROR:",
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