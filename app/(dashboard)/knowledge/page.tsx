"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Video,
  Mic,
  Image,
  File,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Brain,
  Bookmark,
  Tag,
  FolderOpen,
  MoreVertical,
  Sparkles,
  GraduationCap,
  Lightbulb,
  ChevronDown,
  MessageSquare,
  Package,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample knowledge data
const knowledgeData = [
  {
    id: 1,
    title: "Menopause Reverser - Product Information",
    type: "Product",
    category: "Products",
    content: "Complete product description, benefits, usage instructions, and FAQ for Menopause Reverser. Contains approved customer responses and common objections handling.",
    tags: ["product", "menopause", "health"],
    status: "Approved",
    createdAt: "2024-08-10",
    updatedAt: "2024-08-13",
    source: "Product Team",
    aiUsage: 342,
    voiceUrl: "/audio/product-intro.mp3"
  },
  {
    id: 2,
    title: "Delivery Policy - Standard Operating Procedure",
    type: "Policy",
    category: "Operations",
    content: "Standard operating procedure for deliveries including: dispatcher selection, rate negotiation limits (max ₦3,500 for Ikeja, ₦4,000 for mainland), customer communication templates, and delay handling.",
    tags: ["policy", "delivery", "sop"],
    status: "Approved",
    createdAt: "2024-08-08",
    updatedAt: "2024-08-12",
    source: "Management",
    aiUsage: 156
  },
  {
    id: 3,
    title: "Customer Welcome Script - WhatsApp",
    type: "Script",
    category: "Customer Service",
    content: "Approved WhatsApp welcome message for new customers. Includes introduction, product recommendations, and FAQ links. Voice version available for AI voice messages.",
    tags: ["script", "whatsapp", "welcome"],
    status: "Approved",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-10",
    source: "Sales Team",
    aiUsage: 289,
    voiceUrl: "/audio/welcome.mp3"
  },
  {
    id: 4,
    title: "Weight Management - Product FAQ",
    type: "FAQ",
    category: "Products",
    content: "Frequently asked questions about Weight Management product. Covers dosage, side effects, results timeline, and pricing. AI uses this for customer inquiries.",
    tags: ["faq", "product", "weight"],
    status: "Pending Review",
    createdAt: "2024-08-12",
    updatedAt: "2024-08-13",
    source: "Product Team",
    aiUsage: 87
  },
  {
    id: 5,
    title: "AI Negotiation Limits - Delivery",
    type: "Policy",
    category: "AI Rules",
    content: "Hard limits for AI delivery negotiations. Max budget: ₦3,500 for Ikeja, ₦4,000 for other Lagos areas, ₦5,000 for outside Lagos. Requires boss approval above limits.",
    tags: ["ai", "negotiation", "delivery"],
    status: "Approved",
    createdAt: "2024-08-01",
    updatedAt: "2024-08-01",
    source: "Boss",
    aiUsage: 523
  },
  {
    id: 6,
    title: "Product Photo - Menopause Reverser",
    type: "Image",
    category: "Products",
    content: "High-quality product photo for Menopause Reverser. Used in customer communications and AI responses.",
    tags: ["image", "product", "menopause"],
    status: "Approved",
    createdAt: "2024-07-28",
    updatedAt: "2024-07-28",
    source: "Marketing",
    aiUsage: 67,
    imageUrl: "/images/product.jpg"
  },
  {
    id: 7,
    title: "Payment Verification Guidelines",
    type: "Document",
    category: "Finance",
    content: "Step-by-step guide for verifying bank transfer screenshots. Includes checklist, red flags, and approval workflow.",
    tags: ["payment", "verification", "finance"],
    status: "Approved",
    createdAt: "2024-07-25",
    updatedAt: "2024-08-10",
    source: "Finance",
    aiUsage: 198
  },
  {
    id: 8,
    title: "Hormone Balance - Voice Explanation",
    type: "Voice",
    category: "Products",
    content: "Pre-recorded voice explanation for Hormone Balance product. AI can send this audio message to customers on WhatsApp.",
    tags: ["voice", "product", "hormone"],
    status: "Pending Review",
    createdAt: "2024-08-11",
    updatedAt: "2024-08-11",
    source: "Sales Team",
    aiUsage: 0,
    voiceUrl: "/audio/hormone-balance.mp3"
  }
];

// Knowledge type icons
const typeIcons: Record<string, any> = {
  "Product": Package,
  "Policy": FileText,
  "Script": MessageSquare,
  "FAQ": Lightbulb,
  "Image": Image,
  "Voice": Mic,
  "Video": Video,
  "Document": File,
  "SOP": BookOpen
};

