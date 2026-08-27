"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  MessageSquare,
  Plus,
  X,
  Sparkles,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Sample orders data ──────────────────────────────────────
const ordersData = [
  {
    id: 1,
    orderNumber: "ORD-10482",
    customer: "Mary Johnson",
    phone: "08031234567",
    items: [{ name: "Menopause Reverser", quantity: 2, price: 85000 }],
    total: 170000,
    status: "Pending",
    paymentStatus: "Pending Verification",
    deliveryStatus: "Pending",
    date: "2024-08-13",
    seller: "Sarah J.",
    address: "12, Lagos Street, Ikeja",
    notes: "Customer requested delivery by 5pm"
  },
  {
    id: 2,
    orderNumber: "ORD-10481",
    customer: "James Brown",
    phone: "08029876543",
    items: [{ name: "Hormone Balance", quantity: 1, price: 85000 }],
    total: 85000,
    status: "Completed",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    date: "2024-08-12",
    seller: "David O.",
    address: "5, Abuja Road, Garki",
    notes: "Delivered to security post"
  },
  {
    id: 3,
    orderNumber: "ORD-10480",
    customer: "Chioma Nwosu",
    phone: "08034567890",
    items: [{ name: "Weight Management", quantity: 3, price: 85000 }],
    total: 255000,
    status: "Processing",
    paymentStatus: "Paid",
    deliveryStatus: "In Transit",
    date: "2024-08-12",
    seller: "Amara K.",
    address: "8, Surulere, Lagos",
    notes: "Call before delivery"
  },
  {
    id: 4,
    orderNumber: "ORD-10479",
    customer: "John Adeyemi",
    phone: "08045678901",
    items: [{ name: "Skin Care Set", quantity: 1, price: 45000 }],
    total: 45000,
    status: "Pending",
    paymentStatus: "Unpaid",
    deliveryStatus: "Pending",
    date: "2024-08-11",
    seller: "Sarah J.",
    address: "3, Victoria Island, Lagos",
    notes: ""
  },
  {
    id: 5,
    orderNumber: "ORD-10478",
    customer: "Grace Okonkwo",
    phone: "08056789012",
    items: [{ name: "Menopause Reverser", quantity: 1, price: 85000 }],
    total: 85000,
    status: "Completed",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    date: "2024-08-11",
    seller: "David O.",
    address: "15, Enugu Road, Enugu",
    notes: "Left with neighbor"
  },
  {
    id: 6,
    orderNumber: "ORD-10477",
    customer: "Emeka Okafor",
    phone: "08067890123",
    items: [{ name: "Weight Management", quantity: 2, price: 85000 }],
    total: 170000,
    status: "Delayed",
    paymentStatus: "Paid",
    deliveryStatus: "Delayed",
    date: "2024-08-10",
    seller: "Amara K.",
    address: "7, Aba Road, Abia",
    notes: "Driver reported traffic issues"
  }
];

