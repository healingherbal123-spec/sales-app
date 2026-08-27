"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Plus,
  Search,
  Filter,
  Settings,
  Power,
  PowerOff,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Zap,
  Shield,
  Key,
  Database,
  Cloud,
  Code,
  Layers,
  Sparkles,
  Rocket,
  Cpu,
  Globe,
  X,
  Save,
  Send,
  Copy,
  Play,
  BarChart,
  DollarSign,
  Loader2,
  ChevronDown,
  Check,
  AlertTriangle,
  Server,
  Link2,
  Users,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Building2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface Provider {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  models: Model[];
}

interface Model {
  id: string;
  name: string;
  slug: string;
  max_tokens: number;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  context_window: number;
}

interface Agent {
  id: string;
  name: string;
  slug: string;
  role: string;
  description: string;
  provider_id: string;
  provider_name: string;
  model_id: string;
  model_name: string;
  fallback_provider_id?: string;
  fallback_provider_name?: string;
  system_instructions: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  memory_enabled: boolean;
  memory_limit: number;
  status: "active" | "inactive" | "training" | "error";
  tools: string[];
  knowledge: { id: string; name: string }[];
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
  usage: {
    runs: number;
    total_tokens: number;
    total_cost: number;
  };
}

interface AgentFormData {
  name: string;
  role: string;
  description: string;
  provider_id: string;
  model_id: string;
  fallback_provider_id?: string;
  system_instructions: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  memory_enabled: boolean;
  memory_limit: number;
  tools: string[];
  knowledge_ids: string[];
  status: "active" | "inactive";
}

