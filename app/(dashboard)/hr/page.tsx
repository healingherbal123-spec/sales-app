"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Briefcase,
  Mail,
  Phone,
  Building2,
  Award,
  FileText,
  Gift,
  BarChart,
  PieChart,
  Activity,
  Download,
  Plus,
} from "lucide-react";

interface HRStats {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  pendingRequests: number;
  departments: number;
  newHires: number;
  turnoverRate: number;
  attendanceRate: number;
}

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive' | 'pending';
  joined_date: string;
  avatar_url?: string;
}

interface DepartmentStats {
  name: string;
  count: number;
  color: string;
}

export default function HRDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<HRStats | null>(null);
  const [recentStaff, setRecentStaff] = useState<StaffMember[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate data loading - Replace with Supabase
    setTimeout(() => {
      setStats({
        totalStaff: 24,
        activeStaff: 18,
        onLeave: 3,
        pendingRequests: 5,
        departments: 6,
        newHires: 4,
        turnoverRate: 8.5,
        attendanceRate: 92,
      });

      setRecentStaff([
        { 
          id: "1", 
          full_name: "John Doe", 
          email: "john@company.com", 
          phone: "+234 800 111 2222", 
          role: "Sales Manager", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-01-15" 
        },
        { 
          id: "2", 
          full_name: "Jane Smith", 
          email: "jane@company.com", 
          phone: "+234 800 333 4444", 
          role: "Senior Sales Rep", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-02-20" 
        },
        { 
          id: "3", 
          full_name: "Mike Johnson", 
          email: "mike@company.com", 
          phone: "+234 800 555 6666", 
          role: "Inventory Manager", 
          department: "Operations", 
          status: 'active', 
          joined_date: "2024-03-10" 
        },
        { 
          id: "4", 
          full_name: "Sarah Williams", 
          email: "sarah@company.com", 
          phone: "+234 800 777 8888", 
          role: "Dispatcher", 
          department: "Logistics", 
          status: 'on_leave', 
          joined_date: "2024-04-05" 
        },
        { 
          id: "5", 
          full_name: "David Brown", 
          email: "david@company.com", 
          phone: "+234 800 999 0000", 
          role: "Sales Rep", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-05-12" 
        },
      ]);

      setDepartmentData([
        { name: "Sales", count: 8, color: "bg-blue-500" },
        { name: "Operations", count: 5, color: "bg-emerald-500" },
        { name: "Logistics", count: 4, color: "bg-amber-500" },
        { name: "Finance", count: 3, color: "bg-purple-500" },
        { name: "HR", count: 2, color: "bg-pink-500" },
        { name: "IT", count: 2, color: "bg-cyan-500" },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, dot: string, label: string }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', label: 'Active' },
      'on_leave': { color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', label: 'On Leave' },
      'inactive': { color: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'Inactive' },
      'pending': { color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', label: 'Pending' },
    };
    const { color, dot, label } = config[status] || config.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading HR data...</p>
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
            HR Dashboard
          </h1>
          <p className="text-sm text-slate-500">Manage staff, attendance, and HR operations.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hr/staff/new">
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
      STATS GRID
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Staff</p>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-1 text-slate-900">{stats?.totalStaff || 0}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats?.newHires || 0} new hires
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats?.activeStaff || 0}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {Math.round(((stats?.activeStaff || 0) / (stats?.totalStaff || 1)) * 100)}% of total
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">On Leave</p>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats?.onLeave || 0}</p>
          <span className="text-[10px] text-amber-600 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-0.5" /> {stats?.pendingRequests || 0} pending requests
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-1 text-purple-600">{stats?.attendanceRate || 0}%</p>
          <span className="text-[10px] text-purple-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +2% from last month
          </span>
        </div>
      </div>

      {/* ============================================
      DEPARTMENT BREAKDOWN
      ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Department Breakdown
            </h3>
            <Link href="/hr/staff">
              <button className="text-xs text-blue-600 hover:underline">View All →</button>
            </Link>
          </div>
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{dept.name}</span>
                  <span className="font-medium text-slate-900">{dept.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full ${dept.color}`}
                    style={{ 
                      width: `${(dept.count / (stats?.totalStaff || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
        QUICK ACTIONS
        ============================================ */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/hr/staff/new">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200 hover:shadow-md transition-all cursor-pointer text-center">
                <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="font-semibold text-xs text-blue-800">Add Staff</p>
              </div>
            </Link>
            <Link href="/hr/attendance">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200 hover:shadow-md transition-all cursor-pointer text-center">
                <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="font-semibold text-xs text-emerald-800">Attendance</p>
              </div>
            </Link>
            <Link href="/hr/leaves">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200 hover:shadow-md transition-all cursor-pointer text-center">
                <Calendar className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <p className="font-semibold text-xs text-amber-800">Leave Requests</p>
              </div>
            </Link>
            <Link href="/hr/performance">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200 hover:shadow-md transition-all cursor-pointer text-center">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="font-semibold text-xs text-purple-800">Performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================
      RECENT STAFF
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm">Recent Staff</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {recentStaff.length} members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Link href="/hr/staff">
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
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {staff.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{staff.full_name}</p>
                        <p className="text-xs text-slate-500">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{staff.role}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {staff.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(staff.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(staff.joined_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/hr/staff/${staff.id}`}>
                        <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </Link>
                      <Link href={`/hr/staff/${staff.id}/edit`}>
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

        {recentStaff.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No staff found</p>
          </div>
        )}
      </div>

      {/* ============================================
      ALERTS
      ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Pending Leave Requests: {stats?.pendingRequests || 0}
              </p>
              <p className="text-xs text-amber-700">3 requests awaiting approval</p>
            </div>
            <Link href="/hr/leaves" className="ml-auto">
              <button className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-200/50 rounded-lg hover:bg-amber-200 transition-colors">
                Review
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                New Hire Onboarding
              </p>
              <p className="text-xs text-blue-700">2 staff joining this week</p>
            </div>
            <Link href="/hr/staff/new" className="ml-auto">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-200/50 rounded-lg hover:bg-blue-200 transition-colors">
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}