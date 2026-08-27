"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Edit3,
  Trash2,
  Power,
  Save,
  X,
  ChevronRight,
  FileText,
  ShieldCheck,
  ShoppingCart,
  Users,
  Truck,
  CreditCard,
  Package,
  Building2,
  MessageSquare,
  Sparkles,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
type TrainingCategory =
  | "Company"
  | "Sales"
  | "Customers"
  | "Products"
  | "Inventory"
  | "Payments"
  | "Delivery"
  | "Policies"
  | "AI Behavior";
type TrainingStatus = "Active" | "Draft" | "Inactive";
type TrainingItem = {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  content: string;
  status: TrainingStatus;
  priority: "Low" | "Medium" | "High" | "Critical";
  updatedAt: string;
  createdBy: string;
  usedBy: string[];
};
const INITIAL_TRAINING: TrainingItem[] = [
  {
    id: "TR-001",
    title: "Company Overview",
    description:
      "Basic information about the company, its mission and how AI SalesOS should operate.",
    category: "Company",
    content:
      "AI SalesOS must understand the company's identity, products, customers, departments and operating structure. AI must always operate according to approved company instructions.",
    status: "Active",
    priority: "Critical",
    updatedAt: "Today",
    createdBy: "Company Admin",
    usedBy: ["Manager AI", "Sales AI", "Customer AI"],
  },
  {
    id: "TR-002",
    title: "Sales Rules",
    description:
      "Rules that guide AI when assisting sales staff and customers.",
    category: "Sales",
    content:
      "AI should help sales representatives follow up with customers, identify opportunities and provide accurate product information. AI must not invent prices, discounts or promises that are not approved.",
    status: "Active",
    priority: "High",
    updatedAt: "Today",
    createdBy: "Sales Manager",
    usedBy: ["Sales AI", "Manager AI"],
  },
  {
    id: "TR-003",
    title: "Customer Communication",
    description:
      "How AI should communicate with customers.",
    category: "Customers",
    content:
      "AI must communicate clearly, respectfully and professionally. It should answer using approved company information and escalate situations it cannot safely resolve.",
    status: "Active",
    priority: "High",
    updatedAt: "Yesterday",
    createdBy: "Company Admin",
    usedBy: ["Customer AI", "Sales AI"],
  },
  {
    id: "TR-004",
    title: "Product Knowledge",
    description:
      "Product descriptions, pricing rules and important product information.",
    category: "Products",
    content:
      "AI must use the current product database when discussing products. If product information is unavailable or outdated, AI should not guess.",
    status: "Active",
    priority: "High",
    updatedAt: "Yesterday",
    createdBy: "Inventory Manager",
    usedBy: ["Sales AI", "Customer AI", "Inventory AI"],
  },
  {
    id: "TR-005",
    title: "Inventory Rules",
    description:
      "Rules for stock monitoring and inventory alerts.",
    category: "Inventory",
    content:
      "AI should monitor stock levels and identify products approaching the company's low-stock threshold. AI should alert the appropriate staff before stock becomes critical.",
    status: "Active",
    priority: "Medium",
    updatedAt: "2 days ago",
    createdBy: "Inventory Manager",
    usedBy: ["Inventory AI", "Manager AI"],
  },
  {
    id: "TR-006",
    title: "Payment Verification",
    description:
      "How payment information and payment evidence should be handled.",
    category: "Payments",
    content:
      "AI must never mark a payment as confirmed solely because a customer claims to have paid. Payment evidence must follow the company's verification process.",
    status: "Active",
    priority: "Critical",
    updatedAt: "3 days ago",
    createdBy: "Finance",
    usedBy: ["Payment AI", "Manager AI"],
  },
  {
    id: "TR-007",
    title: "Delivery Escalation",
    description:
      "Rules for delayed orders and delivery communication.",
    category: "Delivery",
    content:
      "Orders that remain undelivered beyond the company's configured aging period should be flagged and escalated to the appropriate delivery staff.",
    status: "Active",
    priority: "High",
    updatedAt: "3 days ago",
    createdBy: "Operations",
    usedBy: ["Delivery AI", "Customer AI"],
  },
  {
    id: "TR-008",
    title: "AI Approval Policy",
    description:
      "Actions that require human approval.",
    category: "Policies",
    content:
      "AI must request human approval before performing actions outside its assigned authority, making unusual financial decisions or changing important company policies.",
    status: "Active",
    priority: "Critical",
    updatedAt: "4 days ago",
    createdBy: "Company Admin",
    usedBy: ["All AI"],
  },
];
const CATEGORY_CONFIG: Record<
  TrainingCategory,
  {
    icon: any;
  }