// Type colors
const typeColors: Record<string, string> = {
  "Product": "bg-blue-100 text-blue-800 border-blue-200",
  "Policy": "bg-purple-100 text-purple-800 border-purple-200",
  "Script": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "FAQ": "bg-amber-100 text-amber-800 border-amber-200",
  "Image": "bg-pink-100 text-pink-800 border-pink-200",
  "Voice": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Video": "bg-red-100 text-red-800 border-red-200",
  "Document": "bg-slate-100 text-slate-800 border-slate-200",
  "SOP": "bg-cyan-100 text-cyan-800 border-cyan-200"
};

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Categories for filter
  const categories = ["All", ...new Set(knowledgeData.map(item => item.category))];

  // Filter knowledge
  const filteredKnowledge = knowledgeData.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  // Stats
  const totalItems = knowledgeData.length;
  const approvedItems = knowledgeData.filter(i => i.status === "Approved").length;
  const pendingItems = knowledgeData.filter(i => i.status === "Pending Review").length;
  const productItems = knowledgeData.filter(i => i.type === "Product").length;
  const policyItems = knowledgeData.filter(i => i.type === "Policy").length;

  // Handle actions
  const handleView = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleEdit = (item: any) => {
    showToast(`✏️ Editing: ${item.title}`, "info");
  };

  const handleDelete = (item: any) => {
    if (confirm(`Delete "${item.title}"?`)) {
      showToast(`🗑️ Deleted: ${item.title}`, "error");
    }
  };

  const handleApprove = (item: any) => {
    showToast(`✅ Approved: ${item.title}`, "success");
  };

  const handleReject = (item: any) => {
    showToast(`❌ Rejected: ${item.title}`, "error");
  };

  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("📚 Knowledge item added successfully!", "success");
    setShowAddModal(false);
  };

  const handleAITeach = () => {
    showToast("🧠 AI is learning from this knowledge...", "info");
    setTimeout(() => {
      showToast("✅ AI has successfully learned the new information!", "success");
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Approved": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "Pending Review": return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Approved": return "bg-emerald-100 text-emerald-800";
      case "Pending Review": return "bg-amber-100 text-amber-800";
      default: return "bg-red-100 text-red-800";
    }
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Knowledge Hub
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalItems} items
            </span>
          </h1>
          <p className="text-sm text-slate-500">Company knowledge base for AI and team</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Knowledge
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAITeach}
          >
            <Brain className="w-4 h-4" />
            Teach AI
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total</p>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalItems}</p>
          <p className="text-xs text-slate-500">Knowledge items</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Approved</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{approvedItems}</p>
          <p className="text-xs text-slate-500">Ready for AI</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{pendingItems}</p>
          <p className="text-xs text-slate-500">Awaiting review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Products</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{productItems}</p>
          <p className="text-xs text-slate-500">Product info</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Policies</p>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1">{policyItems}</p>
          <p className="text-xs text-slate-500">Company rules</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">AI Usage</p>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1">1.6k</p>
          <p className="text-xs text-slate-500">Total AI queries</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("All")}
          className={selectedCategory === "All" ? "bg-blue-600 text-white" : ""}
        >
          All
        </Button>
        {categories.filter(c => c !== "All").map((category) => (
          <Button 
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search knowledge by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="Product">📦 Product</option>
              <option value="Policy">📋 Policy</option>
              <option value="Script">💬 Script</option>
              <option value="FAQ">❓ FAQ</option>
              <option value="Image">🖼️ Image</option>
              <option value="Voice">🎤 Voice</option>
              <option value="Document">📄 Document</option>
              <option value="SOP">📋 SOP</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Approved">✅ Approved</option>
              <option value="Pending Review">⏳ Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKnowledge.map((item) => {
          const Icon = typeIcons[item.type] || FileText;
          const typeColor = typeColors[item.type] || "bg-slate-100 text-slate-800";
          
          return (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${typeColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleView(item)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                  </button>
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-slate-400 hover:text-amber-500" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <Link href="#" onClick={() => handleView(item)}>
                <h3 className="font-bold text-sm hover:text-blue-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </Link>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {item.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    #{tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className={`text-[10px] font-medium ${getStatusColor(item.status)} px-2 py-0.5 rounded-full`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.aiUsage} uses</span>
                </div>
              </div>

              {/* Quick Actions */}
              {item.status === "Pending Review" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                    onClick={() => handleApprove(item)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1 text-xs h-7"
                    onClick={() => handleReject(item)}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}

              {/* Voice/Image indicator */}
              {item.voiceUrl && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-indigo-600">
                  <Mic className="w-3 h-3" />
                  <span>Audio available</span>
                </div>
              )}
              {item.imageUrl && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-pink-600">
                  <Image className="w-3 h-3" />
                  <span>Image available</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredKnowledge.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">📚</div>
          <p className="text-slate-500 font-medium">No knowledge items found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Knowledge Item
          </Button>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Add Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Add Knowledge Item
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter knowledge title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Product">📦 Product</option>
                    <option value="Policy">📋 Policy</option>
                    <option value="Script">💬 Script</option>
                    <option value="FAQ">❓ FAQ</option>
                    <option value="Image">🖼️ Image</option>
                    <option value="Voice">🎤 Voice</option>
                    <option value="Document">📄 Document</option>
                    <option value="SOP">📋 SOP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Products, Operations"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Enter knowledge content..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="product, health, FAQ (comma separated)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">PDF, Image, Audio up to 10MB</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Knowledge
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                {selectedItem.title}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Meta info */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColors[selectedItem.type] || "bg-slate-100"}`}>
                  {selectedItem.type}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-slate-100">
                  {selectedItem.category}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">{selectedItem.content}</p>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta info grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-sm font-medium">{selectedItem.source}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm">{selectedItem.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Updated</p>
                  <p className="text-sm">{selectedItem.updatedAt}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">AI Usage</p>
                  <p className="text-sm font-medium">{selectedItem.aiUsage} times</p>
                </div>
              </div>

              {/* Voice/Image preview */}
              {selectedItem.voiceUrl && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs font-medium text-indigo-700 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Audio Preview
                  </p>
                  <button className="mt-1 text-sm text-indigo-600 hover:underline">
                    ▶ Play audio (pre-recorded voice)
                  </button>
                </div>
              )}

              {selectedItem.imageUrl && (
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-medium text-pink-700 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Image Preview
                  </p>
                  <div className="mt-1 h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400">
                    [Image Preview Placeholder]
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleEdit(selectedItem)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleAITeach}>
                  <Brain className="w-4 h-4 mr-2" />
                  Teach AI
                </Button>
                {selectedItem.status === "Pending Review" && (
                  <>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(selectedItem)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}