"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle,
  Box,
  DollarSign,
  Layers,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      const mockProducts: Product[] = [
        { id: "1", name: "iPhone 15 Pro", sku: "IP15-001", category: "Phones", price: 1200000, cost: 950000, stock: 45, min_stock: 10, status: 'active', created_at: "2024-01-15" },
        { id: "2", name: "Samsung Galaxy S24", sku: "SGS-001", category: "Phones", price: 850000, cost: 650000, stock: 8, min_stock: 15, status: 'active', created_at: "2024-02-20" },
        { id: "3", name: "AirPods Pro", sku: "APP-001", category: "Accessories", price: 350000, cost: 250000, stock: 5, min_stock: 10, status: 'active', created_at: "2024-03-10" },
        { id: "4", name: "MacBook Pro 16", sku: "MBP-001", category: "Laptops", price: 2500000, cost: 2000000, stock: 3, min_stock: 8, status: 'active', created_at: "2024-04-05" },
        { id: "5", name: "iPad Air", sku: "IPA-001", category: "Tablets", price: 450000, cost: 350000, stock: 6, min_stock: 12, status: 'active', created_at: "2024-05-12" },
        { id: "6", name: "Apple Watch Series 9", sku: "AWS-001", category: "Wearables", price: 380000, cost: 280000, stock: 4, min_stock: 10, status: 'active', created_at: "2024-06-01" },
        { id: "7", name: "Dell XPS 15", sku: "DXP-001", category: "Laptops", price: 1800000, cost: 1400000, stock: 0, min_stock: 5, status: 'discontinued', created_at: "2024-07-15" },
        { id: "8", name: "Samsung Galaxy Watch", sku: "SGW-001", category: "Wearables", price: 280000, cost: 200000, stock: 12, min_stock: 8, status: 'active', created_at: "2024-08-01" },
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800', label: 'Active' },
      'inactive': { color: 'bg-slate-100 text-slate-800', label: 'Inactive' },
      'discontinued': { color: 'bg-red-100 text-red-800', label: 'Discontinued' },
    };
    const { color, label } = config[status] || config.inactive;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStockBadge = (stock: number, min_stock: number) => {
    if (stock <= 0) return { color: 'bg-red-100 text-red-800', label: 'Out of Stock' };
    if (stock < min_stock) return { color: 'bg-amber-100 text-amber-800', label: 'Low Stock' };
    return { color: 'bg-emerald-100 text-emerald-800', label: 'In Stock' };
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================
      BACK BUTTON + HEADER
      ============================================ */}
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Products
          </h1>
          <p className="text-sm text-slate-500">Manage your product catalog.</p>
        </div>
      </div>

      {/* ============================================
      STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Products</p>
          <p className="text-2xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Low Stock</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">
            {products.filter(p => p.stock > 0 && p.stock < p.min_stock).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {products.filter(p => p.stock <= 0).length}
          </p>
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
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <Link href="/inventory/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* ============================================
      PRODUCTS TABLE
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Product</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Price</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((product) => {
                const stockStatus = getStockBadge(product.stock, product.min_stock);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">Added: {product.created_at}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{product.sku}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{product.stock} units</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/inventory/products/${product.id}`}>
                          <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                        </Link>
                        <Link href={`/inventory/products/${product.id}/edit`}>
                          <button className="p-1 hover:bg-amber-50 rounded transition-colors">
                            <Edit className="w-4 h-4 text-amber-500" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No products found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or add a new product</p>
          </div>
        )}

        {/* ============================================
        PAGINATION
        ============================================ */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
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