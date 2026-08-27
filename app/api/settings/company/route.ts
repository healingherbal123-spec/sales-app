import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CompanyUpdate = {
  name?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  legal_name?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  tax_rate?: number;
};

async function getContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("AUTH ERROR:", authError);
  }

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null,
    };
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "id, company_id, email, full_name, role"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "PROFILE ERROR:",
      profileError
    );
  }

  return {
    supabase,
    user,
    profile,
  };
}

/* =========================================================
   GET COMPANY INFORMATION
   ========================================================= */

export async function GET() {
  try {
    const {
      supabase,
      user,
      profile,
    } = await getContext();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized. Please log in.",
        },
        { status: 401 }
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

    if (!profile.company_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile is not connected to a company.",
          user_id: user.id,
        },
        { status: 403 }
      );
    }

    const {
      data: company,
      error,
    } = await supabase
      .from("companies")
      .select(
        `
        id,
        name,
        logo_url,
        address,
        phone,
        email,
        legal_name,
        website,
        city,
        state,
        country,
        timezone,
        currency,
        tax_rate,
        subscription_plan,
        created_at,
        updated_at
        `
      )
      .eq(
        "id",
        profile.company_id
      )
      .maybeSingle();

    if (error) {
      console.error(
        "COMPANY GET ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company not found.",
          company_id:
            profile.company_id,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET COMPANY UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   UPDATE COMPANY INFORMATION
   ========================================================= */

export async function PUT(
  request: Request
) {
  try {
    const {
      supabase,
      user,
      profile,
    } = await getContext();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized. Please log in.",
        },
        { status: 401 }
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

    if (!profile.company_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile is not connected to a company.",
          user_id: user.id,
        },
        { status: 403 }
      );
    }

    /*
     * Only company owners and admins
     * can change company information.
     */

    const allowedRoles = [
      "Company Owner",
      "Owner",
      "Admin",
      "Super Admin",
    ];

    const role =
      profile.role ?? "";

    if (
      !allowedRoles.includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to update company information.",
          role,
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------------------
       Parse JSON safely
       ----------------------------------------------------- */

    let body: CompanyUpdate;

    try {
      body =
        (await request.json()) as CompanyUpdate;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Validate values
       ----------------------------------------------------- */

    if (
      body.name !== undefined &&
      typeof body.name !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company name must be text.",
        },
        { status: 400 }
      );
    }

    if (
      body.tax_rate !== undefined &&
      (
        typeof body.tax_rate !==
          "number" ||
        Number.isNaN(
          body.tax_rate
        )
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tax rate must be a valid number.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Build update object
       ----------------------------------------------------- */

    const updates: Record<
      string,
      string | number | null
    > = {};

    const textFields = [
      "name",
      "logo_url",
      "address",
      "phone",
      "email",
      "legal_name",
      "website",
      "city",
      "state",
      "country",
      "timezone",
      "currency",
    ] as const;

    for (const field of textFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        const value =
          body[field];

        if (
          value === null ||
          value === undefined
        ) {
          updates[field] = null;
        } else {
          updates[field] =
            String(value).trim();
        }
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "tax_rate"
      )
    ) {
      updates.tax_rate =
        body.tax_rate ?? 0;
    }

    if (
      Object.keys(updates)
        .length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No company information was provided.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Update company
       ----------------------------------------------------- */

    const {
      data: company,
      error: updateError,
    } = await supabase
      .from("companies")
      .update(updates)
      .eq(
        "id",
        profile.company_id
      )
      .select(
        `
        id,
        name,
        logo_url,
        address,
        phone,
        email,
        legal_name,
        website,
        city,
        state,
        country,
        timezone,
        currency,
        tax_rate,
        subscription_plan,
        created_at,
        updated_at
        `
      )
      .single();

    if (updateError) {
      console.error(
        "COMPANY UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            updateError.message,
          code:
            updateError.code,
          details:
            updateError.details,
          hint:
            updateError.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Company information saved successfully.",
        data: company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "COMPANY PUT UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}