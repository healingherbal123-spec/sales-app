"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  MoreVertical,
  Download,
  UserPlus,
  Star,
  TrendingUp,
  Calendar,
  Package,
  CreditCard,
  X,
  Pencil,
  Save,
  XCircle,
  Send
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

export default function CustomersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
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

  // Filter customers
  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || customer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalCustomers = customersData.length;
  const activeCustomers = customersData.filter(c => c.status === "Active" || c.status === "VIP").length;
  const vipCustomers = customersData.filter(c => c.status === "VIP").length;
  const totalRevenue = customersData.reduce((sum, c) => sum + c.totalSpent, 0);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "VIP": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Inactive": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800";
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

  // 1. NEW SALE
  const handleNewSale = () => {
    router.push("/sales/new");
    showToast("📝 Opening new sale form...", "info");
  };

  // 2. ADD CUSTOMER
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("👤 Customer added successfully!", "success");
    setShowAddModal(false);
  };

  // 3. VIEW CUSTOMER
  const handleView = (customer: any) => {
    router.push(`/customers/${customer.id}`);
    showToast(`👤 Viewing ${customer.name}`, "info");
  };

  // 4. EDIT CUSTOMER
  const handleEdit = (customer: any) => {
    setEditFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      notes: customer.notes || "",
      status: customer.status
    });
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // 5. SAVE EDIT
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ Customer ${selectedCustomer.name} updated successfully!`, "success");
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  // 6. DELETE CUSTOMER
  const handleDelete = (customer: any) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  // 7. CONFIRM DELETE
  const handleConfirmDelete = () => {
    if (customerToDelete) {
      showToast(`🗑️ Deleted: ${customerToDelete.name}`, "error");
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    }
  };

  // 8. CONTACT CUSTOMER - OPEN MESSAGE MODAL
  const handleContact = (customer: any) => {
    setSelectedCustomer(customer);
    setMessageContent("");
    setShowMessageModal(true);
  };

  // 9. SEND MESSAGE
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim()) {
      showToast("⚠️ Please type a message before sending", "error");
      return;
    }
    
    const phoneNumber = selectedCustomer?.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(messageContent);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    showToast(`📱 Opening WhatsApp for ${selectedCustomer?.name}...`, "info");
    setMessageContent("");
    setShowMessageModal(false);
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  // 10. EXPORT CUSTOMERS
  const handleExport = () => {
    showToast("📥 Exporting customer data...", "info");
    setTimeout(() => {
      showToast("✅ Customers exported successfully!", "success");
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
            <Users className="w-6 h-6 text-blue-500" />
            Customers
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalCustomers} customers
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage customer profiles and history</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={handleNewSale}
          >
            <Plus className="w-4 h-4" />
            New Sale
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400"
          onClick={() => { setFilterStatus("All"); showToast("📊 Showing all customers", "info"); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Customers</p>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalCustomers}</p>
          <p className="text-xs text-emerald-600">Click to view all</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => { setFilterStatus("Active"); showToast("✅ Showing active customers", "info"); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{activeCustomers}</p>
          <p className="text-xs text-slate-500">Click to filter</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => { setFilterStatus("VIP"); showToast("⭐ Showing VIP customers", "info"); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">VIP</p>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{vipCustomers}</p>
          <p className="text-xs text-slate-500">Click to filter</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => { showToast(`💰 Total revenue: ${formatCurrency(totalRevenue)}`, "info"); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-slate-500">Click for details</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="VIP">⭐ VIP</option>
              <option value="Active">✅ Active</option>
              <option value="Inactive">⏳ Inactive</option>
            </select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setSearchTerm(""); setFilterStatus("All"); showToast("🔄 Filters reset", "info"); }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  customer.status === "VIP" ? "bg-amber-500" : "bg-blue-500"
                }`}>
                  {customer.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    {customer.name}
                    {customer.status === "VIP" && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleView(customer)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                </button>
                <button 
                  onClick={() => handleEdit(customer)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-slate-400 hover:text-amber-500" />
                </button>
                <button 
                  onClick={() => handleDelete(customer)}
                  className="p-1 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                </button>
                {/* ✅ MESSAGE BUTTON - NOW ON THE CARD */}
                <button 
                  onClick={() => handleContact(customer)}
                  className="p-1 hover:bg-emerald-50 rounded transition-colors"
                  title="Message"
                >
                  <MessageSquare className="w-4 h-4 text-slate-400 hover:text-emerald-500" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-slate-500">Orders</p>
                <p className="font-bold">{customer.totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Spent</p>
                <p className="font-bold text-sm">{formatCurrency(customer.totalSpent)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Status</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>Joined {formatDate(customer.joinedDate)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <ShoppingBag className="w-3 h-3" />
                <span>Last order {formatDate(customer.lastOrder)}</span>
              </div>
            </div>

            {/* Quick Actions - NOW WITH MESSAGE BUTTON */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs h-7"
                onClick={() => handleView(customer)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Profile
              </Button>
              {/* ✅ MESSAGE BUTTON - ON THE CARD */}
              <Button 
                size="sm" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                onClick={() => handleContact(customer)}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Message
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">👤</div>
          <p className="text-slate-500 font-medium">No customers found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Customer
          </Button>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                Add New Customer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="08012345678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter customer address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Additional notes about customer..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && customerToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Delete Customer</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold">{customerToDelete.name}</span>?
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

      {/* ==================== MESSAGE MODAL ==================== */}

      {showMessageModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Send Message to {selectedCustomer.name}
              </h3>
              <button 
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageContent("");
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              {/* Customer Info */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{selectedCustomer.phone}</span>
                  <span className="text-xs text-slate-400 ml-auto">📱 WhatsApp</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Message will be sent to: {selectedCustomer.name}</p>
              </div>

              {/* EMPTY TEXT AREA */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Type your message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here... (e.g., Hello, how can we help you today?)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none placeholder:text-slate-400"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1">
                  {messageContent.length} characters
                </p>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hello ${selectedCustomer.name}, how can we help you today?`)}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    👋 Welcome
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hi ${selectedCustomer.name}, your order is ready for delivery. Please confirm availability.`)}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    📦 Order Ready
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hello ${selectedCustomer.name}, we have a special promotion. Would you be interested?`)}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    💰 Promotion
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageContent(`Hi ${selectedCustomer.name}, we hope you're enjoying your purchase!`)}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    📝 Follow-up
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!messageContent.trim()}
                  className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    messageContent.trim() 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
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
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center">
                📱 Opens WhatsApp with your message to {selectedCustomer.phone}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}