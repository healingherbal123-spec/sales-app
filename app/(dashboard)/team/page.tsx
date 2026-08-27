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
  Users,
  User,
  UserPlus,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingBag,
  Truck,
  CreditCard,
  MoreVertical,
  ChevronDown,
  Shield,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample team data
const teamData = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@aisalesos.com",
    phone: "08031234567",
    role: "Sales Representative",
    department: "Sales",
    status: "Active",
    joinedDate: "2024-01-15",
    sales: 28,
    target: 30,
    revenue: 2840000,
    orders: 45,
    rating: 4.8,
    avatar: "SJ",
    notes: "Top performer, excellent customer relationships"
  },
  {
    id: 2,
    name: "David Okonjo",
    email: "david.o@aisalesos.com",
    phone: "08029876543",
    role: "Sales Representative",
    department: "Sales",
    status: "Active",
    joinedDate: "2024-02-01",
    sales: 25,
    target: 30,
    revenue: 2410000,
    orders: 38,
    rating: 4.5,
    avatar: "DO",
    notes: "Strong in corporate accounts"
  },
  {
    id: 3,
    name: "Amara Kalu",
    email: "amara.k@aisalesos.com",
    phone: "08034567890",
    role: "Sales Representative",
    department: "Sales",
    status: "Active",
    joinedDate: "2024-03-10",
    sales: 21,
    target: 30,
    revenue: 1980000,
    orders: 32,
    rating: 4.2,
    avatar: "AK",
    notes: "Great with product knowledge"
  },
  {
    id: 4,
    name: "Grace Eze",
    email: "grace.e@aisalesos.com",
    phone: "08056789012",
    role: "Sales Representative",
    department: "Sales",
    status: "Active",
    joinedDate: "2024-04-05",
    sales: 14,
    target: 25,
    revenue: 1190000,
    orders: 22,
    rating: 3.8,
    avatar: "GE",
    notes: "Improving steadily"
  },
  {
    id: 5,
    name: "James Dispatcher",
    email: "james.d@aisalesos.com",
    phone: "08098765432",
    role: "Delivery Dispatcher",
    department: "Logistics",
    status: "Active",
    joinedDate: "2024-01-20",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 4.7,
    avatar: "JD",
    notes: "Reliable, 96% on-time delivery"
  },
  {
    id: 6,
    name: "John Dispatcher",
    email: "john.d@aisalesos.com",
    phone: "08087654321",
    role: "Delivery Dispatcher",
    department: "Logistics",
    status: "Active",
    joinedDate: "2024-02-15",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 4.3,
    avatar: "JD",
    notes: "Good with customers"
  },
  {
    id: 7,
    name: "Chioma Production",
    email: "chioma.p@aisalesos.com",
    phone: "08065432109",
    role: "Production Manager",
    department: "Production",
    status: "Active",
    joinedDate: "2024-01-10",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 4.6,
    avatar: "CP",
    notes: "Manages production efficiently"
  },
  {
    id: 8,
    name: "Michael Finance",
    email: "michael.f@aisalesos.com",
    phone: "08054321098",
    role: "Finance Manager",
    department: "Finance",
    status: "Active",
    joinedDate: "2024-02-01",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 4.4,
    avatar: "MF",
    notes: "Handles all financial transactions"
  },
  {
    id: 9,
    name: "Ngozi Obi",
    email: "ngozi.o@aisalesos.com",
    phone: "08078901234",
    role: "Inventory Officer",
    department: "Inventory",
    status: "Active",
    joinedDate: "2024-03-01",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 4.5,
    avatar: "NO",
    notes: "Keeps inventory organized"
  },
  {
    id: 10,
    name: "Tunde Adeyemi",
    email: "tunde.a@aisalesos.com",
    phone: "08089012345",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "Inactive",
    joinedDate: "2024-04-01",
    sales: 0,
    target: 0,
    revenue: 0,
    orders: 0,
    rating: 0,
    avatar: "TA",
    notes: "On leave"
  }
];

// Department colors
const departmentColors: Record<string, string> = {
  "Sales": "bg-blue-100 text-blue-800 border-blue-200",
  "Logistics": "bg-amber-100 text-amber-800 border-amber-200",
  "Production": "bg-purple-100 text-purple-800 border-purple-200",
  "Finance": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Inventory": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Marketing": "bg-pink-100 text-pink-800 border-pink-200"
};

