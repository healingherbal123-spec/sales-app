"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Bot,
  Users,
  Package,
  Truck,
  DollarSign,
  BarChart,
  PieChart,
  Activity,
  Zap,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'inventory' | 'delivery' | 'finance' | 'hr' | 'general';
  impact: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewed' | 'applied';
  date: string;
  agent: string;
  metrics: {
    label: string;
    value: string;
    change: number;
  }[];
}

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterImpact, setFilterImpact] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    setTimeout(() => {
      const mockInsights: Insight[] = [
        {
          id: "1",
          title: "Sales Growth Opportunity",
          description: "Customer Mary Johnson is 85% likely to purchase additional products based on purchase history. Recommended upsell: AirPods Pro.",
          type: 'sales',
          impact: 'high',
          status: 'new',
          date: "2024-08-13",
          agent: "Atlas",
          metrics: [
            { label: "Conversion Probability", value: "85%", change: 12 },
            { label: "Potential Revenue", value: "₦350,000", change: 0 },
          ],
        },
        {
          id: "2",
          title: "Inventory Reorder Alert",
          description: "Samsung Galaxy S24 stock is running low. Current stock: 8 units. Reorder quantity: 20 units recommended.",
          type: 'inventory',
          impact: 'high',
          status: 'new',
          date: "2024-08-13",
          agent: "Mira",
          metrics: [
            { label: "Current Stock", value: "8 units", change: -60 },
            { label: "Reorder Level", value: "15 units", change: 0 },
          ],
        },
        {
          id: "3",
          title: "Delivery Route Optimization",
          description: "Delivery routes can be optimized to save 15% on fuel costs. Suggested new route reduces distance by 2.3km.",
          type: 'delivery',
          impact: 'medium',
          status: 'reviewed',
          date: "2024-08-12",
          agent: "Nova",
          metrics: [
            { label: "Fuel Savings", value: "15%", change: 15 },
            { label: "Distance Reduction", value: "2.3km", change: 0 },
          ],
        },
        {
          id: "4",
          title: "Payment Fraud Detection",
          description: "Unusual payment pattern detected from customer John Adeyemi. Amount ₦25,000 doesn't match order history.",
          type: 'finance',
          impact: 'high',
          status: 'new',
          date: "2024-08-12",
          agent: "Kira",
          metrics: [
            { label: "Risk Score", value: "92%", change: 45 },
            { label: "Transaction Amount", value: "₦25,000", change: 0 },
          ],
        },
        {
          id: "5",
          title: "Staff Performance Improvement",
          description: "Employee David Brown's performance has dropped 5% this month. Sales training recommended.",
          type: 'hr',
          impact: 'medium',
          status: 'reviewed',
          date: "2024-08-11",
          agent: "Ella",
          metrics: [
            { label: "Performance Change", value: "-5%", change: -5 },
            { label: "Current Rating", value: "3.8/5", change: 0 },
          ],
        },
        {
          id: "6",
          title: "Customer Churn Risk",
          description: "Customer James Brown hasn't placed an order in 30 days. Engagement campaign recommended.",
          type: 'sales',
          impact: 'high',
          status: 'new',
          date: "2024-08-11",
          agent: "Atlas",
          metrics: [
            { label: "Churn Probability", value: "68%", change: 20 },
            { label: "Last Order", value: "30 days ago", change: 0 },
          ],
        },
        {
          id: "7",
          title: "Inventory Turnover Optimization",
          description: "iPhone 15 Pro has low turnover rate. Consider promotion or price adjustment.",
          type: 'inventory',
          impact: 'medium',
          status: 'applied',
          date: "2024-08-10",
          agent: "Mira",
          metrics: [
            { label: "Turnover Rate", value: "2.1x", change: -15 },
            { label: "Current Stock", value: "45 units", change: 0 },
          ],
        },
        {
          id: "8",
          title: "Delivery Time Improvement",
          description: "Average delivery time can be reduced by 20% by optimizing driver assignment based on proximity.",
          type: 'delivery',
          impact: 'medium',
          status: 'reviewed',
          date: "2024-08-10",
          agent: "Nova",
          metrics: [
            { label: "Time Savings", value: "20%", change: 20 },
            { label: "Avg Delivery Time", value: "2.3 hrs", change: 0 },
          ],
        },
      ];
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeBadge = (type: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'sales': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, label: 'Sales' },
      'inventory': { color: 'bg-emerald-100 text-emerald-800', icon: Package, label: 'Inventory' },
      'delivery': { color: 'bg-amber-100 text-amber-800', icon: Truck, label: 'Delivery' },
      'finance': { color: 'bg-purple-100 text-purple-800', icon: DollarSign, label: 'Finance' },
      'hr': { color: 'bg-pink-100 text-pink-800', icon: Users, label: 'HR' },
      'general': { color: 'bg-slate-100 text-slate-800', icon: Brain, label: 'General' },
    };
    const { color, icon: Icon, label } = config[type] || config.general;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getImpactBadge = (impact: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'high': { color: 'bg-red-100 text-red-800', label: '🔴 High' },
      'medium': { color: 'bg-amber-100 text-amber-800', label: '🟡 Medium' },
      'low': { color: 'bg-blue-100 text-blue-800', label: '🔵 Low' },
    };
    const { color, label } = config[impact] || config.medium;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'new': { color: 'bg-blue-100 text-blue-800', icon: Sparkles, label: 'New' },
      'reviewed': { color: 'bg-amber-100 text-amber-800', icon: Eye, label: 'Reviewed' },
      'applied': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Applied' },
    };
    const { color, icon: Icon, label } = config[status] || config.new;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const filteredInsights = insights.filter(i => {
    const matchesType = filterType === 'all' || i.type === filterType;
    const matchesImpact = filterImpact === 'all' || i.impact === filterImpact;
    return matchesType && matchesImpact;
  });

  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const paginatedInsights = filteredInsights.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading AI insights...</p>
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
            <Brain className="w-6 h-6 text-purple-600" />
            AI Insights
          </h1>
          <p className="text-sm text-slate-500">Intelligent insights from your AI workforce.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Insights</p>
          <p className="text-2xl font-bold mt-1">{insights.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">New</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {insights.filter(i => i.status === 'new').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">High Impact</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {insights.filter(i => i.impact === 'high').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Applied</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">
            {insights.filter(i => i.status === 'applied').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Types</option>
            <option value="sales">Sales</option>
            <option value="inventory">Inventory</option>
            <option value="delivery">Delivery</option>
            <option value="finance">Finance</option>
            <option value="hr">HR</option>
            <option value="general">General</option>
          </select>
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedInsights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  {getTypeBadge(insight.type)}
                </div>
                {getStatusBadge(insight.status)}
              </div>

              <h3 className="font-semibold text-slate-900 mt-3">{insight.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{insight.description}</p>

              <div className="mt-3 flex items-center gap-2">
                <Bot className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{insight.agent}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">{insight.date}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {getImpactBadge(insight.impact)}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                {insight.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-slate-500">{metric.label}</p>
                    <p className="font-semibold text-slate-900">{metric.value}</p>
                    {metric.change !== 0 && (
                      <span className={`text-[10px] ${metric.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {insight.status === 'new' && (
                  <>
                    <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors">
                      Review
                    </button>
                    <button className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                      Dismiss
                    </button>
                  </>
                )}
                {insight.status === 'reviewed' && (
                  <button className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-colors">
                    Apply Insight
                  </button>
                )}
                {insight.status === 'applied' && (
                  <button className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs cursor-default">
                    Applied ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginatedInsights.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Brain className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No insights found</p>
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
    </div>
  );
}