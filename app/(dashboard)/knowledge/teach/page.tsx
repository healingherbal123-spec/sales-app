"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  FileText,
  Mic,
  Image,
  Video,
  Upload,
  Save,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Clock,
  Download,
  MessageSquare,
  Lightbulb,
  GraduationCap,
  Bot,
  Zap,
  Globe,
  Database,
  Cpu,
  Layers,
  Target,
  Award,
  Star,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  MoreVertical,
  Send,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample knowledge items for teaching
const knowledgeItems = [
  {
    id: 1,
    title: "Product Knowledge: Menopause Reverser",
    type: "Product",
    content: "Complete product information, benefits, usage instructions, and FAQs for Menopause Reverser.",
    status: "Approved",
    createdAt: "2024-08-10",
    source: "Product Team",
    tags: ["product", "menopause", "health"],
    aiUsage: 342,
    voiceUrl: "/audio/product-intro.mp3"
  },
  {
    id: 2,
    title: "Delivery Policy - Standard Operating Procedure",
    type: "Policy",
    content: "Standard operating procedure for deliveries including dispatcher selection and rate negotiation.",
    status: "Approved",
    createdAt: "2024-08-08",
    source: "Management",
    tags: ["policy", "delivery", "sop"],
    aiUsage: 156
  },
  {
    id: 3,
    title: "Customer Welcome Script - WhatsApp",
    type: "Script",
    content: "Approved WhatsApp welcome message for new customers with product recommendations.",
    status: "Approved",
    createdAt: "2024-08-05",
    source: "Sales Team",
    tags: ["script", "whatsapp", "welcome"],
    aiUsage: 289
  },
  {
    id: 4,
    title: "AI Negotiation Limits - Delivery",
    type: "Policy",
    content: "Hard limits for AI delivery negotiations. Max budget: ₦3,500 for Ikeja.",
    status: "Pending Review",
    createdAt: "2024-08-01",
    source: "Boss",
    tags: ["ai", "negotiation", "delivery"],
    aiUsage: 523
  },
  {
    id: 5,
    title: "Hormone Balance - Voice Explanation",
    type: "Voice",
    content: "Pre-recorded voice explanation for Hormone Balance product.",
    status: "Pending Review",
    createdAt: "2024-08-11",
    source: "Sales Team",
    tags: ["voice", "product", "hormone"],
    aiUsage: 0
  },
  {
    id: 6,
    title: "Payment Verification Guidelines",
    type: "Document",
    content: "Step-by-step guide for verifying bank transfer screenshots.",
    status: "Approved",
    createdAt: "2024-07-25",
    source: "Finance",
    tags: ["payment", "verification", "finance"],
    aiUsage: 198
  }
];

// Proposed rules from AI learning
const proposedRules = [
  {
    id: 1,
    title: "AI Delivery Negotiation Limit",
    description: "Set hard ceiling authority limit for Logistics AI (Atlas) to ₦3,500 for Ikeja delivery routes.",
    source: "Boss WhatsApp Conversation",
    date: "2024-08-13T10:12:00",
    status: "pending",
    votes: 5
  },
  {
    id: 2,
    title: "Customer Response Time Limit",
    description: "AI should respond to customer inquiries within 30 seconds or escalate to human.",
    source: "Team Meeting",
    date: "2024-08-12T14:30:00",
    status: "pending",
    votes: 3
  },
  {
    id: 3,
    title: "Product Return Policy",
    description: "AI should not approve returns without human verification. Escalate all return requests.",
    source: "Boss Email",
    date: "2024-08-11T09:00:00",
    status: "approved",
    votes: 7
  }
];

// Type colors
const typeColors: Record<string, string> = {
  "Product": "bg-blue-100 text-blue-800 border-blue-200",
  "Policy": "bg-purple-100 text-purple-800 border-purple-200",
  "Script": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Voice": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Document": "bg-slate-100 text-slate-800 border-slate-200",
  "FAQ": "bg-amber-100 text-amber-800 border-amber-200",
  "Image": "bg-pink-100 text-pink-800 border-pink-200",
  "Video": "bg-red-100 text-red-800 border-red-200"
};

const statusColors: Record<string, string> = {
  "Approved": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Pending Review": "bg-amber-100 text-amber-800 border-amber-200",
  "Rejected": "bg-red-100 text-red-800 border-red-200"
};

