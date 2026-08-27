"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Printer,
  MessageSquare,
  DollarSign,
  UserCheck,
  Navigation,
  FileText,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  X,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Send,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample deliveries data
const deliveriesData = [
  {
    id: 1,
    waybillNumber: "WB-10482",
    orderNumber: "ORD-10482",
    customer: "Mary Johnson",
    phone: "08031234567",
    email: "mary.j@email.com",
    address: "12, Lagos Street, Ikeja, Lagos",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 3500,
    status: "Pending",
    assignedAt: "2024-08-13T10:30:00",
    pickedUpAt: null,
    deliveredAt: null,
    notes: "Customer requested delivery by 5pm",
    timeline: [
      { time: "2024-08-13T10:30:00", status: "Waybill Created", description: "Waybill generated from order ORD-10482" },
      { time: "2024-08-13T10:35:00", status: "Awaiting Assignment", description: "Delivery pending dispatcher assignment" }
    ]
  },
  {
    id: 2,
    waybillNumber: "WB-10481",
    orderNumber: "ORD-10481",
    customer: "James Brown",
    phone: "08029876543",
    email: "james.b@email.com",
    address: "5, Abuja Road, Garki, Abuja",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 3000,
    status: "Delivered",
    assignedAt: "2024-08-12T14:20:00",
    pickedUpAt: "2024-08-12T15:00:00",
    deliveredAt: "2024-08-12T18:00:00",
    notes: "Delivered to security post",
    timeline: [
      { time: "2024-08-12T14:20:00", status: "Waybill Created", description: "Waybill generated from order ORD-10481" },
      { time: "2024-08-12T14:25:00", status: "Assigned", description: "Assigned to dispatcher James" },
      { time: "2024-08-12T15:00:00", status: "Picked Up", description: "Picked up by dispatcher James" },
      { time: "2024-08-12T18:00:00", status: "Delivered", description: "Delivered to customer at security post" }
    ]
  },
  {
    id: 3,
    waybillNumber: "WB-10480",
    orderNumber: "ORD-10480",
    customer: "Chioma Nwosu",
    phone: "08034567890",
    email: "chioma.n@email.com",
    address: "8, Surulere, Lagos",
    dispatcher: "John",
    dispatcherPhone: "08087654321",
    deliveryFee: 4000,
    status: "In Transit",
    assignedAt: "2024-08-12T15:00:00",
    pickedUpAt: "2024-08-12T16:30:00",
    deliveredAt: null,
    notes: "Call before delivery",
    timeline: [
      { time: "2024-08-12T15:00:00", status: "Waybill Created", description: "Waybill generated from order ORD-10480" },
      { time: "2024-08-12T15:10:00", status: "Assigned", description: "Assigned to dispatcher John" },
      { time: "2024-08-12T16:30:00", status: "Picked Up", description: "Picked up by dispatcher John" },
      { time: "2024-08-12T17:00:00", status: "In Transit", description: "En route to delivery location" }
    ]
  },
  {
    id: 4,
    waybillNumber: "WB-10479",
    orderNumber: "ORD-10479",
    customer: "John Adeyemi",
    phone: "08045678901",
    email: "john.a@email.com",
    address: "3, Victoria Island, Lagos",
    dispatcher: null,
    dispatcherPhone: null,
    deliveryFee: null,
    status: "Pending",
    assignedAt: null,
    pickedUpAt: null,
    deliveredAt: null,
    notes: "Awaiting dispatcher assignment",
    timeline: [
      { time: "2024-08-11T09:00:00", status: "Waybill Created", description: "Waybill generated from order ORD-10479" }
    ]
  },
  {
    id: 5,
    waybillNumber: "WB-10478",
    orderNumber: "ORD-10478",
    customer: "Grace Okonkwo",
    phone: "08056789012",
    email: "grace.o@email.com",
    address: "15, Enugu Road, Enugu",
    dispatcher: "Grace",
    dispatcherPhone: "08076543210",
    deliveryFee: 5000,
    status: "Delivered",
    assignedAt: "2024-08-11T10:00:00",
    pickedUpAt: "2024-08-11T11:00:00",
    deliveredAt: "2024-08-11T14:00:00",
    notes: "Left with neighbor",
    timeline: [
      { time: "2024-08-11T10:00:00", status: "Waybill Created", description: "Waybill generated from order ORD-10478" },
      { time: "2024-08-11T10:15:00", status: "Assigned", description: "Assigned to dispatcher Grace" },
      { time: "2024-08-11T11:00:00", status: "Picked Up", description: "Picked up by dispatcher Grace" },
      { time: "2024-08-11T14:00:00", status: "Delivered", description: "Delivered to neighbor at provided address" }
    ]
  },
  {
    id: 6,
    waybillNumber: "WB-10477",
    orderNumber: "ORD-10477",
    customer: "Emeka Okafor",
    phone: "08067890123",
    email: "emeka.o@email.com",
    address: "7, Aba Road, Abia",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 4500,
    status: "Delayed",
    assignedAt: "2024-08-10T09:00:00",
    pickedUpAt: "2024-08-10T10:30:00",
    deliveredAt: null,
    notes: "Driver reported traffic issues",
    timeline: [
      { time: "2024-08-10T09:00:00", status: "Waybill Created", description: "Waybill generated from order ORD-10477" },
      { time: "2024-08-10T09:15:00", status: "Assigned", description: "Assigned to dispatcher James" },
      { time: "2024-08-10T10:30:00", status: "Picked Up", description: "Picked up by dispatcher James" },
      { time: "2024-08-10T12:00:00", status: "Delayed", description: "Delivery delayed due to traffic congestion" },
      { time: "2024-08-10T14:00:00", status: "Delayed", description: "Still awaiting delivery, customer contacted" }
    ]
  }
];

