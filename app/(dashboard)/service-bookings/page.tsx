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
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  Users,
  Briefcase,
  Download,
  RefreshCw,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Printer,
  MessageSquare,
  MoreVertical,
  ChevronDown,
  Grid,
  List,
  FileText,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample booking data
const bookingsData = [
  {
    id: 1,
    bookingNumber: "BK-001",
    service: "Men's Haircut & Beard Trim",
    client: "John Adeyemi",
    clientPhone: "08031234567",
    clientEmail: "john.a@email.com",
    date: "2024-08-13T10:30:00",
    amount: 5000,
    paid: 5000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "CASH",
    notes: "Regular customer, requested extra beard trim",
    feedback: "Excellent service, very professional",
    rating: 5,
    createdAt: "2024-08-10"
  },
  {
    id: 2,
    bookingNumber: "BK-002",
    service: "Women's Haircut & Blow Dry",
    client: "Mary Johnson",
    clientPhone: "08029876543",
    clientEmail: "mary.j@email.com",
    date: "2024-08-12T14:00:00",
    amount: 10000,
    paid: 10000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "BANK_TRANSFER",
    notes: "Bridal trial session",
    feedback: "Amazing work, loved the style",
    rating: 5,
    createdAt: "2024-08-09"
  },
  {
    id: 3,
    bookingNumber: "BK-003",
    service: "Hair Color & Highlights",
    client: "Chioma Nwosu",
    clientPhone: "08034567890",
    clientEmail: "chioma.n@email.com",
    date: "2024-08-12T16:00:00",
    amount: 25000,
    paid: 15000,
    balance: 10000,
    status: "COMPLETED",
    paymentStatus: "PARTIAL",
    paymentMethod: "POS",
    notes: "Balayage highlights, partial payment",
    feedback: "Color turned out perfect!",
    rating: 4,
    createdAt: "2024-08-08"
  },
  {
    id: 4,
    bookingNumber: "BK-004",
    service: "Bridal Makeup & Hair Package",
    client: "Grace Okonkwo",
    clientPhone: "08056789012",
    clientEmail: "grace.o@email.com",
    date: "2024-08-14T08:00:00",
    amount: 50000,
    paid: 0,
    balance: 50000,
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: null,
    notes: "Bridal package for Saturday wedding",
    feedback: null,
    rating: null,
    createdAt: "2024-08-07"
  },
  {
    id: 5,
    bookingNumber: "BK-005",
    service: "Nail Art & Manicure",
    client: "Emeka Okafor",
    clientPhone: "08067890123",
    clientEmail: "emeka.o@email.com",
    date: "2024-08-11T11:00:00",
    amount: 8000,
    paid: 8000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "MOBILE_MONEY",
    notes: "First time client",
    feedback: "Loved the design!",
    rating: 4,
    createdAt: "2024-08-05"
  },
  {
    id: 6,
    bookingNumber: "BK-006",
    service: "Live Band Performance",
    client: "Tunde Balogun",
    clientPhone: "08078901234",
    clientEmail: "tunde.b@email.com",
    date: "2024-08-15T18:00:00",
    amount: 350000,
    paid: 150000,
    balance: 200000,
    status: "CONFIRMED",
    paymentStatus: "PARTIAL",
    paymentMethod: "BANK_TRANSFER",
    notes: "Wedding event, balance due on day",
    feedback: null,
    rating: null,
    createdAt: "2024-08-01"
  },
  {
    id: 7,
    bookingNumber: "BK-007",
    service: "Solo Acoustic Performance",
    client: "Ngozi Obi",
    clientPhone: "08089012345",
    clientEmail: "ngozi.o@email.com",
    date: "2024-08-10T20:00:00",
    amount: 150000,
    paid: 150000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "CASH",
    notes: "Corporate event, excellent feedback",
    feedback: "The performance was outstanding!",
    rating: 5,
    createdAt: "2024-07-28"
  },
  {
    id: 8,
    bookingNumber: "BK-008",
    service: "Home Care Nursing",
    client: "James Brown",
    clientPhone: "08090123456",
    clientEmail: "james.b@email.com",
    date: "2024-08-14T09:00:00",
    amount: 25000,
    paid: 25000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "BANK_TRANSFER",
    notes: "Post-surgery care, 4-hour session",
    feedback: "Very professional and caring",
    rating: 5,
    createdAt: "2024-08-08"
  },
  {
    id: 9,
    bookingNumber: "BK-009",
    service: "Personal Training Session",
    client: "Amara Kalu",
    clientPhone: "08001234567",
    clientEmail: "amara.k@email.com",
    date: "2024-08-13T07:00:00",
    amount: 15000,
    paid: 15000,
    balance: 0,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "POS",
    notes: "Early morning session",
    feedback: "Great workout session!",
    rating: 4,
    createdAt: "2024-08-06"
  }
];

