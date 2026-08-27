import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   POST /api/leads/[id]/convert

   Converts a lead into a customer.
   ========================================================= */

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    /* -----------------------------------------------------
       AUTHENTICATION
       ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       USER PROFILE
       ----------------------------------------------------- */

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, company_id, role")
        .eq("id", user.id)
        .single();

    if (
      profileError ||
      !profile?.company_id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------------------
       GET LEAD
       ----------------------------------------------------- */

    const { data: lead, error: leadError } =
      await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .eq("company_id", profile.company_id)
        .single();

    if (leadError || !lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found.",
        },
        { status: 404 }
      );
    }

    /* -----------------------------------------------------
       ALREADY CONVERTED?
       ----------------------------------------------------- */

    if (lead.converted_customer_id) {
      return NextResponse.json({
        success: true,
        message: "Lead was already converted.",
        customer_id:
          lead.converted_customer_id,
      });
    }

    /* -----------------------------------------------------
       CHECK FOR EXISTING CUSTOMER
       ----------------------------------------------------- */

    let existingCustomer = null;

    if (lead.phone) {
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("company_id", profile.company_id)
        .eq("phone", lead.phone)
        .maybeSingle();

      existingCustomer = data;
    }

    /* -----------------------------------------------------
       CREATE CUSTOMER IF NEEDED
       ----------------------------------------------------- */

    let customer = existingCustomer;

    if (!customer) {
      const { data: newCustomer, error: customerError } =
        await supabase
          .from("customers")
          .insert({
            company_id: profile.company_id,

            name: lead.name,

            phone:
              lead.phone || null,

            email:
              lead.email || null,

            source:
              lead.source || null,

            notes:
              lead.notes || null,

            assigned_to:
              lead.assigned_to || user.id,
          })
          .select("*")
          .single();

      if (customerError) {
        console.error(
          "CREATE CUSTOMER ERROR:",
          customerError
        );

        return NextResponse.json(
          {
            success: false,
            error: customerError.message,
          },
          { status: 500 }
        );
      }

      customer = newCustomer;
    }

    /* -----------------------------------------------------
       UPDATE LEAD
       ----------------------------------------------------- */

    const { error: updateLeadError } =
      await supabase
        .from("leads")
        .update({
          status: "converted",
          converted_customer_id:
            customer.id,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", lead.id)
        .eq(
          "company_id",
          profile.company_id
        );

    if (updateLeadError) {
      console.error(
        "UPDATE LEAD CONVERSION ERROR:",
        updateLeadError
      );

      return NextResponse.json(
        {
          success: false,
          error: updateLeadError.message,
        },
        { status: 500 }
      );
    }

    /* -----------------------------------------------------
       COMPLETE OPEN FOLLOW-UPS
       ----------------------------------------------------- */

    await supabase
      .from("follow_ups")
      .update({
        customer_id: customer.id,
        updated_at:
          new Date().toISOString(),
      })
      .eq("lead_id", lead.id)
      .eq(
        "company_id",
        profile.company_id
      );

    /* -----------------------------------------------------
       RETURN
       ----------------------------------------------------- */

    return NextResponse.json({
      success: true,

      message:
        "Lead converted to customer successfully.",

      data: {
        lead_id: lead.id,
        customer_id: customer.id,
        customer,
      },
    });
  } catch (error) {
    console.error(
      "CONVERT LEAD SERVER ERROR:",
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