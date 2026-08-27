import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    /*
     * AUTH
     */

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized. Please sign in.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * PROFILE
     */

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          "id, company_id, role"
        )
        .eq(
          "id",
          user.id
        )
        .maybeSingle();

    if (
      profileError
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            profileError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (
      !profile ||
      !profile.company_id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile does not have a company yet.",
        },
        {
          status: 403,
        }
      );
    }

    const companyId =
      profile.company_id;

    const {
      searchParams,
    } = new URL(
      request.url
    );

    const type =
      searchParams.get(
        "type"
      ) || "sales";

    const from =
      searchParams.get(
        "from"
      );

    const to =
      searchParams.get(
        "to"
      );

    let rows: Record<
      string,
      any
    >[] = [];

    /*
     * =====================================================
     * STAFF
     * =====================================================
     */

    if (
      type === "staff"
    ) {
      const {
        data,
        error,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "company_id",
            companyId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error.message,
          },
          {
            status: 500,
          }
        );
      }

      rows =
        (data || []) as Record<
          string,
          any
        >[];
    }

    /*
     * =====================================================
     * SALES
     * =====================================================
     */

    else if (
      type === "sales"
    ) {
      let query =
        supabase
          .from("orders")
          .select("*")
          .eq(
            "company_id",
            companyId
          );

      if (from) {
        query =
          query.gte(
            "created_at",
            `${from}T00:00:00.000Z`
          );
      }

      if (to) {
        query =
          query.lte(
            "created_at",
            `${to}T23:59:59.999Z`
          );
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error.message,
          },
          {
            status: 500,
          }
        );
      }

      rows =
        (data || []) as Record<
          string,
          any
        >[];
    }

    /*
     * =====================================================
     * FINANCIAL
     * =====================================================
     */

    else if (
      type === "financial"
    ) {
      let query =
        supabase
          .from("payments")
          .select("*")
          .eq(
            "company_id",
            companyId
          );

      if (from) {
        query =
          query.gte(
            "created_at",
            `${from}T00:00:00.000Z`
          );
      }

      if (to) {
        query =
          query.lte(
            "created_at",
            `${to}T23:59:59.999Z`
          );
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error.message,
          },
          {
            status: 500,
          }
        );
      }

      rows =
        (data || []) as Record<
          string,
          any
        >[];
    }

    /*
     * =====================================================
     * INVENTORY
     * =====================================================
     */

    else if (
      type === "inventory"
    ) {
      const {
        data,
        error,
      } =
        await supabase
          .from("inventory")
          .select("*")
          .eq(
            "company_id",
            companyId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error.message,
          },
          {
            status: 500,
          }
        );
      }

      rows =
        (data || []) as Record<
          string,
          any
        >[];
    }

    else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid export type.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * CSV
     * =====================================================
     */

    const csv =
      createCSV(rows);

    return new NextResponse(
      csv,
      {
        status: 200,
        headers: {
          "Content-Type":
            "text/csv; charset=utf-8",

          "Content-Disposition":
            `attachment; filename="ai-salesos-${type}-report.csv"`,

          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "REPORT EXPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Export failed.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   CSV GENERATOR
   ========================================================= */

function createCSV(
  rows: Record<
    string,
    any
  >[]
) {
  if (
    rows.length === 0
  ) {
    return "No data available\n";
  }

  const keys =
    Array.from(
      new Set(
        rows.flatMap(
          (row) =>
            Object.keys(row)
        )
      )
    );

  const header =
    keys
      .map(
        escapeCSV
      )
      .join(",");

  const body =
    rows
      .map(
        (row) =>
          keys
            .map(
              (key) =>
                escapeCSV(
                  row[key]
                )
            )
            .join(",")
      )
      .join("\n");

  return `${header}\n${body}`;
}

function escapeCSV(
  value: any
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  let text =
    typeof value ===
    "object"
      ? JSON.stringify(
          value
        )
      : String(value);

  text =
    text.replace(
      /"/g,
      '""'
    );

  return `"${text}"`;
}