// app/team/performance/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  Award,
  BarChart,
  UserPlus,
  Mail,
  Phone,
  Star,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  AlertCircle,
  Crown,
  Medal,
  Trophy,
  User,
  Briefcase,
  Package,
  ShoppingBag,
  Activity,
  PieChart,
  LineChart,
  Sparkles,
  Zap,
  Flame,
  Gift,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Team Member Data
const teamMembers = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Senior Sales Rep",
    avatar: "JS",
    salesTarget: 1000000,
    salesAchieved: 850000,
    totalSales: 12,
    pendingSales: 3,
    approvedSales: 9,
    revenue: 4250000,
    rating: 4.9,
    status: "active",
    joinDate: "2024-01-15",
    performance: "excellent",
    deals: 15,
    conversionRate: 85,
    customerSatisfaction: 4.8,
    topProducts: ["Enterprise Software", "Consulting"],
    recentActivity: "Closed deal with TechCorp"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    role: "Sales Rep",
    avatar: "JD",
    salesTarget: 750000,
    salesAchieved: 620000,
    totalSales: 8,
    pendingSales: 2,
    approvedSales: 6,
    revenue: 3100000,
    rating: 4.7,
    status: "active",
    joinDate: "2024-03-20",
    performance: "good",
    deals: 10,
    conversionRate: 78,
    customerSatisfaction: 4.5,
    topProducts: ["Cloud Services", "Support Plans"],
    recentActivity: "Renewed contract with ABC Ltd"
  },
  {
    id: 3,
    name: "Mary Johnson",
    email: "mary@example.com",
    role: "Sales Rep",
    avatar: "MJ",
    salesTarget: 750000,
    salesAchieved: 780000,
    totalSales: 10,
    pendingSales: 1,
    approvedSales: 9,
    revenue: 3900000,
    rating: 4.8,
    status: "active",
    joinDate: "2024-02-10",
    performance: "excellent",
    deals: 12,
    conversionRate: 82,
    customerSatisfaction: 4.7,
    topProducts: ["Custom Development", "Training"],
    recentActivity: "Closed enterprise deal with MegaCorp"
  },
  {
    id: 4,
    name: "David Okonkwo",
    email: "david@example.com",
    role: "Sales Trainee",
    avatar: "DO",
    salesTarget: 500000,
    salesAchieved: 350000,
    totalSales: 5,
    pendingSales: 4,
    approvedSales: 1,
    revenue: 1750000,
    rating: 4.2,
    status: "training",
    joinDate: "2024-06-01",
    performance: "needs_improvement",
    deals: 4,
    conversionRate: 65,
    customerSatisfaction: 4.0,
    topProducts: ["Basic Support"],
    recentActivity: "Completed product training"
  },
  {
    id: 5,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Senior Sales Rep",
    avatar: "SW",
    salesTarget: 1000000,
    salesAchieved: 920000,
    totalSales: 14,
    pendingSales: 2,
    approvedSales: 12,
    revenue: 4600000,
    rating: 4.9,
    status: "active",
    joinDate: "2024-01-05",
    performance: "excellent",
    deals: 18,
    conversionRate: 88,
    customerSatisfaction: 4.9,
    topProducts: ["Enterprise Suite", "Consulting", "Training"],
    recentActivity: "Top performer for July"
  },
  {
    id: 6,
    name: "Michael Adebayo",
    email: "michael@example.com",
    role: "Sales Rep",
    avatar: "MA",
    salesTarget: 750000,
    salesAchieved: 680000,
    totalSales: 9,
    pendingSales: 3,
    approvedSales: 6,
    revenue: 3400000,
    rating: 4.6,
    status: "active",
    joinDate: "2024-04-15",
    performance: "good",
    deals: 11,
    conversionRate: 76,
    customerSatisfaction: 4.4,
    topProducts: ["Cloud Services", "Maintenance"],
    recentActivity: "Closed 3 deals this week"
  }
];

// Performance Stats
const performanceStats = {
  totalRevenue: teamMembers.reduce((sum, m) => sum + m.revenue, 0),
  totalSales: teamMembers.reduce((sum, m) => sum + m.totalSales, 0),
  totalTarget: teamMembers.reduce((sum, m) => sum + m.salesTarget, 0),
  totalAchieved: teamMembers.reduce((sum, m) => sum + m.salesAchieved, 0),
  averageRating: (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1),
  topPerformer: teamMembers.reduce((a, b) => a.salesAchieved > b.salesAchieved ? a : b),
};

