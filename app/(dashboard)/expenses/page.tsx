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
  Receipt,
  DollarSign,
  CreditCard,
  Wallet,
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  FileText,
  Truck,
  Fuel,
  Package,
  Box,
  Building,
  Users,
  Coffee,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  ChevronDown,
  PiggyBank,
  Landmark,
  Briefcase,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Zap,
  Droplets,
  Flame,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample expenses data
const expensesData = [
  {
    id: 1,
    description: "Delivery fee - James (WB-10482)",
    category: "Delivery",
    amount: 3500,
    date: "2024-08-13",
    paymentMethod: "Cash",
    status: "Paid",
    userId: "Sarah J.",
    orderId: "ORD-10482",
    deliveryId: "WB-10482",
    receipt: "/uploads/receipt-1.jpg",
    notes: "Delivery to Ikeja"
  },
  {
    id: 2,
    description: "Fuel - Dispatch Vehicle",
    category: "Transport",
    amount: 15000,
    date: "2024-08-12",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-2.jpg",
    notes: "Full tank for delivery vehicle"
  },
  {
    id: 3,
    description: "Production - Menopause Reverser Batch",
    category: "Production",
    amount: 250000,
    date: "2024-08-12",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    userId: "Production",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-3.jpg",
    notes: "Raw materials for next batch"
  },
  {
    id: 4,
    description: "Packaging Materials",
    category: "Packaging",
    amount: 45000,
    date: "2024-08-11",
    paymentMethod: "POS",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-4.jpg",
    notes: "Boxes, labels, and tape"
  },
  {
    id: 5,
    description: "Office Rent - August",
    category: "Office",
    amount: 300000,
    date: "2024-08-10",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-5.jpg",
    notes: "Monthly rent payment"
  },
  {
    id: 6,
    description: "Marketing - Social Media Ads",
    category: "Marketing",
    amount: 50000,
    date: "2024-08-09",
    paymentMethod: "Bank Transfer",
    status: "Pending",
    userId: "Marketing",
    orderId: null,
    deliveryId: null,
    receipt: null,
    notes: "Facebook and Instagram ads"
  },
  {
    id: 7,
    description: "Staff Salaries - August",
    category: "Salary",
    amount: 850000,
    date: "2024-08-08",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-7.jpg",
    notes: "Monthly salaries for team"
  },
  {
    id: 8,
    description: "Delivery fee - Grace (WB-10478)",
    category: "Delivery",
    amount: 5000,
    date: "2024-08-11",
    paymentMethod: "Cash",
    status: "Paid",
    userId: "David O.",
    orderId: "ORD-10478",
    deliveryId: "WB-10478",
    receipt: null,
    notes: "Delivery to Enugu"
  },
  {
    id: 9,
    description: "Internet & Phone Bills",
    category: "Office",
    amount: 25000,
    date: "2024-08-07",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-9.jpg",
    notes: "Monthly internet and phone"
  },
  {
    id: 10,
    description: "Production - Hormone Balance",
    category: "Production",
    amount: 180000,
    date: "2024-08-06",
    paymentMethod: "Bank Transfer",
    status: "Pending Verification",
    userId: "Production",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-10.jpg",
    notes: "Raw materials for Hormone Balance"
  },
  {
    id: 11,
    description: "Electricity Bill",
    category: "Office",
    amount: 35000,
    date: "2024-08-05",
    paymentMethod: "POS",
    status: "Paid",
    userId: "Admin",
    orderId: null,
    deliveryId: null,
    receipt: "/uploads/receipt-11.jpg",
    notes: "Monthly electricity"
  },
  {
    id: 12,
    description: "Delivery fee - John (WB-10480)",
    category: "Delivery",
    amount: 4000,
    date: "2024-08-12",
    paymentMethod: "Cash",
    status: "Paid",
    userId: "Amara K.",
    orderId: "ORD-10480",
    deliveryId: "WB-10480",
    receipt: null,
    notes: "Delivery to Surulere"
  }
];