export default function TeachAIPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    content: "",
    tags: "",
    source: ""
  });
  const [voiceText, setVoiceText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter knowledge
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // ==================== BUTTON ACTIONS ====================

  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.content) {
      showToast("⚠️ Please fill in all required fields", "error");
      return;
    }
    showToast("🧠 Knowledge added successfully! AI is learning...", "success");
    setShowAddModal(false);
    setFormData({ title: "", type: "", content: "", tags: "", source: "" });
  };

  const handleTeachAI = () => {
    showToast("🧠 AI is processing new knowledge...", "info");
    setTimeout(() => {
      showToast("✅ AI has successfully learned the new information!", "success");
    }, 2000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 60) {
          clearInterval(interval);
          setIsRecording(false);
          showToast("⏱️ Recording complete!", "success");
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
    showToast("🎤 Recording... Speak clearly", "info");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    showToast("✅ Voice recording saved! AI will learn from this voice.", "success");
    setShowVoiceModal(false);
  };

  const handleApproveRule = (rule: any) => {
    showToast(`✅ Rule "${rule.title}" approved and saved!`, "success");
  };

  const handleRejectRule = (rule: any) => {
    showToast(`❌ Rule "${rule.title}" rejected`, "error");
  };

  const handleTrainAI = () => {
    showToast("🧠 Training AI with all approved knowledge...", "info");
    setTimeout(() => {
      showToast("✅ AI training complete! All agents updated.", "success");
    }, 3000);
  };

  const handleExportKnowledge = () => {
    showToast("📥 Exporting knowledge base...", "info");
    setTimeout(() => {
      showToast("✅ Knowledge base exported!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterType("All");
    setFilterStatus("All");
    showToast("🔄 Filters reset", "info");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
          toast.type === "success" ? "bg-emerald-500 text-white" :
          toast.type === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledge Hub
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Teach AI
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Knowledge Base
            </span>
          </h1>
          <p className="text-sm text-slate-500">Train AI with company knowledge and rules</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Knowledge
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleTrainAI}
          >
            <RefreshCw className="w-4 h-4" />
            Train AI
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportKnowledge}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Knowledge Items</p>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{knowledgeItems.length}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Approved</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{knowledgeItems.filter(i => i.status === "Approved").length}</p>
          <p className="text-xs text-emerald-600">Ready for AI</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending Review</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{knowledgeItems.filter(i => i.status === "Pending Review").length}</p>
          <p className="text-xs text-amber-600">Needs approval</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">AI Usage</p>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1">{knowledgeItems.reduce((sum, i) => sum + i.aiUsage, 0)}</p>
          <p className="text-xs text-amber-500">Total queries</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowVoiceModal(true)}
        >
          <h3 className="font-semibold text-sm text-purple-800">🎤 Record Voice</h3>
          <p className="text-xs text-purple-600">Teach AI with voice messages</p>
        </div>

        <div 
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowRuleModal(true)}
        >
          <h3 className="font-semibold text-sm text-blue-800">📋 Review Rules</h3>
          <p className="text-xs text-blue-600">{proposedRules.filter(r => r.status === "pending").length} pending rules</p>
        </div>

        <div 
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleTrainAI}
        >
          <h3 className="font-semibold text-sm text-emerald-800">🧠 Train All</h3>
          <p className="text-xs text-emerald-600">Update all AI agents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search knowledge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="Product">📦 Product</option>
              <option value="Policy">📋 Policy</option>
              <option value="Script">💬 Script</option>
              <option value="Voice">🎤 Voice</option>
              <option value="Document">📄 Document</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Approved">✅ Approved</option>
              <option value="Pending Review">⏳ Pending</option>
            </select>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleReset}>
              <RefreshCw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-purple-200 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type] || "bg-slate-100"}`}>
                  {item.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status] || "bg-slate-100"}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-slate-100 rounded" title="Edit">
                  <Edit className="w-4 h-4 text-slate-400 hover:text-amber-500" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded" title="Delete">
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-sm mt-2">{item.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.content}</p>

            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">{item.source}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {item.aiUsage} uses
              </span>
            </div>

            {item.status === "Pending Review" && (
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 text-xs">
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </div>
            )}

            {item.voiceUrl && (
              <div className="mt-2 flex items-center gap-1 text-[10px] text-indigo-600">
                <Mic className="w-3 h-3" />
                <span>Audio available</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">🧠</div>
          <p className="text-slate-500 font-medium">No knowledge found</p>
          <p className="text-sm text-slate-400">Add knowledge to teach the AI</p>
          <Button 
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>
      )}

      {/* ==================== ADD KNOWLEDGE MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Teach AI New Knowledge
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddKnowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter knowledge title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                  >
                    <option value="">Select type...</option>
                    <option value="Product">📦 Product</option>
                    <option value="Policy">📋 Policy</option>
                    <option value="Script">💬 Script</option>
                    <option value="Voice">🎤 Voice</option>
                    <option value="Document">📄 Document</option>
                    <option value="FAQ">❓ FAQ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. Product Team"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  placeholder="Enter the knowledge content..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="product, health, FAQ (comma separated)"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  <Brain className="w-4 h-4 mr-2" />
                  Teach AI
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== VOICE RECORDING MODAL ==================== */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-500" />
                Record Voice Message
              </h3>
              <button onClick={() => setShowVoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-6">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                isRecording ? "bg-red-100 animate-pulse" : "bg-indigo-100"
              }`}>
                <Mic className={`w-10 h-10 ${isRecording ? "text-red-600" : "text-indigo-600"}`} />
              </div>
              <p className="text-sm font-medium mt-3">
                {isRecording ? "Recording..." : "Ready to record"}
              </p>
              <p className="text-2xl font-bold mt-1">{String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}</p>
              <p className="text-xs text-slate-400">Maximum 60 seconds</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="What is this voice about?"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <div className="flex gap-2">
              {isRecording ? (
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleStopRecording}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleStartRecording}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => setShowVoiceModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RULE REVIEW MODAL ==================== */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Proposed Rules
              </h3>
              <button onClick={() => setShowRuleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {proposedRules.map((rule) => (
                <div key={rule.id} className="p-4 border border-slate-200 rounded-xl hover:border-amber-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm">{rule.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>Source: {rule.source}</span>
                        <span>•</span>
                        <span>{new Date(rule.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>👍 {rule.votes} votes</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      rule.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                  {rule.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApproveRule(rule)}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve & Teach AI
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleRejectRule(rule)}>
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setShowRuleModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}