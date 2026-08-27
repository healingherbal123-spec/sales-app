"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crown,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  BarChart,
  Activity,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  UserPlus,
  Settings,
  Shield,
  Award,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface PlatformStats {
  totalCompanies: number;
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeCompanies: number;
  revenueGrowth: number;
  userGrowth: number;
  orderGrowth: number;
  companiesGrowth: number;
  averageRevenuePerCompany: number;
  monthlyActiveUsers: number;
  platformHealth: number;
}

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'startup' | 'business' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  staffCount: number;
  revenue: number;
  orders: number;
  joinedDate: string;
  lastActive: string;
  logo?: string;
}

interface RecentActivity {
  id: string;
  type: 'company_registered' | 'user_signed_up' | 'payment_received' | 'order_placed' | 'company_suspended' | 'plan_upgraded';
  description: string;
  company: string;
  time: string;
  user: string;
}

export default function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalCompanies: 12,
        totalUsers: 86,
        totalRevenue: 28450000,
        totalOrders: 1234,
        activeCompanies: 10,
        revenueGrowth: 23.5,
        userGrowth: 18.2,
        orderGrowth: 15.8,
        companiesGrowth: 12.5,
        averageRevenuePerCompany: 2370833,
        monthlyActiveUsers: 72,
        platformHealth: 98,
      });

      setCompanies([
        { 
          id: "1", 
          name: "Tech Solutions Ltd", 
          email: "info@techsolutions.com", 
          phone: "+234 800 111 2222",
          plan: 'enterprise', 
          status: 'active', 
          staffCount: 15, 
          revenue: 5600000, 
          orders: 245, 
          joinedDate: "2024-01-15", 
          lastActive: "Today",
        },
        { 
          id: "2", 
          name: "Global Retail Corp", 
          email: "contact@globalretail.com", 
          phone: "+234 800 333 4444",
          plan: 'business', 
          status: 'active', 
          staffCount: 8, 
          revenue: 3200000, 
          orders: 178, 
          joinedDate: "2024-02-20", 
          lastActive: "Today",
        },
        { 
          id: "3", 
          name: "Healthcare Solutions", 
          email: "admin@healthcare.com", 
          phone: "+234 800 555 6666",
          plan: 'enterprise', 
          status: 'active', 
          staffCount: 22, 
          revenue: 8900000, 
          orders: 412, 
          joinedDate: "2023-11-01", 
          lastActive: "2 hours ago",
        },
        { 
          id: "4", 
          name: "Eco Logistics", 
          email: "info@ecologistics.com", 
          phone: "+234 800 777 8888",
          plan: 'startup', 
          status: 'inactive', 
          staffCount: 3, 
          revenue: 450000, 
          orders: 34, 
          joinedDate: "2024-03-10", 
          lastActive: "2 days ago",
        },
        { 
          id: "5", 
          name: "Digital Marketing Pro", 
          email: "hello@digitalmarketing.com", 
          phone: "+234 800 999 0000",
          plan: 'business', 
          status: 'active', 
          staffCount: 6, 
          revenue: 2100000, 
          orders: 98, 
          joinedDate: "2024-04-05", 
          lastActive: "Yesterday",
        },
        { 
          id: "6", 
          name: "Food Delivery Express", 
          email: "support@fooddelivery.com", 
          phone: "+234 800 111 3333",
          plan: 'business', 
          status: 'suspended', 
          staffCount: 4, 
          revenue: 780000, 
          orders: 56, 
          joinedDate: "2024-05-12", 
          lastActive: "3 days ago",
        },
        { 
          id: "7", 
          name: "EduTech Africa", 
          email: "info@edutechafrica.com", 
          phone: "+234 800 555 7777",
          plan: 'startup', 
          status: 'active', 
          staffCount: 5, 
          revenue: 850000, 
          orders: 67, 
          joinedDate: "2024-06-01", 
          lastActive: "Today",
        },
        { 
          id: "8", 
          name: "FinTech Solutions", 
          email: "contact@fintechsolutions.com", 
          phone: "+234 800 999 1111",
          plan: 'enterprise', 
          status: 'active', 
          staffCount: 18, 
          revenue: 7200000, 
          orders: 320, 
          joinedDate: "2024-07-15", 
          lastActive: "1 hour ago",
        },
      ]);

      setRecentActivities([
        { 
          id: "1", 
          type: 'company_registered', 
          description: "New company registered: FinTech Solutions", 
          company: "FinTech Solutions", 
          time: "2 hours ago",
          user: "System",
        },
        { 
          id: "2", 
          type: 'payment_received', 
          description: "Payment received from Tech Solutions Ltd - ₦5,600,000", 
          company: "Tech Solutions Ltd", 
          time: "3 hours ago",
          user: "System",
        },
        { 
          id: "3", 
          type: 'user_signed_up', 
          description: "New user signed up: John Doe (Healthcare Solutions)", 
          company: "Healthcare Solutions", 
          time: "5 hours ago",
          user: "John Doe",
        },
        { 
          id: "4", 
          type: 'plan_upgraded', 
          description: "Global Retail Corp upgraded to Business plan", 
          company: "Global Retail Corp", 
          time: "Yesterday",
          user: "System",
        },
        { 
          id: "5", 
          type: 'order_placed', 
          description: "New order #ORD-1001 placed by Tech Solutions Ltd", 
          company: "Tech Solutions Ltd", 
          time: "Yesterday",
          user: "Mary Johnson",
        },
        { 
          id: "6", 
          type: 'company_suspended', 
          description: "Food Delivery Express suspended due to payment issues", 
          company: "Food Delivery Express", 
          time: "2 days ago",
          user: "System",
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
      'inactive': { color: 'bg-slate-100 text-slate-800', icon: Clock, label: 'Inactive' },
      'suspended': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Suspended' },
    };
    const { color, icon: Icon, label } = config[status] || config.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getActivityIcon = (type: string) => {
    const config: Record<string, any> = {
      'company_registered': Building2,
      'user_signed_up': Users,
      'payment_received': DollarSign,
      'order_placed': ShoppingBag,
      'company_suspended': AlertCircle,
      'plan_upgraded': TrendingUp,
    };
    const Icon = config[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (type: string) => {
    const config: Record<string, string> = {
      'company_registered': 'text-emerald-500',
      'user_signed_up': 'text-blue-500',
      'payment_received': 'text-emerald-500',
      'order_placed': 'text-purple-500',
      'company_suspended': 'text-red-500',
      'plan_upgraded': 'text-amber-500',
    };
    return config[type] || 'text-slate-500';
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || c.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading your empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================
      HEADER
      ============================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here's your AI SalesOS empire overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/owner/companies/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Register Company
            </button>
          </Link>
          <Link href="/owner/settings">
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Platform Settings
            </button>
          </Link>
        </div>
      </div>

      {/* ============================================
      STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Companies</p>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats?.totalCompanies || 0}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.companiesGrowth || 0}% growth
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{stats?.activeCompanies || 0}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">of {stats?.totalCompanies || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Users</p>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats?.totalUsers || 0}</p>
          <span className="text-[10px] text-purple-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.userGrowth || 0}% growth
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Platform Health</p>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{stats?.platformHealth || 0}%</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">All systems operational</span>
        </div>
      </div>

      {/* ============================================
      SECONDARY STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-600">Total Revenue</p>
          <p className="text-xl font-bold text-blue-800">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-600">Revenue Growth</p>
          <p className="text-xl font-bold text-emerald-800">+{stats?.revenueGrowth || 0}%</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
          <p className="text-xs text-purple-600">Total Orders</p>
          <p className="text-xl font-bold text-purple-800">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-600">Avg Revenue/Company</p>
          <p className="text-xl font-bold text-amber-800">{formatCurrency(stats?.averageRevenuePerCompany || 0)}</p>
        </div>
      </div>

      {/* ============================================
      QUICK ACTIONS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/owner/companies/new">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Register Company</p>
                <p className="text-xs text-slate-500">Onboard new business</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/owner/companies">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Manage Companies</p>
                <p className="text-xs text-slate-500">View all companies</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/owner/analytics">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <BarChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Analytics</p>
                <p className="text-xs text-slate-500">Platform insights</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/owner/settings">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <Settings className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Platform Settings</p>
                <p className="text-xs text-slate-500">Configure platform</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ============================================
      COMPANIES LIST
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm">Registered Companies</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {companies.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="all">All Plans</option>
              <option value="startup">Startup</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <Link href="/owner/companies">
              <button className="text-xs text-blue-600 font-semibold hover:underline">
                View All →
              </button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Revenue</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Orders</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPlanBadge(company.plan)}</td>
                  <td className="px-4 py-3 text-sm">{company.staffCount}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(company.revenue)}</td>
                  <td className="px-4 py-3 text-sm">{company.orders}</td>
                  <td className="px-4 py-3">{getStatusBadge(company.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/owner/companies/${company.id}`}>
                        <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </Link>
                      <Link href={`/owner/companies/${company.id}/edit`}>
                        <button className="p-1 hover:bg-amber-50 rounded transition-colors">
                          <Edit className="w-4 h-4 text-amber-500" />
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

        {paginatedCompanies.length === 0 && (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No companies found</p>
          </div>
        )}

        {/* ============================================
        PAGINATION
        ============================================ */}
        {totalPages > 1 && (
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of{' '}
              {filteredCompanies.length} companies
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

      {/* ============================================
      RECENT ACTIVITY
      ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Recent Activity
            </h3>
            <Link href="/owner/activity">
              <button className="text-xs text-blue-600 hover:underline">View All →</button>
            </Link>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg bg-slate-50 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{activity.company}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {recentActivities.length === 0 && (
            <div className="text-center py-4 text-sm text-slate-500">
              No recent activity
            </div>
          )}
        </div>

        {/* ============================================
        PLATFORM INSIGHTS
        ============================================ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            Platform Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Monthly Active Users</p>
                <p className="font-semibold">{stats?.monthlyActiveUsers || 0}</p>
              </div>
              <span className="text-xs text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Avg Revenue/Company</p>
                <p className="font-semibold">{formatCurrency(stats?.averageRevenuePerCompany || 0)}</p>
              </div>
              <span className="text-xs text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +8%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Total Orders</p>
                <p className="font-semibold">{stats?.totalOrders || 0}</p>
              </div>
              <span className="text-xs text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.orderGrowth || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Platform Uptime</p>
                <p className="font-semibold text-emerald-600">{stats?.platformHealth || 0}%</p>
              </div>
              <span className="text-xs text-emerald-600">✅ Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}