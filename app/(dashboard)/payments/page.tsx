"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  CreditCard,
  Banknote,
  Wallet,
  Calendar,
  Download,
  RefreshCw,
  Upload,
  X,
  FileText,
  Image,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Printer,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample payments data
const paymentsData = [
  {
    id: 1,
    orderNumber: "ORD-10482",
    customer: "Mary Johnson",
    phone: "08031234567",
    amount: 170000,
    method: "Bank Transfer",
    status: "Pending Verification",
    date: "2024-08-13",
    seller: "Sarah J.",
    evidence: "/uploads/receipt-10482.jpg",
    notes: "Payment screenshot uploaded"
  },
  {
    id: 2,
    orderNumber: "ORD-10481",
    customer: "James Brown",
    phone: "08029876543",
    amount: 85000,
    method: "POS",
    status: "Paid",
    date: "2024-08-12",
    seller: "David O.",
    evidence: "/uploads/receipt-10481.jpg",
    notes: "POS transaction confirmed"
  },
  {
    id: 3,
    orderNumber: "ORD-10480",
    customer: "Chioma Nwosu",
    phone: "08034567890",
    amount: 255000,
    method: "Bank Transfer",
    status: "Paid",
    date: "2024-08-12",
    seller: "Amara K.",
    evidence: "/uploads/receipt-10480.jpg",
    notes: "Transfer confirmed"
  },
  {
    id: 4,
    orderNumber: "ORD-10479",
    customer: "John Adeyemi",
    phone: "08045678901",
    amount: 45000,
    method: "Cash",
    status: "Unpaid",
    date: "2024-08-11",
    seller: "Sarah J.",
    evidence: null,
    notes: "Customer promised to pay tomorrow"
  },
  {
    id: 5,
    orderNumber: "ORD-10478",
    customer: "Grace Okonkwo",
    phone: "08056789012",
    amount: 85000,
    method: "Bank Transfer",
    status: "Paid",
    date: "2024-08-11",
    seller: "David O.",
    evidence: "/uploads/receipt-10478.jpg",
    notes: ""
  },
  {
    id: 6,
    orderNumber: "ORD-10477",
    customer: "Emeka Okafor",
    phone: "08067890123",
    amount: 170000,
    method: "POS",
    status: "Paid",
    date: "2024-08-10",
    seller: "Amara K.",
    evidence: "/uploads/receipt-10477.jpg",
    notes: "POS receipt uploaded"
  },
  {
    id: 7,
    orderNumber: "ORD-10476",
    customer: "Ngozi Obi",
    phone: "08078901234",
    amount: 255000,
    method: "Bank Transfer",
    status: "Pending Verification",
    date: "2024-08-10",
    seller: "Sarah J.",
    evidence: "/uploads/receipt-10476.jpg",
    notes: "Waiting for bank confirmation"
  },
  {
    id: 8,
    orderNumber: "ORD-10475",
    customer: "Tunde Balogun",
    phone: "08089012345",
    amount: 85000,
    method: "Cash",
    status: "Paid",
    date: "2024-08-09",
    seller: "David O.",
    evidence: null,
    notes: "Cash payment received"
  },
  {
    id: 9,
    orderNumber: "ORD-10474",
    customer: "Amina Mohammed",
    phone: "08090123456",
    amount: 120000,
    method: "Bank Transfer",
    status: "Unpaid",
    date: "2024-08-08",
    seller: "Sarah J.",
    evidence: null,
    notes: "Awaiting transfer"
  },
  {
    id: 10,
    orderNumber: "ORD-10473",
    customer: "Oluwaseun Ade",
    phone: "08012345678",
    amount: 95000,
    method: "POS",
    status: "Pending Verification",
    date: "2024-08-07",
    seller: "David O.",
    evidence: "/uploads/receipt-10473.jpg",
    notes: "POS receipt uploaded"
  }
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPendingReviewModal, setShowPendingReviewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate stats
  const totalPayments = paymentsData.length;
  const paidPayments = paymentsData.filter(p => p.status === "Paid");
  const pendingPayments = paymentsData.filter(p => p.status === "Pending Verification");
  const unpaidPayments = paymentsData.filter(p => p.status === "Unpaid");
  const totalAmount = paymentsData.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const unpaidAmount = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

  // Filter payments
  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch = 
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "All" || payment.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination - get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      showToast(`📄 Page ${currentPage - 1}`, "info");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      showToast(`📄 Page ${currentPage + 1}`, "info");
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    showToast(`📄 Page ${page}`, "info");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending Verification": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Unpaid": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "Pending Verification": return <Clock className="w-4 h-4 text-amber-500" />;
      case "Unpaid": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case "Bank Transfer": return <Banknote className="w-4 h-4 text-blue-500" />;
      case "POS": return <CreditCard className="w-4 h-4 text-purple-500" />;
      case "Cash": return <Wallet className="w-4 h-4 text-emerald-500" />;
      default: return <DollarSign className="w-4 h-4 text-slate-500" />;
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

  // 1. VIEW EVIDENCE
  const handleViewEvidence = (payment: any) => {
    setSelectedPayment(payment);
    setShowEvidenceModal(true);
  };

  // 2. VERIFY PAYMENT
  const handleVerifyPayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowVerifyModal(true);
  };

  // 3. CONFIRM VERIFY
  const handleConfirmVerify = () => {
    showToast(`✅ Payment for ${selectedPayment?.orderNumber} verified!`, "success");
    setShowVerifyModal(false);
  };

  // 4. UPLOAD EVIDENCE
  const handleUploadEvidence = (payment: any) => {
    setSelectedPayment(payment);
    setUploadFile(null);
    setUploadPreview(null);
    setShowUploadModal(true);
  };

  // 5. HANDLE FILE SELECTION
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 6. SUBMIT UPLOAD
  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast("⚠️ Please select a file to upload", "error");
      return;
    }
    showToast(`📤 Uploading evidence for ${selectedPayment?.orderNumber}...`, "info");
    setTimeout(() => {
      showToast(`✅ Evidence uploaded for ${selectedPayment?.orderNumber}!`, "success");
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadPreview(null);
    }, 1500);
  };

  // 7. EXPORT PAYMENTS
  const handleExport = () => {
    showToast("📥 Exporting payment data...", "info");
    setTimeout(() => {
      showToast("✅ Payments exported successfully!", "success");
    }, 1500);
  };

  // 8. RESET FILTERS
  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterMethod("All");
    setSelectedPeriod("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  // 9. CONTACT CUSTOMER
  const handleContactCustomer = (payment: any) => {
    showToast(`📱 WhatsApp message sent to ${payment.customer}`, "success");
  };

  // 10. PRINT PAYMENT
  const handlePrintPayment = (payment: any) => {
    showToast(`🖨️ Printing payment receipt for ${payment.orderNumber}`, "info");
    setTimeout(() => {
      showToast(`✅ Receipt sent to printer`, "success");
    }, 1000);
  };

  // 11. REJECT PAYMENT
  const handleRejectPayment = (payment: any) => {
    if (confirm(`Reject payment for ${payment.orderNumber}?`)) {
      showToast(`❌ Payment for ${payment.orderNumber} rejected`, "error");
    }
  };

  // 12. PENDING VERIFICATION - OPEN REVIEW MODAL (FIXED)
  const handlePendingVerification = () => {
    setShowPendingReviewModal(true);
  };

  // 13. UNPAID - FILTER UNPAID (FIXED)
  const handleUnpaidClick = () => {
    setFilterStatus("Unpaid");
    setCurrentPage(1);
    showToast("❌ Showing unpaid transactions", "info");
  };

  // 14. REVIEW ALL PENDING
  const handleReviewAll = () => {
    showToast("🔍 Reviewing all pending verifications...", "info");
    setTimeout(() => {
      showToast("✅ All pending verifications reviewed!", "success");
      setShowPendingReviewModal(false);
    }, 1500);
  };

  // 15. VERIFY ALL PENDING
  const handleVerifyAll = () => {
    showToast("✅ Verifying all pending payments...", "info");
    setTimeout(() => {
      showToast("✅ All pending payments verified!", "success");
      setShowPendingReviewModal(false);
    }, 1500);
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
            <CreditCard className="w-6 h-6 text-blue-500" />
            Payments
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalPayments} transactions
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage all payment transactions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Stats Grid - ALL CLICKABLE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-slate-500">All payments</p>
        </div>

        {/* PAID - Clickable */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => { setFilterStatus("Paid"); setCurrentPage(1); showToast("✅ Showing paid transactions", "info"); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Paid</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-slate-500">{paidPayments.length} transactions</p>
        </div>

        {/* PENDING VERIFICATION - Clickable (FIXED) */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={handlePendingVerification}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending Verification</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-amber-600">{pendingPayments.length} awaiting</p>
        </div>

        {/* UNPAID - Clickable (FIXED) */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-red-400"
          onClick={handleUnpaidClick}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Unpaid</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{formatCurrency(unpaidAmount)}</p>
          <p className="text-xs text-red-600">{unpaidPayments.length} outstanding</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, order, or seller..."
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
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Paid">✅ Paid</option>
              <option value="Pending Verification">⏳ Pending Verification</option>
              <option value="Unpaid">❌ Unpaid</option>
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
              <option value="Bank Transfer">🏦 Bank Transfer</option>
              <option value="POS">💳 POS</option>
              <option value="Cash">💰 Cash</option>
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/orders/${payment.orderNumber}`}>
                      <span className="font-mono text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        {payment.orderNumber}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{payment.customer}</p>
                      <p className="text-xs text-slate-400">{payment.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {formatDate(payment.date)}
                    <p className="text-xs text-slate-400">{payment.seller}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* View Evidence */}
                      {payment.evidence && (
                        <button 
                          onClick={() => handleViewEvidence(payment)}
                          className="p-1 hover:bg-blue-50 rounded transition-colors" 
                          title="View Evidence"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      )}

                      {/* Verify Payment */}
                      {payment.status === "Pending Verification" && (
                        <button 
                          onClick={() => handleVerifyPayment(payment)}
                          className="p-1 hover:bg-emerald-50 rounded transition-colors" 
                          title="Verify Payment"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}

                      {/* Upload Evidence */}
                      {!payment.evidence && (
                        <button 
                          onClick={() => handleUploadEvidence(payment)}
                          className="p-1 hover:bg-amber-50 rounded transition-colors" 
                          title="Upload Evidence"
                        >
                          <Upload className="w-4 h-4 text-amber-500" />
                        </button>
                      )}

                      {/* Reject Payment */}
                      {payment.status === "Pending Verification" && (
                        <button 
                          onClick={() => handleRejectPayment(payment)}
                          className="p-1 hover:bg-red-50 rounded transition-colors" 
                          title="Reject Payment"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      )}

                      {/* Contact Customer */}
                      <button 
                        onClick={() => handleContactCustomer(payment)}
                        className="p-1 hover:bg-purple-50 rounded transition-colors" 
                        title="Contact Customer"
                      >
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                      </button>

                      {/* Print */}
                      <button 
                        onClick={() => handlePrintPayment(payment)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors" 
                        title="Print"
                      >
                        <Printer className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💳</div>
            <p className="text-slate-500 font-medium">No payments found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Table Footer with Functional Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredPayments.length}</span> payments
            {filteredPayments.length > 0 && (
              <span className="ml-1">(Page {currentPage} of {totalPages})</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {/* PREVIOUS BUTTON - FUNCTIONAL */}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {/* PAGE NUMBERS - FUNCTIONAL */}
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
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${currentPage === pageNum ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {/* NEXT BUTTON - FUNCTIONAL */}
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
        {/* PAID SUMMARY - Clickable */}
        <div 
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => { setFilterStatus("Paid"); setCurrentPage(1); showToast("✅ Showing paid transactions", "info"); }}
        >
          <h3 className="font-semibold text-sm text-emerald-800">✅ Total Paid</h3>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-emerald-700">{paidPayments.length} transactions completed</p>
        </div>

        {/* PENDING SUMMARY - Clickable (FIXED) */}
        <div 
          className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handlePendingVerification}
        >
          <h3 className="font-semibold text-sm text-amber-800">⏳ Pending Verification</h3>
          <p className="text-2xl font-bold text-amber-900">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-amber-700">{pendingPayments.length} awaiting review</p>
        </div>

        {/* UNPAID SUMMARY - Clickable (FIXED) */}
        <div 
          className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleUnpaidClick}
        >
          <h3 className="font-semibold text-sm text-red-800">❌ Unpaid</h3>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(unpaidAmount)}</p>
          <p className="text-xs text-red-700">{unpaidPayments.length} outstanding</p>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* PENDING REVIEW MODAL - (FIXED) */}
      {showPendingReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Verifications
              </h3>
              <button onClick={() => setShowPendingReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-2xl font-bold text-amber-800">{pendingPayments.length}</p>
                <p className="text-sm text-amber-700">Payments awaiting review</p>
                <p className="text-xs text-amber-600">Total: {formatCurrency(pendingAmount)}</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{payment.orderNumber}</p>
                      <p className="text-xs text-slate-500">{payment.customer}</p>
                      <p className="text-xs text-slate-400">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatCurrency(payment.amount)}</span>
                      <br />
                      {payment.evidence ? (
                        <span className="text-xs text-emerald-600">✅ Evidence uploaded</span>
                      ) : (
                        <span className="text-xs text-red-500">⚠️ No evidence</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleReviewAll}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review All
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleVerifyAll}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify All
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPendingReviewModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Evidence Modal */}
      {showEvidenceModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-500" />
                Payment Evidence
              </h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{selectedPayment.orderNumber}</p>
                <p className="text-sm">{selectedPayment.customer}</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(selectedPayment.amount)}</p>
                <p className="text-xs text-slate-500">Method: {selectedPayment.method}</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Payment Evidence</p>
                <p className="text-xs text-slate-400">{selectedPayment.evidence}</p>
                <Button variant="outline" className="mt-3 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Full Image
                </Button>
              </div>
              {selectedPayment.notes && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-slate-500">Notes</p>
                  <p className="text-sm">{selectedPayment.notes}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => setShowEvidenceModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Payment Modal */}
      {showVerifyModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Verify Payment
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{selectedPayment.orderNumber}</p>
                <p className="text-sm">{selectedPayment.customer}</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(selectedPayment.amount)}</p>
                <p className="text-xs text-slate-500">Method: {selectedPayment.method}</p>
              </div>
              {selectedPayment.evidence ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 transition-colors">
                  <p className="text-sm text-slate-500">Payment evidence uploaded</p>
                  <p className="text-xs text-emerald-600">Click to view</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center bg-red-50">
                  <p className="text-sm text-red-600">⚠️ No evidence uploaded</p>
                </div>
              )}
              <p className="text-xs text-slate-500">Verify this payment matches bank records</p>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleConfirmVerify}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify & Clear
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowVerifyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {showUploadModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                Upload Payment Evidence
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitUpload} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{selectedPayment.orderNumber}</p>
                <p className="text-sm">{selectedPayment.customer}</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div 
                className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-amber-400"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadPreview ? (
                  <div className="space-y-2">
                    <img src={uploadPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm font-medium text-emerald-600">{uploadFile?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadFile(null);
                        setUploadPreview(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to upload payment evidence</p>
                    <p className="text-xs text-slate-400">PNG, JPG, PDF up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className={`flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors ${
                    uploadFile 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Upload Evidence
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}