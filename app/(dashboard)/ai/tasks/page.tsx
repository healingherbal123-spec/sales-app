"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  Bot,
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Trash2,
  Play,
  X,
  Loader2,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";

interface AITask {
  id: string;
  title: string;
  description: string;
  agent: string;
  agentType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  assigned_to: string;
  completed_at?: string;
}

export default function AITasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockTasks: AITask[] = [
        {
          id: "1",
          title: "Process order #ORD-1001",
          description: "Analyze and process customer order including inventory check and payment verification.",
          agent: "Atlas",
          agentType: "sales",
          status: 'completed',
          priority: 'high',
          created_at: "2024-08-13 10:30 AM",
          assigned_to: "Atlas",
          completed_at: "2024-08-13 10:35 AM",
        },
        {
          id: "2",
          title: "Check inventory for iPhone 15 Pro",
          description: "Verify stock levels and suggest reorder if below minimum threshold.",
          agent: "Mira",
          agentType: "inventory",
          status: 'in_progress',
          priority: 'high',
          created_at: "2024-08-13 09:15 AM",
          assigned_to: "Mira",
        },
        {
          id: "3",
          title: "Route optimization for delivery #DEL-045",
          description: "Find the most efficient route for delivery including traffic analysis.",
          agent: "Nova",
          agentType: "delivery",
          status: 'failed',
          priority: 'medium',
          created_at: "2024-08-12 04:45 PM",
          assigned_to: "Nova",
        },
        {
          id: "4",
          title: "Generate monthly financial report",
          description: "Compile and generate financial report for August 2024.",
          agent: "Kira",
          agentType: "finance",
          status: 'completed',
          priority: 'medium',
          created_at: "2024-08-12 02:00 PM",
          assigned_to: "Kira",
          completed_at: "2024-08-12 02:30 PM",
        },
        {
          id: "5",
          title: "Analyze customer feedback for Q3",
          description: "Process and analyze customer feedback data to identify trends.",
          agent: "Athena",
          agentType: "sales",
          status: 'pending',
          priority: 'low',
          created_at: "2024-08-11 11:00 AM",
          assigned_to: "Athena",
        },
        {
          id: "6",
          title: "Update inventory records",
          description: "Sync and update inventory records from supplier database.",
          agent: "Mira",
          agentType: "inventory",
          status: 'pending',
          priority: 'high',
          created_at: "2024-08-11 09:30 AM",
          assigned_to: "Mira",
        },
        {
          id: "7",
          title: "Send delivery confirmation to customers",
          description: "Notify customers of successful deliveries with tracking information.",
          agent: "Echo",
          agentType: "delivery",
          status: 'in_progress',
          priority: 'medium',
          created_at: "2024-08-10 03:20 PM",
          assigned_to: "Echo",
        },
        {
          id: "8",
          title: "Train AI on new product data",
          description: "Update AI models with new product catalog and pricing information.",
          agent: "Nexus",
          agentType: "orchestrator",
          status: 'pending',
          priority: 'high',
          created_at: "2024-08-10 10:00 AM",
          assigned_to: "Nexus",
        },
        {
          id: "9",
          title: "Verify suspicious payment transaction",
          description: "Review and verify payment transaction flagged for potential fraud.",
          agent: "Kira",
          agentType: "finance",
          status: 'completed',
          priority: 'high',
          created_at: "2024-08-09 01:15 PM",
          assigned_to: "Kira",
          completed_at: "2024-08-09 01:45 PM",
        },
        {
          id: "10",
          title: "Optimize delivery routes for tomorrow",
          description: "Pre-calculate and optimize delivery routes based on upcoming orders.",
          agent: "Nova",
          agentType: "delivery",
          status: 'pending',
          priority: 'medium',
          created_at: "2024-08-09 11:00 AM",
          assigned_to: "Nova",
        },
      ];
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'completed': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Completed' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', icon: Activity, label: 'In Progress' },
      'pending': { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending' },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'high': { color: 'bg-red-100 text-red-800', label: '🔴 High' },
      'medium': { color: 'bg-amber-100 text-amber-800', label: '🟡 Medium' },
      'low': { color: 'bg-blue-100 text-blue-800', label: '🔵 Low' },
    };
    const { color, label } = config[priority] || config.medium;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const handleRunTask = async (taskId: string) => {
    setUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'in_progress' as const } : t
      ));
    } finally {
      setUpdating(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.agent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading AI tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            AI Tasks
          </h1>
          <p className="text-sm text-slate-500">View and manage AI tasks.</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Completed</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Failed</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.failed}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by title, description, or agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {paginatedTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  task.status === 'completed' ? 'bg-emerald-50' :
                  task.status === 'in_progress' ? 'bg-blue-50' :
                  task.status === 'failed' ? 'bg-red-50' :
                  'bg-amber-50'
                }`}>
                  {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {task.status === 'in_progress' && <Activity className="w-5 h-5 text-blue-600" />}
                  {task.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {task.status === 'pending' && <Clock className="w-5 h-5 text-amber-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{task.title}</h3>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      {task.agent}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.created_at}
                    </span>
                    {task.completed_at && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3 h-3" />
                        Completed: {task.completed_at}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status)}
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleRunTask(task.id)}
                    disabled={updating}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                    title="Run Task"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDetails(true);
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginatedTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No AI tasks found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Task Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Title</p>
                <p className="font-semibold">{selectedTask.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Agent</p>
                  <p className="font-medium">{selectedTask.agent}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  {getStatusBadge(selectedTask.status)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priority</p>
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm">{selectedTask.created_at}</p>
                </div>
                {selectedTask.completed_at && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Completed</p>
                    <p className="text-sm text-emerald-600">{selectedTask.completed_at}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {selectedTask.status === 'pending' && (
                <button
                  onClick={() => {
                    handleRunTask(selectedTask.id);
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}