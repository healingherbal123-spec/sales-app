"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  CreditCard,
  User,
  Users,
  MessageSquare,
  Bot,
  Brain,
  Settings,
  ShoppingBag,
  Briefcase,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Activity,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  X,
  RefreshCw,
  Check,
  Eye,
  Trash2,
  Archive,
  Download,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample notifications data
const notificationsData = [
  {
    id: 1,
    type: "order",
    title: "New Order Created",
    message: "Order #ORD-10482 has been created by Mary Johnson",
    time: "2024-08-13T10:30:00",
    read: false,
    priority: "high",
    icon: ShoppingBag,
    link: "/orders/1",
    action: "View Order"
  },
  {
    id: 2,
    type: "delivery",
    title: "Delivery Delayed",
    message: "Waybill #WB-10477 has been delayed. Driver reported traffic issues.",
    time: "2024-08-13T10:15:00",
    read: false,
    priority: "urgent",
    icon: Truck,
    link: "/deliveries/waybill/6",
    action: "View Waybill"
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Verified",
    message: "Payment for Order #ORD-10481 has been verified by Ledger",
    time: "2024-08-13T10:00:00",
    read: false,
    priority: "medium",
    icon: CreditCard,
    link: "/payments",
    action: "View Payment"
  },
  {
    id: 4,
    type: "inventory",
    title: "Low Stock Alert",
    message: "Menopause Reverser (MR-001) stock is at 10 units. Minimum is 15.",
    time: "2024-08-13T09:45:00",
    read: false,
    priority: "high",
    icon: Package,
    link: "/inventory",
    action: "View Inventory"
  },
  {
    id: 5,
    type: "ai",
    title: "AI Task Completed",
    message: "Atlas successfully negotiated delivery fee for WB-10482",
    time: "2024-08-13T09:30:00",
    read: true,
    priority: "low",
    icon: Bot,
    link: "/ai/activity",
    action: "View Activity"
  },
  {
    id: 6,
    type: "customer",
    title: "Customer Feedback",
    message: "Mary Johnson left a 5-star review for Order #ORD-10482",
    time: "2024-08-13T09:15:00",
    read: true,
    priority: "medium",
    icon: User,
    link: "/customers/1",
    action: "View Customer"
  },
  {
    id: 7,
    type: "system",
    title: "System Update",
    message: "AI SalesOS has been updated to version 2.4.0",
    time: "2024-08-13T08:00:00",
    read: true,
    priority: "low",
    icon: Settings,
    link: "/settings",
    action: "View Changes"
  },
  {
    id: 8,
    type: "order",
    title: "Order Completed",
    message: "Order #ORD-10481 has been successfully delivered",
    time: "2024-08-12T18:00:00",
    read: true,
    priority: "medium",
    icon: CheckCircle,
    link: "/orders/2",
    action: "View Order"
  },
  {
    id: 9,
    type: "payment",
    title: "Payment Pending",
    message: "Payment for Order #ORD-10479 is awaiting verification",
    time: "2024-08-12T16:30:00",
    read: true,
    priority: "high",
    icon: CreditCard,
    link: "/payments",
    action: "Review Payment"
  },
  {
    id: 10,
    type: "ai",
    title: "AI Learning Complete",
    message: "Sage has learned new knowledge about Menopause Reverser",
    time: "2024-08-12T15:00:00",
    read: true,
    priority: "low",
    icon: Brain,
    link: "/knowledge",
    action: "View Knowledge"
  },
  {
    id: 11,
    type: "delivery",
    title: "Delivery Assigned",
    message: "Waybill #WB-10480 has been assigned to dispatcher John",
    time: "2024-08-12T14:20:00",
    read: true,
    priority: "medium",
    icon: Truck,
    link: "/deliveries/waybill/3",
    action: "View Waybill"
  },
  {
    id: 12,
    type: "inventory",
    title: "Stock Restocked",
    message: "Hormone Balance (HB-002) has been restocked. New stock: 12 units",
    time: "2024-08-12T13:00:00",
    read: true,
    priority: "low",
    icon: Package,
    link: "/inventory",
    action: "View Inventory"
  }
];

// Type colors
const typeColors: Record<string, string> = {
  "order": "bg-blue-100 text-blue-800 border-blue-200",
  "delivery": "bg-amber-100 text-amber-800 border-amber-200",
  "payment": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "inventory": "bg-purple-100 text-purple-800 border-purple-200",
  "ai": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "customer": "bg-pink-100 text-pink-800 border-pink-200",
  "system": "bg-slate-100 text-slate-800 border-slate-200"
};

// Priority colors
const priorityColors: Record<string, string> = {
  "urgent": "bg-red-100 text-red-800 border-red-200",
  "high": "bg-amber-100 text-amber-800 border-amber-200",
  "medium": "bg-blue-100 text-blue-800 border-blue-200",
  "low": "bg-slate-100 text-slate-800 border-slate-200"
};

const priorityIcons: Record<string, any> = {
  "urgent": AlertCircle,
  "high": AlertCircle,
  "medium": Clock,
  "low": CheckCircle
};

