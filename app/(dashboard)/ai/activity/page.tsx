"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";

interface AIActivity {
  id: string;
  agent: string;
  agentType: string;
  action: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  duration: string;
}

export default function AIActivityPage() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      const mockActivities: AIActivity[] = [
        {
          id: "1",
          agent: "Atlas",
          agentType: "sales",
          action: "Processed order #ORD-1001",
          details: "Successfully processed customer order with inventory check and payment verification.",
          status: 'success',
          timestamp: "2024-08-13 10:35 AM",
          duration: "2.3s",
        },
        {
          id: "2",
          agent: "Mira",
          agentType: "inventory",
          action: "Checked inventory for iPhone 15 Pro",
          details: "Verified stock levels. Current stock: 12 units. Reorder recommended.",
          status: 'success',
          timestamp: "2024-08-13 10:20 AM",
          duration: "1.5s",
        },
        {
          id: "3",
          agent: "Nova",
          agentType: "delivery",
          action: "Route optimization for delivery #DEL-045",
          details: "Failed to optimize route due to traffic data unavailability.",
          status: 'failed',
          timestamp: "2024-08-12 04:45 PM",
          duration: "5.2s",
        },
        {
          id: "4",
          agent: "Kira",
          agentType: "finance",
          action: "Generated monthly financial report",
          details: "Successfully generated financial report for August 2024.",
          status: 'success',
          timestamp: "2024-08-12 02:30 PM",
          duration: "4.8s",
        },
        {
          id: "5",
          agent: "Athena",
          agentType: "sales",
          action: "Analyzed customer feedback for Q3",
          details: "Processing customer feedback data. 85% positive sentiment detected.",
          status: 'pending',
          timestamp: "2024-08-11 11:00 AM",
          duration: "3.1s",
        },
        {
          id: "6",
          agent: "Mira",
          agentType: "inventory",
          action: "Updated inventory records",
          details: "Successfully synced inventory records from supplier database.",
          status: 'success',
          timestamp: "2024-08-11 09:30 AM",
          duration: "1.8s",
        },
        {
          id: "7",
          agent: "Echo",
          agentType: "delivery",
          action: "Sent delivery confirmation to customers",
          details: "Successfully sent delivery notifications to 12 customers.",
          status: 'success',
          timestamp: "2024-08-10 03:20 PM",
          duration: "2.1s",
        },
        {
          id: "8",
          agent: "Nexus",
          agentType: "orchestrator",
          action: "Trained AI on new product data",
          details: "Updated AI models with new product catalog and pricing.",
          status: 'success',
          timestamp: "2024-08-10 10:00 AM",
          duration: "15.3s",
        },
        {
          id: "9",
          agent: "Kira",
          agentType: "finance",
          action: "Verified suspicious payment transaction",
          details: "Successfully verified payment transaction. No fraud detected.",
          status: 'success',
          timestamp: "2024-08-09 01:45 PM",
          duration: "3.4s",
        },
        {
          id: "10",
          agent: "Nova",
          agentType: "delivery",
          action: "Optimized delivery routes for tomorrow",
          details: "Successfully optimized routes for 15 deliveries scheduled tomorrow.",
          status: 'success',
          timestamp: "2024-08-09 11:00 AM",
          duration: "6.7s",
        },
        {
          id: "11",
          agent: "Atlas",
          agentType: "sales",
          action: "Generated proposal for Mary Johnson",
          details: "Successfully generated personalized proposal for new customer.",
          status: 'success',
          timestamp: "2024-08-08 04:00 PM",
          duration: "2.9s",
        },
        {
          id: "12",
          agent: "Mira",
          agentType: "inventory",
          action: "Low stock alert for Samsung Galaxy S24",
          details: "Detected low stock: 8 units remaining. Reorder quantity: 20 units.",
          status: 'success',
          timestamp: "2024-08-08 02:15 PM",
          duration: "0.8s",
        },
      ];
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'success': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Success' },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' },
      'pending': { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'sales': { color: 'bg-blue-100 text-blue-800', label: 'Sales' },
      'inventory': { color: 'bg-emerald-100 text-emerald-800', label: 'Inventory' },
      'delivery': { color: 'bg-amber-100 text-amber-800', label: 'Delivery' },
      'finance': { color: 'bg-purple-100 text-purple-800', label: 'Finance' },
      'hr': { color: 'bg-pink-100 text-pink-800', label: 'HR' },
      'orchestrator': { color: 'bg-indigo-100 text-indigo-800', label: 'Orchestrator' },
    };
    const { color, label } = config[type] || config.sales;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.agent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || a.agentType === filterType;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: activities.length,
    success: activities.filter(a => a.status === 'success').length,
    failed: activities.filter(a => a.status === 'failed').length,
    pending: activities.filter(a => a.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading AI activity...</p>
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
            <Activity className="w-6 h-6 text-blue-600" />
            AI Activity Log
          </h1>
          <p className="text-sm text-slate-500">View all AI agent activities and events.</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Activities</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Successful</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.success}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Failed</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.failed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Agents</option>
            <option value="sales">Sales</option>
            <option value="inventory">Inventory</option>
            <option value="delivery">Delivery</option>
            <option value="finance">Finance</option>
            <option value="hr">HR</option>
            <option value="orchestrator">Orchestrator</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Agent</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm text-slate-900">{activity.agent}</p>
                        {getTypeBadge(activity.agentType)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.details}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(activity.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{activity.duration}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{activity.timestamp}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No activity found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{' '}
              {filteredActivities.length} activities
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm text-slate-600">
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
          </div>
        )}
      </div>
    </div>
  );
}