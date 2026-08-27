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
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  Download,
  RefreshCw,
  MoreVertical,
  Printer,
  MessageSquare,
  DollarSign,
  Navigation,
  UserCheck,
  UserX,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  X,
  Bot,
  FileText
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
    address: "12, Lagos Street, Ikeja, Lagos",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 3500,
    status: "Pending",
    assignedAt: "2024-08-13T10:30:00",
    pickedUpAt: null,
    deliveredAt: null,
    notes: "Customer requested delivery by 5pm"
  },
  {
    id: 2,
    waybillNumber: "WB-10481",
    orderNumber: "ORD-10481",
    customer: "James Brown",
    phone: "08029876543",
    address: "5, Abuja Road, Garki, Abuja",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 3000,
    status: "Delivered",
    assignedAt: "2024-08-12T14:20:00",
    pickedUpAt: "2024-08-12T15:00:00",
    deliveredAt: "2024-08-12T18:00:00",
    notes: "Delivered to security post"
  },
  {
    id: 3,
    waybillNumber: "WB-10480",
    orderNumber: "ORD-10480",
    customer: "Chioma Nwosu",
    phone: "08034567890",
    address: "8, Surulere, Lagos",
    dispatcher: "John",
    dispatcherPhone: "08087654321",
    deliveryFee: 4000,
    status: "In Transit",
    assignedAt: "2024-08-12T15:00:00",
    pickedUpAt: "2024-08-12T16:30:00",
    deliveredAt: null,
    notes: "Call before delivery"
  },
  {
    id: 4,
    waybillNumber: "WB-10479",
    orderNumber: "ORD-10479",
    customer: "John Adeyemi",
    phone: "08045678901",
    address: "3, Victoria Island, Lagos",
    dispatcher: null,
    dispatcherPhone: null,
    deliveryFee: null,
    status: "Pending",
    assignedAt: null,
    pickedUpAt: null,
    deliveredAt: null,
    notes: "Awaiting dispatcher assignment"
  },
  {
    id: 5,
    waybillNumber: "WB-10478",
    orderNumber: "ORD-10478",
    customer: "Grace Okonkwo",
    phone: "08056789012",
    address: "15, Enugu Road, Enugu",
    dispatcher: "Grace",
    dispatcherPhone: "08076543210",
    deliveryFee: 5000,
    status: "Delivered",
    assignedAt: "2024-08-11T10:00:00",
    pickedUpAt: "2024-08-11T11:00:00",
    deliveredAt: "2024-08-11T14:00:00",
    notes: "Left with neighbor"
  },
  {
    id: 6,
    waybillNumber: "WB-10477",
    orderNumber: "ORD-10477",
    customer: "Emeka Okafor",
    phone: "08067890123",
    address: "7, Aba Road, Abia",
    dispatcher: "James",
    dispatcherPhone: "08098765432",
    deliveryFee: 4500,
    status: "Delayed",
    assignedAt: "2024-08-10T09:00:00",
    pickedUpAt: "2024-08-10T10:30:00",
    deliveredAt: null,
    notes: "Driver reported traffic issues"
  }
];

