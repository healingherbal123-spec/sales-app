"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Filter,
  MessageCircle,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";

type SalesStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Won"
  | "Lost";

type FollowUpStatus = "Due" | "Today" | "Upcoming";

type Lead = {
  id: string;
  name: string;
  phone: string;
  product: string;
  value: number;
  status: SalesStatus;
  source: string;
  assignedTo: string;
  lastContact: string;
  followUp: FollowUpStatus;
  avatar: string;
};

type Sale = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "Paid" | "Pending";
  date: string;
  salesperson: string;
};

const leads: Lead[] = [
  {
    id: "LD-1001",
    name: "John Doe",
    phone: "+234 801 234 5678",
    product: "Premium Package",
    value: 200000,
    status: "Interested",
    source: "WhatsApp",
    assignedTo: "David",
    lastContact: "2 hours ago",
    followUp: "Due",
    avatar: "JD",
  },
  {
    id: "LD-1002",
    name: "Sarah Williams",
    phone: "+234 802 456 7890",
    product: "Starter Package",
    value: 85000,
    status: "Contacted",
    source: "Facebook",
    assignedTo: "Mary",
    lastContact: "Yesterday",
    followUp: "Today",
    avatar: "SW",
  },
  {
    id: "LD-1003",
    name: "Michael Johnson",
    phone: "+234 803 345 6789",
    product: "Premium Package",
    value: 200000,
    status: "New",
    source: "Instagram",
    assignedTo: "David",
    lastContact: "Never",
    followUp: "Today",
    avatar: "MJ",
  },
  {
    id: "LD-1004",
    name: "Grace Okafor",
    phone: "+234 804 123 4567",
    product: "Business Package",
    value: 350000,
    status: "Interested",
    source: "Website",
    assignedTo: "James",
    lastContact: "3 days ago",
    followUp: "Due",
    avatar: "GO",
  },
  {
    id: "LD-1005",
    name: "Daniel Smith",
    phone: "+234 805 987 6543",
    product: "Starter Package",
    value: 85000,
    status: "Won",
    source: "Referral",
    assignedTo: "Mary",
    lastContact: "Today",
    followUp: "Upcoming",
    avatar: "DS",
  },
];

const recentSales: Sale[] = [
  {
    id: "ORD-1042",
    customer: "John Doe",
    product: "Premium Package",
    amount: 200000,
    status: "Paid",
    date: "Today, 10:42 AM",
    salesperson: "David",
  },
  {
    id: "ORD-1041",
    customer: "Grace Okafor",
    product: "Business Package",
    amount: 350000,
    status: "Pending",
    date: "Today, 9:18 AM",
    salesperson: "James",
  },
  {
    id: "ORD-1040",
    customer: "Daniel Smith",
    product: "Starter Package",
    amount: 85000,
    status: "Paid",
    date: "Yesterday",
    salesperson: "Mary",
  },
  {
    id: "ORD-1039",
    customer: "Sarah Williams",
    product: "Starter Package",
    amount: 85000,
    status: "Paid",
    date: "Yesterday",
    salesperson: "Mary",
  },
];

