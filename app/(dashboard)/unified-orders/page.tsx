"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
  Package,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  X,
  MoreVertical,
  ChevronDown,
  Grid,
  List,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Printer,
  MessageSquare,
  FileText,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample unified orders data
const ordersData = [
  {
    id: 1,
    orderNumber: "ORD-001",
    type: "PRODUCT",
    customer: "Mary Johnson",
    phone: "08031234567",
    email: "mary.j@email.com",
    amount: 170000,
    items: [
      { name: "Menopause Reverser", quantity: 2, price: 85000 }
    ],
    status: "PENDING",
    paymentStatus: "PENDING_VERIFICATION",
    createdAt: "2024-08-13",
    deliveryStatus: "Pending"
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    type: "SERVICE",
    client: "John Adeyemi",
    phone: "08029876543",
    email: "john.a@email.com",
    amount: 25000,
    items: [
      { name: "Men's Haircut & Beard Trim", quantity: 1, price: 25000 }
    ],
    status: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: "2024-08-12",
    deliveryStatus: "N/A"
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    type: "MIXED",
    customer: "Chioma Nwosu",
    phone: "08034567890",
    email: "chioma.n@email.com",
    amount: 110000,
    items: [
      { name: "Skin Care Set", quantity: 1, price: 45000 },
      { name: "Makeup Session", quantity: 1, price: 65000 }
    ],
    status: "PROCESSING",
    paymentStatus: "PARTIAL",
    createdAt: "2024-08-11",
    deliveryStatus: "Processing"
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    type: "PRODUCT",
    customer: "James Brown",
    phone: "08045678901",
    email: "james.b@email.com",
    amount: 85000,
    items: [
      { name: "Hormone Balance", quantity: 1, price: 85000 }
    ],
    status: "DELIVERED",
    paymentStatus: "PAID",
    createdAt: "2024-08-10",
    deliveryStatus: "Delivered"
  },
  {
    id: 5,
    orderNumber: "ORD-005",
    type: "SERVICE",
    client: "Grace Okonkwo",
    phone: "08056789012",
    email: "grace.o@email.com",
    amount: 50000,
    items: [
      { name: "Bridal Makeup & Hair Package", quantity: 1, price: 50000 }
    ],
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: "2024-08-10",
    deliveryStatus: "N/A"
  },
  {
    id: 6,
    orderNumber: "ORD-006",
    type: "PRODUCT",
    customer: "Emeka Okafor",
    phone: "08067890123",
    email: "emeka.o@email.com",
    amount: 170000,
    items: [
      { name: "Weight Management", quantity: 2, price: 85000 }
    ],
    status: "PROCESSING",
    paymentStatus: "PAID",
    createdAt: "2024-08-09",
    deliveryStatus: "In Transit"
  },
  {
    id: 7,
    orderNumber: "ORD-007",
    type: "SERVICE",
    client: "Ngozi Obi",
    phone: "08078901234",
    email: "ngozi.o@email.com",
    amount: 150000,
    items: [
      { name: "Solo Acoustic Performance", quantity: 1, price: 150000 }
    ],
    status: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: "2024-08-08",
    deliveryStatus: "N/A"
  },
  {
    id: 8,
    orderNumber: "ORD-008",
    type: "MIXED",
    customer: "Tunde Balogun",
    phone: "08089012345",
    email: "tunde.b@email.com",
    amount: 200000,
    items: [
      { name: "Wellness Package", quantity: 1, price: 120000 },
      { name: "Personal Training Session", quantity: 1, price: 80000 }
    ],
    status: "PENDING",
    paymentStatus: "PENDING_VERIFICATION",
    createdAt: "2024-08-07",
    deliveryStatus: "Pending"
  }
];

// Type colors
const typeColors: Record<string, string> = {
  "PRODUCT": "bg-blue-100 text-blue-800 border-blue-200",
  "SERVICE": "bg-purple-100 text-purple-800 border-purple-200",
  "MIXED": "bg-amber-100 text-amber-800 border-amber-200"
};

// Status colors
const statusColors: Record<string, string> = {
  "PENDING": "bg-amber-100 text-amber-800 border-amber-200",
  "PROCESSING": "bg-blue-100 text-blue-800 border-blue-200",
  "DELIVERED": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "COMPLETED": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "CANCELLED": "bg-red-100 text-red-800 border-red-200"
};

const statusIcons: Record<string, any> = {
  "PENDING": Clock,
  "PROCESSING": RefreshCw,
  "DELIVERED": CheckCircle,
  "COMPLETED": CheckCircle,
  "CANCELLED": XCircle
};

const paymentStatusColors: Record<string, string> = {
  "PAID": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "PARTIAL": "bg-amber-100 text-amber-800 border-amber-200",
  "UNPAID": "bg-red-100 text-red-800 border-red-200",
  "PENDING_VERIFICATION": "bg-blue-100 text-blue-800 border-blue-200"
};

