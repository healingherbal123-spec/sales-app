"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Wallet,
  Package,
  Download,
  RefreshCw,
  Search,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  UserX,
  Boxes,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type ReportTab =
  | "staff"
  | "sales"
  | "financial"
  | "inventory"
  | "export";

type ReportResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

const TABS: {
  id: ReportTab;
  label: string;
  icon: any;
}[] = [
  {
    id: "staff",
    label: "Staff Reports",
    icon: Users,
  },
  {
    id: "sales",
    label: "Sales Reports",
    icon: ShoppingCart,
  },
  {
    id: "financial",
    label: "Financial Reports",
    icon: Wallet,
  },
  {
    id: "inventory",
    label: "Inventory Reports",
    icon: Package,
  },
  {
    id: "export",
    label: "Export Data",
    icon: Download,
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] =
    useState<ReportTab>("sales");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [report, setReport] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  async function loadReport(
    reportType: ReportTab = activeTab
  ) {
    if (reportType === "export") {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const params = new URLSearchParams();

      params.set("type", reportType);

      if (dateFrom) {
        params.set("from", dateFrom);
      }

      if (dateTo) {
        params.set("to", dateTo);
      }

      const response = await fetch(
        `/api/reports?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: ReportResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to load report."
        );
      }

      setReport(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function applyFilters() {
    loadReport(activeTab);
  }

  function clearFilters() {
    setDateFrom("");
    setDateTo("");

    setTimeout(() => {
      loadReport(activeTab);
    }, 0);
  }

  async function exportData(
    format: "csv"
  ) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const params = new URLSearchParams();

      params.set("type", activeTab);
      params.set("format", format);

      if (dateFrom) {
        params.set("from", dateFrom);
      }

      if (dateTo) {
        params.set("to", dateTo);
      }

      const response = await fetch(
        `/api/reports/export?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        let message =
          "Unable to export data.";

        try {
          const result =
            await response.json();

          message =
            result.error || message;
        } catch {
          // Response wasn't JSON.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        `ai-salesos-${activeTab}-report.csv`;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      window.URL.revokeObjectURL(url);

      setSuccess(
        "Report exported successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export report."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <BarChart3 size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Reports
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Understand your people, sales,
                finances and inventory.
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* TABS */}

        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;

              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={17} />

                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTERS */}

        {activeTab !== "export" && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">

              <DateInput
                label="From"
                value={dateFrom}
                onChange={setDateFrom}
              />

              <DateInput
                label="To"
                value={dateTo}
                onChange={setDateTo}
              />

              <button
                onClick={applyFilters}
                disabled={loading}
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw size={17} />
                )}

                Apply
              </button>

              <button
                onClick={clearFilters}
                disabled={loading}
                className="mt-auto rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {activeTab === "staff" && (
              <StaffReport
                data={report}
                search={search}
                setSearch={setSearch}
              />
            )}

            {activeTab === "sales" && (
              <SalesReport
                data={report}
                search={search}
                setSearch={setSearch}
              />
            )}

            {activeTab === "financial" && (
              <FinancialReport
                data={report}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryReport
                data={report}
                search={search}
                setSearch={setSearch}
              />
            )}

            {activeTab === "export" && (
              <ExportReport
                onExport={exportData}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}


/* =========================================================
   STAFF REPORT
   ========================================================= */

function StaffReport({
  data,
  search,
  setSearch,
}: {
  data: any;
  search: string;
  setSearch: (value: string) => void;
}) {
  const staff =
    data?.staff || [];

  const filtered =
    staff.filter((person: any) => {
      const query =
        search.toLowerCase();

      return [
        person.full_name,
        person.email,
        person.role,
        person.department,
        person.job_title,
      ]
        .filter(Boolean)
        .some((value: any) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });

  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Staff"
          value={
            data?.summary?.total_staff ?? 0
          }
        />

        <MetricCard
          icon={<UserCheck size={20} />}
          label="Active"
          value={
            data?.summary?.active_staff ?? 0
          }
        />

        <MetricCard
          icon={<UserX size={20} />}
          label="Inactive"
          value={
            data?.summary?.inactive_staff ?? 0
          }
        />

        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Departments"
          value={
            data?.summary?.departments ?? 0
          }
        />
      </div>

      <ReportCard
        title="Staff Performance & Directory"
        icon={<Users size={19} />}
      >
        <div className="mb-5 relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search staff..."
            className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <DataTable
          headers={[
            "Staff",
            "Role",
            "Department",
            "Job Title",
            "Status",
            "Joined",
          ]}
        >
          {filtered.map(
            (person: any) => (
              <tr
                key={person.id}
                className="border-t border-white/10"
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-white">
                    {person.full_name ||
                      "Unnamed"}
                  </div>

                  <div className="text-xs text-slate-500">
                    {person.email || "—"}
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {person.role || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {person.department || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {person.job_title || "—"}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={
                      person.status ||
                      "active"
                    }
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {formatDate(
                    person.joined_at
                  )}
                </td>
              </tr>
            )
          )}
        </DataTable>
      </ReportCard>
    </div>
  );
}


/* =========================================================
   SALES REPORT
   ========================================================= */

function SalesReport({
  data,
  search,
  setSearch,
}: {
  data: any;
  search: string;
  setSearch: (value: string) => void;
}) {
  const sellers =
    data?.salespeople || [];

  const filtered =
    sellers.filter((seller: any) =>
      String(
        seller.name || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MoneyCard
          icon={<DollarSign size={20} />}
          label="Total Sales"
          value={
            data?.summary?.total_sales ?? 0
          }
        />

        <MetricCard
          icon={<ShoppingCart size={20} />}
          label="Orders"
          value={
            data?.summary?.orders ?? 0
          }
        />

        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Paid Orders"
          value={
            data?.summary?.paid_orders ?? 0
          }
        />

        <MoneyCard
          icon={<Wallet size={20} />}
          label="Outstanding"
          value={
            data?.summary?.outstanding ?? 0
          }
        />
      </div>

      <ReportCard
        title="Sales Performance"
        icon={<ShoppingCart size={19} />}
      >
        <div className="mb-5 relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search salesperson..."
            className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <DataTable
          headers={[
            "Salesperson",
            "Orders",
            "Sales",
            "Paid",
            "Outstanding",
          ]}
        >
          {filtered.map(
            (seller: any) => (
              <tr
                key={
                  seller.id ||
                  seller.name
                }
                className="border-t border-white/10"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {seller.name || "Unassigned"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {seller.orders ?? 0}
                </td>

                <td className="px-5 py-4 text-sm text-white">
                  {formatMoney(
                    seller.sales
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-emerald-400">
                  {formatMoney(
                    seller.paid
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-orange-400">
                  {formatMoney(
                    seller.outstanding
                  )}
                </td>
              </tr>
            )
          )}
        </DataTable>
      </ReportCard>
    </div>
  );
}


/* =========================================================
   FINANCIAL REPORT
   ========================================================= */

function FinancialReport({
  data,
}: {
  data: any;
}) {
  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MoneyCard
          icon={<DollarSign size={20} />}
          label="Revenue"
          value={
            data?.summary?.revenue ?? 0
          }
        />

        <MoneyCard
          icon={<CreditCard size={20} />}
          label="Payments Received"
          value={
            data?.summary?.payments_received ??
            0
          }
        />

        <MoneyCard
          icon={<Wallet size={20} />}
          label="Outstanding"
          value={
            data?.summary?.outstanding ?? 0
          }
        />

        <MoneyCard
          icon={<TrendingDown size={20} />}
          label="Refunds"
          value={
            data?.summary?.refunds ?? 0
          }
        />
      </div>

      <ReportCard
        title="Financial Summary"
        icon={<Wallet size={19} />}
      >
        <DataTable
          headers={[
            "Metric",
            "Amount",
          ]}
        >
          <tr className="border-t border-white/10">
            <td className="px-5 py-4 text-slate-300">
              Total Revenue
            </td>
            <td className="px-5 py-4 font-semibold text-white">
              {formatMoney(
                data?.summary?.revenue
              )}
            </td>
          </tr>

          <tr className="border-t border-white/10">
            <td className="px-5 py-4 text-slate-300">
              Payments Received
            </td>
            <td className="px-5 py-4 font-semibold text-emerald-400">
              {formatMoney(
                data?.summary
                  ?.payments_received
              )}
            </td>
          </tr>

          <tr className="border-t border-white/10">
            <td className="px-5 py-4 text-slate-300">
              Outstanding Balance
            </td>
            <td className="px-5 py-4 font-semibold text-orange-400">
              {formatMoney(
                data?.summary?.outstanding
              )}
            </td>
          </tr>

          <tr className="border-t border-white/10">
            <td className="px-5 py-4 text-slate-300">
              Refunds
            </td>
            <td className="px-5 py-4 font-semibold text-red-400">
              {formatMoney(
                data?.summary?.refunds
              )}
            </td>
          </tr>
        </DataTable>
      </ReportCard>

      <ReportCard
        title="Payment Status"
        icon={<CreditCard size={19} />}
      >
        <DataTable
          headers={[
            "Status",
            "Transactions",
            "Amount",
          ]}
        >
          {(data?.payment_status || []).map(
            (item: any) => (
              <tr
                key={item.status}
                className="border-t border-white/10"
              >
                <td className="px-5 py-4 capitalize text-slate-300">
                  {item.status}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {item.count}
                </td>

                <td className="px-5 py-4 font-medium text-white">
                  {formatMoney(
                    item.amount
                  )}
                </td>
              </tr>
            )
          )}
        </DataTable>
      </ReportCard>
    </div>
  );
}


/* =========================================================
   INVENTORY REPORT
   ========================================================= */

function InventoryReport({
  data,
  search,
  setSearch,
}: {
  data: any;
  search: string;
  setSearch: (value: string) => void;
}) {
  const items =
    data?.items || [];

  const filtered =
    items.filter((item: any) => {
      const query =
        search.toLowerCase();

      return [
        item.product_name,
        item.sku,
        item.status,
      ]
        .filter(Boolean)
        .some((value: any) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });

  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MoneyCard
          icon={<Boxes size={20} />}
          label="Inventory Value"
          value={
            data?.summary?.inventory_value ??
            0
          }
        />

        <MetricCard
          icon={<Package size={20} />}
          label="Products"
          value={
            data?.summary?.products ?? 0
          }
        />

        <MetricCard
          icon={<AlertCircle size={20} />}
          label="Low Stock"
          value={
            data?.summary?.low_stock ?? 0
          }
        />

        <MetricCard
          icon={<Package size={20} />}
          label="Out of Stock"
          value={
            data?.summary?.out_of_stock ?? 0
          }
        />
      </div>

      <ReportCard
        title="Inventory Status"
        icon={<Package size={19} />}
      >
        <div className="mb-5 relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search product or SKU..."
            className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <DataTable
          headers={[
            "Product",
            "SKU",
            "Quantity",
            "Unit Price",
            "Value",
            "Status",
          ]}
        >
          {filtered.map(
            (item: any) => (
              <tr
                key={
                  item.id ||
                  item.product_id
                }
                className="border-t border-white/10"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {item.product_name ||
                    "Unknown Product"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {item.sku || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {item.quantity ?? 0}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {formatMoney(
                    item.unit_price
                  )}
                </td>

                <td className="px-5 py-4 font-medium text-white">
                  {formatMoney(
                    item.value
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={
                      item.status ||
                      "normal"
                    }
                  />
                </td>
              </tr>
            )
          )}
        </DataTable>
      </ReportCard>
    </div>
  );
}


/* =========================================================
   EXPORT
   ========================================================= */

function ExportReport({
  onExport,
  loading,
}: {
  onExport: (
    format: "csv"
  ) => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-semibold text-white">
          Export Data
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Download your AI SalesOS business
          data for accounting, analysis or
          backup.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <ExportCard
          icon={<Users size={24} />}
          title="Staff"
          description="Export staff directory and roles."
          onClick={() => onExport("csv")}
          loading={loading}
        />

        <ExportCard
          icon={<ShoppingCart size={24} />}
          title="Sales"
          description="Export orders and sales performance."
          onClick={() => onExport("csv")}
          loading={loading}
        />

        <ExportCard
          icon={<Wallet size={24} />}
          title="Financial"
          description="Export payments and financial records."
          onClick={() => onExport("csv")}
          loading={loading}
        />

        <ExportCard
          icon={<Package size={24} />}
          title="Inventory"
          description="Export products and stock levels."
          onClick={() => onExport("csv")}
          loading={loading}
        />
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <FileSpreadsheet size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              CSV Export
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              CSV files can be opened in
              Excel, Google Sheets and other
              spreadsheet applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   EXPORT CARD
   ========================================================= */

function ExportCard({
  icon,
  title,
  description,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 min-h-[42px] text-sm text-slate-500">
        {description}
      </p>

      <button
        onClick={onClick}
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        {loading ? (
          <Loader2
            size={16}
            className="animate-spin"
          />
        ) : (
          <Download size={16} />
        )}

        Export CSV
      </button>
    </div>
  );
}


/* =========================================================
   SHARED UI
   ========================================================= */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div className="text-2xl font-bold text-white">
        {Number(value || 0).toLocaleString()}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {label}
      </div>
    </div>
  );
}

function MoneyCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>

      <div className="text-2xl font-bold text-white">
        {formatMoney(value)}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {label}
      </div>
    </div>
  );
}

function ReportCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="text-blue-400">
          {icon}
        </div>

        <h2 className="font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-3"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-slate-500">
        {label}
      </span>

      <div className="relative">
        <CalendarDays
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="date"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-blue-500"
        />
      </div>
    </label>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  let classes =
    "bg-slate-500/10 text-slate-400";

  if (
    normalized === "active" ||
    normalized === "paid" ||
    normalized === "normal"
  ) {
    classes =
      "bg-emerald-500/10 text-emerald-400";
  }

  if (
    normalized === "pending" ||
    normalized === "low" ||
    normalized === "partial"
  ) {
    classes =
      "bg-orange-500/10 text-orange-400";
  }

  if (
    normalized === "inactive" ||
    normalized === "suspended" ||
    normalized === "failed" ||
    normalized === "out of stock"
  ) {
    classes =
      "bg-red-500/10 text-red-400";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${classes}`}
    >
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="text-center">
        <Loader2
          size={32}
          className="mx-auto animate-spin text-blue-500"
        />

        <p className="mt-3 text-sm text-slate-500">
          Generating report...
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(
  value: any
) {
  const number =
    Number(value) || 0;

  return `₦${number.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(
  value: any
) {
  if (!value) return "—";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-NG"
  );
}