"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  ShoppingBag,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  PieChart,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  LineChart,
  AreaChart,
  Target,
  Zap,
  Sparkles,
  Rocket,
  Globe,
  MapPin,
  Medal,
  Crown,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────
const monthlyData = [
  { month: 'Jan', revenue: 1800000, companies: 8, users: 45, orders: 85, growth: 5 },
  { month: 'Feb', revenue: 2100000, companies: 8, users: 48, orders: 92, growth: 8 },
  { month: 'Mar', revenue: 2300000, companies: 9, users: 52, orders: 98, growth: 12 },
  { month: 'Apr', revenue: 2000000, companies: 9, users: 56, orders: 95, growth: 4 },
  { month: 'May', revenue: 2500000, companies: 10, users: 62, orders: 105, growth: 15 },
  { month: 'Jun', revenue: 2800000, companies: 10, users: 68, orders: 115, growth: 18 },
  { month: 'Jul', revenue: 2900000, companies: 11, users: 72, orders: 120, growth: 20 },
  { month: 'Aug', revenue: 2700000, companies: 11, users: 76, orders: 118, growth: 16 },
  { month: 'Sep', revenue: 3000000, companies: 12, users: 80, orders: 125, growth: 22 },
  { month: 'Oct', revenue: 3200000, companies: 12, users: 82, orders: 130, growth: 25 },
  { month: 'Nov', revenue: 3400000, companies: 12, users: 84, orders: 135, growth: 28 },
  { month: 'Dec', revenue: 3600000, companies: 12, users: 86, orders: 140, growth: 30 },
];

const topCompanies = [
  { id: '1', name: 'Healthcare Solutions', revenue: 8900000, orders: 412, growth: 18, industry: 'Healthcare' },
  { id: '2', name: 'FinTech Solutions', revenue: 7200000, orders: 320, growth: 25, industry: 'Finance' },
  { id: '3', name: 'Tech Solutions Ltd', revenue: 5600000, orders: 245, growth: 12, industry: 'Technology' },
  { id: '4', name: 'Global Retail Corp', revenue: 3200000, orders: 178, growth: 8, industry: 'Retail' },
  { id: '5', name: 'Digital Marketing Pro', revenue: 2100000, orders: 98, growth: 15, industry: 'Marketing' },
];

const industryDistribution = [
  { name: 'Technology', percentage: 35, color: 'bg-blue-500' },
  { name: 'Finance', percentage: 25, color: 'bg-emerald-500' },
  { name: 'Healthcare', percentage: 20, color: 'bg-purple-500' },
  { name: 'Retail', percentage: 10, color: 'bg-amber-500' },
  { name: 'Other', percentage: 10, color: 'bg-slate-500' },
];

export default function OwnerAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/owner">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <BarChart className="w-6 h-6 text-[#635BFF]" />
            Platform Analytics
          </h1>
          <p className="text-sm text-[#737987] dark:text-gray-400">View platform-wide analytics and insights.</p>
        </div>
      </div>

      {/* Time Range */}
      <div className="flex flex-wrap gap-2">
        {['month', 'quarter', 'year', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 text-xs rounded-lg transition ${
              timeRange === range
                ? 'bg-[#635BFF] text-white'
                : 'bg-white dark:bg-[#1a1d27] text-[#737987] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
        <button className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1d27] text-[#737987] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
          <Download className="w-3 h-3" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">₦32.45M</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +23.5% growth
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Companies</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">12</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% growth
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">86</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.2% growth
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">1,234</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +15.8% growth
          </span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-6 border border-gray-100/50 dark:border-gray-800 shadow-sm">
        <h3 className="font-bold text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#635BFF]" />
          Monthly Performance
        </h3>
        <div className="space-y-4">
          {monthlyData.slice(-6).map((item, index) => {
            const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-[#171A24] dark:text-white">{item.month}</span>
                  <span className="text-[#737987]">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#635BFF] to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${height}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#737987] mt-0.5">
                  <span>{item.companies} companies</span>
                  <span>{item.users} users</span>
                  <span>{item.orders} orders</span>
                  <span className="text-emerald-600">+{item.growth}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Companies & Industry Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#171A24] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top Companies
            </h3>
            <Link href="/owner/companies">
              <button className="text-xs text-[#635BFF] hover:underline">View All →</button>
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topCompanies.map((company) => (
              <div key={company.id} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-[#171A24] dark:text-white">{company.name}</p>
                  <p className="text-xs text-[#737987]">{company.industry} • {company.orders} orders</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(company.revenue)}</p>
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {company.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 border border-gray-100/50 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-sm text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            Industry Distribution
          </h3>
          <div className="space-y-3">
            {industryDistribution.map((industry) => (
              <div key={industry.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#737987]">{industry.name}</span>
                  <span className="font-medium text-[#171A24] dark:text-white">{industry.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full ${industry.color}`}
                    style={{ width: `${industry.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 dark:bg-[#14171f] rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#737987]">Most Common Industry</span>
            <span className="font-medium text-[#171A24] dark:text-white">Technology (35%)</span>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-6 border border-gray-100/50 dark:border-gray-800 shadow-sm">
        <h3 className="font-bold text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#635BFF]" />
          Growth Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-[#14171f] p-4 rounded-lg text-center">
            <p className="text-xs text-[#737987]">Revenue Growth</p>
            <p className="text-2xl font-bold text-emerald-600">+23.5%</p>
            <span className="text-xs text-emerald-600">This year</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#14171f] p-4 rounded-lg text-center">
            <p className="text-xs text-[#737987]">User Growth</p>
            <p className="text-2xl font-bold text-emerald-600">+18.2%</p>
            <span className="text-xs text-emerald-600">This year</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#14171f] p-4 rounded-lg text-center">
            <p className="text-xs text-[#737987]">Company Growth</p>
            <p className="text-2xl font-bold text-emerald-600">+12.5%</p>
            <span className="text-xs text-emerald-600">This year</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#14171f] p-4 rounded-lg text-center">
            <p className="text-xs text-[#737987]">Order Growth</p>
            <p className="text-2xl font-bold text-emerald-600">+15.8%</p>
            <span className="text-xs text-emerald-600">This year</span>
          </div>
        </div>
      </div>
    </div>
  );
}