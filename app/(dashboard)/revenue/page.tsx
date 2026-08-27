"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  CreditCard,
  Banknote,
  Wallet,
  PieChart,
  BarChart,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  X,
  Printer,
  FileText,
  ChevronDown,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample revenue data
const revenueData = [
  { id: 1, source: "Men's Haircut & Beard Trim", amount: 5000, date: "2024-08-13", method: "Cash", status: "completed" },
  { id: 2, source: "Women's Haircut & Blow Dry", amount: 10000, date: "2024-08-12", method: "Bank Transfer", status: "completed" },
  { id: 3, source: "Hair Color & Highlights", amount: 15000, date: "2024-08-12", method: "POS", status: "completed" },
  { id: 4, source: "Bridal Makeup & Hair Package", amount: 0, date: "2024-08-14", method: "-", status: "pending" },
  { id: 5, source: "Nail Art & Manicure", amount: 8000, date: "2024-08-11", method: "Mobile Money", status: "completed" },
  { id: 6, source: "Live Band Performance", amount: 150000, date: "2024-08-15", method: "Bank Transfer", status: "partial" },
  { id: 7, source: "Solo Acoustic Performance", amount: 150000, date: "2024-08-10", method: "Cash", status: "completed" },
  { id: 8, source: "Home Care Nursing", amount: 25000, date: "2024-08-14", method: "Bank Transfer", status: "completed" },
  { id: 9, source: "Personal Training Session", amount: 15000, date: "2024-08-13", method: "POS", status: "completed" },
];

export default function RevenuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
  const completedRevenue = revenueData.filter(r => r.status === "completed").reduce((sum, r) => sum + r.amount, 0);
  const pendingRevenue = revenueData.filter(r => r.status === "pending" || r.status === "partial").reduce((sum, r) => sum + r.amount, 0);
  const totalTransactions = revenueData.length;

  const filteredRevenue = revenueData.filter((item) => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesMethod = filterMethod === "All" || item.method === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRevenue.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRevenue.length / itemsPerPage);

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

  const handleExport = () => {
    showToast("📥 Exporting revenue data...", "info");
    setTimeout(() => {
      showToast("✅ Revenue data exported!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterMethod("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
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
      {/* Toast */}
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
            <DollarSign className="w-6 h-6 text-emerald-500" />
            Revenue
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalTransactions} transactions
            </span>
          </h1>
          <p className="text-sm text-slate-500">Track all income and payments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-slate-500">All time</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Collected</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{formatCurrency(completedRevenue)}</p>
          <p className="text-xs text-emerald-600">Completed payments</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(pendingRevenue)}</p>
          <p className="text-xs text-amber-600">Awaiting payment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Transactions</p>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalTransactions}</p>
          <p className="text-xs text-slate-500">Total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by service or client..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="completed">✅ Completed</option>
              <option value="partial">💰 Partial</option>
              <option value="pending">⏳ Pending</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => {
                setFilterMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="POS">POS</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service/Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{item.source}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${item.amount > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                      {item.amount > 0 ? formatCurrency(item.amount) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-sm">{item.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                      item.status === "partial" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-slate-500 font-medium">No revenue data found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredRevenue.length > itemsPerPage && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Showing {currentItems.length} of {filteredRevenue.length} transactions</p>
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
    </div>
  );
}