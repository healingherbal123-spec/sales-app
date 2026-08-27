import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase service role configuration."
    );
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            );
          } catch {
            // Server component/API cookie writes
            // may not always be available.
          }
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function POST(
  request: Request
) {
  try {
    if (!SUPABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error:
            "NEXT_PUBLIC_SUPABASE_URL is missing.",
        },
        { status: 500 }
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
        },
        { status: 500 }
      );
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "SUPABASE_SERVICE_ROLE_KEY is missing from the server environment.",
        },
        { status: 500 }
      );
    }

    const currentUser =
      await getAuthenticatedUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const full_name =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const role =
      typeof body.role === "string"
        ? body.role.trim().toLowerCase()
        : "sales";

    const department =
      typeof body.department === "string"
        ? body.department.trim()
        : "";

    const job_title =
      typeof body.job_title === "string"
        ? body.job_title.trim()
        : "";

    const employee_number =
      typeof body.employee_number === "string"
        ? body.employee_number.trim()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Staff email is required.",
        },
        { status: 400 }
      );
    }

    if (!full_name) {
      return NextResponse.json(
        {
          success: false,
          error: "Staff full name is required.",
        },
        { status: 400 }
      );
    }

    const allowedRoles = [
      "owner",
      "admin",
      "manager",
      "sales",
      "inventory",
      "dispatcher",
      "accountant",
      "hr",
      "customer",
      "ai_employee",
    ];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid staff role.",
        },
        { status: 400 }
      );
    }

    const admin = getAdminClient();

    /*
     * Find the current user's profile.
     */
    const {
      data: currentProfile,
      error: profileError,
    } = await admin
      .from("profiles")
      .select(
        "id, company_id, role, status"
      )
      .eq("id", currentUser.id)
      .maybeSingle();

    if (
      profileError ||
      !currentProfile
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your user profile was not found.",
        },
        { status: 403 }
      );
    }

    /*
     * Only owner/admin can manage employees.
     */
    const managerRoles = [
      "owner",
      "admin",
    ];

    if (
      !managerRoles.includes(
        String(currentProfile.role).toLowerCase()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to invite staff.",
        },
        { status: 403 }
      );
    }

    const companyId =
      currentProfile.company_id;

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile is not connected to a company.",
        },
        { status: 400 }
      );
    }

    /*
     * Verify company exists.
     */
    const {
      data: company,
      error: companyError,
    } = await admin
      .from("companies")
      .select("id, name")
      .eq("id", companyId)
      .maybeSingle();

    if (
      companyError ||
      !company
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Check whether this email already belongs
     * to an existing profile in this company.
     */
    const {
      data: existingProfile,
    } = await admin
      .from("profiles")
      .select("id, email")
      .eq("company_id", companyId)
      .ilike("email", email)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A staff profile with this email already exists in your company.",
        },
        { status: 409 }
      );
    }

    /*
     * Check Auth users first.
     */
    const {
      data: authUsers,
      error: authListError,
    } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authListError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check existing authentication users.",
        },
        { status: 500 }
      );
    }

    const existingAuthUser =
      authUsers.users.find(
        (user) =>
          user.email?.toLowerCase() === email
      );

    let authUserId: string;

    /*
     * If the Auth user already exists, reuse it.
     *
     * This is useful if an invitation was previously
     * created but the profile was not created.
     */
    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
    } else {
      /*
       * Create/invite the Supabase Auth user.
       */
      const {
        data: inviteData,
        error: inviteError,
      } = await admin.auth.admin.inviteUserByEmail(
        email,
        {
          data: {
            full_name,
            company_id: companyId,
            role,
          },
        }
      );

      if (
        inviteError ||
        !inviteData.user
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              inviteError?.message ||
              "Unable to create staff authentication account.",
          },
          { status: 500 }
        );
      }

      authUserId =
        inviteData.user.id;
    }

    /*
     * Create the profile using the EXACT
     * auth.users UUID.
     */
    const {
      data: newProfile,
      error: insertError,
    } = await admin
      .from("profiles")
      .insert({
        id: authUserId,
        company_id: companyId,
        email,
        full_name,
        phone: phone || null,
        role,
        department:
          department || null,
        job_title:
          job_title || null,
        status: "invited",
        employee_number:
          employee_number || null,
        joined_at: new Date().toISOString(),
      })
      .select(
        "id, email, full_name, phone, role, department, job_title, status, employee_number, joined_at, last_login_at"
      )
      .single();

    if (insertError) {
      /*
       * If profile creation failed, don't leave
       * a newly-created Auth user behind.
       *
       * We only remove the Auth user when it was
       * created by this request.
       */
      if (!existingAuthUser) {
        await admin.auth.admin.deleteUser(
          authUserId
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            insertError.message,
          details:
            "The authentication user was created, but the staff profile could not be created.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Staff member invited successfully.",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "STAFF INVITE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}