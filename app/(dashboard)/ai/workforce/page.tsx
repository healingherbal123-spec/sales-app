"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Brain,
  MessageSquare,
  Truck,
  Package,
  CreditCard,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  Power,
  PowerOff,
  Zap,
  Download,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

// AI Agents Data
const aiAgents = [
  {
    id: 1,
    name: "Nova",
    role: "Router",
    description: "Coordinates all AI activities and routes tasks to appropriate agents.",
    icon: Brain,
    status: "active",
    permissions: "Full Access",
    tasksCompleted: 1247,
    accuracy: 98,
    responseTime: "0.8s",
    lastActive: "2024-08-13T10:30:00",
    tools: ["route_task", "analyze_request", "assign_agent"]
  },
  {
    id: 2,
    name: "Ada",
    role: "Customer AI",
    description: "Handles customer inquiries, order status, delivery updates.",
    icon: MessageSquare,
    status: "active",
    permissions: "Limited",
    tasksCompleted: 3456,
    accuracy: 96,
    responseTime: "1.2s",
    lastActive: "2024-08-13T10:45:00",
    tools: ["get_order", "get_customer", "send_message"]
  },
  {
    id: 3,
    name: "Atlas",
    role: "Delivery AI",
    description: "Manages dispatchers, waybills, delivery delays, rate negotiations.",
    icon: Truck,
    status: "active",
    permissions: "Limited",
    tasksCompleted: 2341,
    accuracy: 94,
    responseTime: "1.5s",
    lastActive: "2024-08-13T10:46:00",
    tools: ["contact_dispatcher", "negotiate_rate", "update_waybill"]
  },
  {
    id: 4,
    name: "Mira",
    role: "Inventory AI",
    description: "Monitors stock levels, low-stock alerts, production coordination.",
    icon: Package,
    status: "active",
    permissions: "Limited",
    tasksCompleted: 1892,
    accuracy: 97,
    responseTime: "1.0s",
    lastActive: "2024-08-13T10:44:00",
    tools: ["get_inventory", "contact_employee", "create_reorder"]
  },
  {
    id: 5,
    name: "Ledger",
    role: "Finance AI",
    description: "Tracks payments, expenses, financial summaries, payment verification.",
    icon: CreditCard,
    status: "idle",
    permissions: "Read Only",
    tasksCompleted: 876,
    accuracy: 99,
    responseTime: "0.9s",
    lastActive: "2024-08-13T10:00:00",
    tools: ["verify_payment", "track_expense", "generate_report"]
  }
];

// Activity Log
const activityLog = [
  { id: 1, agent: "Atlas", action: "negotiated delivery rate", details: "Reduced fee from ₦5,000 to ₦3,500", time: "10:46 AM", status: "success" },
  { id: 2, agent: "Mira", action: "issued reorder notice", details: "Product A stock reached 10 units", time: "10:44 AM", status: "success" },
  { id: 3, agent: "Ada", action: "customer inquiry", details: "Mary Johnson asked about order status", time: "10:30 AM", status: "pending" }
];

