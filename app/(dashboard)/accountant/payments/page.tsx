"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingDown,
  DollarSign,
  Receipt,
  Building2,
  Smartphone,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Payment {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  amount: number;
  status: 'verified' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money';
  reference: string;
  notes?: string;
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockPayments: Payment[] = [
        { 
          id: "1", 
          orderNumber: "ORD-1001", 
          customer: "Mary Johnson", 
          customerEmail: "mary@example.com",
          amount: 170000, 
          method: 'bank_transfer',
          status: 'verified', 
          date: "2024-08-13",
          reference: "REF-001234",
          notes: "Payment confirmed for order #ORD-1001"
        },
        { 
          id: "2", 
          orderNumber: "ORD-1002", 
          customer: "John Adeyemi", 
          customerEmail: "john@example.com",
          amount: 25000, 
          method: 'cash',
          status: 'pending', 
          date: "2024-08-13",
          reference: "REF-001235",
          notes: "Awaiting payment confirmation"
        },
        { 
          id: "3", 
          orderNumber: "ORD-1003", 
          customer: "Chioma Nwosu", 
          customerEmail: "chioma@example.com",
          amount: 110000, 
          method: 'card',
          status: 'verified', 
          date: "2024-08-12",
          reference: "REF-001236",
          notes: "Card payment processed successfully"
        },
        { 
          id: "4", 
          orderNumber: "ORD-1004", 
          customer: "James Brown", 
          customerEmail: "james@example.com",
          amount: 85000, 
          method: 'mobile_money',
          status: 'pending', 
          date: "2024-08-12",
          reference: "REF-001237",
          notes: "Payment pending from mobile money"
        },
        { 
          id: "5", 
          orderNumber: "ORD-1005", 
          customer: "Grace Okonkwo", 
          customerEmail: "grace@example.com",
          amount: 50000, 
          method: 'bank_transfer',
          status: 'failed', 
          date: "2024-08-11",
          reference: "REF-001238",
          notes: "Bank transfer failed. Customer notified."
        },
        { 
          id: "6", 
          orderNumber: "ORD-1006", 
          customer: "Peter Obi", 
          customerEmail: "peter@example.com",
          amount: 230000, 
          method: 'card',
          status: 'verified', 
          date: "2024-08-11",
          reference: "REF-001239",
          notes: "Large transaction verified"
        },
        { 
          id: "7", 
          orderNumber: "ORD-1007", 
          customer: "Ngozi Okonjo", 
          customerEmail: "ngozi@example.com",
          amount: 150000, 
          method: 'cash',
          status: 'pending', 
          date: "2024-08-10",
          reference: "REF-001240",
          notes: "Cash payment receipt pending"
        },
        { 
          id: "8", 
          orderNumber: "ORD-1008", 
          customer: "Emeka Okafor", 
          customerEmail: "emeka@example.com",
          amount: 45000, 
          method: 'bank_transfer',
          status: 'refunded', 
          date: "2024-08-10",
          reference: "REF-001241",
          notes: "Refund processed due to cancellation"
        },
        { 
          id: "9", 
          orderNumber: "ORD-1009", 
          customer: "Amina Bello", 
          customerEmail: "amina@example.com",
          amount: 75000, 
          method: 'mobile_money',
          status: 'verified', 
          date: "2024-08-09",
          reference: "REF-001242",
          notes: "Mobile money payment verified"
        },
        { 
          id: "10", 
          orderNumber: "ORD-1010", 
          customer: "Chidi Okonkwo", 
          customerEmail: "chidi@example.com",
          amount: 120000, 
          method: 'card',
          status: 'pending', 
          date: "2024-08-09",
          reference: "REF-001243",
          notes: "Pending card authorization"
        },
      ];
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'verified': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Verified' },
      'pending': { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending' },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' },
      'refunded': { color: 'bg-purple-100 text-purple-800', icon: TrendingDown, label: 'Refunded' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getMethodIcon = (method: string) => {
    const config: Record<string, { icon: any, label: string }> = {
      'cash': { icon: DollarSign, label: 'Cash' },
      'bank_transfer': { icon: Building2, label: 'Bank Transfer' },
      'card': { icon: CreditCard, label: 'Card' },
      'mobile_money': { icon: Smartphone, label: 'Mobile Money' },
    };
    const { icon: Icon, label } = config[method] || config.cash;
    return { icon: Icon, label };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openDetailsModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || p.method === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: payments.length,
    verified: payments.filter(p => p.status === 'verified').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading payments...</p>
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
        <Link href="/accountant">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            All Payments
          </h1>
          <p className="text-sm text-slate-500">View and manage all customer payments.</p>
        </div>
      </div>

      {/* ============================================
      STATS
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Payments</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Verified</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.verified}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Failed</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.failed}</p>
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
              placeholder="Search by order, customer, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ============================================
      PAYMENTS TABLE
      ============================================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.map((payment) => {
                const method = getMethodIcon(payment.method);
                const MethodIcon = method.icon;
                return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-blue-600">
                      {payment.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-slate-900">{payment.customer}</p>
                        <p className="text-xs text-slate-500">{payment.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MethodIcon className="w-4 h-4" />
                        <span>{method.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(payment.date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openDetailsModal(payment)}
                          className="p-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        {payment.status === 'pending' && (
                          <Link href={`/accountant/verify?payment=${payment.id}`}>
                            <button className="p-1 hover:bg-emerald-50 rounded transition-colors">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No payments found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ============================================
        PAGINATION
        ============================================ */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{' '}
              {filteredPayments.length} payments
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

      {/* ============================================
      PAYMENT DETAILS MODAL
      ============================================ */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-600" />
                Payment Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Order Number</p>
                  <p className="font-medium">{selectedPayment.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reference</p>
                  <p className="font-mono text-sm">{selectedPayment.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-medium">{selectedPayment.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm">{selectedPayment.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Method</p>
                  <p className="font-medium">{getMethodIcon(selectedPayment.method).label}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium">{formatDate(selectedPayment.date)}</p>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="text-sm">{selectedPayment.notes}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 flex gap-2">
                {selectedPayment.status === 'pending' && (
                  <Link href={`/accountant/verify?payment=${selectedPayment.id}`}>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Verify Payment
                    </button>
                  </Link>
                )}
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}