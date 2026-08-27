"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Calendar,
  ArrowLeft,
} from "lucide-react";

interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: 'startup' | 'business' | 'enterprise';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  amount: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  endDate: string;
  paymentMethod: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setSubscriptions([
        {
          id: "1",
          companyId: "1",
          companyName: "Tech Solutions Ltd",
          plan: "enterprise",
          status: "active",
          amount: 500000,
          billingCycle: "annually",
          startDate: "2024-01-15",
          endDate: "2025-01-15",
          paymentMethod: "Bank Transfer",
          lastPaymentDate: "2024-01-15",
          nextPaymentDate: "2025-01-15",
        },
        {
          id: "2",
          companyId: "2",
          companyName: "Global Retail Corp",
          plan: "business",
          status: "active",
          amount: 200000,
          billingCycle: "annually",
          startDate: "2024-02-20",
          endDate: "2025-02-20",
          paymentMethod: "Credit Card",
          lastPaymentDate: "2024-02-20",
          nextPaymentDate: "2025-02-20",
        },
        {
          id: "3",
          companyId: "3",
          companyName: "Healthcare Solutions",
          plan: "enterprise",
          status: "active",
          amount: 500000,
          billingCycle: "annually",
          startDate: "2023-11-01",
          endDate: "2024-11-01",
          paymentMethod: "Bank Transfer",
          lastPaymentDate: "2023-11-01",
          nextPaymentDate: "2024-11-01",
        },
        {
          id: "4",
          companyId: "4",
          companyName: "Eco Logistics",
          plan: "startup",
          status: "expired",
          amount: 50000,
          billingCycle: "monthly",
          startDate: "2024-03-10",
          endDate: "2024-09-10",
          paymentMethod: "Credit Card",
          lastPaymentDate: "2024-08-10",
          nextPaymentDate: "2024-09-10",
        },
        {
          id: "5",
          companyId: "5",
          companyName: "Digital Marketing Pro",
          plan: "business",
          status: "active",
          amount: 200000,
          billingCycle: "annually",
          startDate: "2024-04-05",
          endDate: "2025-04-05",
          paymentMethod: "Bank Transfer",
          lastPaymentDate: "2024-04-05",
          nextPaymentDate: "2025-04-05",
        },
        {
          id: "6",
          companyId: "6",
          companyName: "Food Delivery Express",
          plan: "business",
          status: "cancelled",
          amount: 200000,
          billingCycle: "annually",
          startDate: "2024-05-12",
          endDate: "2024-11-12",
          paymentMethod: "Credit Card",
          lastPaymentDate: "2024-05-12",
          nextPaymentDate: "N/A",
        },
        {
          id: "7",
          companyId: "7",
          companyName: "EduTech Africa",
          plan: "startup",
          status: "active",
          amount: 50000,
          billingCycle: "monthly",
          startDate: "2024-06-01",
          endDate: "2025-06-01",
          paymentMethod: "Bank Transfer",
          lastPaymentDate: "2024-06-01",
          nextPaymentDate: "2025-06-01",
        },
        {
          id: "8",
          companyId: "8",
          companyName: "FinTech Solutions",
          plan: "enterprise",
          status: "pending",
          amount: 500000,
          billingCycle: "annually",
          startDate: "2024-07-15",
          endDate: "2025-07-15",
          paymentMethod: "Pending",
          lastPaymentDate: "N/A",
          nextPaymentDate: "2024-07-15",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getPlanBadge = (plan: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'startup': { color: 'bg-slate-100 text-slate-800', label: 'Startup' },
      'business': { color: 'bg-blue-100 text-blue-800', label: 'Business' },
      'enterprise': { color: 'bg-purple-100 text-purple-800', label: 'Enterprise' },
    };
    const { color, label } = config[plan] || config.startup;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Active' },
      'pending': { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending' },
      'expired': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Expired' },
      'cancelled': { color: 'bg-slate-100 text-slate-800', icon: AlertCircle, label: 'Cancelled' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    const matchesSearch = s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || s.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    expired: subscriptions.filter(s => s.status === 'expired' || s.status === 'cancelled').length,
    monthlyRevenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const monthly = s.billingCycle === 'monthly' ? s.amount : 
                        s.billingCycle === 'quarterly' ? s.amount / 3 : 
                        s.amount / 12;
        return sum + monthly;
      }, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading subscriptions...</p>
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
            <CreditCard className="w-8 h-8 text-blue-500" />
            Subscriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all company subscriptions and billing.</p>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total</p>
            <Receipt className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Expired/Cancelled</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{stats.expired}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Monthly Revenue</p>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-purple-600">{formatCurrency(stats.monthlyRevenue)}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Plans</option>
            <option value="startup">Startup</option>
            <option value="business">Business</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Billing Cycle</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Payment Method</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Next Payment</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{subscription.companyName}</p>
                      <p className="text-xs text-slate-500">ID: {subscription.companyId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPlanBadge(subscription.plan)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(subscription.amount)}</td>
                  <td className="px-4 py-3 text-sm capitalize">{subscription.billingCycle}</td>
                  <td className="px-4 py-3">{getStatusBadge(subscription.status)}</td>
                  <td className="px-4 py-3 text-sm">{subscription.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm">{subscription.nextPaymentDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/owner/subscriptions/${subscription.id}`}>
                        <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </Link>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedSubscriptions.length === 0 && (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No subscriptions found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredSubscriptions.length)} of{' '}
              {filteredSubscriptions.length} subscriptions
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