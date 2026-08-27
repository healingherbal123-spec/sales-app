"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Grid,
  List,
  Layers,
  Warehouse,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample products data
const productsData = [
  {
    id: 1,
    name: "Menopause Reverser",
    sku: "MR-001",
    category: "Health",
    price: 85000,
    cost: 42000,
    description: "A comprehensive menopause relief supplement.",
    status: "Active",
    rating: 4.8,
    createdAt: "2024-06-15",
    salesCount: 142,
    stock: 34,
    minStock: 15,
    location: "Warehouse A, Shelf 3",
    inventoryStatus: "In Stock"
  },
  {
    id: 2,
    name: "Hormone Balance",
    sku: "HB-002",
    category: "Health",
    price: 45000,
    cost: 22000,
    description: "Natural hormone balancing formula.",
    status: "Active",
    rating: 4.5,
    createdAt: "2024-07-01",
    salesCount: 98,
    stock: 12,
    minStock: 10,
    location: "Warehouse A, Shelf 2",
    inventoryStatus: "Low Stock"
  }
];

// Category colors
const categoryColors: Record<string, string> = {
  "Health": "bg-blue-100 text-blue-800",
  "Wellness": "bg-emerald-100 text-emerald-800",
  "Beauty": "bg-pink-100 text-pink-800"
};

// Inventory status colors
const inventoryStatusColors: Record<string, string> = {
  "In Stock": "bg-emerald-100 text-emerald-800",
  "Low Stock": "bg-amber-100 text-amber-800",
  "Critical": "bg-red-100 text-red-800",
  "Out of Stock": "bg-slate-100 text-slate-800"
};

const inventoryStatusIcons: Record<string, any> = {
  "In Stock": CheckCircle,
  "Low Stock": AlertCircle,
  "Critical": AlertCircle,
  "Out of Stock": XCircle
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterInventory, setFilterInventory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const itemsPerPage = 9;

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = ["All", ...new Set(productsData.map(p => p.category))];

  const totalProducts = productsData.length;
  const activeProducts = productsData.filter(p => p.status === "Active");
  const totalStock = productsData.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = productsData.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockItems = productsData.filter(p => p.inventoryStatus === "Low Stock" || p.inventoryStatus === "Critical");
  const outOfStockItems = productsData.filter(p => p.inventoryStatus === "Out of Stock");

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    const matchesStatus = filterStatus === "All" || product.status === filterStatus;
    const matchesInventory = filterInventory === "All" || product.inventoryStatus === filterInventory;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesInventory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-slate-300" />
        ))}
        <span className="text-xs font-medium text-slate-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleExport = () => {
    showToast("📥 Exporting product data...", "info");
    setTimeout(() => {
      showToast("✅ Products exported!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterInventory("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  const handleDeleteProduct = (product: any) => {
    if (confirm(`Delete ${product.name}?`)) {
      showToast(`🗑️ Deleted ${product.name}`, "error");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
          toast.type === "success" ? "bg-emerald-500 text-white" :
          toast.type === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            Products
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalProducts} products
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/products/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Products</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalProducts}</p>
          <p className="text-xs text-slate-500">Active: {activeProducts.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400" onClick={() => setFilterStatus("Active")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{activeProducts.length}</p>
          <p className="text-xs text-emerald-600">Available</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-400" onClick={() => setFilterInventory("Low Stock")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Low Stock</p>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{lowStockItems.length}</p>
          <p className="text-xs text-amber-600">Need restock</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-red-400" onClick={() => setFilterInventory("Out of Stock")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Out of Stock</p>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{outOfStockItems.length}</p>
          <p className="text-xs text-red-600">Urgent</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Stock</p>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalStock} units</p>
          <p className="text-xs text-slate-500">Value: {formatCurrency(totalValue)}</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={handleReset}>All Products</Button>
        <Button variant="outline" size="sm" className="text-xs border-emerald-300 text-emerald-700" onClick={() => setFilterStatus("Active")}>
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700" onClick={() => setFilterInventory("Low Stock")}>
          <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
        </Button>
        {categories.filter(c => c !== "All").map((cat) => (
          <Button key={cat} variant="outline" size="sm" className="text-xs" onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}>
            {cat}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="All">All Status</option>
              <option value="Active">✅ Active</option>
              <option value="Inactive">⏳ Inactive</option>
            </select>
            <select value={filterInventory} onChange={(e) => { setFilterInventory(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="All">All Inventory</option>
              <option value="In Stock">✅ In Stock</option>
              <option value="Low Stock">⚠️ Low Stock</option>
              <option value="Critical">🔴 Critical</option>
              <option value="Out of Stock">📦 Out of Stock</option>
            </select>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((product) => {
          const InventoryIcon = inventoryStatusIcons[product.inventoryStatus] || CheckCircle;
          return (
            <div key={product.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group">
              <div className="relative h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-300" />
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${product.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
                  {product.status}
                </span>
                <span className={`absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${inventoryStatusColors[product.inventoryStatus]}`}>
                  <InventoryIcon className="w-3 h-3 inline mr-0.5" />
                  {product.inventoryStatus}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm">{product.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[product.category] || "bg-slate-100"}`}>
                  {product.category}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{product.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-slate-400">Cost: {formatCurrency(product.cost)}</p>
                </div>
                <div className="text-right">
                  {renderStars(product.rating)}
                  <p className="text-xs text-slate-400">{product.salesCount} sold</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Stock: <span className={`font-bold ${product.stock <= product.minStock ? "text-red-600" : "text-emerald-600"}`}>{product.stock}</span></span>
                <span className="flex items-center gap-1"><Warehouse className="w-3 h-3" /> {product.location}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                </Link>
                <Link href={`/products/${product.id}/edit`} className="flex-1">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                </Link>
                <button onClick={() => handleDeleteProduct(product)} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-slate-500 font-medium">No products found</p>
          <Link href="/products/add"><Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add First Product</Button></Link>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">Showing {currentItems.length} of {filteredProducts.length} products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`text-xs ${currentPage === pageNum ? "bg-blue-600 text-white" : ""}`} onClick={() => handlePageClick(pageNum)}>{pageNum}</Button>;
            })}
            <Button variant="outline" size="sm" className="text-xs" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}