// Category icons mapping
const categoryIcons: Record<string, any> = {
  "Delivery": Truck,
  "Transport": Car,
  "Fuel": Flame,
  "Production": Package,
  "Packaging": Box,
  "Marketing": TrendingUp,
  "Office": Building,
  "Salary": Users,
  "Other": MoreVertical
};

// Category colors
const categoryColors: Record<string, string> = {
  "Delivery": "bg-blue-100 text-blue-800 border-blue-200",
  "Transport": "bg-amber-100 text-amber-800 border-amber-200",
  "Fuel": "bg-orange-100 text-orange-800 border-orange-200",
  "Production": "bg-purple-100 text-purple-800 border-purple-200",
  "Packaging": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Marketing": "bg-pink-100 text-pink-800 border-pink-200",
  "Office": "bg-slate-100 text-slate-800 border-slate-200",
  "Salary": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Other": "bg-slate-100 text-slate-800 border-slate-200"
};

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const itemsPerPage = 5;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get unique categories
  const categories = ["All",...new Set(expensesData.map(e => e.category))];

  // Calculate stats
  const totalExpenses = expensesData.length;
  const totalAmount = expensesData.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = expensesData.filter(e => e.status === "Paid");
  const pendingExpenses = expensesData.filter(e => e.status === "Pending");
  const pendingVerification = expensesData.filter(e => e.status === "Pending Verification");
  const paidAmount = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Filter expenses
  const filteredExpenses = expensesData.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.orderId && expense.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === "All" || expense.category === filterCategory;
    const matchesStatus = filterStatus === "All" || expense.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pending Verification": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "Pending Verification": return <Clock className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

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

  // ==================== BUTTON ACTIONS ====================

  const handleViewReceipt = (expense: any) => {
    setSelectedExpense(expense);
    setShowReceiptModal(true);
  };

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleDeleteExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      showToast(`🗑️ Deleted: ${selectedExpense.description}`, "error");
      setShowDeleteConfirm(false);
      setSelectedExpense(null);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✅ Expense added successfully!", "success");
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ ${selectedExpense?.description} updated!`, "success");
    setShowEditModal(false);
  };

  const handleExport = () => {
    showToast("📥 Exporting expense data...", "info");
    setTimeout(() => {
      showToast("✅ Expenses exported successfully!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterStatus("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  const handleFilterByStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    showToast(`📋 Showing ${status} expenses`, "info");
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

  const handleVerifyExpense = (expense: any) => {
    showToast(`🔍 Verifying ${expense.description}...`, "info");
    setTimeout(() => {
      showToast(`✅ ${expense.description} verified!`, "success");
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
          toast.type === "success"? "bg-emerald-500 text-white" :
          toast.type === "error"? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <X className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-500" />
            Expenses
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalExpenses} expenses
            </span>
          </h1>
          <p className="text-sm text-slate-500">Track all company expenses</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Expense
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

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Expenses</p>
            <Receipt className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-slate-500">{totalExpenses} transactions</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => handleFilterByStatus("Paid")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Paid</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-emerald-600">{paidExpenses.length} paid</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => handleFilterByStatus("Pending")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-amber-600">{pendingExpenses.length} pending</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400"
          onClick={() => handleFilterByStatus("Pending Verification")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending Verification</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-blue-600">{pendingVerification.length}</p>
          <p className="text-xs text-blue-600">Need approval</p>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${filterCategory === "All" && filterStatus === "All"? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All Expenses
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-emerald-300 text-emerald-700"
          onClick={() => handleFilterByStatus("Paid")}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => handleFilterByStatus("Pending")}
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-blue-300 text-blue-700"
          onClick={() => handleFilterByStatus("Pending Verification")}
        >
          <Clock className="w-3 h-3 mr-1" />
          Verify
        </Button>
        {["Delivery", "Office", "Production", "Salary", "Marketing"].map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => { setFilterCategory(cat); setCurrentPage(1); showToast(`📋 Showing ${cat} expenses`, "info"); }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by description, category, or user..."
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
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
              <option value="Paid">✅ Paid</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Pending Verification">🔍 Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((expense) => {
                const Icon = categoryIcons[expense.category] || Receipt;
                return (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{expense.description}</p>
                        <p className="text-xs text-slate-400">{expense.userId}</p>
                        {expense.orderId && (
                          <p className="text-xs text-blue-600">Order: {expense.orderId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[expense.category] || "bg-slate-100"}`}>
                          {expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(expense.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(expense.date)}
                      <p className="text-xs text-slate-400">{expense.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {expense.receipt && (
                          <button
                            onClick={() => handleViewReceipt(expense)}
                            className="p-1 hover:bg-blue-50 rounded transition-colors"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1 hover:bg-amber-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-amber-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense)}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        {expense.status === "Pending Verification" && (
                          <button
                            onClick={() => handleVerifyExpense(expense)}
                            className="p-1 hover:bg-emerald-50 rounded transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button
                          onClick={() => showToast(`🖨️ Printing receipt...`, "info")}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                          title="Print"
                        >
                          <Printer className="w-4 h-4 text-slate-500" />
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
            <div className="text-5xl mb-3">💰</div>
            <p className="text-slate-500 font-medium">No expenses found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Expense
            </Button>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredExpenses.length}</span> expenses
            {filteredExpenses.length > 0 && (
              <span className="ml-1">(Page {currentPage} of {totalPages})</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${currentPage === pageNum? "bg-blue-600 text-white" : ""}`}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <h3 className="font-semibold text-sm text-emerald-800">✅ Paid</h3>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-emerald-700">{paidExpenses.length} transactions completed</p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-sm text-amber-800">⏳ Pending</h3>
          <p className="text-2xl font-bold text-amber-900">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-amber-700">{pendingExpenses.length} awaiting payment</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-sm text-blue-800">🔍 Verification</h3>
          <p className="text-2xl font-bold text-blue-900">{pendingVerification.length}</p>
          <p className="text-xs text-blue-700">Need approval</p>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Add Expense
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter expense description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Delivery">🚚 Delivery</option>
                    <option value="Transport">🚗 Transport</option>
                    <option value="Fuel">⛽ Fuel</option>
                    <option value="Production">📦 Production</option>
                    <option value="Packaging">📦 Packaging</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Office">🏢 Office</option>
                    <option value="Salary">💰 Salary</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₦) *</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="POS">POS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Paid">✅ Paid</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Pending Verification">🔍 Pending Verification</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Additional notes..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Expense
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <input type="text" required defaultValue={selectedExpense.description} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select defaultValue={selectedExpense.category} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Delivery">🚚 Delivery</option>
                    <option value="Transport">🚗 Transport</option>
                    <option value="Fuel">⛽ Fuel</option>
                    <option value="Production">📦 Production</option>
                    <option value="Packaging">📦 Packaging</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Office">🏢 Office</option>
                    <option value="Salary">💰 Salary</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₦)</label>
                  <input type="number" defaultValue={selectedExpense.amount} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select defaultValue={selectedExpense.status} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Paid">✅ Paid</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Pending Verification">🔍 Pending Verification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                  <input type="text" defaultValue={selectedExpense.notes || ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Delete Expense</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold">{selectedExpense.description}</span>?
                <br />
                <span className="text-xs text-red-500">This action cannot be undone.</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {showReceiptModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Receipt Preview
              </h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{selectedExpense.description}</p>
                <p className="text-sm">Amount: <span className="font-bold">{formatCurrency(selectedExpense.amount)}</span></p>
                <p className="text-sm">Date: {formatDate(selectedExpense.date)}</p>
                <p className="text-sm">Category: {selectedExpense.category}</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Receipt Image</p>
                <p className="text-xs text-slate-400">{selectedExpense.receipt}</p>
                <Button variant="outline" className="mt-3 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Full Image
                </Button>
              </div>
              {selectedExpense.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">📝 Notes</p>
                  <p className="text-sm text-amber-700">{selectedExpense.notes}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => setShowReceiptModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}