export default function UnifiedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewMode, setViewMode] = useState("list");
  const itemsPerPage = 5;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Stats
  const totalOrders = ordersData.length;
  const productOrders = ordersData.filter(o => o.type === "PRODUCT" || o.type === "MIXED");
  const serviceOrders = ordersData.filter(o => o.type === "SERVICE" || o.type === "MIXED");
  const totalRevenue = ordersData.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = ordersData.filter(o => o.status === "PENDING");

  // Filter orders
  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.client?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      order.phone?.includes(searchTerm);
    
    const matchesType = filterType === "All" || order.type === filterType;
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesPayment = filterPayment === "All" || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesType && matchesStatus && matchesPayment;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==================== BUTTON ACTIONS ====================

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleEditOrder = (order: any) => {
    showToast(`✏️ Editing ${order.orderNumber}`, "info");
  };

  const handleDeleteOrder = (order: any) => {
    if (confirm(`Delete ${order.orderNumber}?`)) {
      showToast(`🗑️ Deleted ${order.orderNumber}`, "error");
    }
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✅ Order created successfully!", "success");
    setShowAddModal(false);
  };

  const handleExport = () => {
    showToast("📥 Exporting orders...", "info");
    setTimeout(() => {
      showToast("✅ Orders exported!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterType("All");
    setFilterStatus("All");
    setFilterPayment("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  const handleMarkCompleted = (order: any) => {
    showToast(`✅ ${order.orderNumber} marked as COMPLETED`, "success");
  };

  const handleRecordPayment = (order: any) => {
    showToast(`💳 Recording payment for ${order.orderNumber}...`, "info");
    setTimeout(() => {
      showToast(`✅ Payment recorded for ${order.orderNumber}`, "success");
    }, 1000);
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
      {/* Toast Notification */}
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
            <ShoppingBag className="w-6 h-6 text-blue-500" />
            Unified Orders
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalOrders} orders
            </span>
          </h1>
          <p className="text-sm text-slate-500">Products & Services in one view</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            New Order
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Orders</p>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalOrders}</p>
          <p className="text-xs text-slate-500">All orders</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-slate-500">Total revenue</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => { setFilterStatus("PENDING"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{pendingOrders.length}</p>
          <p className="text-xs text-amber-600">Awaiting action</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-purple-400"
          onClick={() => { setFilterType("SERVICE"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Services</p>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-purple-600">{serviceOrders.length}</p>
          <p className="text-xs text-purple-600">Service bookings</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterType === "All" && filterStatus === "All" && filterPayment === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All Orders
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => { setFilterStatus("PENDING"); setCurrentPage(1); }}
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-emerald-300 text-emerald-700"
          onClick={() => { setFilterStatus("COMPLETED"); setCurrentPage(1); }}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-red-300 text-red-700"
          onClick={() => { setFilterPayment("UNPAID"); setCurrentPage(1); }}
        >
          <DollarSign className="w-3 h-3 mr-1" />
          Unpaid
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-blue-300 text-blue-700"
          onClick={() => { setFilterPayment("PENDING_VERIFICATION"); setCurrentPage(1); }}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending Verification
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order number, customer, or client..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="PRODUCT">📦 Products</option>
              <option value="SERVICE">💼 Services</option>
              <option value="MIXED">🔄 Mixed</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="PROCESSING">🔄 Processing</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="DELIVERED">📦 Delivered</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => {
                setFilterPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Payment</option>
              <option value="PAID">✅ Paid</option>
              <option value="PARTIAL">💰 Partial</option>
              <option value="UNPAID">❌ Unpaid</option>
              <option value="PENDING_VERIFICATION">⏳ Pending</option>
            </select>

            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table/Grid */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {order.orderNumber}
                        </span>
                        <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[order.type]}`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{order.customer || order.client}</p>
                        <p className="text-xs text-slate-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-xs block">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold">{formatCurrency(order.amount)}</span>
                        <p className="text-xs text-slate-400">{order.paymentStatus}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button 
                            onClick={() => handleViewOrder(order)}
                            className="p-1 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="p-1 hover:bg-amber-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-amber-500" />
                          </button>
                          {order.status !== "COMPLETED" && order.status !== "DELIVERED" && (
                            <button 
                              onClick={() => handleMarkCompleted(order)}
                              className="p-1 hover:bg-emerald-50 rounded"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </button>
                          )}
                          {order.paymentStatus !== "PAID" && (
                            <button 
                              onClick={() => handleRecordPayment(order)}
                              className="p-1 hover:bg-emerald-50 rounded"
                              title="Record Payment"
                            >
                              <DollarSign className="w-4 h-4 text-emerald-500" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteOrder(order)}
                            className="p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-slate-500 font-medium">No orders found</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Order
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > itemsPerPage && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredOrders.length}</span> orders
                {filteredOrders.length > 0 && (
                  <span className="ml-1">(Page {currentPage} of {totalPages})</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`text-xs ${currentPage === pageNum ? "bg-blue-600 text-white" : ""}`} onClick={() => handlePageClick(pageNum)}>
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" className="text-xs" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            return (
              <div key={order.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm">{order.orderNumber}</h3>
                    <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[order.type]}`}>
                    {order.type}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium">{order.customer || order.client}</p>
                  <p className="text-xs text-slate-400">{order.phone}</p>
                </div>

                <div className="mt-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-xs text-slate-600">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">{formatCurrency(order.amount)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <StatusIcon className="w-4 h-4" />
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => handleEditOrder(order)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Order Details - {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Customer/Client</p>
                  <p className="font-medium">{selectedOrder.customer || selectedOrder.client}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Type</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[selectedOrder.type]}`}>
                    {selectedOrder.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="font-bold">{formatCurrency(selectedOrder.amount)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Payment</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentStatusColors[selectedOrder.paymentStatus]}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Items</p>
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => { setShowDetailModal(false); handleEditOrder(selectedOrder); }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { setShowDetailModal(false); handleRecordPayment(selectedOrder); }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD ORDER MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                New Order
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Customer/Client *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input type="tel" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08012345678" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Order Type</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="PRODUCT">📦 Product</option>
                  <option value="SERVICE">💼 Service</option>
                  <option value="MIXED">🔄 Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Items</label>
                <textarea rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Item 1: Product Name x2 = ₦170,000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₦) *</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="UNPAID">❌ Unpaid</option>
                    <option value="PARTIAL">💰 Partial</option>
                    <option value="PAID">✅ Paid</option>
                    <option value="PENDING_VERIFICATION">⏳ Pending Verification</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}