const currency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | SalesStatus>("All");
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState<Lead | null>(null);
  const [showMore, setShowMore] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    product: "",
    source: "WhatsApp",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.toLowerCase().includes(search.toLowerCase()) ||
        lead.product.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const stats = [
    {
      title: "Today's Sales",
      value: "₦720,000",
      change: "+12.5%",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "New Leads",
      value: "24",
      change: "+8.2%",
      positive: true,
      icon: UserPlus,
    },
    {
      title: "Active Customers",
      value: "184",
      change: "+5.4%",
      positive: true,
      icon: Users,
    },
    {
      title: "Follow-ups",
      value: "9",
      change: "3 due now",
      positive: false,
      icon: Bot,
    },
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLead.name || !newLead.phone) {
      return;
    }

    setShowCreateLead(false);

    setNewLead({
      name: "",
      phone: "",
      product: "",
      source: "WhatsApp",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
                <h1 className="text-2xl font-bold tracking-tight">
                  Sales
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Manage leads, customers, orders, payments and follow-ups.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/follow-ups"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Bot className="h-4 w-4" />
                AI Follow-ups
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  9
                </span>
              </Link>

              <button
                onClick={() => setShowCreateLead(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Lead
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
                      {stat.positive ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Clock3 className="h-3.5 w-3.5 text-orange-500" />
                      )}

                      <span
                        className={
                          stat.positive
                            ? "text-emerald-600"
                            : "text-orange-600"
                        }
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main sales overview */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          {/* Leads */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Sales Pipeline</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your leads from first contact to conversion.
                  </p>
                </div>

                <Link
                  href="/leads"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all leads
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as "All" | SalesStatus
                      )
                    }
                    className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="All">All statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Lead</th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Value</th>
                    <th className="px-5 py-3">Follow-up</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {lead.avatar}
                          </div>

                          <div>
                            <Link
                              href={`/leads/${lead.id}`}
                              className="font-semibold hover:text-indigo-600"
                            >
                              {lead.name}
                            </Link>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {lead.product}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {lead.source}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        {currency(lead.value)}
                      </td>

                      <td className="px-5 py-4">
                        <FollowUpBadge status={lead.followUp} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setShowFollowUp(lead)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {lead.avatar}
                      </div>

                      <div>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-semibold"
                        >
                          {lead.name}
                        </Link>

                        <p className="text-xs text-slate-500">
                          {lead.phone}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={lead.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Product</p>
                      <p className="mt-1 font-medium">{lead.product}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Value</p>
                      <p className="mt-1 font-semibold">
                        {currency(lead.value)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Last contact
                      </p>
                      <p className="mt-1 font-medium">
                        {lead.lastContact}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Follow-up
                      </p>
                      <div className="mt-1">
                        <FollowUpBadge status={lead.followUp} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setShowFollowUp(lead)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white"
                    >
                      <Bot className="h-4 w-4" />
                      AI Follow-up
                    </button>

                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center rounded-xl border border-slate-200 px-4 text-slate-700"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <div className="p-10 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 font-semibold">No leads found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or create a new lead.
                </p>
              </div>
            )}
          </div>

          {/* AI Follow-up panel */}
          <aside className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white shadow-sm">
            <div className="border-b border-indigo-100 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold">AI Follow-ups</h2>
                  <p className="text-xs text-slate-500">
                    Your next best sales actions
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4">
              {leads
                .filter(
                  (lead) =>
                    lead.followUp === "Due" ||
                    lead.followUp === "Today"
                )
                .slice(0, 4)
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{lead.name}</p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {lead.status === "Interested"
                            ? `Interested in ${lead.product} but hasn't completed the next step.`
                            : `This lead has not been contacted recently.`}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          lead.followUp === "Due"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {lead.followUp}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowFollowUp(lead)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Review AI message
                    </button>
                  </div>
                ))}
            </div>

            <div className="border-t border-indigo-100 p-4">
              <Link
                href="/follow-ups"
                className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Open Follow-up Center
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        {/* Recent sales */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest sales activity across your team.
              </p>
            </div>

            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
            >
              View orders
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/orders/${sale.id}`}
                        className="font-semibold text-indigo-600"
                      >
                        {sale.id}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium">
                      {sale.customer}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {sale.product}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      {currency(sale.amount)}
                    </td>

                    <td className="px-5 py-4">
                      {sale.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {sale.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom quick actions */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction
              icon={UserPlus}
              title="New Lead"
              description="Add potential customer"
              onClick={() => setShowCreateLead(true)}
            />

            <QuickAction
              icon={Users}
              title="Customers"
              description="View customer database"
              href="/customers"
            />

            <QuickAction
              icon={Package}
              title="New Order"
              description="Create customer order"
              href="/orders/new"
            />

            <QuickAction
              icon={CalendarClock}
              title="Follow-ups"
              description="Review AI recommendations"
              href="/follow-ups"
            />
          </div>
        </section>
      </div>

      {/* Create lead modal */}
      {showCreateLead && (
        <Modal
          title="Add New Lead"
          onClose={() => setShowCreateLead(false)}
        >
          <form onSubmit={handleCreateLead} className="space-y-4">
            <Input
              label="Customer name"
              placeholder="John Doe"
              value={newLead.name}
              onChange={(value) =>
                setNewLead((prev) => ({ ...prev, name: value }))
              }
              required
            />

            <Input
              label="Phone number"
              placeholder="+234 801 234 5678"
              value={newLead.phone}
              onChange={(value) =>
                setNewLead((prev) => ({ ...prev, phone: value }))
              }
              required
            />

            <Input
              label="Product interested in"
              placeholder="Product or service"
              value={newLead.product}
              onChange={(value) =>
                setNewLead((prev) => ({ ...prev, product: value }))
              }
            />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Lead source
              </label>

              <select
                value={newLead.source}
                onChange={(e) =>
                  setNewLead((prev) => ({
                    ...prev,
                    source: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>WhatsApp</option>
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateLead(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create Lead
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* AI Follow-up modal */}
      {showFollowUp && (
        <Modal
          title="AI Follow-up"
          onClose={() => setShowFollowUp(null)}
        >
          <div className="space-y-5">
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-indigo-600 p-2 text-white">
                  <Bot className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-indigo-900">
                    AI recommendation
                  </p>

                  <p className="mt-1 text-sm leading-6 text-indigo-800">
                    {showFollowUp.name} appears interested in{" "}
                    <strong>{showFollowUp.product}</strong>. A follow-up
                    is recommended because there has not been a recent
                    meaningful interaction.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Suggested message
              </label>

              <textarea
                defaultValue={`Hi ${showFollowUp.name.split(" ")[0]}, just checking in regarding your interest in ${showFollowUp.product}. I wanted to see if you have any questions or if there is anything I can help you with.`}
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                Edit
              </button>

              <button className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Send Message
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Next follow-up
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Tomorrow
                </p>
              </div>

              <button className="rounded-lg border border-slate-200 bg-white p-2">
                <CalendarClock className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

/* ============================================================
   COMPONENTS
   ============================================================ */

function StatusBadge({ status }: { status: SalesStatus }) {
  const styles: Record<SalesStatus, string> = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-slate-100 text-slate-700",
    Interested: "bg-purple-100 text-purple-700",
    Won: "bg-emerald-100 text-emerald-700",
    Lost: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function FollowUpBadge({ status }: { status: FollowUpStatus }) {
  const styles: Record<FollowUpStatus, string> = {
    Due: "bg-red-100 text-red-700",
    Today: "bg-orange-100 text-orange-700",
    Upcoming: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
    >
      <Clock3 className="h-3 w-3" />
      {status}
    </span>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="rounded-xl bg-slate-100 p-2.5 transition group-hover:bg-indigo-100">
        <Icon className="h-5 w-5 text-slate-700 group-hover:text-indigo-600" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      {content}
    </button>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}