// Available dispatchers
const dispatchers = [
  { id: 1, name: "James", phone: "08098765432", rate: 3500, availability: true, reliability: 96 },
  { id: 2, name: "John", phone: "08087654321", rate: 3200, availability: true, reliability: 93 },
  { id: 3, name: "Grace", phone: "08076543210", rate: 4000, availability: false, reliability: 89 },
  { id: 4, name: "Michael", phone: "08065432109", rate: 3800, availability: true, reliability: 91 }
];

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDispatcher, setFilterDispatcher] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);
  const [showDelayedModal, setShowDelayedModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [selectedDispatcher, setSelectedDispatcher] = useState("");
  const [negotiatedRate, setNegotiatedRate] = useState(0);
  const itemsPerPage = 5;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate stats
  const totalDeliveries = deliveriesData.length;
  const pendingDeliveries = deliveriesData.filter(d => d.status === "Pending");
  const inTransitDeliveries = deliveriesData.filter(d => d.status === "In Transit");
  const deliveredDeliveries = deliveriesData.filter(d => d.status === "Delivered");
  const delayedDeliveries = deliveriesData.filter(d => d.status === "Delayed");

  // Filter deliveries
  const filteredDeliveries = deliveriesData.filter((delivery) => {
    const matchesSearch = 
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.waybillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || delivery.status === filterStatus;
    const matchesDispatcher = filterDispatcher === "All" || 
      (filterDispatcher === "Unassigned" && !delivery.dispatcher) ||
      delivery.dispatcher === filterDispatcher;
    
    return matchesSearch && matchesStatus && matchesDispatcher;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  // Status badge colors
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
      case "Delivered": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "In Transit": return <Truck className="w-4 h-4 text-blue-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "Delayed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

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

  // ==================== BUTTON ACTIONS ====================

  // 1. VIEW WAYBILL
  const handleViewWaybill = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowWaybillModal(true);
  };

  // 2. ASSIGN DISPATCHER
  const handleAssignDispatcher = (delivery: any) => {
    setSelectedDelivery(delivery);
    setSelectedDispatcher("");
    setNegotiatedRate(0);
    setShowAssignModal(true);
  };

  // 3. CONFIRM ASSIGN
  const handleConfirmAssign = () => {
    if (!selectedDispatcher) {
      showToast("⚠️ Please select a dispatcher", "error");
      return;
    }
    const dispatcher = dispatchers.find(d => d.name === selectedDispatcher);
    showToast(`✅ ${selectedDelivery.waybillNumber} assigned to ${selectedDispatcher} at ₦${negotiatedRate || dispatcher?.rate}`, "success");
    setShowAssignModal(false);
  };

  // 4. MARK AS DELIVERED
  const handleMarkDelivered = (delivery: any) => {
    if (confirm(`Mark ${delivery.waybillNumber} as delivered?`)) {
      showToast(`✅ ${delivery.waybillNumber} marked as DELIVERED`, "success");
    }
  };

  // 5. CONTACT DISPATCHER
  const handleContactDispatcher = (delivery: any) => {
    if (delivery.dispatcher) {
      showToast(`📱 Contacting ${delivery.dispatcher}...`, "info");
      setTimeout(() => {
        showToast(`✅ Message sent to ${delivery.dispatcher}`, "success");
      }, 1000);
    } else {
      showToast("⚠️ No dispatcher assigned", "error");
    }
  };

  // 6. CONTACT CUSTOMER
  const handleContactCustomer = (delivery: any) => {
    showToast(`📱 Contacting ${delivery.customer}...`, "info");
    setTimeout(() => {
      showToast(`✅ Message sent to ${delivery.customer}`, "success");
    }, 1000);
  };

  // 7. PRINT WAYBILL
  const handlePrintWaybill = (delivery: any) => {
    showToast(`🖨️ Printing waybill ${delivery.waybillNumber}...`, "info");
    setTimeout(() => {
      showToast("✅ Waybill sent to printer", "success");
    }, 1000);
  };

  // 8. EXPORT
  const handleExport = () => {
    showToast("📥 Exporting delivery data...", "info");
    setTimeout(() => {
      showToast("✅ Deliveries exported successfully!", "success");
    }, 1500);
  };

  // 9. RESET
  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterDispatcher("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  // 10. DELAYED - OPEN MODAL
  const handleDelayedAlert = () => {
    setShowDelayedModal(true);
  };

  // 11. RESOLVE DELAYS
  const handleResolveDelays = () => {
    showToast("🔧 Resolving delayed deliveries...", "info");
    setTimeout(() => {
      showToast("✅ Delayed deliveries resolved!", "success");
      setShowDelayedModal(false);
    }, 1500);
  };

  // 12. FILTER BY STATUS
  const handleFilterByStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    showToast(`📋 Showing ${status} deliveries`, "info");
  };

  // 13. PAGINATION
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 14. AI NEGOTIATE
  const handleAINegotiate = () => {
    showToast("🤖 AI negotiating with dispatchers...", "info");
    setTimeout(() => {
      showToast("✅ AI negotiated rate: ₦3,500 (saved ₦500)", "success");
    }, 2000);
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
            <Truck className="w-6 h-6 text-blue-500" />
            Deliveries
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalDeliveries} deliveries
            </span>
          </h1>
          <p className="text-sm text-slate-500">Track and manage all deliveries</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAINegotiate}
          >
            <Bot className="w-4 h-4 text-purple-500" />
            AI Negotiate
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total</p>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalDeliveries}</p>
          <p className="text-xs text-slate-500">All deliveries</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => handleFilterByStatus("Pending")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{pendingDeliveries.length}</p>
          <p className="text-xs text-amber-600">Awaiting dispatch</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400"
          onClick={() => handleFilterByStatus("In Transit")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">In Transit</p>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-blue-600">{inTransitDeliveries.length}</p>
          <p className="text-xs text-blue-600">On the way</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => handleFilterByStatus("Delivered")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Delivered</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{deliveredDeliveries.length}</p>
          <p className="text-xs text-emerald-600">Completed</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-red-400"
          onClick={handleDelayedAlert}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Delayed</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{delayedDeliveries.length}</p>
          <p className="text-xs text-red-600">Need attention</p>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterStatus === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={() => handleFilterByStatus("All")}
        >
          All Deliveries
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
          onClick={() => handleFilterByStatus("In Transit")}
        >
          <Truck className="w-3 h-3 mr-1" />
          In Transit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-emerald-300 text-emerald-700"
          onClick={() => handleFilterByStatus("Delivered")}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Delivered
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-red-300 text-red-700"
          onClick={handleDelayedAlert}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Delayed
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, waybill, order, or address..."
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
              <option value="Pending">⏳ Pending</option>
              <option value="In Transit">🚚 In Transit</option>
              <option value="Delivered">✅ Delivered</option>
              <option value="Delayed">⚠️ Delayed</option>
            </select>
            
            <select
              value={filterDispatcher}
              onChange={(e) => {
                setFilterDispatcher(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Dispatchers</option>
              <option value="Unassigned">❌ Unassigned</option>
              {dispatchers.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Waybill</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Address</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Dispatcher</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fee</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {delivery.waybillNumber}
                    </span>
                    <p className="text-xs text-slate-400">{delivery.orderNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{delivery.customer}</p>
                      <p className="text-xs text-slate-400">{delivery.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{delivery.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {delivery.dispatcher ? (
                      <div>
                        <p className="text-sm font-medium">{delivery.dispatcher}</p>
                        <p className="text-xs text-slate-400">{delivery.dispatcherPhone}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {delivery.deliveryFee ? (
                      <span className="font-bold">{formatCurrency(delivery.deliveryFee)}</span>
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(delivery.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button 
                        onClick={() => handleViewWaybill(delivery)}
                        className="p-1 hover:bg-blue-50 rounded transition-colors" 
                        title="View Waybill"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      
                      {delivery.status === "Pending" && !delivery.dispatcher && (
                        <button 
                          onClick={() => handleAssignDispatcher(delivery)}
                          className="p-1 hover:bg-emerald-50 rounded transition-colors" 
                          title="Assign Dispatcher"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}
                      
                      {delivery.status === "In Transit" && (
                        <button 
                          onClick={() => handleMarkDelivered(delivery)}
                          className="p-1 hover:bg-emerald-50 rounded transition-colors" 
                          title="Mark Delivered"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleContactDispatcher(delivery)}
                        className="p-1 hover:bg-purple-50 rounded transition-colors" 
                        title="Contact Dispatcher"
                      >
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                      </button>
                      
                      <button 
                        onClick={() => handleContactCustomer(delivery)}
                        className="p-1 hover:bg-blue-50 rounded transition-colors" 
                        title="Contact Customer"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                      </button>
                      
                      <button 
                        onClick={() => handlePrintWaybill(delivery)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors" 
                        title="Print Waybill"
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
            <div className="text-5xl mb-3">🚚</div>
            <p className="text-slate-500 font-medium">No deliveries found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredDeliveries.length}</span> deliveries
            {filteredDeliveries.length > 0 && (
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
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${currentPage === pageNum ? "bg-blue-600 text-white" : ""}`}
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
          <h3 className="font-semibold text-sm text-emerald-800">✅ Delivered</h3>
          <p className="text-2xl font-bold text-emerald-900">{deliveredDeliveries.length}</p>
          <p className="text-xs text-emerald-700">Successfully completed</p>
        </div>

        <div 
          className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleFilterByStatus("Pending")}
        >
          <h3 className="font-semibold text-sm text-amber-800">⏳ Pending</h3>
          <p className="text-2xl font-bold text-amber-900">{pendingDeliveries.length}</p>
          <p className="text-xs text-amber-700">Awaiting dispatch</p>
        </div>

        <div 
          className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleDelayedAlert}
        >
          <h3 className="font-semibold text-sm text-red-800">⚠️ Delayed</h3>
          <p className="text-2xl font-bold text-red-900">{delayedDeliveries.length}</p>
          <p className="text-xs text-red-700">Need attention</p>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* View Waybill Modal */}
      {showWaybillModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Waybill {selectedDelivery.waybillNumber}
              </h3>
              <button onClick={() => setShowWaybillModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Order</p>
                  <p className="font-medium">{selectedDelivery.orderNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDelivery.status)}`}>
                    {selectedDelivery.status}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Customer</p>
                <p className="font-medium">{selectedDelivery.customer}</p>
                <p className="text-sm text-slate-500">{selectedDelivery.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm">{selectedDelivery.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Dispatcher</p>
                  <p className="font-medium">{selectedDelivery.dispatcher || "Not assigned"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Delivery Fee</p>
                  <p className="font-bold">{selectedDelivery.deliveryFee ? formatCurrency(selectedDelivery.deliveryFee) : "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Assigned</p>
                  <p className="text-sm">{formatDateTime(selectedDelivery.assignedAt)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Picked Up</p>
                  <p className="text-sm">{formatDateTime(selectedDelivery.pickedUpAt)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Delivered</p>
                  <p className="text-sm">{formatDateTime(selectedDelivery.deliveredAt)}</p>
                </div>
              </div>
              {selectedDelivery.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">📝 Notes</p>
                  <p className="text-sm text-amber-700">{selectedDelivery.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handlePrintWaybill(selectedDelivery)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Waybill
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowWaybillModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Dispatcher Modal */}
      {showAssignModal && selectedDelivery && (
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
                <p className="text-sm font-medium">{selectedDelivery.waybillNumber}</p>
                <p className="text-sm">{selectedDelivery.customer}</p>
                <p className="text-sm text-slate-500">{selectedDelivery.address}</p>
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
                      {d.name} - {formatCurrency(d.rate)} - {d.availability ? "✅ Available" : "❌ Busy"} ({d.reliability}% reliability)
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
                <p className="text-xs text-slate-400 mt-1">AI recommended: ₦3,500</p>
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

      {/* Delayed Deliveries Modal */}
      {showDelayedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Delayed Deliveries
              </h3>
              <button onClick={() => setShowDelayedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-2xl font-bold text-red-800">{delayedDeliveries.length}</p>
                <p className="text-sm text-red-700">Deliveries exceeding expected delivery time</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {delayedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{delivery.waybillNumber}</p>
                      <p className="text-xs text-slate-500">{delivery.customer}</p>
                      <p className="text-xs text-slate-400">{delivery.dispatcher || "No dispatcher"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-red-600 font-medium">Delayed</span>
                      <br />
                      <span className="text-xs text-slate-400">Since {formatDateTime(delivery.assignedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleResolveDelays}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve Delays
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDelayedModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}