"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Shield,
  Database,
  Clock,
  User,
  FileText,
  Settings,
  Building2,
  CreditCard,
  Users,
  Key,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failure' | 'warning';
  userRole: string;
  resourceType: 'company' | 'user' | 'subscription' | 'settings' | 'security';
}

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterResource, setFilterResource] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setLogs([
        {
          id: "1",
          timestamp: "2024-01-15 10:30:00",
          user: "Admin",
          action: "Company Created",
          resource: "Tech Solutions Ltd",
          details: "New company registered with Enterprise plan",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "Admin",
          resourceType: "company",
        },
        {
          id: "2",
          timestamp: "2024-01-15 11:45:00",
          user: "System",
          action: "Payment Processed",
          resource: "Tech Solutions Ltd",
          details: "Annual subscription payment of ₦5,000,000",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "System",
          resourceType: "subscription",
        },
        {
          id: "3",
          timestamp: "2024-01-16 09:15:00",
          user: "John Doe",
          action: "User Login",
          resource: "Healthcare Solutions",
          details: "User logged in from new device (Chrome/Windows)",
          ipAddress: "192.168.1.2",
          status: "success",
          userRole: "Manager",
          resourceType: "user",
        },
        {
          id: "4",
          timestamp: "2024-01-16 14:20:00",
          user: "System",
          action: "Plan Upgrade",
          resource: "Global Retail Corp",
          details: "Upgraded from Startup to Business plan",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "System",
          resourceType: "subscription",
        },
        {
          id: "5",
          timestamp: "2024-01-17 08:00:00",
          user: "System",
          action: "Company Suspended",
          resource: "Food Delivery Express",
          details: "Company suspended due to payment failure (3 missed payments)",
          ipAddress: "192.168.1.1",
          status: "warning",
          userRole: "System",
          resourceType: "company",
        },
        {
          id: "6",
          timestamp: "2024-01-17 10:30:00",
          user: "Admin",
          action: "Permission Change",
          resource: "Eco Logistics",
          details: "Admin permissions revoked for user: Mike Johnson",
          ipAddress: "192.168.1.3",
          status: "failure",
          userRole: "Admin",
          resourceType: "security",
        },
        {
          id: "7",
          timestamp: "2024-01-18 13:45:00",
          user: "System",
          action: "Security Alert",
          resource: "FinTech Solutions",
          details: "Multiple failed login attempts detected (5 attempts)",
          ipAddress: "192.168.1.4",
          status: "warning",
          userRole: "System",
          resourceType: "security",
        },
        {
          id: "8",
          timestamp: "2024-01-18 16:20:00",
          user: "Admin",
          action: "Settings Updated",
          resource: "Platform Settings",
          details: "Email notification settings updated",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "Admin",
          resourceType: "settings",
        },
        {
          id: "9",
          timestamp: "2024-01-19 09:00:00",
          user: "System",
          action: "User Added",
          resource: "Tech Solutions Ltd",
          details: "New user added: Sarah Williams (Sales Manager)",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "System",
          resourceType: "user",
        },
        {
          id: "10",
          timestamp: "2024-01-19 11:30:00",
          user: "Admin",
          action: "Subscription Cancelled",
          resource: "Food Delivery Express",
          details: "Subscription cancelled by admin due to policy violation",
          ipAddress: "192.168.1.1",
          status: "warning",
          userRole: "Admin",
          resourceType: "subscription",
        },
        {
          id: "11",
          timestamp: "2024-01-20 08:15:00",
          user: "System",
          action: "Password Reset",
          resource: "Healthcare Solutions",
          details: "Password reset requested and completed",
          ipAddress: "192.168.1.5",
          status: "success",
          userRole: "System",
          resourceType: "security",
        },
        {
          id: "12",
          timestamp: "2024-01-20 10:00:00",
          user: "Admin",
          action: "Data Export",
          resource: "All Companies",
          details: "Full data export requested (compliance audit)",
          ipAddress: "192.168.1.1",
          status: "success",
          userRole: "Admin",
          resourceType: "settings",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'success': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Success' },
      'failure': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failure' },
      'warning': { color: 'bg-amber-100 text-amber-800', icon: AlertCircle, label: 'Warning' },
    };
    const { color, icon: Icon, label } = config[status] || config.success;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getResourceIcon = (type: string) => {
    const config: Record<string, any> = {
      'company': Building2,
      'user': Users,
      'subscription': CreditCard,
      'settings': Settings,
      'security': Shield,
    };
    const Icon = config[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesResource = filterResource === 'all' || log.resourceType === filterResource;
    return matchesSearch && matchesStatus && matchesResource;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warnings: logs.filter(l => l.status === 'warning').length,
    failures: logs.filter(l => l.status === 'failure').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/owner" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-8 h-8 text-blue-500" />
            Audit Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">Complete audit trail of all platform activities.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Events</p>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
          <span className="text-[10px] text-blue-600 flex items-center mt-1">All time</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Success</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{stats.success}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            {Math.round((stats.success / stats.total) * 100)}% of total
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Warnings</p>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{stats.warnings}</p>
          <span className="text-[10px] text-amber-600 flex items-center mt-1">Needs attention</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Failures</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{stats.failures}</p>
          <span className="text-[10px] text-red-600 flex items-center mt-1">Requires review</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by user, action, resource, or details..."
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
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="failure">Failure</option>
          </select>
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Resources</option>
            <option value="company">Companies</option>
            <option value="user">Users</option>
            <option value="subscription">Subscriptions</option>
            <option value="settings">Settings</option>
            <option value="security">Security</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Resource</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Details</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-slate-600">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {log.user.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium bg-slate-100 text-slate-700">
                      <User className="w-3 h-3" />
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{log.action}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">{getResourceIcon(log.resourceType)}</span>
                      <span className="text-sm text-slate-600">{log.resource}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.ipAddress}</td>
                  <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedLogs.length === 0 && (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No audit logs found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
              {filteredLogs.length} logs
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