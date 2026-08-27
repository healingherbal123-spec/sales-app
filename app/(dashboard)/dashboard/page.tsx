"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Briefcase,
  ChevronRight,
  BarChart,
  Activity,
  ArrowRight,
  Eye,
  Calendar,
  Bot,
  Layers,
  CreditCard,
  Receipt,
  UserPlus,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample unified orders data
const recentOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    type: "PRODUCT",
    customer: "Mary Johnson",
    amount: 170000,
    status: "PENDING",
    createdAt: "2024-08-13"
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    type: "SERVICE",
    client: "John Adeyemi",
    amount: 25000,
    status: "COMPLETED",
    createdAt: "2024-08-12"
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    type: "MIXED",
    customer: "Chioma Nwosu",
    amount: 110000,
    status: "PROCESSING",
    createdAt: "2024-08-11"
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    type: "PRODUCT",
    customer: "James Brown",
    amount: 85000,
    status: "DELIVERED",
    createdAt: "2024-08-10"
  },
  {
    id: 5,
    orderNumber: "ORD-005",
    type: "SERVICE",
    client: "Grace Okonkwo",
    amount: 50000,
    status: "PENDING",
    createdAt: "2024-08-10"
  }
];

const typeColors: Record<string, string> = {
  "PRODUCT": "bg-blue-100 text-blue-800",
  "SERVICE": "bg-purple-100 text-purple-800",
  "MIXED": "bg-amber-100 text-amber-800"
};

const statusColors: Record<string, string> = {
  "PENDING": "bg-amber-100 text-amber-800",
  "PROCESSING": "bg-blue-100 text-blue-800",
  "COMPLETED": "bg-emerald-100 text-emerald-800",
  "DELIVERED": "bg-emerald-100 text-emerald-800"
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stats
  const totalOrders = recentOrders.length;
  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = recentOrders.filter(o => o.status === "PENDING");
  const completedOrders = recentOrders.filter(o => o.status === "COMPLETED" || o.status === "DELIVERED");
  const productOrders = recentOrders.filter(o => o.type === "PRODUCT");
  const serviceOrders = recentOrders.filter(o => o.type === "SERVICE");

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2 text-slate-900">
            Good morning, Boss <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} — Unified Business Overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            AI Active (6 Agents)
          </span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-slate-900">{formatCurrency(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +14% vs yesterday
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Orders</p>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-slate-900">{totalOrders}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">All orders</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Products</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-slate-900">{productOrders.length}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">Physical items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Services</p>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-slate-900">{serviceOrders.length}</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-1 block">Service bookings</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-amber-600">{pendingOrders.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Awaiting action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl md:text-2xl font-extrabold mt-1 text-emerald-600">{completedOrders.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Done</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/unified-order">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-blue-800 flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  All Orders
                </h3>
                <p className="text-3xl font-bold text-blue-900 mt-1">{totalOrders}</p>
                <p className="text-xs text-blue-700">Products & Services</p>
              </div>
              <ArrowRight className="w-8 h-8 text-blue-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link href="/products">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-emerald-800 flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Products
                </h3>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{productOrders.length}</p>
                <p className="text-xs text-emerald-700">Manage catalog</p>
              </div>
              <Package className="w-8 h-8 text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
            </div>
          </div>
        </Link>

        <Link href="/services">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-purple-800 flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  Services
                </h3>
                <p className="text-3xl font-bold text-purple-900 mt-1">{serviceOrders.length}</p>
                <p className="text-xs text-purple-700">Manage services</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500 opacity-50 group-hover:opacity-100 transition-all" />
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Quick Actions Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/sales/new">
          <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-3 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <p className="text-xs font-medium text-cyan-800">💰 New Sale</p>
            <p className="text-lg font-bold text-cyan-900">+ Record</p>
          </div>
        </Link>
        <Link href="/customers">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-xl border border-pink-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <p className="text-xs font-medium text-pink-800">👥 Customers</p>
            <p className="text-lg font-bold text-pink-900">4,731</p>
          </div>
        </Link>
        <Link href="/inventory">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <p className="text-xs font-medium text-amber-800">📦 Inventory</p>
            <p className="text-lg font-bold text-amber-900">Low Stock</p>
          </div>
        </Link>
        <Link href="/payments">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <p className="text-xs font-medium text-emerald-800">💳 Payments</p>
            <p className="text-lg font-bold text-emerald-900">7 Pending</p>
          </div>
        </Link>
      </div>

      {/* Recent Unified Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-700">Recent Unified Orders</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Products & Services
            </span>
          </div>
          <Link href="/unified-order">
            <button className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 group">
              View All <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Customer/Client</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[order.type]}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-sm font-medium text-slate-900">{order.customer || order.client}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-slate-900">{formatCurrency(order.amount)}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link href={`/unified-order/${order.id}`}>
                      <button className="p-1 hover:bg-blue-50 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No orders yet</p>
          </div>
        )}

        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{Math.min(5, recentOrders.length)}</span> of <span className="font-medium">{recentOrders.length}</span> orders
          </p>
          <Link href="/unified-order">
            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900">
              <BarChart className="w-4 h-4 text-blue-500" />
              Business Overview
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
              <span className="text-slate-600">Products Revenue</span>
              <span className="font-bold text-blue-600">{formatCurrency(425000)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
              <span className="text-slate-600">Services Revenue</span>
              <span className="font-bold text-purple-600">{formatCurrency(210000)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
              <span className="text-slate-600">Total Customers</span>
              <span className="font-bold text-slate-700">24</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
              <span className="text-slate-600">Total Clients</span>
              <span className="font-bold text-slate-700">18</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900">
              <Activity className="w-4 h-4 text-cyan-500" />
              AI Workforce Activity
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3 p-2 border-l-2 border-blue-500 bg-slate-50/60 rounded-r-lg">
              <span className="text-slate-400 font-mono text-[10px] pt-0.5">10:46 AM</span>
              <div>
                <p className="font-semibold text-slate-700">Atlas (Delivery AI) negotiated waybill rate</p>
                <p className="text-slate-500 text-[11px]">Reduced fee from ₦5,000 to ₦3,500</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 border-l-2 border-emerald-500 bg-slate-50/60 rounded-r-lg">
              <span className="text-slate-400 font-mono text-[10px] pt-0.5">10:44 AM</span>
              <div>
                <p className="font-semibold text-slate-700">Mira (Inventory AI) issued reorder notice</p>
                <p className="text-slate-500 text-[11px]">Product A stock reached 10 units</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 border-l-2 border-amber-500 bg-slate-50/60 rounded-r-lg">
              <span className="text-slate-400 font-mono text-[10px] pt-0.5">10:30 AM</span>
              <div>
                <p className="font-semibold text-slate-700">Nova (Customer AI) sent follow-up emails</p>
                <p className="text-slate-500 text-[11px]">3 pending invoices reminder sent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
        <p>© 2024 AI SalesOS — Enterprise Sales Operating System</p>
        <p className="mt-1">All data is for demonstration purposes only</p>
      </div>
    </div>
  );
}