export default function TeamPerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("revenue");
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  // Get roles for filter
  const roles = ["All", ...new Set(teamMembers.map(m => m.role))];
  const statuses = ["All", "active", "training", "on_leave"];

  // Filter and sort members
  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "All" || member.role === filterRole;
      const matchesStatus = filterStatus === "All" || member.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "revenue":
          return b.revenue - a.revenue;
        case "sales":
          return b.totalSales - a.totalSales;
        case "achieved":
          return b.salesAchieved - a.salesAchieved;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getProgressColor = (achieved: number, target: number) => {
    const progress = (achieved / target) * 100;
    if (progress >= 100) return "bg-emerald-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getPerformanceBadge = (performance: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      excellent: { label: "🏆 Top Performer", color: "bg-emerald-100 text-emerald-800", icon: Trophy },
      good: { label: "⭐ Good Performance", color: "bg-blue-100 text-blue-800", icon: Star },
      needs_improvement: { label: "⚠️ Needs Improvement", color: "bg-amber-100 text-amber-800", icon: AlertCircle },
    };
    return badges[performance] || badges.good;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      active: { label: "Active", color: "bg-emerald-100 text-emerald-800" },
      training: { label: "In Training", color: "bg-blue-100 text-blue-800" },
      on_leave: { label: "On Leave", color: "bg-amber-100 text-amber-800" },
    };
    return badges[status] || badges.active;
  };

  const handleViewMember = (member: typeof teamMembers[0]) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-medium">
                  {selectedMember.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                  <p className="text-sm text-slate-500">{selectedMember.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMemberModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Target</p>
                <p className="font-bold">{formatCurrency(selectedMember.salesTarget)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Achieved</p>
                <p className="font-bold text-emerald-600">{formatCurrency(selectedMember.salesAchieved)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Sales</p>
                <p className="font-bold">{selectedMember.totalSales}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{selectedMember.rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-sm mb-2">Recent Activity</h4>
              <p className="text-sm text-slate-600">{selectedMember.recentActivity}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-sm mb-2">Top Products</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.topProducts.map((product, i) => (
                  <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                    {product}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Send Message
              </button>
              <button className="flex-1 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50">
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-7 h-7 text-indigo-600" />
              Team Performance
            </h1>
            <p className="text-sm text-slate-500">Track and manage your team's performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(performanceStats.totalRevenue)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +12% vs last month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Sales</p>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{performanceStats.totalSales}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Across all members</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Avg Rating</p>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xl font-bold">{performanceStats.averageRating}</span>
            <span className="text-sm text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-amber-600 font-medium mt-1 block">Customer satisfaction</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Top Performer</p>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 truncate">{performanceStats.topPerformer.name}</p>
          <span className="text-[10px] text-amber-600 font-medium mt-1 block">
            {formatCurrency(performanceStats.topPerformer.salesAchieved)} achieved
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="sales">Sort by Sales</option>
            <option value="achieved">Sort by Achieved</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const progress = Math.min((member.salesAchieved / member.salesTarget) * 100, 100);
          const performanceBadge = getPerformanceBadge(member.performance);
          const statusBadge = getStatusBadge(member.status);
          const isTopPerformer = member.performance === "excellent";

          return (
            <div 
              key={member.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
              onClick={() => handleViewMember(member)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg ${
                    isTopPerformer ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                  }`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                {isTopPerformer && (
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Target: {formatCurrency(member.salesTarget)}</span>
                  <span className="font-medium text-slate-700">{formatCurrency(member.salesAchieved)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`${getProgressColor(member.salesAchieved, member.salesTarget)} h-2 rounded-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Sales</p>
                  <p className="font-bold text-sm">{member.totalSales}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Revenue</p>
                  <p className="font-bold text-sm text-emerald-600">{formatCurrency(member.revenue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Rating</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-sm">{member.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${performanceBadge.color}`}>
                  {performanceBadge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No team members found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <h4 className="font-semibold text-sm text-indigo-800 flex items-center gap-2">
            <Target className="w-4 h-4" /> Set Targets
          </h4>
          <p className="text-xs text-indigo-700 mt-1">Update team sales targets</p>
          <button className="mt-2 text-xs text-indigo-700 font-medium hover:underline">Configure →</button>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <h4 className="font-semibold text-sm text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Approve Sales
          </h4>
          <p className="text-xs text-emerald-700 mt-1">Review pending approvals</p>
          <button className="mt-2 text-xs text-emerald-700 font-medium hover:underline">Review →</button>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-sm text-purple-800 flex items-center gap-2">
            <BarChart className="w-4 h-4" /> Generate Report
          </h4>
          <p className="text-xs text-purple-700 mt-1">Export team performance</p>
          <button className="mt-2 text-xs text-purple-700 font-medium hover:underline">Export →</button>
        </div>
      </div>
    </div>
  );
}