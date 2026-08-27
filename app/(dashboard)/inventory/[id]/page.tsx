"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Warehouse,
  Plus,
  Search,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Users,
  Box,
  Building2,
} from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  total_items: number;
  total_products: number;
  capacity: number;
  used_capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
}

export default function WarehousesPage() {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      const mockWarehouses: Warehouse[] = [
        { id: "1", name: "Main Warehouse", location: "Lekki Phase 1, Lagos", manager: "Mike Johnson", total_items: 1200, total_products: 85, capacity: 2000, used_capacity: 60, status: 'active', created_at: "2024-01-15" },
        { id: "2", name: "Secondary Warehouse", location: "Surulere, Lagos", manager: "Sarah Williams", total_items: 800, total_products: 45, capacity: 1200, used_capacity: 67, status: 'active', created_at: "2024-02-20" },
        { id: "3", name: "Distribution Center", location: "Ikeja, Lagos", manager: "James Brown", total_items: 430, total_products: 26, capacity: 600, used_capacity: 72, status: 'active', created_at: "2024-03-10" },
      ];
      setWarehouses(mockWarehouses);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      'active': 'bg-emerald-100 text-emerald-800',
      'inactive': 'bg-slate-100 text-slate-800',
      'maintenance': 'bg-amber-100 text-amber-800',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${config[status] || config.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredWarehouses = warehouses.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
  const paginatedWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading warehouses...</p>
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
            <Warehouse className="w-6 h-6 text-blue-600" />
            Warehouses
          </h1>
          <p className="text-sm text-slate-500">Manage your warehouse locations.</p>
        </div>
      </div>

      {/* ============================================
      STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Warehouses</p>
          <p className="text-2xl font-bold mt-1">{warehouses.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">
            {warehouses.filter(w => w.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Items</p>
          <p className="text-2xl font-bold mt-1">
            {warehouses.reduce((sum, w) => sum + w.total_items, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Products</p>
          <p className="text-2xl font-bold mt-1">
            {warehouses.reduce((sum, w) => sum + w.total_products, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ============================================
      SEARCH & ADD
      ============================================ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* ============================================
      WAREHOUSES GRID
      ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedWarehouses.map((warehouse) => (
          <div key={warehouse.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{warehouse.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {warehouse.location}
                    </p>
                  </div>
                </div>
                {getStatusBadge(warehouse.status)}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-xs text-slate-500">Items</p>
                  <p className="font-bold">{warehouse.total_items}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-xs text-slate-500">Products</p>
                  <p className="font-bold">{warehouse.total_products}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Capacity</span>
                  <span>{warehouse.used_capacity}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      warehouse.used_capacity > 80 ? 'bg-red-500' :
                      warehouse.used_capacity > 60 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${warehouse.used_capacity}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Manager: {warehouse.manager}</p>
                <div className="flex gap-1">
                  <Link href={`/inventory/warehouses/${warehouse.id}`}>
                    <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                  </Link>
                  <Link href={`/inventory/warehouses/${warehouse.id}/edit`}>
                    <button className="p-1 hover:bg-amber-50 rounded transition-colors">
                      <Edit className="w-4 h-4 text-amber-500" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginatedWarehouses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Warehouse className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No warehouses found</p>
        </div>
      )}

      {/* ============================================
      PAGINATION
      ============================================ */}
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