// ─── Mock Data ──────────────────────────────────────────────────
const MOCK_PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "OpenAI",
    slug: "openai",
    is_active: true,
    models: [
      { id: "m1", name: "GPT-4 Turbo", slug: "gpt-4-turbo", max_tokens: 4096, input_cost_per_1k: 0.01, output_cost_per_1k: 0.03, context_window: 128000 },
      { id: "m2", name: "GPT-4", slug: "gpt-4", max_tokens: 4096, input_cost_per_1k: 0.03, output_cost_per_1k: 0.06, context_window: 8192 },
      { id: "m3", name: "GPT-3.5 Turbo", slug: "gpt-3.5-turbo", max_tokens: 4096, input_cost_per_1k: 0.0005, output_cost_per_1k: 0.0015, context_window: 16384 },
    ],
  },
  {
    id: "p2",
    name: "Anthropic",
    slug: "anthropic",
    is_active: true,
    models: [
      { id: "m4", name: "Claude 3 Opus", slug: "claude-3-opus", max_tokens: 4096, input_cost_per_1k: 0.015, output_cost_per_1k: 0.075, context_window: 200000 },
      { id: "m5", name: "Claude 3 Sonnet", slug: "claude-3-sonnet", max_tokens: 4096, input_cost_per_1k: 0.003, output_cost_per_1k: 0.015, context_window: 200000 },
      { id: "m6", name: "Claude 3 Haiku", slug: "claude-3-haiku", max_tokens: 4096, input_cost_per_1k: 0.00025, output_cost_per_1k: 0.00125, context_window: 200000 },
    ],
  },
  {
    id: "p3",
    name: "Google",
    slug: "google",
    is_active: true,
    models: [
      { id: "m7", name: "Gemini Pro", slug: "gemini-pro", max_tokens: 4096, input_cost_per_1k: 0.00025, output_cost_per_1k: 0.0005, context_window: 30720 },
      { id: "m8", name: "Gemini Ultra", slug: "gemini-ultra", max_tokens: 4096, input_cost_per_1k: 0.002, output_cost_per_1k: 0.004, context_window: 30720 },
    ],
  },
  {
    id: "p4",
    name: "DeepSeek",
    slug: "deepseek",
    is_active: true,
    models: [
      { id: "m9", name: "DeepSeek Chat", slug: "deepseek-chat", max_tokens: 4096, input_cost_per_1k: 0.00014, output_cost_per_1k: 0.00028, context_window: 32000 },
      { id: "m10", name: "DeepSeek Coder", slug: "deepseek-coder", max_tokens: 4096, input_cost_per_1k: 0.00014, output_cost_per_1k: 0.00028, context_window: 32000 },
    ],
  },
  {
    id: "p5",
    name: "Mistral",
    slug: "mistral",
    is_active: true,
    models: [
      { id: "m11", name: "Mistral Large", slug: "mistral-large", max_tokens: 4096, input_cost_per_1k: 0.008, output_cost_per_1k: 0.024, context_window: 32000 },
      { id: "m12", name: "Mistral Medium", slug: "mistral-medium", max_tokens: 4096, input_cost_per_1k: 0.0027, output_cost_per_1k: 0.0081, context_window: 32000 },
    ],
  },
  {
    id: "p6",
    name: "xAI",
    slug: "xai",
    is_active: true,
    models: [
      { id: "m13", name: "Grok-1", slug: "grok-1", max_tokens: 4096, input_cost_per_1k: 0.005, output_cost_per_1k: 0.015, context_window: 8192 },
    ],
  },
  {
    id: "p7",
    name: "Cohere",
    slug: "cohere",
    is_active: true,
    models: [
      { id: "m14", name: "Command R", slug: "command-r", max_tokens: 4096, input_cost_per_1k: 0.0005, output_cost_per_1k: 0.0015, context_window: 128000 },
    ],
  },
  {
    id: "p8",
    name: "Meta Llama",
    slug: "meta",
    is_active: true,
    models: [
      { id: "m15", name: "Llama 3 70B", slug: "llama-3-70b", max_tokens: 4096, input_cost_per_1k: 0.001, output_cost_per_1k: 0.002, context_window: 8192 },
    ],
  },
  {
    id: "p9",
    name: "Qwen",
    slug: "qwen",
    is_active: true,
    models: [
      { id: "m16", name: "Qwen 72B", slug: "qwen-72b", max_tokens: 4096, input_cost_per_1k: 0.002, output_cost_per_1k: 0.004, context_window: 32768 },
    ],
  },
  {
    id: "p10",
    name: "Groq",
    slug: "groq",
    is_active: true,
    models: [
      { id: "m17", name: "Groq Mixtral", slug: "groq-mixtral", max_tokens: 4096, input_cost_per_1k: 0.0005, output_cost_per_1k: 0.001, context_window: 32768 },
    ],
  },
  {
    id: "p11",
    name: "OpenRouter",
    slug: "openrouter",
    is_active: true,
    models: [
      { id: "m18", name: "OpenRouter GPT-4", slug: "openrouter-gpt-4", max_tokens: 4096, input_cost_per_1k: 0.01, output_cost_per_1k: 0.03, context_window: 8192 },
    ],
  },
  {
    id: "p12",
    name: "Perplexity",
    slug: "perplexity",
    is_active: true,
    models: [
      { id: "m19", name: "Perplexity Llama", slug: "perplexity-llama", max_tokens: 4096, input_cost_per_1k: 0.001, output_cost_per_1k: 0.002, context_window: 8192 },
    ],
  },
  {
    id: "p13",
    name: "Hugging Face",
    slug: "huggingface",
    is_active: true,
    models: [
      { id: "m20", name: "Hugging Face Mistral", slug: "huggingface-mistral", max_tokens: 4096, input_cost_per_1k: 0.001, output_cost_per_1k: 0.002, context_window: 8192 },
    ],
  },
  {
    id: "p14",
    name: "Ollama",
    slug: "ollama",
    is_active: true,
    models: [
      { id: "m21", name: "Ollama Llama2", slug: "ollama-llama2", max_tokens: 4096, input_cost_per_1k: 0, output_cost_per_1k: 0, context_window: 4096 },
    ],
  },
  {
    id: "p15",
    name: "Custom",
    slug: "custom",
    is_active: true,
    models: [
      { id: "m22", name: "Custom Model", slug: "custom-model", max_tokens: 4096, input_cost_per_1k: 0, output_cost_per_1k: 0, context_window: 4096 },
    ],
  },
];