export default function NotificationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterRead, setFilterRead] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get unique types
  const types = ["All", ...new Set(notifications.map(n => n.type))];

  // Stats
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === "urgent").length;
  const highCount = notifications.filter(n => n.priority === "high").length;

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "All" || notification.type === filterType;
    const matchesPriority = filterPriority === "All" || notification.priority === filterPriority;
    const matchesRead = filterRead === "All" || 
      (filterRead === "read" && notification.read) || 
      (filterRead === "unread" && !notification.read);
    
    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ==================== BUTTON ACTIONS ====================

  // Navigate back
  const handleBack = () => {
    router.back();
  };

  // Mark as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    showToast("✅ Notification marked as read", "success");
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    showToast("✅ All notifications marked as read", "success");
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    if (confirm("Delete this notification?")) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast("🗑️ Notification deleted", "error");
    }
  };

  // Clear all read
  const clearAllRead = () => {
    if (confirm("Delete all read notifications?")) {
      setNotifications(prev => prev.filter(n => !n.read));
      showToast("🗑️ All read notifications cleared", "error");
    }
  };

  // View notification details
  const viewNotification = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  // Navigate to link
  const navigateToLink = (notification: any) => {
    if (notification.link) {
      setShowDetailModal(false);
      router.push(notification.link);
      showToast(`🔗 Navigating to ${notification.action}`, "info");
    }
  };

  // Export
  const handleExport = () => {
    showToast("📥 Exporting notifications...", "info");
    setTimeout(() => {
      showToast("✅ Notifications exported!", "success");
    }, 1500);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm("");
    setFilterType("All");
    setFilterPriority("All");
    setFilterRead("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Unread count badge
  const unreadBadge = unreadCount > 0 ? (
    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
      {unreadCount} unread
    </span>
  ) : null;

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

      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            Notifications
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalNotifications} notifications
            </span>
            {unreadBadge}
          </h1>
          <p className="text-sm text-slate-500">Stay updated with all your alerts and messages</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 hover:bg-red-50"
            onClick={clearAllRead}
          >
            <Trash2 className="w-4 h-4" />
            Clear Read
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
            <p className="text-xs font-medium text-slate-500">Total</p>
            <Bell className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalNotifications}</p>
          <p className="text-xs text-slate-500">All notifications</p>
        </div>

        {/* ⭐ UNREAD - CLICKABLE */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => { setFilterRead("unread"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Unread</p>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{unreadCount}</p>
          <p className="text-xs text-amber-600">New notifications</p>
        </div>

        {/* ⭐ URGENT - CLICKABLE */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-red-400"
          onClick={() => { setFilterPriority("urgent"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Urgent</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-red-600">{urgentCount}</p>
          <p className="text-xs text-red-600">Need attention</p>
        </div>

        {/* ⭐ HIGH PRIORITY - CLICKABLE */}
        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => { setFilterPriority("high"); setCurrentPage(1); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">High Priority</p>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{highCount}</p>
          <p className="text-xs text-amber-600">Important</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterType === "All" && filterPriority === "All" && filterRead === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-amber-300 text-amber-700"
          onClick={() => { setFilterRead("unread"); setCurrentPage(1); }}
        >
          <Bell className="w-3 h-3 mr-1" />
          Unread ({unreadCount})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-red-300 text-red-700"
          onClick={() => { setFilterPriority("urgent"); setCurrentPage(1); }}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Urgent
        </Button>
        {types.filter(t => t !== "All").map((type) => (
          <Button 
            key={type}
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => { setFilterType(type); setCurrentPage(1); }}
          >
            {type}
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
              placeholder="Search notifications..."
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
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Priority</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">⚪ Low</option>
            </select>

            <select
              value={filterRead}
              onChange={(e) => {
                setFilterRead(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="read">✅ Read</option>
              <option value="unread">⏳ Unread</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {currentItems.map((notification) => {
          const Icon = notification.icon || Bell;
          const PriorityIcon = priorityIcons[notification.priority] || AlertCircle;
          const bgClass = notification.read ? "bg-white" : "bg-blue-50/50";
          const borderClass = notification.read ? "border-slate-200" : "border-l-4 border-l-blue-500";

          return (
            <div 
              key={notification.id}
              className={`${bgClass} ${borderClass} rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all cursor-pointer`}
              onClick={() => viewNotification(notification)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[notification.type] || "bg-slate-100"}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-700">
                        {notification.title}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[notification.priority]}`}>
                        <PriorityIcon className="w-3 h-3 inline mr-0.5" />
                        {notification.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[notification.type]}`}>
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatTime(notification.time)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToLink(notification);
                      }}
                    >
                      {notification.action || "View"}
                    </button>
                    <span className="text-xs text-slate-300">|</span>
                    <span className="text-xs text-slate-400">{formatDate(notification.time)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <button 
                      className="p-1 hover:bg-blue-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-blue-500" />
                    </button>
                  )}
                  <button 
                    className="p-1 hover:bg-red-50 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-slate-500 font-medium">No notifications found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredNotifications.length > itemsPerPage && (
        <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredNotifications.length}</span> notifications
            {filteredNotifications.length > 0 && (
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

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Notification Details
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColors[selectedNotification.type] || "bg-slate-100"}`}>
                  <selectedNotification.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold">{selectedNotification.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[selectedNotification.priority]}`}>
                      {selectedNotification.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{formatDate(selectedNotification.time)} at {formatTime(selectedNotification.time)}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Type</p>
                  <p className="font-medium capitalize">{selectedNotification.type}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="font-medium">{selectedNotification.read ? "Read" : "Unread"}</p>
                </div>
              </div>

              {selectedNotification.link && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-800">🔗 Related Link</p>
                  <button 
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => navigateToLink(selectedNotification)}
                  >
                    {selectedNotification.action}
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {!selectedNotification.read && (
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                      setShowDetailModal(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailModal(false)}
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