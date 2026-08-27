import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AnyRow = Record<
  string,
  any
>;

export async function GET(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    /*
     * =====================================================
     * AUTHENTICATED USER
     * =====================================================
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
     * =====================================================
     * PROFILE
     * =====================================================
     */

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          "id, company_id, role, full_name, email"
        )
        .eq("id", user.id)
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
            "Your account does not have a company profile yet.",
        },
        {
          status: 403,
        }
      );
    }

    const companyId =
      profile.company_id;

    /*
     * =====================================================
     * QUERY PARAMETERS
     * =====================================================
     */

    const { searchParams } =
      new URL(request.url);

    const type =
      searchParams.get("type") ||
      "sales";

    const from =
      searchParams.get("from");

    const to =
      searchParams.get("to");

    switch (type) {
      case "staff":
        return NextResponse.json(
          await getStaffReport(
            supabase,
            companyId
          )
        );

      case "sales":
        return NextResponse.json(
          await getSalesReport(
            supabase,
            companyId,
            from,
            to
          )
        );

      case "financial":
        return NextResponse.json(
          await getFinancialReport(
            supabase,
            companyId,
            from,
            to
          )
        );

      case "inventory":
        return NextResponse.json(
          await getInventoryReport(
            supabase,
            companyId
          )
        );

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Unknown report type.",
          },
          {
            status: 400,
          }
        );
    }
  } catch (error) {
    console.error(
      "REPORTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate report.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   STAFF REPORT
   ========================================================= */

async function getStaffReport(
  supabase: any,
  companyId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      phone,
      role,
      department,
      job_title,
      status,
      employee_number,
      joined_at,
      last_login_at
      `
    )
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
    return {
      success: false,
      error: error.message,
    };
  }

  const staff =
    (data || []) as AnyRow[];

  const active =
    staff.filter(
      (person) =>
        !person.status ||
        person.status ===
          "active"
    ).length;

  const inactive =
    staff.filter(
      (person) =>
        person.status !==
          "active" &&
        person.status
    ).length;

  const departments =
    new Set(
      staff
        .map(
          (person) =>
            person.department
        )
        .filter(Boolean)
    ).size;

  return {
    success: true,
    data: {
      summary: {
        total_staff:
          staff.length,
        active_staff:
          active,
        inactive_staff:
          inactive,
        departments,
      },
      staff,
    },
  };
}


/* =========================================================
   SALES REPORT
   ========================================================= */

async function getSalesReport(
  supabase: any,
  companyId: string,
  from: string | null,
  to: string | null
) {
  let query =
    supabase
      .from("orders")
      .select("*")
      .eq(
        "company_id",
        companyId
      );

  query =
    applyDateFilter(
      query,
      from,
      to
    );

  const {
    data: ordersData,
    error,
  } = await query;

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const orders =
    (ordersData || []) as AnyRow[];

  const [
    profilesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, email, role"
      )
      .eq(
        "company_id",
        companyId
      ),

    supabase
      .from("payments")
      .select("*")
      .eq(
        "company_id",
        companyId
      ),
  ]);

  const profiles =
    (profilesResult.data ||
      []) as AnyRow[];

  let payments =
    (paymentsResult.data ||
      []) as AnyRow[];

  if (
    from ||
    to
  ) {
    payments =
      filterRowsByDate(
        payments,
        from,
        to
      );
  }

  const profileMap =
    new Map(
      profiles.map(
        (person) => [
          person.id,
          person,
        ]
      )
    );

  const sellerMap =
    new Map<
      string,
      AnyRow
    >();

  let totalSales = 0;

  let paidOrders = 0;

  let outstanding = 0;

  for (const order of orders) {
    const total =
      getOrderTotal(order);

    const paid =
      getOrderPaid(
        order,
        payments
      );

    totalSales += total;

    if (
      isPaidOrder(
        order,
        paid,
        total
      )
    ) {
      paidOrders++;
    }

    outstanding += Math.max(
      total - paid,
      0
    );

    const sellerId =
      order.assigned_to ||
      order.salesperson_id ||
      order.sales_rep_id ||
      order.created_by ||
      order.user_id;

    const seller =
      sellerId
        ? profileMap.get(
            sellerId
          )
        : null;

    const key =
      sellerId ||
      "unassigned";

    if (
      !sellerMap.has(key)
    ) {
      sellerMap.set(
        key,
        {
          id:
            sellerId ||
            "unassigned",
          name:
            seller?.full_name ||
            "Unassigned",
          orders: 0,
          sales: 0,
          paid: 0,
          outstanding: 0,
        }
      );
    }

    const sellerStats =
      sellerMap.get(key);

    sellerStats.orders += 1;

    sellerStats.sales +=
      total;

    sellerStats.paid +=
      paid;

    sellerStats.outstanding +=
      Math.max(
        total - paid,
        0
      );
  }

  return {
    success: true,
    data: {
      summary: {
        total_sales:
          totalSales,
        orders:
          orders.length,
        paid_orders:
          paidOrders,
        outstanding,
      },

      salespeople:
        Array.from(
          sellerMap.values()
        ).sort(
          (a, b) =>
            b.sales -
            a.sales
        ),
    },
  };
}


/* =========================================================
   FINANCIAL REPORT
   ========================================================= */

async function getFinancialReport(
  supabase: any,
  companyId: string,
  from: string | null,
  to: string | null
) {
  let paymentsQuery =
    supabase
      .from("payments")
      .select("*")
      .eq(
        "company_id",
        companyId
      );

  paymentsQuery =
    applyDateFilter(
      paymentsQuery,
      from,
      to
    );

  const [
    paymentsResult,
    ordersResult,
  ] = await Promise.all([
    paymentsQuery,

    supabase
      .from("orders")
      .select("*")
      .eq(
        "company_id",
        companyId
      ),
  ]);

  if (
    paymentsResult.error
  ) {
    return {
      success: false,
      error:
        paymentsResult.error.message,
    };
  }

  const payments =
    (paymentsResult.data ||
      []) as AnyRow[];

  let orders =
    (ordersResult.data ||
      []) as AnyRow[];

  orders =
    filterRowsByDate(
      orders,
      from,
      to
    );

  let paymentsReceived = 0;

  let refunds = 0;

  const statusMap =
    new Map<
      string,
      {
        status: string;
        count: number;
        amount: number;
      }
    >();

  for (const payment of payments) {
    const amount =
      getPaymentAmount(
        payment
      );

    const status =
      String(
        payment.status ||
          "unknown"
      ).toLowerCase();

    if (
      [
        "paid",
        "completed",
        "success",
        "successful",
        "verified",
      ].includes(status)
    ) {
      paymentsReceived +=
        amount;
    }

    if (
      [
        "refunded",
        "refund",
      ].includes(status)
    ) {
      refunds += amount;
    }

    if (
      !statusMap.has(
        status
      )
    ) {
      statusMap.set(
        status,
        {
          status,
          count: 0,
          amount: 0,
        }
      );
    }

    const item =
      statusMap.get(
        status
      )!;

    item.count += 1;

    item.amount +=
      amount;
  }

  let revenue = 0;

  let outstanding = 0;

  for (const order of orders) {
    const total =
      getOrderTotal(order);

    const paid =
      getOrderPaid(
        order,
        payments
      );

    revenue += total;

    outstanding += Math.max(
      total - paid,
      0
    );
  }

  return {
    success: true,
    data: {
      summary: {
        revenue,
        payments_received:
          paymentsReceived,
        outstanding,
        refunds,
      },

      payment_status:
        Array.from(
          statusMap.values()
        ),
    },
  };
}


/* =========================================================
   INVENTORY REPORT
   ========================================================= */

async function getInventoryReport(
  supabase: any,
  companyId: string
) {
  const [
    inventoryResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("inventory")
      .select("*")
      .eq(
        "company_id",
        companyId
      ),

    supabase
      .from("products")
      .select("*")
      .eq(
        "company_id",
        companyId
      ),
  ]);

  if (
    inventoryResult.error
  ) {
    return {
      success: false,
      error:
        inventoryResult.error.message,
    };
  }

  const inventory =
    (inventoryResult.data ||
      []) as AnyRow[];

  const products =
    (productsResult.data ||
      []) as AnyRow[];

  const productMap =
    new Map<
      string,
      AnyRow
    >();

  for (
    const product of products
  ) {
    productMap.set(
      product.id,
      product
    );
  }

  let inventoryValue = 0;

  let lowStock = 0;

  let outOfStock = 0;

  const items =
    inventory.map(
      (row) => {
        const product =
          productMap.get(
            row.product_id
          );

        const quantity =
          Number(
            row.quantity ??
              row.stock_quantity ??
              row.current_stock ??
              0
          );

        const unitPrice =
          Number(
            row.unit_price ??
              row.cost_price ??
              product?.price ??
              product?.selling_price ??
              0
          );

        const value =
          quantity *
          unitPrice;

        inventoryValue +=
          value;

        let status =
          "normal";

        if (
          quantity <= 0
        ) {
          status =
            "out of stock";

          outOfStock++;
        } else if (
          quantity <= 15
        ) {
          status = "low";

          lowStock++;
        }

        return {
          id: row.id,
          product_id:
            row.product_id,
          product_name:
            product?.name ||
            product?.product_name ||
            row.product_name ||
            "Unknown Product",
          sku:
            product?.sku ||
            row.sku ||
            "—",
          quantity,
          unit_price:
            unitPrice,
          value,
          status,
        };
      }
    );

  return {
    success: true,
    data: {
      summary: {
        inventory_value:
          inventoryValue,
        products:
          items.length,
        low_stock:
          lowStock,
        out_of_stock:
          outOfStock,
      },

      items,
    },
  };
}


/* =========================================================
   HELPERS
   ========================================================= */

function applyDateFilter(
  query: any,
  from: string | null,
  to: string | null
) {
  if (from) {
    query = query.gte(
      "created_at",
      `${from}T00:00:00.000Z`
    );
  }

  if (to) {
    query = query.lte(
      "created_at",
      `${to}T23:59:59.999Z`
    );
  }

  return query;
}

function filterRowsByDate(
  rows: AnyRow[],
  from: string | null,
  to: string | null
) {
  if (!from && !to) {
    return rows;
  }

  return rows.filter(
    (row) => {
      const value =
        row.created_at ||
        row.payment_date ||
        row.date;

      if (!value) {
        return true;
      }

      const date =
        new Date(value);

      if (from) {
        const start =
          new Date(
            `${from}T00:00:00`
          );

        if (
          date < start
        ) {
          return false;
        }
      }

      if (to) {
        const end =
          new Date(
            `${to}T23:59:59`
          );

        if (
          date > end
        ) {
          return false;
        }
      }

      return true;
    }
  );
}

function getOrderTotal(
  order: AnyRow
) {
  return Number(
    order.total_amount ??
      order.total ??
      order.grand_total ??
      order.amount ??
      order.order_total ??
      0
  );
}

function getPaymentAmount(
  payment: AnyRow
) {
  return Number(
    payment.amount ??
      payment.amount_paid ??
      payment.paid_amount ??
      payment.total ??
      0
  );
}

function getOrderPaid(
  order: AnyRow,
  payments: AnyRow[]
) {
  const directPaid =
    Number(
      order.paid_amount ??
        order.amount_paid ??
        order.amount_paid_total ??
        0
    );

  if (
    directPaid > 0
  ) {
    return directPaid;
  }

  const orderPayments =
    payments.filter(
      (payment) =>
        payment.order_id ===
        order.id
    );

  return orderPayments.reduce(
    (
      total,
      payment
    ) => {
      const status =
        String(
          payment.status ||
            ""
        ).toLowerCase();

      if (
        [
          "paid",
          "completed",
          "success",
          "successful",
          "verified",
        ].includes(status)
      ) {
        return (
          total +
          getPaymentAmount(
            payment
          )
        );
      }

      return total;
    },
    0
  );
}

function isPaidOrder(
  order: AnyRow,
  paid: number,
  total: number
) {
  const status =
    String(
      order.payment_status ||
        order.status ||
        ""
    ).toLowerCase();

  return (
    paid >= total &&
    total > 0
  ) || [
    "paid",
    "completed",
    "payment_completed",
  ].includes(status);
}