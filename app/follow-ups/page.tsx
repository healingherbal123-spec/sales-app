"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  MessageCircle,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */

type FollowUpStatus = "Due" | "Today" | "Upcoming" | "Completed";
type Priority = "High" | "Medium" | "Low";
type CustomerType = "Lead" | "Customer";

type FollowUp = {
  id: string;
  name: string;
  phone: string;
  type: CustomerType;
  reason: string;
  product: string;
  orderId?: string;
  orderAmount?: number;
  priority: Priority;
  status: FollowUpStatus;
  scheduledFor: string;
  lastContact: string;
  assignedTo: string;
  aiRecommendation: string;
  aiMessage: string;
  avatar: string;
};

/* =========================================================
   MOCK DATA
   Replace this with Supabase data later.
   ========================================================= */

const initialFollowUps: FollowUp[] = [
  {
    id: "FU-1001",
    name: "John Doe",
    phone: "+234 801 234 5678",
    type: "Customer",
    reason: "Payment pending",
    product: "Premium Package",
    orderId: "ORD-1042",
    orderAmount: 200000,
    priority: "High",
    status: "Due",
    scheduledFor: "Today, 10:00 AM",
    lastContact: "Yesterday",
    assignedTo: "David",
    avatar: "JD",
    aiRecommendation:
      "John has an order worth ₦200,000 that is still awaiting payment. A polite payment reminder is recommended.",
    aiMessage:
      "Hi John, just checking in regarding your Premium Package order. Please let us know if you need any assistance completing your payment. We're happy to help.",
  },
  {
    id: "FU-1002",
    name: "Sarah Williams",
    phone: "+234 802 456 7890",
    type: "Lead",
    reason: "Interested lead",
    product: "Starter Package",
    priority: "High",
    status: "Today",
    scheduledFor: "Today, 12:30 PM",
    lastContact: "Yesterday",
    assignedTo: "Mary",
    avatar: "SW",
    aiRecommendation:
      "Sarah previously showed interest but has not moved forward. Follow up to answer questions and help her make a decision.",
    aiMessage:
      "Hi Sarah, I wanted to check in and see if you had any questions about the Starter Package. I'm happy to help you with anything you need.",
  },
  {
    id: "FU-1003",
    name: "Michael Johnson",
    phone: "+234 803 345 6789",
    type: "Lead",
    reason: "New lead not contacted",
    product: "Premium Package",
    priority: "High",
    status: "Due",
    scheduledFor: "Today, 1:00 PM",
    lastContact: "Never",
    assignedTo: "David",
    avatar: "MJ",
    aiRecommendation:
      "Michael is a new lead and has not been contacted yet. Initial contact should happen as soon as possible.",
    aiMessage:
      "Hi Michael, thanks for your interest. I'd love to help you learn more about our Premium Package. What would you like to know?",
  },
  {
    id: "FU-1004",
    name: "Grace Okafor",
    phone: "+234 804 123 4567",
    type: "Lead",
    reason: "No response",
    product: "Business Package",
    priority: "Medium",
    status: "Today",
    scheduledFor: "Today, 3:00 PM",
    lastContact: "3 days ago",
    assignedTo: "James",
    avatar: "GO",
    aiRecommendation:
      "Grace was contacted three days ago but has not responded. A short, low-pressure follow-up is recommended.",
    aiMessage:
      "Hi Grace, just checking in to see if you had a chance to review the Business Package. If you have any questions, I'm here to help.",
  },
  {
    id: "FU-1005",
    name: "Daniel Smith",
    phone: "+234 805 987 6543",
    type: "Customer",
    reason: "Customer re-engagement",
    product: "Starter Package",
    priority: "Medium",
    status: "Upcoming",
    scheduledFor: "Tomorrow, 10:00 AM",
    lastContact: "14 days ago",
    assignedTo: "Mary",
    avatar: "DS",
    aiRecommendation:
      "Daniel is an existing customer who has not been contacted recently. A relationship-building message is recommended.",
    aiMessage:
      "Hi Daniel, we hope everything is going well. We just wanted to check in and see how things have been since your last purchase.",
  },
  {
    id: "FU-1006",
    name: "Rebecca Adams",
    phone: "+234 806 111 2233",
    type: "Customer",
    reason: "Order follow-up",
    product: "Premium Package",
    orderId: "ORD-1035",
    orderAmount: 200000,
    priority: "Low",
    status: "Upcoming",
    scheduledFor: "Tomorrow, 2:00 PM",
    lastContact: "5 days ago",
    assignedTo: "David",
    avatar: "RA",
    aiRecommendation:
      "Rebecca completed a recent purchase. A post-purchase follow-up can help maintain the relationship.",
    aiMessage:
      "Hi Rebecca, we're checking in to make sure everything is going well with your recent purchase. Please let us know if you need anything.",
  },
  {
    id: "FU-1007",
    name: "Peter Williams",
    phone: "+234 807 444 5566",
    type: "Customer",
    reason: "Payment reminder",
    product: "Business Package",
    orderId: "ORD-1029",
    orderAmount: 350000,
    priority: "High",
    status: "Completed",
    scheduledFor: "Yesterday, 4:00 PM",
    lastContact: "Yesterday",
    assignedTo: "James",
    avatar: "PW",
    aiRecommendation:
      "Payment follow-up was completed.",
    aiMessage:
      "Hi Peter, just following up regarding your outstanding payment. Please let us know if you need any assistance.",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

const currency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const statusStyles: Record<FollowUpStatus, string> = {
  Due: "bg-red-100 text-red-700",
  Today: "bg-orange-100 text-orange-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-orange-100 text-orange-700",
  Low: "bg-slate-100 text-slate-600",
};

/* =========================================================
   PAGE
   ========================================================= */

export default function FollowUpsPage() {
  const [followUps, setFollowUps] =
    useState<FollowUp[]>(initialFollowUps);

  const [activeTab, setActiveTab] =
    useState<"All" | FollowUpStatus>("All");

  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] =
    useState<"All" | Priority>("All");

  const [selectedFollowUp, setSelectedFollowUp] =
    useState<FollowUp | null>(null);

  const [showFilters, setShowFilters] = useState(false);

  const [showScheduleModal, setShowScheduleModal] =
    useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  /* =======================================================
     FILTERING
     ======================================================= */

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      const matchesTab =
        activeTab === "All" || item.status === activeTab;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      const query = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query);

      return (
        matchesTab &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [
    followUps,
    activeTab,
    priorityFilter,
    search,
  ]);

  /* =======================================================
     COUNTS
     ======================================================= */

  const dueCount = followUps.filter(
    (x) => x.status === "Due"
  ).length;

  const todayCount = followUps.filter(
    (x) => x.status === "Today"
  ).length;

  const upcomingCount = followUps.filter(
    (x) => x.status === "Upcoming"
  ).length;

  const completedCount = followUps.filter(
    (x) => x.status === "Completed"
  ).length;

  /* =======================================================
     COMPLETE FOLLOW-UP
     ======================================================= */

  const completeFollowUp = (id: string) => {
    setFollowUps((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

    setSelectedFollowUp(null);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  /* =======================================================
     RESCHEDULE
     ======================================================= */

  const rescheduleFollowUp = (id: string) => {
    setFollowUps((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Upcoming",
              scheduledFor: "Tomorrow, 10:00 AM",
            }
          : item
      )
    );

    setSelectedFollowUp(null);
    setShowScheduleModal(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">

              <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-sm">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    AI Follow-ups
                  </h1>

                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    AI
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Let AI identify who needs attention, why they
                  need it, and what your sales team should do next.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setActiveTab("All");
                  setPriorityFilter("All");
                  setSearch("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>

            </div>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            AI SUMMARY
            ================================================= */}

        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-5 text-white shadow-lg sm:p-6">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">

              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />

                <p className="text-sm font-bold uppercase tracking-wide text-indigo-100">
                  AI Sales Assistant
                </p>
              </div>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                You have {dueCount} follow-up
                {dueCount !== 1 ? "s" : ""} that need
                attention now.
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                AI has analyzed your leads, customers and orders
                and prioritized the conversations most likely to
                need action.
              </p>

            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">

              <SummaryMini
                value={dueCount}
                label="Due"
              />

              <SummaryMini
                value={todayCount}
                label="Today"
              />

              <SummaryMini
                value={upcomingCount}
                label="Upcoming"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH + FILTER
            ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customers, leads, products..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {showFilters && (
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value as
                      | "All"
                      | Priority
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500"
              >
                <option value="All">
                  All priorities
                </option>
                <option value="High">
                  High priority
                </option>
                <option value="Medium">
                  Medium priority
                </option>
                <option value="Low">
                  Low priority
                </option>
              </select>
            )}

          </div>

          {/* Tabs */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

            <Tab
              active={activeTab === "All"}
              onClick={() => setActiveTab("All")}
              label="All"
              count={followUps.length}
            />

            <Tab
              active={activeTab === "Due"}
              onClick={() => setActiveTab("Due")}
              label="Due now"
              count={dueCount}
              danger
            />

            <Tab
              active={activeTab === "Today"}
              onClick={() => setActiveTab("Today")}
              label="Today"
              count={todayCount}
            />

            <Tab
              active={activeTab === "Upcoming"}
              onClick={() => setActiveTab("Upcoming")}
              label="Upcoming"
              count={upcomingCount}
            />

            <Tab
              active={activeTab === "Completed"}
              onClick={() => setActiveTab("Completed")}
              label="Completed"
              count={completedCount}
            />

          </div>

        </section>

        {/* =================================================
            FOLLOW-UP LIST
            ================================================= */}

        <section className="space-y-4">

          {filteredFollowUps.map((item) => (

            <FollowUpCard
              key={item.id}
              item={item}
              onOpen={() =>
                setSelectedFollowUp(item)
              }
              onComplete={() =>
                completeFollowUp(item.id)
              }
              onReschedule={() => {
                setSelectedFollowUp(item);
                setShowScheduleModal(true);
              }}
            />

          ))}

          {filteredFollowUps.length === 0 && (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Nothing needs your attention
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no follow-ups matching your current
                filters. Great work!
              </p>

            </div>

          )}

        </section>

        {/* =================================================
            FOOTER INFO
            ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-slate-100 p-2.5">
                <Zap className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="font-semibold">
                  AI Follow-up engine
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  AI analyzes leads, customers and orders to
                  recommend your next sales action.
                </p>
              </div>

            </div>

            <div className="text-sm font-semibold text-emerald-600">
              ● System active
            </div>

          </div>

        </section>

      </div>

      {/* ===================================================
          FOLLOW-UP DETAIL MODAL
          =================================================== */}

      {selectedFollowUp && !showScheduleModal && (

        <Modal
          title="AI Follow-up"
          onClose={() =>
            setSelectedFollowUp(null)
          }
        >

          <div className="space-y-5">

            {/* Customer */}

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {selectedFollowUp.avatar}
              </div>

              <div>
                <p className="font-bold">
                  {selectedFollowUp.name}
                </p>

                <p className="text-sm text-slate-500">
                  {selectedFollowUp.phone}
                </p>
              </div>

            </div>

            {/* Context */}

            <div className="grid grid-cols-2 gap-3">

              <InfoBox
                label="Type"
                value={selectedFollowUp.type}
              />

              <InfoBox
                label="Reason"
                value={selectedFollowUp.reason}
              />

              <InfoBox
                label="Product"
                value={selectedFollowUp.product}
              />

              <InfoBox
                label="Priority"
                value={selectedFollowUp.priority}
              />

            </div>

            {selectedFollowUp.orderId && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Related order
                    </p>

                    <Link
                      href={`/orders/${selectedFollowUp.orderId}`}
                      className="mt-1 block font-bold text-indigo-600"
                    >
                      {selectedFollowUp.orderId}
                    </Link>
                  </div>

                  {selectedFollowUp.orderAmount && (
                    <p className="font-bold">
                      {currency(
                        selectedFollowUp.orderAmount
                      )}
                    </p>
                  )}

                </div>

              </div>
            )}

            {/* AI recommendation */}

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-indigo-600 p-2 text-white">
                  <Bot className="h-4 w-4" />
                </div>

                <div>

                  <p className="text-sm font-bold text-indigo-900">
                    AI recommendation
                  </p>

                  <p className="mt-1 text-sm leading-6 text-indigo-800">
                    {selectedFollowUp.aiRecommendation}
                  </p>

                </div>

              </div>

            </div>

            {/* Message */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-bold">
                  Suggested message
                </label>

                <span className="text-xs font-medium text-slate-400">
                  AI generated
                </span>

              </div>

              <textarea
                defaultValue={
                  selectedFollowUp.aiMessage
                }
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* Actions */}

            <div className="grid grid-cols-2 gap-3">

              <a
                href={`tel:${selectedFollowUp.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>

              <button
                onClick={() => {
                  setShowSuccess(true);
                  setTimeout(
                    () => setShowSuccess(false),
                    2500
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
                Send
              </button>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={() =>
                  completeFollowUp(
                    selectedFollowUp.id
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                Complete
              </button>

              <button
                onClick={() =>
                  setShowScheduleModal(true)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CalendarClock className="h-4 w-4" />
                Reschedule
              </button>

            </div>

          </div>

        </Modal>

      )}

      {/* ===================================================
          RESCHEDULE MODAL
          =================================================== */}

      {showScheduleModal && selectedFollowUp && (

        <Modal
          title="Reschedule Follow-up"
          onClose={() =>
            setShowScheduleModal(false)
          }
        >

          <div className="space-y-5">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm font-semibold">
                {selectedFollowUp.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {selectedFollowUp.reason}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={() =>
                  rescheduleFollowUp(
                    selectedFollowUp.id
                  )
                }
                className="rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Clock className="h-5 w-5 text-indigo-600" />

                <p className="mt-2 font-semibold">
                  Tomorrow
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  10:00 AM
                </p>
              </button>

              <button
                onClick={() =>
                  rescheduleFollowUp(
                    selectedFollowUp.id
                  )
                }
                className="rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Calendar className="h-5 w-5 text-indigo-600" />

                <p className="mt-2 font-semibold">
                  Next week
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Monday
                </p>
              </button>

            </div>

            <button
              onClick={() =>
                setShowScheduleModal(false)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>

          </div>

        </Modal>

      )}

      {/* ===================================================
          SUCCESS MESSAGE
          =================================================== */}

      {showSuccess && (

        <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2">

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">

            <div className="rounded-full bg-emerald-500 p-1">
              <Check className="h-3.5 w-3.5" />
            </div>

            Follow-up updated successfully.

          </div>

        </div>

      )}

    </main>
  );
}

/* =========================================================
   FOLLOW-UP CARD
   ========================================================= */

function FollowUpCard({
  item,
  onOpen,
  onComplete,
  onReschedule,
}: {
  item: FollowUp;
  onOpen: () => void;
  onComplete: () => void;
  onReschedule: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        item.status === "Due"
          ? "border-red-200"
          : "border-slate-200"
      }`}
    >

      {/* Top */}

      <div className="p-5">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex min-w-0 items-start gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {item.avatar}
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <Link
                  href={
                    item.type === "Lead"
                      ? `/leads/${item.id}`
                      : `/customers/${item.id}`
                  }
                  className="font-bold hover:text-indigo-600"
                >
                  {item.name}
                </Link>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                  {item.type}
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${priorityStyles[item.priority]}`}
                >
                  {item.priority}
                </span>

              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {item.phone}
                </span>

                <span>
                  Last contact: {item.lastContact}
                </span>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[item.status]}`}
            >
              {item.status === "Due" && (
                <AlertCircle className="h-3.5 w-3.5" />
              )}

              {item.status === "Today" && (
                <Clock className="h-3.5 w-3.5" />
              )}

              {item.status === "Upcoming" && (
                <Calendar className="h-3.5 w-3.5" />
              )}

              {item.status === "Completed" && (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}

              {item.status}
            </span>

            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* Content */}

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Why AI flagged this
            </p>

            <p className="mt-2 font-semibold">
              {item.reason}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Product:{" "}
              <span className="font-medium text-slate-700">
                {item.product}
              </span>
            </p>

            {item.orderId && (
              <div className="mt-3 flex items-center justify-between">

                <Link
                  href={`/orders/${item.orderId}`}
                  className="text-xs font-bold text-indigo-600"
                >
                  {item.orderId}
                </Link>

                {item.orderAmount && (
                  <span className="text-sm font-bold">
                    {currency(item.orderAmount)}
                  </span>
                )}

              </div>
            )}

          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-indigo-600 p-2 text-white">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                  AI recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-indigo-900">
                  {item.aiRecommendation}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <CalendarClock className="h-4 w-4" />

            <span>
              Scheduled:{" "}
              <strong className="text-slate-700">
                {item.scheduledFor}
              </strong>
            </span>

            <span className="hidden sm:inline">•</span>

            <span>
              Assigned to{" "}
              <strong className="text-slate-700">
                {item.assignedTo}
              </strong>
            </span>

          </div>

          <div className="flex gap-2">

            {item.status !== "Completed" && (
              <>
                <button
                  onClick={onReschedule}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  Reschedule
                </button>

                <button
                  onClick={onComplete}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  <Check className="h-3.5 w-3.5" />
                  Complete
                </button>
              </>
            )}

            <button
              onClick={onOpen}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Review
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   TAB
   ========================================================= */

function Tab({
  active,
  onClick,
  label,
  count,
  danger,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          active
            ? "bg-white/15 text-white"
            : danger
            ? "bg-red-100 text-red-700"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* =========================================================
   SUMMARY MINI
   ========================================================= */

function SummaryMini({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-[76px] rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   INFO BOX
   ========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MODAL
   ========================================================= */

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">

      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <h2 className="font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="max-h-[82vh] overflow-y-auto p-5">
          {children}
        </div>

      </div>

    </div>
  );
}