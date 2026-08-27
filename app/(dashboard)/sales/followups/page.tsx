"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarDays,
  MoreVertical,
  ChevronRight,
  X,
  Bot,
  User,
  RefreshCw,
  Filter,
  ArrowUpRight,
  Flame,
  ShoppingBag,
  DollarSign,
  Calendar,
  Check,
} from "lucide-react";

type FollowUpStatus =
  | "Overdue"
  | "Today"
  | "Upcoming"
  | "Completed";

type Priority = "High" | "Medium" | "Low";

type FollowUp = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  amount: number;
  status: FollowUpStatus;
  priority: Priority;
  lastContact: string;
  nextFollowUp: string;
  note: string;
  source: string;
  assignedTo: string;
};

const initialFollowUps: FollowUp[] = [
  {
    id: "FU-1001",
    customer: "Sarah Johnson",
    phone: "+234 801 234 5678",
    product: "Premium Wellness Pack",
    amount: 200000,
    status: "Overdue",
    priority: "High",
    lastContact: "Yesterday",
    nextFollowUp: "Today, 9:00 AM",
    note: "Customer asked about payment options and delivery.",
    source: "WhatsApp",
    assignedTo: "You",
  },
  {
    id: "FU-1002",
    customer: "Michael Mensah",
    phone: "+233 24 555 1122",
    product: "Fertilito",
    amount: 180000,
    status: "Today",
    priority: "High",
    lastContact: "2 days ago",
    nextFollowUp: "Today, 11:30 AM",
    note: "Interested but wants to confirm with spouse.",
    source: "Facebook",
    assignedTo: "You",
  },
  {
    id: "FU-1003",
    customer: "Grace Williams",
    phone: "+234 803 555 9000",
    product: "Ovulation Booster",
    amount: 150000,
    status: "Today",
    priority: "Medium",
    lastContact: "Today",
    nextFollowUp: "Today, 2:00 PM",
    note: "Customer requested more information before ordering.",
    source: "Website",
    assignedTo: "You",
  },
  {
    id: "FU-1004",
    customer: "Daniel Brown",
    phone: "+234 706 123 4567",
    product: "Egg Booster",
    amount: 120000,
    status: "Upcoming",
    priority: "Medium",
    lastContact: "2 hours ago",
    nextFollowUp: "Tomorrow, 10:00 AM",
    note: "Asked to be contacted tomorrow morning.",
    source: "Instagram",
    assignedTo: "You",
  },
  {
    id: "FU-1005",
    customer: "Linda Adams",
    phone: "+234 809 777 1234",
    product: "Superwomb",
    amount: 220000,
    status: "Upcoming",
    priority: "Low",
    lastContact: "Yesterday",
    nextFollowUp: "Aug 23, 3:00 PM",
    note: "Requested product details and customer testimonials.",
    source: "WhatsApp",
    assignedTo: "You",
  },
  {
    id: "FU-1006",
    customer: "James Anderson",
    phone: "+234 812 222 8888",
    product: "Menopause Support Pack",
    amount: 85000,
    status: "Completed",
    priority: "Low",
    lastContact: "Aug 20",
    nextFollowUp: "Completed",
    note: "Customer purchased successfully.",
    source: "Referral",
    assignedTo: "You",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SalesFollowUpsPage() {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | FollowUpStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<
    "All" | Priority
  >("All");

  const [selectedFollowUp, setSelectedFollowUp] =
    useState<FollowUp | null>(null);

  const [showCreate, setShowCreate] = useState(false);

  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      const matchesSearch =
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.toLowerCase().includes(search.toLowerCase()) ||
        item.product.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" || item.status === filter;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [followUps, search, filter, priorityFilter]);

  const overdueCount = followUps.filter(
    (item) => item.status === "Overdue"
  ).length;

  const todayCount = followUps.filter(
    (item) => item.status === "Today"
  ).length;

  const upcomingCount = followUps.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const completedCount = followUps.filter(
    (item) => item.status === "Completed"
  ).length;

  const markCompleted = (id: string) => {
    setFollowUps((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
              nextFollowUp: "Completed",
            }
          : item
      )
    );

    setSelectedFollowUp(null);
  };

  const createFollowUp = () => {
    if (!newCustomer || !newPhone || !newProduct) return;

    const newItem: FollowUp = {
      id: `FU-${Date.now()}`,
      customer: newCustomer,
      phone: newPhone,
      product: newProduct,
      amount: Number(newAmount) || 0,
      status: "Upcoming",
      priority: "Medium",
      lastContact: "Just now",
      nextFollowUp: newDate || "Tomorrow",
      note: "New sales follow-up.",
      source: "Manual",
      assignedTo: "You",
    };

    setFollowUps((current) => [newItem, ...current]);

    setNewCustomer("");
    setNewPhone("");
    setNewProduct("");
    setNewAmount("");
    setNewDate("");
    setShowCreate(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                <span>Sales</span>
                <ChevronRight size={15} />
                <span>Follow-ups</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Sales Follow-ups
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay on top of every customer conversation and close more
                sales.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} />
              New Follow-up
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            title="Overdue"
            value={overdueCount}
            icon={<AlertCircle size={20} />}
            description="Needs attention"
            active={filter === "Overdue"}
            onClick={() =>
              setFilter(filter === "Overdue" ? "All" : "Overdue")
            }
          />

          <StatCard
            title="Today"
            value={todayCount}
            icon={<CalendarDays size={20} />}
            description="Due today"
            active={filter === "Today"}
            onClick={() =>
              setFilter(filter === "Today" ? "All" : "Today")
            }
          />

          <StatCard
            title="Upcoming"
            value={upcomingCount}
            icon={<Clock size={20} />}
            description="Coming next"
            active={filter === "Upcoming"}
            onClick={() =>
              setFilter(filter === "Upcoming" ? "All" : "Upcoming")
            }
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle2 size={20} />}
            description="Successfully handled"
            active={filter === "Completed"}
            onClick={() =>
              setFilter(filter === "Completed" ? "All" : "Completed")
            }
          />
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bot size={22} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  AI Sales Assistant
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  You have{" "}
                  <strong>{overdueCount} overdue follow-up</strong>
                  {overdueCount === 1 ? "" : "s"} that should be handled
                  today.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFilter("Overdue")}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50"
            >
              Review Now
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, phone or product..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <FilterButton
                active={priorityFilter === "All"}
                onClick={() => setPriorityFilter("All")}
              >
                All priorities
              </FilterButton>

              <FilterButton
                active={priorityFilter === "High"}
                onClick={() => setPriorityFilter("High")}
              >
                High
              </FilterButton>

              <FilterButton
                active={priorityFilter === "Medium"}
                onClick={() => setPriorityFilter("Medium")}
              >
                Medium
              </FilterButton>

              <FilterButton
                active={priorityFilter === "Low"}
                onClick={() => setPriorityFilter("Low")}
              >
                Low
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Follow-up List */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Follow-up Queue
              </h2>
              <p className="text-sm text-slate-500">
                {filteredFollowUps.length} customer
                {filteredFollowUps.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
                setPriorityFilter("All");
              }}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <RefreshCw size={15} />
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {filteredFollowUps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Search className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 font-semibold">No follow-ups found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredFollowUps.map((item) => (
                <FollowUpCard
                  key={item.id}
                  item={item}
                  onOpen={() => setSelectedFollowUp(item)}
                  onComplete={() => markCompleted(item.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFollowUp && (
        <Modal onClose={() => setSelectedFollowUp(null)}>
          <div className="flex items-start justify-between border-b border-slate-200 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Follow-up
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {selectedFollowUp.customer}
              </h2>
            </div>

            <button
              onClick={() => setSelectedFollowUp(null)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3">
              <InfoBox
                icon={<ShoppingBag size={17} />}
                label="Product"
                value={selectedFollowUp.product}
              />

              <InfoBox
                icon={<DollarSign size={17} />}
                label="Potential Sale"
                value={formatCurrency(selectedFollowUp.amount)}
              />

              <InfoBox
                icon={<Phone size={17} />}
                label="Phone"
                value={selectedFollowUp.phone}
              />

              <InfoBox
                icon={<Calendar size={17} />}
                label="Next Follow-up"
                value={selectedFollowUp.nextFollowUp}
              />
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer note
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedFollowUp.note}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${selectedFollowUp.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <Phone size={17} />
                Call
              </a>

              <a
                href={`https://wa.me/${selectedFollowUp.phone.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>

            <button
              onClick={() => markCompleted(selectedFollowUp.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <CheckCircle2 size={18} />
              Mark Follow-up Completed
            </button>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="text-xl font-bold">New Follow-up</h2>
              <p className="mt-1 text-sm text-slate-500">
                Create a follow-up for a customer.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 p-5">
            <Input
              label="Customer name"
              value={newCustomer}
              onChange={setNewCustomer}
              placeholder="John Doe"
            />

            <Input
              label="Phone number"
              value={newPhone}
              onChange={setNewPhone}
              placeholder="+234 801 234 5678"
            />

            <Input
              label="Product"
              value={newProduct}
              onChange={setNewProduct}
              placeholder="Product name"
            />

            <Input
              label="Potential sale amount"
              value={newAmount}
              onChange={setNewAmount}
              placeholder="150000"
              type="number"
            />

            <Input
              label="Follow-up date"
              value={newDate}
              onChange={setNewDate}
              placeholder="Tomorrow, 10:00 AM"
            />

            <button
              onClick={createFollowUp}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              Create Follow-up
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  active,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        active
          ? "border-slate-900 ring-1 ring-slate-900"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-500">{icon}</span>

        {title === "Overdue" && value > 0 && (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <Flame size={13} />
            Urgent
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-0.5 text-xs text-slate-400">{description}</p>
    </button>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function FollowUpCard({
  item,
  onOpen,
  onComplete,
}: {
  item: FollowUp;
  onOpen: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
          {item.customer
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{item.customer}</h3>

                <PriorityBadge priority={item.priority} />
                <StatusBadge status={item.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {item.product} · {formatCurrency(item.amount)}
              </p>
            </div>

            <button
              onClick={onOpen}
              className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 sm:block"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-3">
            <p className="text-sm leading-5 text-slate-600">
              {item.note}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {item.nextFollowUp}
            </span>

            <span className="flex items-center gap-1.5">
              <User size={14} />
              {item.assignedTo}
            </span>

            <span>{item.source}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <a
              href={`tel:${item.phone}`}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
            >
              <Phone size={15} />
              Call
            </a>

            <a
              href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>

            {item.status !== "Completed" && (
              <button
                onClick={onComplete}
                className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 sm:col-span-1"
              >
                <Check size={15} />
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: FollowUpStatus }) {
  const styles = {
    Overdue: "bg-red-50 text-red-700",
    Today: "bg-blue-50 text-blue-700",
    Upcoming: "bg-violet-50 text-violet-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
      />
    </label>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-y-auto bg-white sm:max-w-lg sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
}