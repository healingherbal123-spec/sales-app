"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Box,
  Warehouse,
  Truck,
  Clock,
  DollarSign,
  ArrowLeft,
  Download,
  Activity,
  Layers,
  ShoppingBag,
} from "lucide-react";

interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingRequests: number;
  categories: number;
  stockTurnover: number;
}

interface RecentMovement {
  id: string;
  product: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  user: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  min_stock: number;
  reorder_qty: number;
  category: string;
}

export default function InventoryDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalProducts: 156,
        totalStock: 2430,
        totalValue: 18500000,
        lowStockItems: 8,
        outOfStockItems: 3,
        pendingRequests: 5,
        categories: 12,
        stockTurnover: 4.2,
      });

      setRecentMovements([
        { id: "1", product: "iPhone 15 Pro", type: 'in', quantity: 50, date: "Today", user: "Mike J.", status: 'completed' },
        { id: "2", product: "Samsung Galaxy S24", type: 'out', quantity: 12, date: "Today", user: "Sales Team", status: 'completed' },
        { id: "3", product: "AirPods Pro", type: 'in', quantity: 30, date: "Yesterday", user: "Admin", status: 'completed' },
        { id: "4", product: "MacBook Pro", type: 'out', quantity: 5, date: "Yesterday", user: "Sales Team", status: 'pending' },
        { id: "5", product: "iPad Air", type: 'in', quantity: 20, date: "2 days ago", user: "Supplier", status: 'completed' },
        { id: "6", product: "Apple Watch", type: 'adjustment', quantity: -3, date: "2 days ago", user: "Mike J.", status: 'cancelled' },
      ]);

      setLowStockItems([
        { id: "1", name: "Samsung Galaxy S24", sku: "SGS-001", stock: 8, min_stock: 15, reorder_qty: 20, category: "Phones" },
        { id: "2", name: "AirPods Pro", sku: "APP-001", stock: 5, min_stock: 10, reorder_qty: 15, category: "Accessories" },
        { id: "3", name: "MacBook Pro 16", sku: "MBP-001", stock: 3, min_stock: 8, reorder_qty: 10, category: "Laptops" },
        { id: "4", name: "iPad Air", sku: "IPA-001", stock: 6, min_stock: 12, reorder_qty: 15, category: "Tablets" },
        { id: "5", name: "Apple Watch Series 9", sku: "AWS-001", stock: 4, min_stock: 10, reorder_qty: 12, category: "Wearables" },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
  const formatNumber = (num: number) => num.toLocaleString();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'completed': { color: 'bg-emerald-100 text-emerald-800', label: 'Completed' },
      'pending': { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    const { color, label } = config[status] || config.completed;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getMovementIcon = (type: string) => {
    const config: Record<string, { icon: any, color: string }> = {
      'in': { icon: TrendingUp, color: 'text-emerald-500' },
      'out': { icon: TrendingDown, color: 'text-red-500' },
      'adjustment': { icon: RefreshCw, color: 'text-amber-500' },
    };
    const { icon: Icon, color } = config[type] || config.in;
    return <Icon className={`w-4 h-4 ${color}`} />;
  };

  const getMovementLabel = (type: string) => {
    const config: Record<string, string> = {
      'in': 'Stock In',
      'out': 'Stock Out',
      'adjustment': 'Adjustment',
    };
    return config[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading inventory...</p>
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
            <Package className="w-6 h-6 text-blue-600" />
            Inventory Dashboard
          </h1>
          <p className="text-sm text-slate-500">Manage your stock and inventory.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </Link>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync
          </button>
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
            <p className="text-xs font-medium text-slate-500">Total Products</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatNumber(stats?.totalProducts || 0)}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Active items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Stock</p>
            <Box className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatNumber(stats?.totalStock || 0)}</p>
          <span className="text-[10px] text-emerald-600 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +120 this week
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Low Stock</p>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{stats?.lowStockItems || 0}</p>
          <span className="text-[10px] text-amber-600 flex items-center mt-1">Need reorder</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Out of Stock</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{stats?.outOfStockItems || 0}</p>
          <span className="text-[10px] text-red-600 flex items-center mt-1">Critical</span>
        </div>
      </div>

      {/* ============================================
      SECONDARY STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-600">Inventory Value</p>
          <p className="text-xl font-bold text-blue-800">{formatCurrency(stats?.totalValue || 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-600">Categories</p>
          <p className="text-xl font-bold text-emerald-800">{stats?.categories || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
          <p className="text-xs text-purple-600">Stock Turnover</p>
          <p className="text-xl font-bold text-purple-800">{stats?.stockTurnover || 0}x</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-600">Pending Requests</p>
          <p className="text-xl font-bold text-amber-800">{stats?.pendingRequests || 0}</p>
        </div>
      </div>

      {/* ============================================
      QUICK ACTIONS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/inventory/products">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">All Products</p>
                <p className="text-xs text-slate-500">View catalog</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/inventory/low-stock">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Low Stock</p>
                <p className="text-xs text-slate-500">{stats?.lowStockItems || 0} items</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/inventory/movements">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <RefreshCw className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Movements</p>
                <p className="text-xs text-slate-500">Stock history</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/inventory/warehouses">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Warehouse className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Warehouses</p>
                <p className="text-xs text-slate-500">Manage locations</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ============================================
      LOW STOCK ALERT
      ============================================ */}
      {(stats?.lowStockItems || 0) > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Low Stock Alert: {stats?.lowStockItems} items need reordering
              </p>
              <p className="text-xs text-amber-700">
                {stats?.outOfStockItems} items are completely out of stock
              </p>
            </div>
            <Link href="/inventory/low-stock" className="ml-auto">
              <button className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-200/50 rounded-lg hover:bg-amber-200 transition-colors">
                View All
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ============================================
      RECENT MOVEMENTS
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm">Recent Stock Movements</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {recentMovements.length} movements
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {recentMovements.map((movement) => (
            <div key={movement.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  movement.type === 'in' ? 'bg-emerald-50' :
                  movement.type === 'out' ? 'bg-red-50' :
                  'bg-amber-50'
                }`}>
                  {getMovementIcon(movement.type)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{movement.product}</p>
                  <p className="text-xs text-slate-500">
                    {getMovementLabel(movement.type)} • {Math.abs(movement.quantity)} units • {movement.user}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  movement.type === 'in' ? 'bg-emerald-100 text-emerald-800' :
                  movement.type === 'out' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {getMovementLabel(movement.type)}
                </span>
                <span className="text-xs text-slate-500">{movement.date}</span>
                {getStatusBadge(movement.status)}
                <Link href={`/inventory/movements/${movement.id}`}>
                  <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {recentMovements.length === 0 && (
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No stock movements</p>
          </div>
        )}
      </div>

      {/* ============================================
      LOW STOCK PREVIEW
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Low Stock Items
          </h3>
          <Link href="/inventory/low-stock">
            <button className="text-xs text-blue-600 hover:underline">View All →</button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {lowStockItems.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">SKU: {item.sku} • {item.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">{item.stock} units</p>
                  <p className="text-xs text-slate-500">Min: {item.min_stock}</p>
                </div>
                <Link href={`/inventory/products/${item.id}`}>
                  <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {lowStockItems.length === 0 && (
          <div className="text-center py-4 text-sm text-slate-500">
            No low stock items
          </div>
        )}
      </div>
    </div>
  );
}