const MOCK_AGENTS: Agent[] = [
  {
    id: "a1",
    name: "Sales AI",
    slug: "sales-ai",
    role: "sales",
    description: "Handles sales leads, follow-ups, and customer inquiries",
    provider_id: "p1",
    provider_name: "OpenAI",
    model_id: "m1",
    model_name: "GPT-4 Turbo",
    fallback_provider_id: "p2",
    fallback_provider_name: "Anthropic",
    system_instructions: "You are a sales assistant. Help find opportunities, follow up with leads, and provide product information.",
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    memory_enabled: true,
    memory_limit: 50,
    status: "active",
    tools: ["lead_scoring", "followup_reminders"],
    knowledge: [{ id: "k1", name: "Product Catalog" }],
    last_run_at: "2024-01-15T10:30:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    usage: { runs: 128, total_tokens: 45200, total_cost: 0.45 },
  },
  {
    id: "a2",
    name: "Customer AI",
    slug: "customer-ai",
    role: "customer",
    description: "Handles customer conversations and support",
    provider_id: "p2",
    provider_name: "Anthropic",
    model_id: "m5",
    model_name: "Claude 3 Sonnet",
    fallback_provider_id: "p1",
    fallback_provider_name: "OpenAI",
    system_instructions: "You are a customer support agent. Help customers with their questions and resolve issues.",
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    memory_enabled: true,
    memory_limit: 100,
    status: "active",
    tools: ["knowledge_base"],
    knowledge: [{ id: "k2", name: "Support Policies" }],
    last_run_at: "2024-01-15T09:00:00Z",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-14T00:00:00Z",
    usage: { runs: 87, total_tokens: 32000, total_cost: 0.22 },
  },
  {
    id: "a3",
    name: "Delivery AI",
    slug: "delivery-ai",
    role: "delivery",
    description: "Tracks deliveries and communicates with drivers",
    provider_id: "p3",
    provider_name: "Google",
    model_id: "m7",
    model_name: "Gemini Pro",
    fallback_provider_id: "p4",
    fallback_provider_name: "DeepSeek",
    system_instructions: "You are a logistics assistant. Track deliveries, notify customers, and coordinate with drivers.",
    temperature: 0.6,
    max_tokens: 2048,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    memory_enabled: false,
    memory_limit: 0,
    status: "inactive",
    tools: [],
    knowledge: [{ id: "k3", name: "Delivery Routes" }],
    last_run_at: null,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    usage: { runs: 23, total_tokens: 8000, total_cost: 0.05 },
  },
  {
    id: "a4",
    name: "Payment AI",
    slug: "payment-ai",
    role: "payment",
    description: "Monitors payments and payment evidence",
    provider_id: "p4",
    provider_name: "DeepSeek",
    model_id: "m9",
    model_name: "DeepSeek Chat",
    fallback_provider_id: "p1",
    fallback_provider_name: "OpenAI",
    system_instructions: "You are a finance assistant. Track payments, verify payment evidence, and manage invoices.",
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    memory_enabled: true,
    memory_limit: 30,
    status: "active",
    tools: ["payment_verification"],
    knowledge: [{ id: "k4", name: "Payment Policies" }],
    last_run_at: "2024-01-14T16:00:00Z",
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-14T00:00:00Z",
    usage: { runs: 34, total_tokens: 12000, total_cost: 0.08 },
  },
];

