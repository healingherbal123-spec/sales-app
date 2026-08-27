"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  BarChart,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  Users,
  FileText,
  PieChart,
  ArrowLeft,
  Plus,
  Printer,
  Mail,
  RefreshCw,
} from "lucide-react";

interface AccountantStats {
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  paymentsReceived: number;
  outstandingPayments: number;
  pendingVerification: number;
  totalTransactions: number;
  revenueGrowth: number;
  averageTransaction: number;
  successRate: number;
}

interface Payment {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  amount: number;
  status: 'verified' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money';
  reference: string;
}

export default function AccountantDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AccountantStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    setTimeout(() => {
      setStats({
        todayRevenue: 425000,
        monthlyRevenue: 4500000,
        yearlyRevenue: 52450000,
        paymentsReceived: 3200000,
        outstandingPayments: 520000,
        pendingVerification: 7,
        totalTransactions: 234,
        revenueGrowth: 18.5,
        averageTransaction: 12500,
        successRate: 94.2,
      });

      setPayments([
        { 
          id: "1", 
          orderNumber: "ORD-1001", 
          customer: "Mary Johnson", 
          customerEmail: "mary@example.com",
          amount: 170000, 
          status: 'verified', 
          date: "Today", 
          method: 'bank_transfer',
          reference: "REF-001234"
        },
        { 
          id: "2", 
          orderNumber: "ORD-1002", 
          customer: "John Adeyemi", 
          customerEmail: "john@example.com",
          amount: 25000, 
          status: 'pending', 
          date: "Today", 
          method: 'cash',
          reference: "REF-001235"
        },
        { 
          id: "3", 
          orderNumber: "ORD-1003", 
          customer: "Chioma Nwosu", 
          customerEmail: "chioma@example.com",
          amount: 110000, 
          status: 'verified', 
          date: "Yesterday", 
          method: 'card',
          reference: "REF-001236"
        },
        { 
          id: "4", 
          orderNumber: "ORD-1004", 
          customer: "James Brown", 
          customerEmail: "james@example.com",
          amount: 85000, 
          status: 'pending', 
          date: "Yesterday", 
          method: 'mobile_money',
          reference: "REF-001237"
        },
        { 
          id: "5", 
          orderNumber: "ORD-1005", 
          customer: "Grace Okonkwo", 
          customerEmail: "grace@example.com",
          amount: 50000, 
          status: 'failed', 
          date: "2 days ago", 
          method: 'bank_transfer',
          reference: "REF-001238"
        },
        { 
          id: "6", 
          orderNumber: "ORD-1006", 
          customer: "Peter Obi", 
          customerEmail: "peter@example.com",
          amount: 230000, 
          status: 'verified', 
          date: "2 days ago", 
          method: 'card',
          reference: "REF-001239"
        },
        { 
          id: "7", 
          orderNumber: "ORD-1007", 
          customer: "Ngozi Okonjo", 
          customerEmail: "ngozi@example.com",
          amount: 150000, 
          status: 'pending', 
          date: "2 days ago", 
          method: 'cash',
          reference: "REF-001240"
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'verified': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Verified' },
      'pending': { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending' },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' },
      'refunded': { color: 'bg-purple-100 text-purple-800', icon: TrendingDown, label: 'Refunded' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getMethodIcon = (method: string) => {
    const config: Record<string, { icon: any, label: string }> = {
      'cash': { icon: DollarSign, label: 'Cash' },
      'bank_transfer': { icon: Receipt, label: 'Bank Transfer' },
      'card': { icon: CreditCard, label: 'Card' },
      'mobile_money': { icon: Smartphone, label: 'Mobile Money' },
    };
    const { icon: Icon, label } = config[method] || config.cash;
    return { icon: Icon, label };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* ============================================
      HEADER
      ============================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Accountant Dashboard
          </h1>
          <p className="text-sm text-slate-500">Manage finances, payments, and transactions.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/accountant/verify">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Verify Payments ({stats?.pendingVerification || 0})
            </button>
          </Link>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ============================================
      TIME RANGE FILTER
      ============================================ */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange("today")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            timeRange === "today"
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeRange("week")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            timeRange === "week"
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            timeRange === "month"
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeRange("year")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            timeRange === "year"
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          This Year
        </button>
      </div>

      {/* ============================================
      STATS GRID
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Today's Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(stats?.todayRevenue || 0)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +8% from yesterday
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Monthly Revenue</p>
            <BarChart className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
          <span className="text-[10px] text-blue-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.revenueGrowth || 0}% growth
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Payments Received</p>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(stats?.paymentsReceived || 0)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">This month</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Outstanding</p>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(stats?.outstandingPayments || 0)}</p>
          <span className="text-[10px] text-amber-600 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-0.5" /> {stats?.pendingVerification || 0} pending
          </span>
        </div>
      </div>

      {/* ============================================
      SECONDARY STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-600">Total Transactions</p>
          <p className="text-xl font-bold text-blue-800">{stats?.totalTransactions || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-600">Success Rate</p>
          <p className="text-xl font-bold text-emerald-800">{stats?.successRate || 0}%</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
          <p className="text-xs text-purple-600">Avg Transaction</p>
          <p className="text-xl font-bold text-purple-800">{formatCurrency(stats?.averageTransaction || 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-600">Yearly Revenue</p>
          <p className="text-xl font-bold text-amber-800">{formatCurrency(stats?.yearlyRevenue || 0)}</p>
        </div>
      </div>

      {/* ============================================
      QUICK ACTIONS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/accountant/payments">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">All Payments</p>
                <p className="text-xs text-slate-500">View all transactions</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/accountant/verify">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Verify Payments</p>
                <p className="text-xs text-slate-500">{stats?.pendingVerification || 0} pending</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/accountant/reports">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Reports</p>
                <p className="text-xs text-slate-500">Financial reports</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/accountant/reconciliation">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Reconciliation</p>
                <p className="text-xs text-slate-500">Match payments</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ============================================
      SEARCH & FILTERS
      ============================================ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order, customer, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ============================================
      RECENT PAYMENTS
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-sm">Recent Payments</h3>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {payments.length} transactions
            </span>
          </div>
          <Link href="/accountant/payments">
            <button className="text-xs text-purple-600 hover:underline">View All →</button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => {
                const method = getMethodIcon(payment.method);
                const MethodIcon = method.icon;
                return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-blue-600">
                      {payment.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-slate-900">{payment.customer}</p>
                        <p className="text-xs text-slate-500">{payment.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MethodIcon className="w-4 h-4" />
                        <span>{method.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{payment.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/accountant/payments/${payment.id}`}>
                          <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                        </Link>
                        {payment.status === 'pending' && (
                          <Link href={`/accountant/verify?payment=${payment.id}`}>
                            <button className="p-1 hover:bg-emerald-50 rounded transition-colors">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No payments found</p>
          </div>
        )}
      </div>

      {/* ============================================
      OUTSTANDING PAYMENTS ALERT
      ============================================ */}
      {(stats?.outstandingPayments || 0) > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Outstanding Payments: {formatCurrency(stats?.outstandingPayments || 0)}
              </p>
              <p className="text-xs text-amber-700">
                {stats?.pendingVerification || 0} payments pending verification
              </p>
            </div>
            <Link href="/accountant/verify" className="ml-auto">
              <button className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-200/50 rounded-lg hover:bg-amber-200 transition-colors">
                Verify Now
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}