> = {
  Company: { icon: Building2 },
  Sales: { icon: ShoppingCart },
  Customers: { icon: Users },
  Products: { icon: Package },
  Inventory: { icon: Package },
  Payments: { icon: CreditCard },
  Delivery: { icon: Truck },
  Policies: { icon: ShieldCheck },
  "AI Behavior": { icon: Brain },
};
function getStoredTraining(): TrainingItem[] {
  if (typeof window === "undefined") return INITIAL_TRAINING;
  try {
    const saved = localStorage.getItem("ai_salesos_training");
    if (!saved) return INITIAL_TRAINING;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_TRAINING;
    return parsed;
  } catch {
    return INITIAL_TRAINING;
  }
}
export default function AITrainingPage() {
  const [training, setTraining] = useState<TrainingItem[]>(INITIAL_TRAINING);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | TrainingCategory>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | TrainingStatus
  >("All");
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] =
    useState<TrainingItem | null>(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Company" as TrainingCategory,
    content: "",
    priority: "Medium" as TrainingItem["priority"],
    status: "Draft" as TrainingStatus,
  });
  useEffect(() => {
    setTraining(getStoredTraining());
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "ai_salesos_training",
      JSON.stringify(training)
    );
  }, [training]);
  const filteredTraining = useMemo(() => {
    const query = search.trim().toLowerCase();
    return training.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query);
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [training, search, category, statusFilter]);
  const activeCount = training.filter(
    (item) => item.status === "Active"
  ).length;
  const draftCount = training.filter(
    (item) => item.status === "Draft"
  ).length;
  const inactiveCount = training.filter(
    (item) => item.status === "Inactive"
  ).length;
  const criticalCount = training.filter(
    (item) => item.priority === "Critical"
  ).length;
  const trainingScore =
    training.length === 0
      ? 0
      : Math.round((activeCount / training.length) * 100);
  function resetForm() {
    setForm({
      title: "",
      description: "",
      category: "Company",
      content: "",
      priority: "Medium",
      status: "Draft",
    });
    setEditingId(null);
  }
  function openCreate() {
    resetForm();
    setShowModal(true);
  }
  function openEdit(item: TrainingItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      priority: item.priority,
      status: item.status,
    });
    setShowModal(true);
  }
  function saveTraining() {
    if (!form.title.trim()) {
      alert("Please enter a training title.");
      return;
    }
    if (!form.content.trim()) {
      alert("Please enter the training instructions.");
      return;
    }
    if (editingId) {
      setTraining((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                updatedAt: "Just now",
              }
            : item
        )
      );
      setSavedMessage("Training updated successfully.");
    } else {
      const newItem: TrainingItem = {
        id: `TR-${String(Date.now()).slice(-6)}`,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        content: form.content.trim(),
        status: form.status,
        priority: form.priority,
        updatedAt: "Just now",
        createdBy: "Company Admin",
        usedBy: ["Manager AI"],
      };
      setTraining((current) => [newItem, ...current]);
      setSavedMessage("Training added successfully.");
    }
    setShowModal(false);
    resetForm();
    setTimeout(() => setSavedMessage(""), 3000);
  }
  function deleteTraining(id: string) {
    const confirmed = window.confirm(
      "Delete this training permanently?"
    );
    if (!confirmed) return;
    setTraining((current) =>
      current.filter((item) => item.id !== id)
    );
    setSelectedTraining(null);
  }
  function toggleTraining(id: string) {
    setTraining((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
              updatedAt: "Just now",
            }
          : item
      )
    );
  }
  function resetTrainingDatabase() {
    const confirmed = window.confirm(
      "Reset AI Training to the default AI SalesOS training?"
    );
    if (!confirmed) return;
    setTraining(INITIAL_TRAINING);
    setSearch("");
    setCategory("All");
    setStatusFilter("All");
    setSavedMessage("Training reset successfully.");
    setTimeout(() => setSavedMessage(""), 3000);
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">
                    AI Training
                  </h1>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    AI SalesOS
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Teach your AI workforce how your company operates.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetTrainingDatabase}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={openCreate}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Training
              </button>
            </div>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* SUCCESS MESSAGE */}
        {savedMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {savedMessage}
          </div>
        )}
        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Brain className="h-5 w-5" />}
            title="Training Score"
            value={`${trainingScore}%`}
            description="AI knowledge coverage"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Active"
            value={activeCount}
            description="Currently used by AI"
          />
          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Drafts"
            value={draftCount}
            description="Waiting for activation"
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5" />}
            title="Critical Rules"
            value={criticalCount}
            description={`${inactiveCount} inactive`}
          />
        </div>
        {/* TRAINING HEALTH */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">
                AI Training Health
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                How prepared the AI workforce is to operate your business.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {trainingScore}%
              </p>
              <p className="text-xs text-slate-500">
                Knowledge readiness
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${trainingScore}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HealthItem
              title="Company"
              value="Ready"
              good
            />
            <HealthItem
              title="Sales"
              value="Ready"
              good
            />
            <HealthItem
              title="Operations"
              value="Ready"
              good
            />
            <HealthItem
              title="Policies"
              value={
                criticalCount > 0
                  ? "Configured"
                  : "Needs setup"
              }
              good={criticalCount > 0}
            />
          </div>
        </section>
        {/* SEARCH + FILTER */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search training, policies or instructions..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-slate-800">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "All"
                      | TrainingCategory
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="All">
                  All categories
                </option>
                {Object.keys(CATEGORY_CONFIG).map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "All"
                      | TrainingStatus
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="All">
                  All statuses
                </option>
                <option value="Active">
                  Active
                </option>
                <option value="Draft">
                  Draft
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          )}
        </section>
        {/* TRAINING LIST */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Company Training
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredTraining.length} training rules
              </p>
            </div>
            <button
              onClick={openCreate}
              className="hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              <Plus className="h-4 w-4" />
              Add training
            </button>
          </div>
          {filteredTraining.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-semibold">
                No training found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or create new training.
              </p>
              <button
                onClick={openCreate}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Add Training
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredTraining.map((item) => {
                const CategoryIcon =
                  CATEGORY_CONFIG[item.category].icon;
                return (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
                  >
                    <div className="flex gap-4">
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:flex dark:bg-blue-950/40 dark:text-blue-400">
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">
                                {item.title}
                              </h3>
                              <StatusBadge
                                status={item.status}
                              />
                              <PriorityBadge
                                priority={item.priority}
                              />
                            </div>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setSelectedTraining(item)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                              title="View training"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openEdit(item)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                toggleTraining(item.id)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                              title="Activate/deactivate"
                            >
                              <Power className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                deleteTraining(item.id)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                            {item.category}
                          </span>
                          <span>
                            Updated {item.updatedAt}
                          </span>
                          <span>
                            Used by {item.usedBy.length} AI
                            {item.usedBy.length !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        {/* AI WORKFORCE TRAINING */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">
                AI Workforce Learning
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Active training is automatically available to the AI workforce.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <WorkforceCard
              name="Manager AI"
              score={96}
              status="Learning"
            />
            <WorkforceCard
              name="Sales AI"
              score={91}
              status="Ready"
            />
            <WorkforceCard
              name="Customer AI"
              score={88}
              status="Ready"
            />
          </div>
        </section>
        {/* RECENT ACTIVITY */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Training Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recent changes to AI knowledge.
              </p>
            </div>
            <MoreVertical className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-5 space-y-4">
            <ActivityRow
              icon={<BookOpen className="h-4 w-4" />}
              title="Sales Rules updated"
              description="Sales AI training was updated."
              time="Today"
            />
            <ActivityRow
              icon={<ShieldCheck className="h-4 w-4" />}
              title="AI Approval Policy activated"
              description="Critical approval rules are active."
              time="Yesterday"
            />
            <ActivityRow
              icon={<Package className="h-4 w-4" />}
              title="Product Knowledge updated"
              description="Product information was refreshed."
              time="2 days ago"
            />
          </div>
        </section>
      </main>
      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="font-semibold">
                  {editingId
                    ? "Edit AI Training"
                    : "Add AI Training"}
                </h2>
                <p className="text-xs text-slate-500">
                  Define how the AI workforce should operate.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Training title">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="Example: Customer refund policy"
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category:
                          e.target.value as TrainingCategory,
                      })
                    }
                    className={inputClass}
                  >
                    {Object.keys(CATEGORY_CONFIG).map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </FormField>
              </div>
              <FormField label="Short description">
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Explain what this training teaches the AI."
                  className={inputClass}
                />
              </FormField>
              <FormField label="Training instructions">
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="Write the exact rules, instructions, procedures or knowledge the AI should learn..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Priority">
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority:
                          e.target.value as TrainingItem["priority"],
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Low">
                      Low
                    </option>
                    <option value="Medium">
                      Medium
                    </option>
                    <option value="High">
                      High
                    </option>
                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </FormField>
                <FormField label="Status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status:
                          e.target.value as TrainingStatus,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Draft">
                      Draft
                    </option>
                    <option value="Active">
                      Active
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </FormField>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                <div className="flex gap-2">
                  <Brain className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Active training becomes available to the AI
                    workforce. Use clear instructions and avoid
                    ambiguous rules.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={saveTraining}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {editingId
                  ? "Save Changes"
                  : "Create Training"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* VIEW MODAL */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">
                    {selectedTraining.title}
                  </h2>
                  <StatusBadge
                    status={selectedTraining.status}
                  />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedTraining.category}
                </p>
              </div>
              <button
                onClick={() =>
                  setSelectedTraining(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {selectedTraining.description}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  AI Instructions
                </p>
                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  {selectedTraining.content}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  AI Workforce
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTraining.usedBy.map(
                    (ai) => (
                      <span
                        key={ai}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      >
                        {ai}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => {
                  openEdit(selectedTraining);
                  setSelectedTraining(null);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() =>
                  toggleTraining(selectedTraining.id)
                }
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Power className="h-4 w-4" />
                {selectedTraining.status === "Active"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* =========================================================
   COMPONENTS
   ========================================================= */
function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>
      <p className="text-sm font-medium">
        {title}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}
function HealthItem({
  title,
  value,
  good,
}: {
  title: string;
  value: string;
  good: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-xs text-slate-500">
        {title}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        {good ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        <span className="text-sm font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
}
function StatusBadge({
  status,
}: {
  status: TrainingStatus;
}) {
  const classes =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
      : status === "Draft"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}
function PriorityBadge({
  priority,
}: {
  priority: TrainingItem["priority"];
}) {
  const classes =
    priority === "Critical"
      ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
      : priority === "High"
      ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
      : priority === "Medium"
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${classes}`}
    >
      {priority}
    </span>
  );
}
function WorkforceCard({
  name,
  score,
  status,
}: {
  name: string;
  score: number;
  status: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">
            {name}
          </span>
        </div>
        <span className="text-xs text-emerald-600">
          {status}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">
            Knowledge
          </span>
          <span className="font-semibold">
            {score}%
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-purple-600"
            style={{
              width: `${score}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
function ActivityRow({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-sm font-medium">
            {title}
          </p>
          <span className="text-xs text-slate-400">
            {time}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white";