// ─── Helper Functions ──────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getStatusBadge(status: string) {
  const config: Record<string, { color: string; icon: any; label: string }> = {
    active: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400", icon: CheckCircle2, label: "Active" },
    inactive: { color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", icon: PowerOff, label: "Inactive" },
    training: { color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400", icon: Clock, label: "Training" },
    error: { color: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400", icon: AlertCircle, label: "Error" },
  };
  const { color, icon: Icon, label } = config[status] || config.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function AIAgentsPage() {
  // ─── State ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    role: "",
    description: "",
    provider_id: "",
    model_id: "",
    fallback_provider_id: "",
    system_instructions: "",
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    memory_enabled: true,
    memory_limit: 50,
    tools: [],
    knowledge_ids: [],
    status: "active",
  });
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testing, setTesting] = useState(false);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "usage" | "settings">("overview");
  const [saving, setSaving] = useState(false);

  // ─── Load Data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const res = await fetch('/api/ai/agents');
      // const data = await res.json();
      // setAgents(data);
      // const providersRes = await fetch('/api/ai/providers');
      // const providersData = await providersRes.json();
      // setProviders(providersData);
      
      // Use mock data for demo
      setAgents(MOCK_AGENTS);
      setProviders(MOCK_PROVIDERS);
    } catch (error) {
      showToast("Failed to load AI agents", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Toast ────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleCreate = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      role: "",
      description: "",
      provider_id: providers.length > 0 ? providers[0].id : "",
      model_id: "",
      fallback_provider_id: "",
      system_instructions: "",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      memory_enabled: true,
      memory_limit: 50,
      tools: [],
      knowledge_ids: [],
      status: "active",
    });
    setShowCreateModal(true);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      role: agent.role,
      description: agent.description,
      provider_id: agent.provider_id,
      model_id: agent.model_id,
      fallback_provider_id: agent.fallback_provider_id || "",
      system_instructions: agent.system_instructions,
      temperature: agent.temperature,
      max_tokens: agent.max_tokens,
      top_p: agent.top_p,
      frequency_penalty: agent.frequency_penalty,
      presence_penalty: agent.presence_penalty,
      memory_enabled: agent.memory_enabled,
      memory_limit: agent.memory_limit,
      tools: agent.tools,
      knowledge_ids: agent.knowledge.map(k => k.id),
      status: agent.status === "active" ? "active" : "inactive",
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast("Agent name is required.", "error");
      return;
    }
    if (!formData.provider_id) {
      showToast("Please select a provider.", "error");
      return;
    }
    if (!formData.model_id) {
      showToast("Please select a model.", "error");
      return;
    }

    setSaving(true);
    try {
      // In a real app, POST/PUT to API
      // const url = editingAgent ? `/api/ai/agents/${editingAgent.id}` : '/api/ai/agents';
      // const method = editingAgent ? 'PUT' : 'POST';
      // const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      // if (!res.ok) throw new Error('Failed to save agent');
      
      // For demo, update local state
      const newAgent: Agent = {
        id: editingAgent?.id || `a${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s/g, "-"),
        role: formData.role,
        description: formData.description,
        provider_id: formData.provider_id,
        provider_name: providers.find(p => p.id === formData.provider_id)?.name || "",
        model_id: formData.model_id,
        model_name: providers.flatMap(p => p.models).find(m => m.id === formData.model_id)?.name || "",
        fallback_provider_id: formData.fallback_provider_id,
        fallback_provider_name: formData.fallback_provider_id ? providers.find(p => p.id === formData.fallback_provider_id)?.name : undefined,
        system_instructions: formData.system_instructions,
        temperature: formData.temperature,
        max_tokens: formData.max_tokens,
        top_p: formData.top_p,
        frequency_penalty: formData.frequency_penalty,
        presence_penalty: formData.presence_penalty,
        memory_enabled: formData.memory_enabled,
        memory_limit: formData.memory_limit,
        status: formData.status,
        tools: formData.tools,
        knowledge: formData.knowledge_ids.map(id => ({ id, name: "Knowledge " + id })),
        last_run_at: editingAgent?.last_run_at || null,
        created_at: editingAgent?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage: editingAgent?.usage || { runs: 0, total_tokens: 0, total_cost: 0 },
      };
      if (editingAgent) {
        setAgents(agents.map(a => a.id === editingAgent.id ? newAgent : a));
        showToast("Agent updated successfully.");
      } else {
        setAgents([newAgent, ...agents]);
        showToast("Agent created successfully.");
      }
      setShowCreateModal(false);
    } catch (error) {
      showToast("Failed to save agent.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === "active" ? "inactive" : "active";
    try {
      // In real app: PUT /api/ai/agents/:id with { status: newStatus }
      setAgents(agents.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
      showToast(`Agent ${newStatus === "active" ? "activated" : "deactivated"}.`);
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agent permanently?")) return;
    try {
      // In real app: DELETE /api/ai/agents/:id
      setAgents(agents.filter(a => a.id !== id));
      showToast("Agent deleted.");
    } catch {
      showToast("Failed to delete agent.", "error");
    }
  };

  const handleDuplicate = async (agent: Agent) => {
    const newAgent: Agent = {
      ...agent,
      id: `a${Date.now()}`,
      name: `${agent.name} (Copy)`,
      slug: `${agent.slug}-copy`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usage: { runs: 0, total_tokens: 0, total_cost: 0 },
    };
    setAgents([newAgent, ...agents]);
    showToast("Agent duplicated.");
  };

  // ─── 🧠 UPDATED: Real DeepSeek chat ──────────────────────────
  const handleTest = async (agent: Agent, prompt: string) => {
    setTesting(true);
    setTestResponse("");
    try {
      const res = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          userMessage: prompt,
          systemInstructions: agent.system_instructions,
          model: agent.model_name,   // you can also use agent.model_id
          temperature: agent.temperature,
          maxTokens: agent.max_tokens,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "API error");
      }
      const data = await res.json();
      setTestResponse(data.reply);
      showToast("Test completed.");
    } catch (error: any) {
      setTestResponse(`Error: ${error.message}`);
      showToast("Test failed.", "error");
    } finally {
      setTesting(false);
    }
  };

  // ─── Filters ──────────────────────────────────────────────────
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "all" || agent.role === filterRole;
      const matchesProvider = filterProvider === "all" || agent.provider_name === filterProvider;
      const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
      return matchesSearch && matchesRole && matchesProvider && matchesStatus;
    });
  }, [agents, searchQuery, filterRole, filterProvider, filterStatus]);

  // ─── Provider/Model change handler ──────────────────────────
  const handleProviderChange = (providerId: string) => {
    setFormData({ ...formData, provider_id: providerId, model_id: "" });
  };

  const getModelsForProvider = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.models || [];
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold">AI Agents</h1>
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-0.5 rounded-full">Workforce</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure and manage your AI workforce across multiple providers.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                New Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Agents" value={agents.length} icon={Brain} color="blue" />
          <StatCard label="Active" value={agents.filter(a => a.status === "active").length} icon={CheckCircle2} color="emerald" />
          <StatCard label="Inactive" value={agents.filter(a => a.status === "inactive").length} icon={PowerOff} color="slate" />
          <StatCard label="Total Runs" value={agents.reduce((sum, a) => sum + a.usage.runs, 0)} icon={Activity} color="purple" />
          <StatCard label="Total Cost" value={formatCurrency(agents.reduce((sum, a) => sum + a.usage.total_cost, 0))} icon={DollarSign} color="amber" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#1a1d27] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search agents by name, role, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Roles</option>
              {Array.from(new Set(agents.map(a => a.role))).map(role => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Providers</option>
              {Array.from(new Set(agents.map(a => a.provider_name))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="training">Training</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Agent Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-200 dark:border-slate-700">
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No agents match your filters.</p>
            <button
              onClick={handleCreate}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create your first agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onToggle={() => handleToggleStatus(agent)}
                onEdit={() => handleEdit(agent)}
                onDelete={() => handleDelete(agent.id)}
                onDuplicate={() => handleDuplicate(agent)}
                onTest={() => {
                  setSelectedAgent(agent);
                  setTestPrompt("");
                  setTestResponse("");
                  setShowTestModal(true);
                }}
                onView={() => {
                  setSelectedAgent(agent);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── CREATE / EDIT MODAL ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-[#1a1d27] px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{editingAgent ? "Edit Agent" : "Create New Agent"}</h2>
                <p className="text-sm text-slate-500">Configure your AI employee</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sales AI"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select role</option>
                    <option value="sales">Sales</option>
                    <option value="customer">Customer Support</option>
                    <option value="delivery">Delivery</option>
                    <option value="payment">Payment</option>
                    <option value="inventory">Inventory</option>
                    <option value="insight">Insight</option>
                    <option value="manager">Manager</option>
                    <option value="marketing">Marketing</option>
                    <option value="training">Training</option>
                    <option value="analytics">Analytics</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this agent do?"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Provider & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Provider *</label>
                  <select
                    value={formData.provider_id}
                    onChange={(e) => handleProviderChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select provider</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model *</label>
                  <select
                    value={formData.model_id}
                    onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    disabled={!formData.provider_id}
                  >
                    <option value="">Select model</option>
                    {getModelsForProvider(formData.provider_id).map(m => (
                      <option key={m.id} value={m.id}>{m.name} (${m.input_cost_per_1k}/1K in, ${m.output_cost_per_1k}/1K out)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fallback Provider */}
              <div>
                <label className="block text-sm font-medium mb-1">Fallback Provider (optional)</label>
                <select
                  value={formData.fallback_provider_id}
                  onChange={(e) => setFormData({ ...formData, fallback_provider_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">None</option>
                  {providers.filter(p => p.id !== formData.provider_id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* System Instructions */}
              <div>
                <label className="block text-sm font-medium mb-1">System Instructions</label>
                <textarea
                  value={formData.system_instructions}
                  onChange={(e) => setFormData({ ...formData, system_instructions: e.target.value })}
                  rows={4}
                  placeholder="Define the agent's personality, goals, and constraints..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y"
                />
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Tokens</label>
                  <input
                    type="number"
                    value={formData.max_tokens}
                    onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Top P</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.top_p}
                    onChange={(e) => setFormData({ ...formData, top_p: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency Penalty</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-2"
                    max="2"
                    value={formData.frequency_penalty}
                    onChange={(e) => setFormData({ ...formData, frequency_penalty: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Presence Penalty</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-2"
                    max="2"
                    value={formData.presence_penalty}
                    onChange={(e) => setFormData({ ...formData, presence_penalty: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium mb-1">Memory</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.memory_enabled}
                      onChange={(e) => setFormData({ ...formData, memory_enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                  </label>
                  {formData.memory_enabled && (
                    <input
                      type="number"
                      value={formData.memory_limit}
                      onChange={(e) => setFormData({ ...formData, memory_limit: parseInt(e.target.value) })}
                      className="w-20 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm"
                      placeholder="Limit"
                    />
                  )}
                </div>
              </div>

              {/* Tools & Knowledge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tools</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2">
                    {["lead_scoring", "followup_reminders", "knowledge_base", "payment_verification", "stock_monitoring", "delivery_tracking"].map(tool => (
                      <label key={tool} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.tools.includes(tool)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, tools: [...formData.tools, tool] });
                            } else {
                              setFormData({ ...formData, tools: formData.tools.filter(t => t !== tool) });
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {tool.replace(/_/g, " ")}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Knowledge Sources</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2">
                    {["Product Catalog", "Support Policies", "Delivery Routes", "Payment Policies", "HR Handbook", "Sales Scripts"].map(know => (
                      <label key={know} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.knowledge_ids.includes("k" + know.split(" ")[0])}
                          onChange={(e) => {
                            const id = "k" + know.split(" ")[0];
                            if (e.target.checked) {
                              setFormData({ ...formData, knowledge_ids: [...formData.knowledge_ids, id] });
                            } else {
                              setFormData({ ...formData, knowledge_ids: formData.knowledge_ids.filter(k => k !== id) });
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {know}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1a1d27] px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingAgent ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TEST MODAL ─── */}
      {showTestModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Test Agent: {selectedAgent.name}</h2>
                <p className="text-sm text-slate-500">Send a test prompt to this agent</p>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prompt</label>
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={3}
                  placeholder="Ask something to test the agent..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d0f15] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y"
                />
              </div>
              <button
                onClick={() => handleTest(selectedAgent, testPrompt)}
                disabled={testing || !testPrompt.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Run Test
              </button>
              {testResponse && (
                <div>
                  <label className="block text-sm font-medium mb-1">Response</label>
                  <div className="p-4 bg-slate-50 dark:bg-[#0d0f15] rounded-lg border border-slate-200 dark:border-slate-700 whitespace-pre-wrap text-sm">
                    {testResponse}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DETAIL / ACTIVITY MODAL ─── */}
      {showDetailModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                <p className="text-sm text-slate-500">{selectedAgent.role} • {selectedAgent.provider_name} / {selectedAgent.model_name}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
              {["overview", "activity", "usage", "settings"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 transition ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-slate-500 text-sm">Status:</span> {getStatusBadge(selectedAgent.status)}</div>
                    <div><span className="text-slate-500 text-sm">Last Run:</span> {selectedAgent.last_run_at ? formatDate(selectedAgent.last_run_at) : "Never"}</div>
                    <div><span className="text-slate-500 text-sm">Created:</span> {formatDate(selectedAgent.created_at)}</div>
                    <div><span className="text-slate-500 text-sm">Memory:</span> {selectedAgent.memory_enabled ? `Enabled (${selectedAgent.memory_limit} items)` : "Disabled"}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selectedAgent.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Instructions</p>
                    <pre className="text-sm bg-slate-50 dark:bg-[#0d0f15] p-4 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedAgent.system_instructions}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tools</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAgent.tools.length > 0 ? selectedAgent.tools.map(t => (
                        <span key={t} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{t.replace(/_/g, " ")}</span>
                      )) : <span className="text-sm text-slate-400">None</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Knowledge Sources</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAgent.knowledge.length > 0 ? selectedAgent.knowledge.map(k => (
                        <span key={k.id} className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">{k.name}</span>
                      )) : <span className="text-sm text-slate-400">None</span>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Recent activity will appear here.</p>
                  {/* In real app, fetch from API */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[1,2,3].map(i => (
                      <div key={i} className="py-2 flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium">Chat completion</p>
                          <p className="text-slate-500 text-xs">2 hours ago • 120 tokens</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-[#0d0f15] rounded-lg">
                      <p className="text-xs text-slate-500">Total Runs</p>
                      <p className="text-2xl font-bold">{selectedAgent.usage.runs}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-[#0d0f15] rounded-lg">
                      <p className="text-xs text-slate-500">Total Tokens</p>
                      <p className="text-2xl font-bold">{selectedAgent.usage.total_tokens.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-[#0d0f15] rounded-lg">
                      <p className="text-xs text-slate-500">Total Cost</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedAgent.usage.total_cost)}</p>
                    </div>
                  </div>
                  <div className="h-32 bg-slate-50 dark:bg-[#0d0f15] rounded-lg flex items-center justify-center text-slate-400">
                    [Cost chart placeholder]
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-slate-500 text-sm">Temperature:</span> {selectedAgent.temperature}</div>
                    <div><span className="text-slate-500 text-sm">Max Tokens:</span> {selectedAgent.max_tokens}</div>
                    <div><span className="text-slate-500 text-sm">Top P:</span> {selectedAgent.top_p}</div>
                    <div><span className="text-slate-500 text-sm">Frequency Penalty:</span> {selectedAgent.frequency_penalty}</div>
                    <div><span className="text-slate-500 text-sm">Presence Penalty:</span> {selectedAgent.presence_penalty}</div>
                    <div><span className="text-slate-500 text-sm">Fallback Provider:</span> {selectedAgent.fallback_provider_name || "None"}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedAgent);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit className="h-4 w-4 inline mr-2" />
                    Edit Agent
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
    slate: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="bg-white dark:bg-[#1a1d27] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

// ─── Agent Card ──────────────────────────────────────────────────
function AgentCard({
  agent,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onTest,
  onView,
}: {
  agent: Agent;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onTest: () => void;
  onView: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition p-5 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {agent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{agent.role}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1d27] rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-10">
              <button onClick={onView} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <Eye className="h-4 w-4" /> View Details
              </button>
              <button onClick={onTest} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <Play className="h-4 w-4" /> Test
              </button>
              <button onClick={onEdit} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <button onClick={onDuplicate} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <Copy className="h-4 w-4" /> Duplicate
              </button>
              <button onClick={onDelete} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{agent.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {agent.provider_name}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {agent.model_name}
        </span>
        {agent.memory_enabled && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
            Memory
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> {agent.usage.runs}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> {agent.usage.total_cost.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(agent.status)}
          <button
            onClick={onToggle}
            className={`p-1 rounded transition ${agent.status === "active" ? "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500"}`}
          >
            {agent.status === "active" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}