export default function OrdersPage() {
  // ─── State ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalAction, setModalAction] = useState("");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // ─── AI Follow‑up state ────────────────────────────────────
  const [showAIFollowupModal, setShowAIFollowupModal] = useState(false);
  const [aiFollowupOrder, setAiFollowupOrder] = useState<any>(null);
  const [aiFollowupMessage, setAiFollowupMessage] = useState("");
  const [aiFollowupLoading, setAiFollowupLoading] = useState(false);
  const [aiFollowupSent, setAiFollowupSent] = useState(false);

  // ─── Toast ──────────────────────────────────────────────────
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Stats ──────────────────────────────────────────────────
  const totalOrders = ordersData.length;
  const completedOrders = ordersData.filter(o => o.status === "Completed");
  const pendingOrders = ordersData.filter(o => o.status === "Pending");
  const processingOrders = ordersData.filter(o => o.status === "Processing");
  const delayedOrders = ordersData.filter(o => o.status === "Delayed");
  const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
  const pendingRevenue = pendingOrders.reduce((sum, order) => sum + order.total, 0);

  // ─── Filtered orders ────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.seller.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "All" || order.status === filterStatus;
      const matchesPayment = filterPayment === "All" || order.paymentStatus === filterPayment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchTerm, filterStatus, filterPayment]);

  // ─── UI helpers ─────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Completed": "bg-emerald-100 text-emerald-800",
      "Pending": "bg-amber-100 text-amber-800",
      "Processing": "bg-blue-100 text-blue-800",
      "Delayed": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Paid": "bg-emerald-100 text-emerald-800",
      "Pending Verification": "bg-amber-100 text-amber-800",
      "Unpaid": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const getDeliveryStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Delivered": "bg-emerald-100 text-emerald-800",
      "In Transit": "bg-blue-100 text-blue-800",
      "Pending": "bg-amber-100 text-amber-800",
      "Delayed": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleProcessOrder = (order: any) => {
    setSelectedOrder(order);
    setModalAction("process");
    setShowConfirmModal(true);
  };

  const handleVerifyPayment = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleAssignDelivery = (order: any) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleMarkCompleted = (order: any) => {
    setSelectedOrder(order);
    setModalAction("complete");
    setShowConfirmModal(true);
  };

  const handleResolveDelay = (order: any) => {
    setSelectedOrder(order);
    setModalAction("resolve");
    setShowConfirmModal(true);
  };

  const handleContactCustomer = (order: any) => {
    showToast(`📞 Calling ${order.customer}...`, "info");
    setTimeout(() => {
      showToast(`📱 WhatsApp message sent to ${order.customer}`, "success");
    }, 1500);
  };

  const handlePrintOrder = (order: any) => {
    showToast(`🖨️ Printing order ${order.orderNumber}...`, "info");
    setTimeout(() => {
      showToast(`✅ Order ${order.orderNumber} sent to printer`, "success");
    }, 1000);
  };

  const handleConfirmAction = () => {
    if (!selectedOrder) return;
    switch(modalAction) {
      case "process":
        showToast(`✅ Order ${selectedOrder.orderNumber} is now PROCESSING`, "success");
        break;
      case "complete":
        showToast(`✅ Order ${selectedOrder.orderNumber} marked as COMPLETED`, "success");
        break;
      case "resolve":
        showToast(`✅ Order ${selectedOrder.orderNumber} delay RESOLVED`, "success");
        break;
      default:
        showToast(`✅ Action completed for ${selectedOrder.orderNumber}`, "success");
    }
    setShowConfirmModal(false);
    setSelectedOrder(null);
  };

  const handlePaymentVerification = (approved: boolean) => {
    if (approved) {
      showToast(`✅ Payment for ${selectedOrder?.orderNumber} VERIFIED ✓`, "success");
    } else {
      showToast(`❌ Payment for ${selectedOrder?.orderNumber} REJECTED`, "error");
    }
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleAssignDeliveryAction = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ Delivery assigned to Dispatcher James for ${selectedOrder?.orderNumber}`, "success");
    setShowDeliveryModal(false);
    setSelectedOrder(null);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case "pending":
        setFilterStatus("Pending");
        showToast("📋 Showing pending orders", "info");
        break;
      case "processing":
        setFilterStatus("Processing");
        showToast("🔄 Showing processing orders", "info");
        break;
      case "completed":
        setFilterStatus("Completed");
        showToast("✅ Showing completed orders", "info");
        break;
      case "delayed":
        setFilterStatus("Delayed");
        showToast("⚠️ Showing delayed orders", "info");
        break;
      case "verification":
        setFilterPayment("Pending Verification");
        showToast("💳 Showing orders awaiting payment verification", "info");
        break;
      case "all":
        setFilterStatus("All");
        setFilterPayment("All");
        showToast("📦 Showing all orders", "info");
        break;
      default:
        break;
    }
  };

  // ─── AI Follow‑up ─────────────────────────────────────────────
  const handleAIFollowup = async (order: any) => {
    setAiFollowupOrder(order);
    setAiFollowupMessage("");
    setAiFollowupSent(false);
    setShowAIFollowupModal(true);
    setAiFollowupLoading(true);

    try {
      const response = await fetch("/api/ai/followup/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate follow-up");

      setAiFollowupMessage(data.message);
      setAiFollowupSent(data.wasSent || false);
    } catch (error: any) {
      showToast("❌ " + error.message, "error");
      setShowAIFollowupModal(false);
    } finally {
      setAiFollowupLoading(false);
    }
  };

  const handleSendAIFollowup = async () => {
    if (!aiFollowupOrder || !aiFollowupMessage) return;
    setAiFollowupLoading(true);

    try {
      const response = await fetch("/api/ai/followup/order/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: aiFollowupOrder.id,
          message: aiFollowupMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send");

      showToast(`📨 WhatsApp message sent to ${aiFollowupOrder.customer}`, "success");
      setAiFollowupSent(true);
    } catch (error: any) {
      showToast("❌ " + error.message, "error");
    } finally {
      setAiFollowupLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Orders
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalOrders} orders
            </span>
          </h1>
          <p className="text-sm text-slate-500">Track and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/sales/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleQuickAction("all")}>
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400" onClick={() => handleQuickAction("all")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Orders</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalOrders}</p>
          <p className="text-xs text-emerald-600">Click to view all</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400" onClick={() => handleQuickAction("pending")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{pendingOrders.length}</p>
          <p className="text-xs text-amber-600">{formatCurrency(pendingRevenue)} pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400" onClick={() => handleQuickAction("processing")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Processing</p>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-blue-600">{processingOrders.length}</p>
          <p className="text-xs text-slate-500">In progress</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400" onClick={() => handleQuickAction("completed")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{completedOrders.length}</p>
          <p className="text-xs text-slate-500">Delivered</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-red-400" onClick={() => handleQuickAction("delayed")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Delayed</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{delayedOrders.length}</p>
          <p className="text-xs text-red-600">Need attention</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => handleQuickAction("pending")}>
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => handleQuickAction("processing")}>
          <RefreshCw className="w-3 h-3 mr-1" /> Processing
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => handleQuickAction("completed")}>
          <CheckCircle className="w-3 h-3 mr-1" /> Completed
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleQuickAction("delayed")}>
          <AlertCircle className="w-3 h-3 mr-1" /> Delayed
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => handleQuickAction("verification")}>
          <CreditCard className="w-3 h-3 mr-1" /> Payment Verification
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, order, product, or seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="All">All Status</option>
              <option value="Completed">✅ Completed</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Processing">🔄 Processing</option>
              <option value="Delayed">⚠️ Delayed</option>
            </select>
            <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="All">All Payment</option>
              <option value="Paid">💳 Paid</option>
              <option value="Pending Verification">⏳ Pending Verification</option>
              <option value="Unpaid">❌ Unpaid</option>
            </select>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Products</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Delivery</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-blue-600">{order.orderNumber}</span>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-slate-400">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.name} <span className="text-xs text-slate-400">x{item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => handleViewOrder(order)} className="p-1 hover:bg-blue-50 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      {order.status === "Pending" && (
                        <button onClick={() => handleProcessOrder(order)} className="p-1 hover:bg-blue-50 rounded transition-colors" title="Process Order">
                          <RefreshCw className="w-4 h-4 text-blue-500" />
                        </button>
                      )}
                      {order.paymentStatus === "Pending Verification" && (
                        <button onClick={() => handleVerifyPayment(order)} className="p-1 hover:bg-amber-50 rounded transition-colors" title="Verify Payment">
                          <CreditCard className="w-4 h-4 text-amber-500" />
                        </button>
                      )}
                      {(order.status === "Processing" || order.status === "Pending") && (
                        <button onClick={() => handleAssignDelivery(order)} className="p-1 hover:bg-emerald-50 rounded transition-colors" title="Assign Delivery">
                          <Truck className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}
                      {order.status === "Processing" && (
                        <button onClick={() => handleMarkCompleted(order)} className="p-1 hover:bg-emerald-50 rounded transition-colors" title="Mark Completed">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}
                      {order.status === "Delayed" && (
                        <button onClick={() => handleResolveDelay(order)} className="p-1 hover:bg-red-50 rounded transition-colors" title="Resolve Delay">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                      <button onClick={() => handleContactCustomer(order)} className="p-1 hover:bg-purple-50 rounded transition-colors" title="Contact Customer">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                      </button>
                      <button onClick={() => handlePrintOrder(order)} className="p-1 hover:bg-slate-100 rounded transition-colors" title="Print Order">
                        <Printer className="w-4 h-4 text-slate-500" />
                      </button>
                      {/* ─── AI FOLLOW‑UP BUTTON ─── */}
                      <button onClick={() => handleAIFollowup(order)} className="p-1 hover:bg-purple-50 rounded transition-colors" title="AI Follow‑up">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-slate-500 font-medium">No orders found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{ordersData.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">Previous</Button>
            <Button size="sm" className="text-xs bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm" className="text-xs">2</Button>
            <Button variant="outline" size="sm" className="text-xs">Next</Button>
          </div>
        </div>
      </div>

      {/* ─── MODALS ────────────────────────────────────────────── */}

      {/* View Order Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Order {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Payment</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm">{selectedOrder.address}</p>
              </div>
              {selectedOrder.notes && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowOrderModal(false)}>
                  Close
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handlePrintOrder(selectedOrder)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Verification Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Verify Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium">Order: {selectedOrder.orderNumber}</p>
                <p className="text-sm">Customer: {selectedOrder.customer}</p>
                <p className="text-sm font-bold">Amount: {formatCurrency(selectedOrder.total)}</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <p className="text-sm text-slate-500">Payment evidence uploaded</p>
                <p className="text-xs text-slate-400">Click to view screenshot</p>
              </div>
              <p className="text-xs text-slate-500">Verify this payment matches bank records</p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handlePaymentVerification(true)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify & Clear
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handlePaymentVerification(false)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-500" />
                Assign Delivery
              </h3>
              <button onClick={() => setShowDeliveryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignDeliveryAction} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Order</label>
                <p className="text-sm font-medium">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer</label>
                <p className="text-sm">{selectedOrder.customer}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                <p className="text-sm text-slate-500">{selectedOrder.address}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Dispatcher</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Choose dispatcher...</option>
                  <option value="james">James - ₦3,500 - Available</option>
                  <option value="john">John - ₦3,200 - Available</option>
                  <option value="grace">Grace - ₦4,000 - Busy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Fee (₦)</label>
                <input type="number" defaultValue="3500" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Truck className="w-4 h-4 mr-2" />
                  Assign Delivery
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowDeliveryModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">
                {modalAction === "process" && "🔄"}
                {modalAction === "complete" && "✅"}
                {modalAction === "resolve" && "🔧"}
              </div>
              <h3 className="font-extrabold text-lg">Confirm Action</h3>
              <p className="text-sm text-slate-500 mt-1">
                {modalAction === "process" && `Process order ${selectedOrder.orderNumber}?`}
                {modalAction === "complete" && `Mark order ${selectedOrder.orderNumber} as completed?`}
                {modalAction === "resolve" && `Resolve delay for order ${selectedOrder.orderNumber}?`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirmAction}>
                Confirm
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI FOLLOW‑UP MODAL ───────────────────────────────── */}
      {showAIFollowupModal && aiFollowupOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI Follow‑up: {aiFollowupOrder.orderNumber}
              </h3>
              <button onClick={() => setShowAIFollowupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-medium">{aiFollowupOrder.customer}</p>
                  <p className="text-sm text-slate-500">{aiFollowupOrder.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Order Total</p>
                  <p className="font-bold">{formatCurrency(aiFollowupOrder.total)}</p>
                </div>
              </div>
              {aiFollowupLoading && !aiFollowupMessage ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                  <p className="text-sm text-slate-500 mt-2">Generating AI follow‑up...</p>
                </div>
              ) : (
                <>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700">AI‑generated message</p>
                    <p className="text-sm whitespace-pre-wrap mt-1">{aiFollowupMessage}</p>
                  </div>
                  <div className="flex gap-2">
                    {!aiFollowupSent ? (
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSendAIFollowup} disabled={aiFollowupLoading}>
                        {aiFollowupLoading ? "Sending..." : "📨 Send via WhatsApp"}
                      </Button>
                    ) : (
                      <div className="flex-1 text-center text-emerald-600 font-medium bg-emerald-50 p-2 rounded-lg">
                        ✅ Message sent successfully
                      </div>
                    )}
                    <Button variant="outline" onClick={() => setShowAIFollowupModal(false)}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}