export default function AIWorkforcePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    permissions: "Limited",
    tools: ""
  });

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredAgents = aiAgents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || agent.status === filterStatus;
    const matchesRole = filterRole === "All" || agent.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const roles = ["All", ...new Set(aiAgents.map(a => a.role))];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-emerald-100 text-emerald-800";
      case "idle": return "bg-amber-100 text-amber-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "active": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "idle": return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <XCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  // ==================== BUTTON ACTIONS ====================

  // ⭐ NEW AGENT - Opens modal
  const handleNewAgent = () => {
    setFormData({ name: "", role: "", description: "", permissions: "Limited", tools: "" });
    setShowAddModal(true);
  };

  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      role: agent.role,
      description: agent.description,
      permissions: agent.permissions,
      tools: agent.tools.join(", ")
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ ${selectedAgent?.name} updated successfully!`, "success");
    setShowEditModal(false);
  };

  const handleToggleAgent = (agent: any) => {
    const newStatus = agent.status === "active" ? "idle" : "active";
    showToast(`${newStatus === "active" ? "✅" : "⏸️"} ${agent.name} is now ${newStatus}`, "success");
  };

  const handleDeleteAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      showToast(`🗑️ Deleted ${selectedAgent.name}`, "error");
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveNewAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      showToast("⚠️ Please fill in name and role", "error");
      return;
    }
    showToast("🤖 New AI agent created successfully!", "success");
    setShowAddModal(false);
  };

  const handleViewActivity = () => {
    setShowActivityModal(true);
  };

  const handleExport = () => {
    showToast("📥 Exporting AI data...", "info");
    setTimeout(() => showToast("✅ AI data exported!", "success"), 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterRole("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  const handleFilterByStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const totalAgents = aiAgents.length;
  const activeAgents = aiAgents.filter(a => a.status === "active");
  const idleAgents = aiAgents.filter(a => a.status === "idle");
  const totalTasks = aiAgents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const avgAccuracy = Math.round(aiAgents.reduce((sum, a) => sum + a.accuracy, 0) / aiAgents.length);

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
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

      {/* ⭐ PAGE HEADER - NEW AGENT BUTTON IS HERE ⭐ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-500" />
            AI Workforce
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalAgents} agents
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage your AI employees and autonomous agents</p>
        </div>
        {/* ⭐ THE NEW AGENT BUTTON - VISIBLE HERE ⭐ */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 shadow-sm"
            onClick={handleNewAgent}
          >
            <Plus className="w-4 h-4" />
            New Agent
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Agents</p>
            <Bot className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalAgents}</p>
          <p className="text-xs text-slate-500">AI workforce</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => handleFilterByStatus("active")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{activeAgents.length}</p>
          <p className="text-xs text-emerald-600">Running</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => handleFilterByStatus("idle")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Idle</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{idleAgents.length}</p>
          <p className="text-xs text-amber-600">Paused</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Tasks Completed</p>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalTasks.toLocaleString()}</p>
          <p className="text-xs text-blue-600">{avgAccuracy}% accuracy</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterStatus === "All" && filterRole === "All" ? "bg-cyan-50 border-cyan-400" : ""}`}
          onClick={handleReset}
        >
          All Agents
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-emerald-300 text-emerald-700"
          onClick={() => handleFilterByStatus("active")}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => handleFilterByStatus("idle")}
        >
          <Clock className="w-3 h-3 mr-1" />
          Idle
        </Button>
        {roles.filter(r => r !== "All").map((role) => (
          <Button 
            key={role}
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => { setFilterRole(role); setCurrentPage(1); }}
          >
            {role}
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
              placeholder="Search by name, role, or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="active">✅ Active</option>
              <option value="idle">⏳ Idle</option>
            </select>
            
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
            >
              <option value="All">All Roles</option>
              {roles.filter(r => r !== "All").map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleViewActivity}
            >
              <Activity className="w-4 h-4" />
              Log
            </Button>
          </div>
        </div>
      </div>

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((agent) => {
          const Icon = agent.icon;
          return (
            <div 
              key={agent.id} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-cyan-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    agent.status === "active" ? "bg-cyan-100 text-cyan-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-1">
                      {agent.name}
                      {agent.status === "active" && <Zap className="w-3 h-3 text-emerald-500" />}
                    </h3>
                    <p className="text-xs text-slate-500">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleViewAgent(agent)} className="p-1 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4 text-cyan-500" /></button>
                  <button onClick={() => handleEditAgent(agent)} className="p-1 hover:bg-amber-50 rounded"><Edit className="w-4 h-4 text-amber-500" /></button>
                  <button onClick={() => handleToggleAgent(agent)} className="p-1 hover:bg-emerald-50 rounded">
                    {agent.status === "active" ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <button onClick={() => handleDeleteAgent(agent)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2">{agent.description}</p>

              <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                <div className="text-center"><p className="text-xs text-slate-500">Tasks</p><p className="font-bold">{agent.tasksCompleted}</p></div>
                <div className="text-center"><p className="text-xs text-slate-500">Accuracy</p><p className="font-bold">{agent.accuracy}%</p></div>
                <div className="text-center"><p className="text-xs text-slate-500">Response</p><p className="font-bold text-xs">{agent.responseTime}</p></div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(agent.status)}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(agent.status)}`}>{agent.status}</span>
                  <span className="text-xs text-slate-400">• {formatTime(agent.lastActive)}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  agent.permissions === "Full Access" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {agent.permissions}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {agent.tools.slice(0, 3).map((tool) => (
                  <span key={tool} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{tool}</span>
                ))}
                {agent.tools.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">+{agent.tools.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">🤖</div>
          <p className="text-slate-500 font-medium">No AI agents found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleNewAgent}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Agent
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredAgents.length > itemsPerPage && (
        <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">Showing {currentItems.length} of {filteredAgents.length} agents (Page {currentPage} of {totalPages})</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`text-xs ${currentPage === pageNum ? "bg-cyan-600 text-white" : ""}`} onClick={() => handlePageClick(pageNum)}>
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" className="text-xs" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
          </div>
        </div>
      )}

      {/* ==================== ADD NEW AGENT MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-500" />
                Create New AI Agent
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveNewAgent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Agent Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. Nova" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role *</label>
                  <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white">
                    <option value="">Select role...</option>
                    <option value="Router">Router</option>
                    <option value="Customer AI">Customer AI</option>
                    <option value="Delivery AI">Delivery AI</option>
                    <option value="Inventory AI">Inventory AI</option>
                    <option value="Finance AI">Finance AI</option>
                    <option value="Knowledge AI">Knowledge AI</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none" placeholder="Describe what this AI agent does..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Permissions</label>
                  <select value={formData.permissions} onChange={(e) => setFormData({...formData, permissions: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white">
                    <option value="Full Access">Full Access</option>
                    <option value="Limited">Limited</option>
                    <option value="Read Only">Read Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tools (comma separated)</label>
                  <input type="text" value={formData.tools} onChange={(e) => setFormData({...formData, tools: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="tool1, tool2, tool3" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Agent - {selectedAgent.name}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Agent Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Role</label><select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white"><option value="Router">Router</option><option value="Customer AI">Customer AI</option><option value="Delivery AI">Delivery AI</option><option value="Inventory AI">Inventory AI</option><option value="Finance AI">Finance AI</option><option value="Knowledge AI">Knowledge AI</option></select></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Description</label><textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Permissions</label><select value={formData.permissions} onChange={(e) => setFormData({...formData, permissions: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white"><option value="Full Access">Full Access</option><option value="Limited">Limited</option><option value="Read Only">Read Only</option></select></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Tools</label><input type="text" value={formData.tools} onChange={(e) => setFormData({...formData, tools: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" /></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                <Button variant="outline" type="button" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Delete Agent</h3>
              <p className="text-sm text-slate-500 mt-1">Are you sure you want to delete <span className="font-bold">{selectedAgent.name}</span>?</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-500" /> Agent Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${selectedAgent.status === "active" ? "bg-cyan-100 text-cyan-600" : "bg-amber-100 text-amber-600"}`}>
                  <selectedAgent.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(selectedAgent.status)}`}>{selectedAgent.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{selectedAgent.role}</p>
                  <p className="text-xs text-slate-400">Permissions: {selectedAgent.permissions}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center"><p className="text-xs text-slate-500">Tasks</p><p className="text-2xl font-bold">{selectedAgent.tasksCompleted}</p></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><p className="text-xs text-slate-500">Accuracy</p><p className="text-2xl font-bold">{selectedAgent.accuracy}%</p></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><p className="text-xs text-slate-500">Response</p><p className="text-2xl font-bold">{selectedAgent.responseTime}</p></div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">Description</p><p className="text-sm text-slate-700">{selectedAgent.description}</p></div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Tools</p>
                <div className="flex flex-wrap gap-2">{selectedAgent.tools.map((tool: string) => (<span key={tool} className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{tool}</span>))}</div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => { setShowDetailModal(false); handleEditAgent(selectedAgent); }}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                <Button variant="outline" className="flex-1" onClick={() => handleToggleAgent(selectedAgent)}>
                  {selectedAgent.status === "active" ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                  {selectedAgent.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-500" /> AI Activity Log</h3>
              <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.agent}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activity.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{activity.status}</span>
                    </div>
                    <p className="text-sm text-slate-600">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.details}</p>
                  </div>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => showToast("📥 Exporting activity log...", "info")}><Download className="w-4 h-4 mr-2" /> Export Log</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowActivityModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}