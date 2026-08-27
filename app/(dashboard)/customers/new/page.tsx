"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  Edit,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  X,
  Pencil,
  Save,
  Trash2,
  XCircle,
  AlertCircle,
  Send,
  Smile,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample customers data
const customersData = [
  {
    id: 1,
    name: "Mary Johnson",
    phone: "08031234567",
    email: "mary.j@email.com",
    address: "12, Lagos Street, Ikeja, Lagos",
    totalOrders: 6,
    totalSpent: 420000,
    lastOrder: "2024-08-13",
    status: "Active",
    joinedDate: "2024-06-15",
    notes: "VIP customer, prefers morning deliveries",
    orders: [
      { id: "ORD-10482", date: "2024-08-13", amount: 170000, status: "Pending" },
      { id: "ORD-10450", date: "2024-08-05", amount: 85000, status: "Completed" },
      { id: "ORD-10420", date: "2024-07-28", amount: 165000, status: "Completed" }
    ]
  },
  {
    id: 2,
    name: "James Brown",
    phone: "08029876543",
    email: "james.b@email.com",
    address: "5, Abuja Road, Garki, Abuja",
    totalOrders: 4,
    totalSpent: 340000,
    lastOrder: "2024-08-12",
    status: "Active",
    joinedDate: "2024-07-01",
    notes: "Corporate customer, bulk orders",
    orders: [
      { id: "ORD-10481", date: "2024-08-12", amount: 85000, status: "Completed" },
      { id: "ORD-10445", date: "2024-08-02", amount: 85000, status: "Completed" },
      { id: "ORD-10415", date: "2024-07-25", amount: 170000, status: "Completed" }
    ]
  },
  {
    id: 3,
    name: "Chioma Nwosu",
    phone: "08034567890",
    email: "chioma.n@email.com",
    address: "8, Surulere, Lagos",
    totalOrders: 3,
    totalSpent: 340000,
    lastOrder: "2024-08-12",
    status: "Active",
    joinedDate: "2024-07-20",
    notes: "Prefers WhatsApp communication",
    orders: [
      { id: "ORD-10480", date: "2024-08-12", amount: 255000, status: "Processing" },
      { id: "ORD-10440", date: "2024-07-30", amount: 85000, status: "Completed" }
    ]
  },
  {
    id: 4,
    name: "John Adeyemi",
    phone: "08045678901",
    email: "john.a@email.com",
    address: "3, Victoria Island, Lagos",
    totalOrders: 2,
    totalSpent: 90000,
    lastOrder: "2024-08-11",
    status: "Inactive",
    joinedDate: "2024-08-01",
    notes: "Hasn't ordered in 30+ days",
    orders: [
      { id: "ORD-10479", date: "2024-08-11", amount: 45000, status: "Pending" },
      { id: "ORD-10435", date: "2024-07-29", amount: 45000, status: "Completed" }
    ]
  },
  {
    id: 5,
    name: "Grace Okonkwo",
    phone: "08056789012",
    email: "grace.o@email.com",
    address: "15, Enugu Road, Enugu",
    totalOrders: 5,
    totalSpent: 425000,
    lastOrder: "2024-08-11",
    status: "VIP",
    joinedDate: "2024-06-01",
    notes: "Top customer, referrer of 3 new customers",
    orders: [
      { id: "ORD-10478", date: "2024-08-11", amount: 85000, status: "Completed" },
      { id: "ORD-10455", date: "2024-08-06", amount: 170000, status: "Completed" },
      { id: "ORD-10425", date: "2024-07-29", amount: 85000, status: "Completed" },
      { id: "ORD-10400", date: "2024-07-20", amount: 85000, status: "Completed" }
    ]
  },
  {
    id: 6,
    name: "Emeka Okafor",
    phone: "08067890123",
    email: "emeka.o@email.com",
    address: "7, Aba Road, Abia",
    totalOrders: 3,
    totalSpent: 255000,
    lastOrder: "2024-08-10",
    status: "Active",
    joinedDate: "2024-07-15",
    notes: "",
    orders: [
      { id: "ORD-10477", date: "2024-08-10", amount: 170000, status: "Delayed" },
      { id: "ORD-10430", date: "2024-07-28", amount: 85000, status: "Completed" }
    ]
  },
  {
    id: 7,
    name: "Ngozi Obi",
    phone: "08078901234",
    email: "ngozi.o@email.com",
    address: "22, Owerri Road, Imo",
    totalOrders: 8,
    totalSpent: 680000,
    lastOrder: "2024-08-10",
    status: "VIP",
    joinedDate: "2024-05-10",
    notes: "Bulk buyer, recommends products to friends",
    orders: [
      { id: "ORD-10476", date: "2024-08-10", amount: 170000, status: "Processing" },
      { id: "ORD-10460", date: "2024-08-07", amount: 85000, status: "Completed" },
      { id: "ORD-10438", date: "2024-07-30", amount: 255000, status: "Completed" },
      { id: "ORD-10410", date: "2024-07-22", amount: 170000, status: "Completed" }
    ]
  },
  {
    id: 8,
    name: "Tunde Balogun",
    phone: "08089012345",
    email: "tunde.b@email.com",
    address: "9, Ibadan Road, Oyo",
    totalOrders: 1,
    totalSpent: 85000,
    lastOrder: "2024-08-09",
    status: "Active",
    joinedDate: "2024-08-09",
    notes: "New customer, first order",
    orders: [
      { id: "ORD-10475", date: "2024-08-09", amount: 85000, status: "Completed" }
    ]
  }
];

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;
  
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    status: ""
  });

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Find customer by ID
  useEffect(() => {
    const found = customersData.find(c => c.id === Number(customerId));
    if (found) {
      setCustomer(found);
      setEditFormData({
        name: found.name,
        phone: found.phone,
        email: found.email,
        address: found.address,
        notes: found.notes || "",
        status: found.status
      });
    }
    setLoading(false);
  }, [customerId]);

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "VIP": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Inactive": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  // Handle edit save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ Customer updated successfully!`, "success");
    setShowEditModal(false);
    setCustomer({
      ...customer,
      ...editFormData
    });
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim()) {
      showToast("⚠️ Please type a message before sending", "error");
      return;
    }
    
    const phoneNumber = customer?.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(messageContent);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    showToast(`📱 Opening WhatsApp for ${customer?.name}...`, "info");
    setMessageContent("");
    setShowMessageModal(false);
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  // Handle back
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold">Customer not found</h2>
          <p className="text-slate-500">The customer you're looking for doesn't exist</p>
          <Link href="/customers">
            <Button className="mt-4">Back to Customers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
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
        Back to Customers
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
            customer.status === "VIP" ? "bg-amber-500" : "bg-blue-500"
          }`}>
            {customer.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              {customer.status === "VIP" && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              setMessageContent("");
              setShowMessageModal(true);
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Message
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
          <p className="text-2xl font-bold mt-1">{customer.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Spent</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(customer.totalSpent)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Avg Order</p>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(customer.totalSpent / customer.totalOrders)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Member Since</p>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-1">{formatDate(customer.joinedDate)}</p>
        </div>
      </div>

      {/* Address & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Address
          </h3>
          <p className="text-sm text-slate-600">{customer.address}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <Edit className="w-4 h-4 text-amber-500" />
            Notes
          </h3>
          <p className="text-sm text-slate-600">{customer.notes || "No notes available"}</p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          Order History
        </h2>
        <div className="space-y-2">
          {customer.orders.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-mono text-sm font-medium text-blue-600">{order.id}</p>
                <p className="text-xs text-slate-500">{formatDate(order.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(order.amount)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  order.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                  order.status === "Pending" ? "bg-amber-100 text-amber-800" :
                  order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== EDIT MODAL ==================== */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Edit Customer
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
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

      {/* ==================== MESSAGE MODAL - WITH EMPTY TEXT AREA ==================== */}

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Send Message
              </h3>
              <button 
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageContent("");
                }} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              {/* Customer Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                  {customer?.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{customer?.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {customer?.phone}
                  </p>
                </div>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                  WhatsApp
                </span>
              </div>

              {/* EMPTY TEXT AREA - THIS IS WHAT YOU ASKED FOR */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Type your message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-colors placeholder:text-slate-400"
                  autoFocus
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-slate-400">
                    {messageContent.length} characters
                  </p>
                  <p className="text-xs text-slate-400">
                    {messageContent.trim() ? "✅ Ready to send" : "📝 Type your message"}
                  </p>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hello ${customer?.name}, how can we help you today?`)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    👋 Welcome
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hi ${customer?.name}, your order is ready for delivery. Please confirm availability.`)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    📦 Order Ready
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hello ${customer?.name}, we have a special promotion. Would you be interested?`)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    💰 Promotion
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hi ${customer?.name}, we hope you're enjoying your purchase!`)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    📝 Follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Dear ${customer?.name}, thank you for being a loyal customer. We appreciate you!`)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    ❤️ Thank You
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!messageContent.trim()}
                  className={`flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    messageContent.trim() 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent("");
                  }}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center">
                📱 Opens WhatsApp with your message. Message will be sent to {customer?.phone}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}