// Status colors
const statusColors: Record<string, string> = {
  "PENDING": "bg-amber-100 text-amber-800 border-amber-200",
  "CONFIRMED": "bg-blue-100 text-blue-800 border-blue-200",
  "IN_PROGRESS": "bg-purple-100 text-purple-800 border-purple-200",
  "COMPLETED": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "CANCELLED": "bg-red-100 text-red-800 border-red-200",
  "NO_SHOW": "bg-slate-100 text-slate-800 border-slate-200"
};

const statusIcons: Record<string, any> = {
  "PENDING": Clock,
  "CONFIRMED": CheckCircle,
  "IN_PROGRESS": RefreshCw,
  "COMPLETED": CheckCircle,
  "CANCELLED": XCircle,
  "NO_SHOW": XCircle
};

const paymentStatusColors: Record<string, string> = {
  "PAID": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "PARTIAL": "bg-amber-100 text-amber-800 border-amber-200",
  "UNPAID": "bg-red-100 text-red-800 border-red-200",
  "REFUNDED": "bg-slate-100 text-slate-800 border-slate-200"
};

export default function ServiceBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Stats
  const totalBookings = bookingsData.length;
  const completedBookings = bookingsData.filter(b => b.status === "COMPLETED");
  const pendingBookings = bookingsData.filter(b => b.status === "PENDING" || b.status === "CONFIRMED");
  const totalRevenue = bookingsData.reduce((sum, b) => sum + b.paid, 0);
  const outstandingBalance = bookingsData.reduce((sum, b) => sum + b.balance, 0);

  // Filter bookings
  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch = 
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "All" || booking.status === filterStatus;
    const matchesPayment = filterPayment === "All" || booking.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render stars
  const renderStars = (rating: number) => {
    if (!rating) return "—";
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

  // ==================== BUTTON ACTIONS ====================

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✅ Booking created successfully!", "success");
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ ${selectedBooking?.bookingNumber} updated!`, "success");
    setShowEditModal(false);
  };

  const handleDeleteBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBooking) {
      showToast(`🗑️ Deleted ${selectedBooking.bookingNumber}`, "error");
      setShowDeleteConfirm(false);
      setSelectedBooking(null);
    }
  };

  const handleMarkCompleted = (booking: any) => {
    showToast(`✅ ${booking.bookingNumber} marked as COMPLETED`, "success");
  };

  const handleRecordPayment = (booking: any) => {
    showToast(`💳 Recording payment for ${booking.bookingNumber}...`, "info");
    setTimeout(() => {
      showToast(`✅ Payment recorded for ${booking.bookingNumber}`, "success");
    }, 1000);
  };

  const handleExport = () => {
    showToast("📥 Exporting bookings...", "info");
    setTimeout(() => {
      showToast("✅ Bookings exported!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterPayment("All");
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
            <Calendar className="w-6 h-6 text-blue-500" />
            Service Bookings
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalBookings} bookings
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage all service bookings and appointments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            New Booking
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
            <p className="text-xs font-medium text-slate-500">Total Bookings</p>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalBookings}</p>
          <p className="text-xs text-slate-500">All time</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => { setFilterStatus("COMPLETED"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{completedBookings.length}</p>
          <p className="text-xs text-emerald-600">Done</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => { setFilterStatus("PENDING"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{pendingBookings.length}</p>
          <p className="text-xs text-amber-600">Awaiting</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-slate-500">{formatCurrency(outstandingBalance)} pending</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterStatus === "All" && filterPayment === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All
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
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => { setFilterStatus("PENDING"); setCurrentPage(1); }}
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
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
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => { setFilterPayment("PARTIAL"); setCurrentPage(1); }}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Partial Payment
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client, booking number, service..."
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
              <option value="PENDING">⏳ Pending</option>
              <option value="CONFIRMED">✅ Confirmed</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="CANCELLED">❌ Cancelled</option>
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
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Booking</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || Clock;
                return (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {booking.bookingNumber}
                      </span>
                      <p className="text-xs text-slate-400">{formatDate(booking.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{booking.client}</p>
                        <p className="text-xs text-slate-400">{booking.clientPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.service}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDateTime(booking.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold">{formatCurrency(booking.amount)}</span>
                      {booking.balance > 0 && (
                        <p className="text-xs text-red-500">Balance: {formatCurrency(booking.balance)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-slate-100"}`}>
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[booking.paymentStatus] || "bg-slate-100"}`}>
                        {booking.paymentStatus}
                      </span>
                      {booking.rating && (
                        <div className="mt-1">{renderStars(booking.rating)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button 
                          onClick={() => handleViewBooking(booking)}
                          className="p-1 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => handleEditBooking(booking)}
                          className="p-1 hover:bg-amber-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-amber-500" />
                        </button>
                        {booking.status !== "COMPLETED" && (
                          <button 
                            onClick={() => handleMarkCompleted(booking)}
                            className="p-1 hover:bg-emerald-50 rounded"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        {booking.paymentStatus !== "PAID" && booking.status === "COMPLETED" && (
                          <button 
                            onClick={() => handleRecordPayment(booking)}
                            className="p-1 hover:bg-emerald-50 rounded"
                            title="Record Payment"
                          >
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteBooking(booking)}
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
            <p className="text-slate-500 font-medium">No bookings found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Booking
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredBookings.length > itemsPerPage && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredBookings.length}</span> bookings
              {filteredBookings.length > 0 && (
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

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Booking Details - {selectedBooking.bookingNumber}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="font-medium">{selectedBooking.client}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {selectedBooking.clientPhone}
                  </p>
                  {selectedBooking.clientEmail && (
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedBooking.clientEmail}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Service</p>
                  <p className="font-medium">{selectedBooking.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-bold">{formatDateTime(selectedBooking.date)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="font-bold">{formatCurrency(selectedBooking.amount)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Paid</p>
                  <p className="font-bold text-emerald-600">{formatCurrency(selectedBooking.paid)}</p>
                  {selectedBooking.balance > 0 && (
                    <p className="text-xs text-red-500">Balance: {formatCurrency(selectedBooking.balance)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedBooking.status] || "bg-slate-100"}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Payment</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[selectedBooking.paymentStatus] || "bg-slate-100"}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                  {selectedBooking.paymentMethod && (
                    <p className="text-sm text-slate-500">Method: {selectedBooking.paymentMethod}</p>
                  )}
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">📝 Notes</p>
                  <p className="text-sm text-amber-700">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.feedback && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-emerald-800">💬 Feedback</p>
                    {selectedBooking.rating && renderStars(selectedBooking.rating)}
                  </div>
                  <p className="text-sm text-emerald-700">{selectedBooking.feedback}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => { setShowDetailModal(false); handleEditBooking(selectedBooking); }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {selectedBooking.status !== "COMPLETED" && (
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => { setShowDetailModal(false); handleMarkCompleted(selectedBooking); }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { setShowDetailModal(false); handleRecordPayment(selectedBooking); }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD BOOKING MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                New Booking
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Client Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter client name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input type="tel" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08012345678" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service *</label>
                  <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select service...</option>
                    <option value="Men's Haircut & Beard Trim">Men's Haircut & Beard Trim</option>
                    <option value="Women's Haircut & Blow Dry">Women's Haircut & Blow Dry</option>
                    <option value="Hair Color & Highlights">Hair Color & Highlights</option>
                    <option value="Bridal Makeup & Hair Package">Bridal Makeup & Hair Package</option>
                    <option value="Nail Art & Manicure">Nail Art & Manicure</option>
                    <option value="Live Band Performance">Live Band Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time *</label>
                  <input type="datetime-local" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₦) *</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="PAID">Paid</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="UNPAID">Unpaid</option>
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
                  Create Booking
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT BOOKING MODAL ==================== */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Booking - {selectedBooking.bookingNumber}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Client Name</label>
                  <input type="text" defaultValue={selectedBooking.client} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" defaultValue={selectedBooking.clientPhone} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service</label>
                  <select defaultValue={selectedBooking.service} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Men's Haircut & Beard Trim">Men's Haircut & Beard Trim</option>
                    <option value="Women's Haircut & Blow Dry">Women's Haircut & Blow Dry</option>
                    <option value="Hair Color & Highlights">Hair Color & Highlights</option>
                    <option value="Bridal Makeup & Hair Package">Bridal Makeup & Hair Package</option>
                    <option value="Nail Art & Manicure">Nail Art & Manicure</option>
                    <option value="Live Band Performance">Live Band Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time</label>
                  <input type="datetime-local" defaultValue={selectedBooking.date} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₦)</label>
                  <input type="number" defaultValue={selectedBooking.amount} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Status</label>
                  <select defaultValue={selectedBooking.paymentStatus} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="PAID">Paid</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={2} defaultValue={selectedBooking.notes} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
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

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {showDeleteConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Delete Booking</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold">{selectedBooking.bookingNumber}</span>?
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
    </div>
  );
}