// Available dispatchers
const dispatchers = [
  { id: 1, name: "James", phone: "08098765432", rate: 3500, availability: true, reliability: 96 },
  { id: 2, name: "John", phone: "08087654321", rate: 3200, availability: true, reliability: 93 },
  { id: 3, name: "Grace", phone: "08076543210", rate: 4000, availability: false, reliability: 89 },
  { id: 4, name: "Michael", phone: "08065432109", rate: 3800, availability: true, reliability: 91 }
];

export default function WaybillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const waybillId = params.id;

  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDispatcher, setSelectedDispatcher] = useState("");
  const [negotiatedRate, setNegotiatedRate] = useState(0);
  const [contactMessage, setContactMessage] = useState("");
  const [modalAction, setModalAction] = useState("");

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Find delivery by ID
  useEffect(() => {
    const found = deliveriesData.find(d => d.id === Number(waybillId));
    if (found) {
      setDelivery(found);
      if (found.deliveryFee) setNegotiatedRate(found.deliveryFee);
    }
    setLoading(false);
  }, [waybillId]);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Transit": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Delayed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Delivered": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "In Transit": return <Truck className="w-5 h-5 text-blue-500" />;
      case "Pending": return <Clock className="w-5 h-5 text-amber-500" />;
      case "Delayed": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  // ==================== BUTTON ACTIONS ====================

  // 1. BACK
  const handleBack = () => {
    router.back();
  };

  // 2. PRINT
  const handlePrint = () => {
    showToast(`🖨️ Printing waybill ${delivery?.waybillNumber}...`, "info");
    setTimeout(() => {
      showToast("✅ Waybill sent to printer", "success");
    }, 1000);
  };

  // 3. DOWNLOAD
  const handleDownload = () => {
    showToast(`📥 Downloading waybill ${delivery?.waybillNumber}...`, "info");
    setTimeout(() => {
      showToast("✅ Waybill downloaded", "success");
    }, 1000);
  };

  // 4. CONTACT - OPEN MODAL
  const handleContact = () => {
    setContactMessage("");
    setShowContactModal(true);
  };

  // 5. SEND MESSAGE
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      showToast("⚠️ Please type a message", "error");
      return;
    }
    showToast(`📱 Message sent to ${delivery?.dispatcher || delivery?.customer}`, "success");
    setShowContactModal(false);
    setContactMessage("");
  };

  // 6. ASSIGN DISPATCHER - OPEN MODAL
  const handleAssignDispatcher = () => {
    setSelectedDispatcher("");
    setNegotiatedRate(delivery?.deliveryFee || 0);
    setShowAssignModal(true);
  };

  // 7. CONFIRM ASSIGN
  const handleConfirmAssign = () => {
    if (!selectedDispatcher) {
      showToast("⚠️ Please select a dispatcher", "error");
      return;
    }
    const dispatcher = dispatchers.find(d => d.name === selectedDispatcher);
    showToast(`✅ ${delivery.waybillNumber} assigned to ${selectedDispatcher} at ${formatCurrency(negotiatedRate || dispatcher?.rate || 0)}`, "success");
    setShowAssignModal(false);
  };

  // 8. MARK AS - OPEN CONFIRM
  const handleMarkAs = (action: string) => {
    setModalAction(action);
    setShowConfirmModal(true);
  };

  // 9. CONFIRM ACTION
  const handleConfirmAction = () => {
    const actions: Record<string, string> = {
      "picked_up": "✅ Marked as PICKED UP",
      "in_transit": "🚚 Marked as IN TRANSIT",
      "delivered": "✅ Marked as DELIVERED",
      "delayed": "⚠️ Marked as DELAYED",
      "resolved": "✅ Delay RESOLVED"
    };
    showToast(actions[modalAction] || "✅ Action completed", "success");
    setShowConfirmModal(false);
  };

  // 10. AI NEGOTIATE
  const handleAINegotiate = () => {
    showToast("🤖 AI negotiating with dispatchers...", "info");
    setTimeout(() => {
      const saved = Math.round(Math.random() * 1000) + 200;
      showToast(`✅ AI negotiated rate: ₦${3500 + saved} (saved ₦${saved})`, "success");
    }, 2000);
  };

  // 11. CONTACT DISPATCHER (Quick)
  const handleContactDispatcher = () => {
    if (delivery?.dispatcher) {
      showToast(`📱 Contacting ${delivery.dispatcher}...`, "info");
      setTimeout(() => {
        showToast(`✅ Message sent to ${delivery.dispatcher}`, "success");
      }, 1000);
    } else {
      showToast("⚠️ No dispatcher assigned", "error");
    }
  };

  // 12. CONTACT CUSTOMER (Quick)
  const handleContactCustomer = () => {
    showToast(`📱 Contacting ${delivery?.customer}...`, "info");
    setTimeout(() => {
      showToast(`✅ Message sent to ${delivery?.customer}`, "success");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading waybill...</p>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold">Waybill not found</h2>
          <p className="text-slate-500">The waybill you're looking for doesn't exist</p>
          <Link href="/deliveries">
            <Button className="mt-4">Back to Deliveries</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
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

      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deliveries
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{delivery.waybillNumber}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Order: {delivery.orderNumber}</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                {getStatusIcon(delivery.status)}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleContact}
          >
            <MessageSquare className="w-4 h-4" />
            Contact
          </Button>
          {delivery.status === "Pending" && !delivery.dispatcher && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
              onClick={handleAssignDispatcher}
            >
              <UserCheck className="w-4 h-4" />
              Assign Dispatcher
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Delivery Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-blue-500" />
              Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Waybill Number</p>
                <p className="font-mono font-medium">{delivery.waybillNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Order Number</p>
                <Link href={`/orders/${delivery.orderNumber}`}>
                  <span className="font-mono font-medium text-blue-600 hover:underline cursor-pointer">
                    {delivery.orderNumber}
                  </span>
                </Link>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Delivery Fee</p>
                <p className="font-bold">{delivery.deliveryFee ? formatCurrency(delivery.deliveryFee) : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Customer & Address Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Customer Name</p>
                <p className="font-medium">{delivery.customer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {delivery.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p>{delivery.email || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500">Address</p>
                <p className="flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                  {delivery.address}
                </p>
              </div>
            </div>
          </div>

          {/* Dispatcher Info Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-blue-500" />
              Dispatcher Information
            </h2>
            {delivery.dispatcher ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Dispatcher Name</p>
                  <p className="font-medium">{delivery.dispatcher}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {delivery.dispatcherPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fee</p>
                  <p className="font-bold">{formatCurrency(delivery.deliveryFee)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className="text-xs text-emerald-600">✅ Available</span>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleContactDispatcher}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Dispatcher
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleContactCustomer}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Customer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-amber-600">⚠️ No dispatcher assigned yet</p>
                <Button 
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleAssignDispatcher}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Dispatcher
                </Button>
              </div>
            )}
          </div>

          {/* Notes */}
          {delivery.notes && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-sm flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Notes
              </h2>
              <p className="text-sm text-slate-600">{delivery.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-500" />
              Timeline
            </h2>
            <div className="space-y-4">
              {delivery.timeline.map((event: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === delivery.timeline.length - 1 ? "bg-blue-500" : "bg-slate-300"
                    }`}></div>
                    {index < delivery.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.status}</p>
                    <p className="text-xs text-slate-500">{event.description}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(event.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {delivery.status === "Pending" && delivery.dispatcher && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleMarkAs("picked_up")}
                >
                  <Package className="w-4 h-4" />
                  Mark as Picked Up
                </Button>
              )}
              {delivery.status === "Picked Up" && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleMarkAs("in_transit")}
                >
                  <Truck className="w-4 h-4" />
                  Mark as In Transit
                </Button>
              )}
              {delivery.status === "In Transit" && (
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleMarkAs("delivered")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </Button>
              )}
              {delivery.status !== "Delivered" && delivery.status !== "Pending" && (
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleMarkAs("delayed")}
                >
                  <AlertCircle className="w-4 h-4" />
                  Mark as Delayed
                </Button>
              )}
              {delivery.status === "Delayed" && (
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleMarkAs("resolved")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve Delay
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAINegotiate}
              >
                <Bot className="w-4 h-4 text-purple-500" />
                AI Negotiate Rate
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleContact}
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Time Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-500" />
              Time Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned</span>
                <span>{formatDateTime(delivery.assignedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Picked Up</span>
                <span>{formatDateTime(delivery.pickedUpAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivered</span>
                <span>{formatDateTime(delivery.deliveredAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Assign Dispatcher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                Assign Dispatcher
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{delivery.waybillNumber}</p>
                <p className="text-sm">{delivery.customer}</p>
                <p className="text-sm text-slate-500">{delivery.address}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Dispatcher</label>
                <select
                  value={selectedDispatcher}
                  onChange={(e) => {
                    setSelectedDispatcher(e.target.value);
                    const dispatcher = dispatchers.find(d => d.name === e.target.value);
                    if (dispatcher) setNegotiatedRate(dispatcher.rate);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Choose dispatcher...</option>
                  {dispatchers.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} - {formatCurrency(d.rate)} - {d.availability ? "✅ Available" : "❌ Busy"} ({d.reliability}%)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Fee (₦)</label>
                <input
                  type="number"
                  value={negotiatedRate}
                  onChange={(e) => setNegotiatedRate(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">💡 AI recommended: ₦3,500</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleConfirmAssign}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Delivery
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">
                {modalAction === "picked_up" && "📦"}
                {modalAction === "in_transit" && "🚚"}
                {modalAction === "delivered" && "✅"}
                {modalAction === "delayed" && "⚠️"}
                {modalAction === "resolved" && "🔧"}
              </div>
              <h3 className="font-extrabold text-lg">Confirm Action</h3>
              <p className="text-sm text-slate-500 mt-1">
                {modalAction === "picked_up" && `Mark ${delivery.waybillNumber} as PICKED UP?`}
                {modalAction === "in_transit" && `Mark ${delivery.waybillNumber} as IN TRANSIT?`}
                {modalAction === "delivered" && `Mark ${delivery.waybillNumber} as DELIVERED?`}
                {modalAction === "delayed" && `Mark ${delivery.waybillNumber} as DELAYED?`}
                {modalAction === "resolved" && `Resolve delay for ${delivery.waybillNumber}?`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleConfirmAction}
              >
                Confirm
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Send Message
              </h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{delivery.waybillNumber}</p>
                <p className="text-sm">{delivery.customer}</p>
                <p className="text-sm text-slate-500">{delivery.dispatcher || "No dispatcher assigned"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setContactMessage(`Hello, this is regarding waybill ${delivery.waybillNumber}. Please provide an update on delivery status.`)}
                  className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  📦 Status Update
                </button>
                <button
                  type="button"
                  onClick={() => setContactMessage(`Hi, delivery for ${delivery.customer} at ${delivery.address}. Please confirm ETA.`)}
                  className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  📍 ETA Request
                </button>
                <button
                  type="button"
                  onClick={() => setContactMessage(`Customer ${delivery.customer} has requested delivery by today. Please prioritize this delivery.`)}
                  className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  ⏰ Priority
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2 px-4 rounded-lg transition-colors"
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