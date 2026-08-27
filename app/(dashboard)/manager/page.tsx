"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
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
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  PieChart,
  Target,
  Award,
  Briefcase,
  Building2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
} from "lucide-react";

interface ManagerStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  activeStaff: number;
  teamPerformance: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  onTimeDelivery: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  sales: number;
  orders: number;
  performance: number;
  status: 'active' | 'busy' | 'offline' | 'on_leave';
  avatar?: string;
  tasks: number;
  completedTasks: number;
  rating: number;
}

interface DepartmentStats {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  time: string;
  type: 'sale' | 'order' | 'customer' | 'inventory' | 'delivery';
}

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentStats[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalRevenue: 8450000,
        totalOrders: 143,
        totalCustomers: 324,
        pendingOrders: 12,
        activeStaff: 15,
        teamPerformance: 91,
        revenueGrowth: 18.5,
        orderGrowth: 12,
        customerGrowth: 8,
        conversionRate: 23.5,
        averageOrderValue: 12500,
        onTimeDelivery: 87,
      });

      setTeamMembers([
        { 
          id: "1", 
          name: "John Doe", 
          role: "Sales Manager", 
          department: "Sales", 
          sales: 2450000, 
          orders: 45, 
          performance: 92, 
          status: 'active',
          tasks: 12,
          completedTasks: 10,
          rating: 4.8,
        },
        { 
          id: "2", 
          name: "Jane Smith", 
          role: "Senior Sales Rep", 
          department: "Sales", 
          sales: 3200000, 
          orders: 58, 
          performance: 98, 
          status: 'active',
          tasks: 15,
          completedTasks: 14,
          rating: 4.9,
        },
        { 
          id: "3", 
          name: "Mike Johnson", 
          role: "Inventory Manager", 
          department: "Operations", 
          sales: 0, 
          orders: 12, 
          performance: 85, 
          status: 'busy',
          tasks: 8,
          completedTasks: 6,
          rating: 4.2,
        },
        { 
          id: "4", 
          name: "Sarah Williams", 
          role: "Dispatcher", 
          department: "Logistics", 
          sales: 0, 
          orders: 28, 
          performance: 90, 
          status: 'active',
          tasks: 10,
          completedTasks: 9,
          rating: 4.5,
        },
        { 
          id: "5", 
          name: "David Brown", 
          role: "Sales Rep", 
          department: "Sales", 
          sales: 1800000, 
          orders: 32, 
          performance: 78, 
          status: 'offline',
          tasks: 6,
          completedTasks: 4,
          rating: 3.8,
        },
        { 
          id: "6", 
          name: "Lisa Chen", 
          role: "Accountant", 
          department: "Finance", 
          sales: 0, 
          orders: 0, 
          performance: 95, 
          status: 'active',
          tasks: 7,
          completedTasks: 7,
          rating: 4.7,
        },
        { 
          id: "7", 
          name: "Robert Taylor", 
          role: "Dispatcher", 
          department: "Logistics", 
          sales: 0, 
          orders: 0, 
          performance: 88, 
          status: 'busy',
          tasks: 9,
          completedTasks: 7,
          rating: 4.3,
        },
        { 
          id: "8", 
          name: "Grace Okonkwo", 
          role: "Delivery Agent", 
          department: "Logistics", 
          sales: 0, 
          orders: 18, 
          performance: 82, 
          status: 'active',
          tasks: 11,
          completedTasks: 9,
          rating: 4.1,
        },
      ]);

      setDepartmentData([
        { name: "Sales", count: 6, revenue: 7450000, color: "bg-blue-500" },
        { name: "Operations", count: 3, revenue: 500000, color: "bg-emerald-500" },
        { name: "Logistics", count: 4, revenue: 350000, color: "bg-amber-500" },
        { name: "Finance", count: 2, revenue: 150000, color: "bg-purple-500" },
      ]);

      setRecentActivities([
        { 
          id: "1", 
          user: "John Doe", 
          action: "New Sale", 
          details: "Sold iPhone 15 Pro to Mary Johnson - ₦1,200,000", 
          time: "10:30 AM",
          type: 'sale',
        },
        { 
          id: "2", 
          user: "Jane Smith", 
          action: "Order Completed", 
          details: "Order #ORD-1002 delivered successfully", 
          time: "09:45 AM",
          type: 'order',
        },
        { 
          id: "3", 
          user: "Mike Johnson", 
          action: "Inventory Update", 
          details: "Restocked 50 units of Samsung Galaxy S24", 
          time: "09:00 AM",
          type: 'inventory',
        },
        { 
          id: "4", 
          user: "Sarah Williams", 
          action: "Delivery Assigned", 
          details: "Assigned delivery #DEL-0045 to James O.", 
          time: "Yesterday",
          type: 'delivery',
        },
        { 
          id: "5", 
          user: "David Brown", 
          action: "New Customer", 
          details: "Added new customer: Peter Obi", 
          time: "Yesterday",
          type: 'customer',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, dot: string, label: string }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', label: 'Active' },
      'busy': { color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', label: 'Busy' },
      'offline': { color: 'bg-slate-100 text-slate-800', dot: 'bg-slate-400', label: 'Offline' },
      'on_leave': { color: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'On Leave' },
    };
    const { color, dot, label } = config[status] || config.offline;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  };

  const getActivityIcon = (type: string) => {
    const config: Record<string, any> = {
      'sale': TrendingUp,
      'order': ShoppingBag,
      'customer': Users,
      'inventory': Package,
      'delivery': Truck,
    };
    const Icon = config[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (type: string) => {
    const config: Record<string, string> = {
      'sale': 'text-emerald-500',
      'order': 'text-blue-500',
      'customer': 'text-purple-500',
      'inventory': 'text-amber-500',
      'delivery': 'text-cyan-500',
    };
    return config[type] || 'text-slate-500';
  };

  const filteredTeam = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading manager dashboard...</p>
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
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500">Monitor team performance and business operations.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/manager/staff/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
          </Link>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ============================================
      TIME RANGE
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
          onClick={() => setTimeRange("quarter")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            timeRange === "quarter"
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          This Quarter
        </button>
      </div>

      {/* ============================================
      STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.revenueGrowth || 0}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Orders</p>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats?.totalOrders || 0}</p>
          <span className="text-[10px] text-blue-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.orderGrowth || 0}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Customers</p>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats?.totalCustomers || 0}</p>
          <span className="text-[10px] text-purple-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.customerGrowth || 0}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Team Performance</p>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats?.teamPerformance || 0}%</p>
          <span className="text-[10px] text-amber-600 flex items-center mt-1">Overall score</span>
        </div>
      </div>

      {/* ============================================
      QUICK STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-600">Pending Orders</p>
          <p className="text-xl font-bold text-blue-800">{stats?.pendingOrders || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-600">Conversion Rate</p>
          <p className="text-xl font-bold text-emerald-800">{stats?.conversionRate || 0}%</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
          <p className="text-xs text-purple-600">Avg Order Value</p>
          <p className="text-xl font-bold text-purple-800">{formatCurrency(stats?.averageOrderValue || 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-3 rounded-xl border border-cyan-200">
          <p className="text-xs text-cyan-600">On-Time Delivery</p>
          <p className="text-xl font-bold text-cyan-800">{stats?.onTimeDelivery || 0}%</p>
        </div>
      </div>

      {/* ============================================
      QUICK ACTIONS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/manager/sales">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <BarChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Sales Overview</p>
                <p className="text-xs text-slate-500">View all sales</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/manager/staff">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Staff Activity</p>
                <p className="text-xs text-slate-500">Monitor team</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/manager/reports">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Reports</p>
                <p className="text-xs text-slate-500">Generate reports</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/manager/performance">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Performance</p>
                <p className="text-xs text-slate-500">Team KPIs</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ============================================
      DEPARTMENT BREAKDOWN
      ============================================ */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Department Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentData.map((dept) => (
            <div key={dept.name} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{dept.name}</p>
                <span className={`w-3 h-3 rounded-full ${dept.color}`} />
              </div>
              <p className="text-2xl font-bold mt-1">{dept.count}</p>
              <p className="text-sm text-slate-500">{formatCurrency(dept.revenue)}</p>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${dept.color}`}
                  style={{ 
                    width: `${(dept.count / teamMembers.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
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
              placeholder="Search staff by name, role, or department..."
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
      TEAM PERFORMANCE TABLE
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm">Team Performance</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {teamMembers.length} members
            </span>
          </div>
          <Link href="/manager/staff">
            <button className="text-xs text-blue-600 hover:underline">View All →</button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Sales</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Orders</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Performance</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{member.role}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(member.sales)}</td>
                  <td className="px-4 py-3">{member.orders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            member.performance >= 90 ? 'bg-emerald-500' :
                            member.performance >= 70 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${member.performance}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{member.performance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(member.status)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/manager/staff/${member.id}`}>
                      <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeam.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No staff found</p>
          </div>
        )}
      </div>

      {/* ============================================
      RECENT ACTIVITY
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Recent Activity
          </h3>
          <Link href="/manager/activity">
            <button className="text-xs text-blue-600 hover:underline">View All →</button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-50 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {activity.user} - {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">{activity.details}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
      AI ALERTS
      ============================================ */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-600" />
          <div>
            <p className="text-sm font-medium text-cyan-800">AI Alerts</p>
            <div className="mt-1 space-y-0.5 text-xs text-cyan-700">
              <p>• 3 low stock items need reordering</p>
              <p>• 2 deliveries are delayed beyond SLA</p>
              <p>• Sales team is 82% toward monthly target</p>
            </div>
          </div>
          <Link href="/ai/activity" className="ml-auto">
            <button className="px-3 py-1.5 text-xs font-medium text-cyan-700 bg-cyan-200/50 rounded-lg hover:bg-cyan-200 transition-colors">
              View All
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}