// Role icons
const roleIcons: Record<string, any> = {
  "Sales Representative": ShoppingBag,
  "Delivery Dispatcher": Truck,
  "Production Manager": Package,
  "Finance Manager": CreditCard,
  "Inventory Officer": Package,
  "Marketing Specialist": TrendingUp
};

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const itemsPerPage = 6;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get unique departments
  const departments = ["All", ...new Set(teamData.map(m => m.department))];

  // Calculate stats
  const totalMembers = teamData.length;
  const activeMembers = teamData.filter(m => m.status === "Active");
  const inactiveMembers = teamData.filter(m => m.status === "Inactive");
  const salesTeam = teamData.filter(m => m.department === "Sales");
  const salesTotal = salesTeam.reduce((sum, m) => sum + m.sales, 0);
  const revenueTotal = salesTeam.reduce((sum, m) => sum + m.revenue, 0);
  const avgTargetCompletion = salesTeam.length > 0 ? 
    Math.round(salesTeam.reduce((sum, m) => sum + (m.target > 0 ? (m.sales / m.target) * 100 : 0), 0) / salesTeam.length) : 0;

  // Filter team
  const filteredTeam = teamData.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "All" || member.department === filterDepartment;
    const matchesStatus = filterStatus === "All" || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeam.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Inactive": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "Inactive": return <Clock className="w-4 h-4 text-slate-500" />;
      default: return null;
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

  // Generate stars for rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && <Star className="w-3 h-3 fill-amber-400 text-amber-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-slate-300" />
        ))}
        <span className="text-xs font-medium text-slate-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // ==================== BUTTON ACTIONS ====================

  // 1. VIEW PROFILE
  const handleViewProfile = (member: any) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  // 2. EDIT MEMBER
  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  // 3. DELETE MEMBER
  const handleDeleteMember = (member: any) => {
    setSelectedMember(member);
    setShowDeleteConfirm(true);
  };

  // 4. CONFIRM DELETE
  const handleConfirmDelete = () => {
    if (selectedMember) {
      showToast(`🗑️ Removed ${selectedMember.name} from team`, "error");
      setShowDeleteConfirm(false);
      setSelectedMember(null);
    }
  };

  // 5. ADD MEMBER
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("👤 Team member added successfully!", "success");
    setShowAddModal(false);
  };

  // 6. SAVE EDIT
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ ${selectedMember?.name} updated!`, "success");
    setShowEditModal(false);
  };

  // 7. CONTACT MEMBER
  const handleContactMember = (member: any) => {
    showToast(`📱 WhatsApp message sent to ${member.name}`, "success");
  };

  // 8. EXPORT
  const handleExport = () => {
    showToast("📥 Exporting team data...", "info");
    setTimeout(() => {
      showToast("✅ Team data exported successfully!", "success");
    }, 1500);
  };

  // 9. RESET
  const handleReset = () => {
    setSearchTerm("");
    setFilterDepartment("All");
    setFilterStatus("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  // 10. FILTER BY STATUS
  const handleFilterByStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    showToast(`📋 Showing ${status} members`, "info");
  };

  // 11. FILTER BY DEPARTMENT
  const handleFilterByDepartment = (dept: string) => {
    setFilterDepartment(dept);
    setCurrentPage(1);
    showToast(`📋 Showing ${dept} team`, "info");
  };

  // 12. PAGINATION
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 13. SEND MESSAGE
  const handleSendMessage = (member: any) => {
    showToast(`💬 Message sent to ${member.name}`, "success");
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
            {toast.type === "error" && <X className="w-5 h-5" />}
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
            Team
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalMembers} members
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage team members and performance</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add Member
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
            <p className="text-xs font-medium text-slate-500">Total Members</p>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalMembers}</p>
          <p className="text-xs text-slate-500">Team members</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => handleFilterByStatus("Active")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{activeMembers.length}</p>
          <p className="text-xs text-emerald-600">Active members</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => handleFilterByStatus("Inactive")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Inactive</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{inactiveMembers.length}</p>
          <p className="text-xs text-amber-600">Inactive</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-400"
          onClick={() => handleFilterByDepartment("Sales")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Sales Team</p>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{salesTeam.length}</p>
          <p className="text-xs text-blue-600">Sales reps</p>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterDepartment === "All" && filterStatus === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All Members
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-emerald-300 text-emerald-700"
          onClick={() => handleFilterByStatus("Active")}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-slate-300 text-slate-700"
          onClick={() => handleFilterByStatus("Inactive")}
        >
          <Clock className="w-3 h-3 mr-1" />
          Inactive
        </Button>
        {/* Department quick filters */}
        {departments.filter(d => d !== "All").map((dept) => (
          <Button 
            key={dept}
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => { setFilterDepartment(dept); setCurrentPage(1); showToast(`📋 Showing ${dept} team`, "info"); }}
          >
            {dept}
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
              placeholder="Search by name, email, role, or department..."
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
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">✅ Active</option>
              <option value="Inactive">⏳ Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((member) => {
          const Icon = roleIcons[member.role] || User;
          return (
            <div 
              key={member.id} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    member.status === "Active" ? "bg-blue-500" : "bg-slate-400"
                  }`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-1">
                      {member.name}
                      {member.role === "Sales Representative" && member.sales >= 25 && (
                        <Trophy className="w-4 h-4 text-amber-500" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon className="w-3 h-3" />
                      <span>{member.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleViewProfile(member)}
                    className="p-1 hover:bg-blue-50 rounded transition-colors"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                  <button 
                    onClick={() => handleEditMember(member)}
                    className="p-1 hover:bg-amber-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-amber-500" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(member)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3 h-3" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3 h-3" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {formatDate(member.joinedDate)}</span>
                </div>
              </div>

              {/* Stats */}
              {member.role === "Sales Representative" && (
                <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Sales</p>
                    <p className="font-bold">{member.sales}</p>
                    <p className="text-xs text-slate-400">/ {member.target}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="font-bold text-sm">{formatCurrency(member.revenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Rating</p>
                    {renderStars(member.rating)}
                  </div>
                </div>
              )}

              {/* Status and Actions */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(member.status)}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${departmentColors[member.department] || "bg-slate-100"}`}>
                    {member.department}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleContactMember(member)}
                    className="p-1 hover:bg-emerald-50 rounded transition-colors"
                    title="Contact"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button 
                    onClick={() => handleSendMessage(member)}
                    className="p-1 hover:bg-purple-50 rounded transition-colors"
                    title="Send Message"
                  >
                    <Mail className="w-4 h-4 text-purple-500" />
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
          <div className="text-5xl mb-3">👥</div>
          <p className="text-slate-500 font-medium">No team members found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredTeam.length}</span> members
          {filteredTeam.length > 0 && (
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

      {/* ==================== MODALS ==================== */}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                Add Team Member
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08012345678" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Delivery Dispatcher">Delivery Dispatcher</option>
                    <option value="Production Manager">Production Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Inventory Officer">Inventory Officer</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Sales">Sales</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Production">Production</option>
                    <option value="Finance">Finance</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  Add Member
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Team Member
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" required defaultValue={selectedMember.name} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" required defaultValue={selectedMember.email} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" defaultValue={selectedMember.phone} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                  <select defaultValue={selectedMember.role} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Delivery Dispatcher">Delivery Dispatcher</option>
                    <option value="Production Manager">Production Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Inventory Officer">Inventory Officer</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <select defaultValue={selectedMember.department} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Sales">Sales</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Production">Production</option>
                    <option value="Finance">Finance</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select defaultValue={selectedMember.status} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={2} defaultValue={selectedMember.notes || ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
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
      {showDeleteConfirm && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Remove Team Member</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-bold">{selectedMember.name}</span> from the team?
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
                Remove
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

      {/* Profile Modal */}
      {showProfileModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Profile - {selectedMember.name}
              </h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                  selectedMember.status === "Active" ? "bg-blue-500" : "bg-slate-400"
                }`}>
                  {selectedMember.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                  <p className="text-sm text-slate-500">{selectedMember.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${departmentColors[selectedMember.department] || "bg-slate-100"}`}>
                      {selectedMember.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium">{selectedMember.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium">{selectedMember.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Joined Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedMember.joinedDate)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Rating</p>
                  {renderStars(selectedMember.rating)}
                </div>
              </div>

              {/* Sales Performance (if sales rep) */}
              {selectedMember.role === "Sales Representative" && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-sm text-blue-800 mb-3">📊 Sales Performance</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-xs text-slate-500">Sales</p>
                      <p className="text-xl font-bold">{selectedMember.sales}</p>
                      <p className="text-xs text-slate-400">/ {selectedMember.target} target</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="text-xl font-bold">{formatCurrency(selectedMember.revenue)}</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-xs text-slate-500">Orders</p>
                      <p className="text-xl font-bold">{selectedMember.orders}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Target Progress</span>
                      <span className="font-bold">{Math.round((selectedMember.sales / selectedMember.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((selectedMember.sales / selectedMember.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedMember.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">📝 Notes</p>
                  <p className="text-sm text-amber-700">{selectedMember.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setShowProfileModal(false); handleEditMember(selectedMember); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleContactMember(selectedMember)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}