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
  Briefcase,
  DollarSign,
  Tag,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  MoreVertical,
  Grid,
  List,
  X,
  Layers,
  User,
  Calendar,
  FileText,
  Printer,
  MessageSquare,
  Save,
  Sparkles,
  Heart,
  Shield,
  Stethoscope,
  Scissors,
  Mic,
  Music,
  Palette,
  Activity,
  Users,
  Award,
  Zap,
  Coffee,
  Utensils,
  Camera,
  Dumbbell,
  BookOpen,
  GraduationCap,
  PenTool,
  Wrench,
  Home,
  Truck,
  Plane,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Check,
  ChevronDown,
  Settings,
  PlusCircle,
  MinusCircle,
  Copy,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample services data with categories for different businesses
const servicesData = [
  // ===== HAIR & BEAUTY SERVICES =====
  {
    id: 1,
    name: "Men's Haircut & Beard Trim",
    category: "Hair & Beauty",
    subcategory: "Haircut",
    description: "Professional men's haircut with precision beard trim and shaping. Includes wash, cut, style, and hot towel shave.",
    price: 5000,
    duration: "30 mins",
    status: "Active",
    rating: 4.7,
    provider: "James Barbers",
    createdAt: "2024-06-15",
    bookings: 342,
    popular: true,
    icon: Scissors,
    tags: ["haircut", "beard", "grooming"]
  },
  {
    id: 2,
    name: "Women's Haircut & Blow Dry",
    category: "Hair & Beauty",
    subcategory: "Haircut",
    description: "Professional women's haircut with premium blow dry and style. Includes consultation, wash, cut, and styling.",
    price: 10000,
    duration: "60 mins",
    status: "Active",
    rating: 4.9,
    provider: "Grace Styles",
    createdAt: "2024-07-01",
    bookings: 256,
    popular: true,
    icon: Scissors,
    tags: ["haircut", "blowdry", "styling"]
  },
  {
    id: 3,
    name: "Hair Color & Highlights",
    category: "Hair & Beauty",
    subcategory: "Color",
    description: "Full hair coloring with professional highlights and lowlights. Includes consultation, color application, treatment, and style.",
    price: 25000,
    duration: "90 mins",
    status: "Active",
    rating: 4.8,
    provider: "Color Masters",
    createdAt: "2024-07-15",
    bookings: 189,
    popular: false,
    icon: Palette,
    tags: ["color", "highlights", "hair"]
  },
  {
    id: 4,
    name: "Bridal Makeup & Hair Package",
    category: "Hair & Beauty",
    subcategory: "Makeup",
    description: "Complete bridal package including professional makeup, hair styling, and trial session. Premium products used.",
    price: 50000,
    duration: "120 mins",
    status: "Active",
    rating: 4.9,
    provider: "Bridal Beauty Pro",
    createdAt: "2024-08-01",
    bookings: 67,
    popular: true,
    icon: Sparkles,
    tags: ["bridal", "makeup", "wedding"]
  },
  {
    id: 5,
    name: "Nail Art & Manicure",
    category: "Hair & Beauty",
    subcategory: "Nails",
    description: "Professional nail art and manicure service. Includes shaping, cuticle care, polish, and custom nail designs.",
    price: 8000,
    duration: "45 mins",
    status: "Active",
    rating: 4.6,
    provider: "Nail Studio",
    createdAt: "2024-08-15",
    bookings: 134,
    popular: false,
    icon: Palette,
    tags: ["nails", "manicure", "art"]
  },

  // ===== PERFORMANCE & ENTERTAINMENT =====
  {
    id: 6,
    name: "Live Band Performance",
    category: "Entertainment",
    subcategory: "Music",
    description: "Full live band performance for weddings, events, and corporate functions. 4-piece band with sound system.",
    price: 350000,
    duration: "3 hours",
    status: "Active",
    rating: 4.8,
    provider: "The Rhythm Band",
    createdAt: "2024-06-20",
    bookings: 28,
    popular: true,
    icon: Music,
    tags: ["live music", "band", "event"]
  },
  {
    id: 7,
    name: "Solo Acoustic Performance",
    category: "Entertainment",
    subcategory: "Music",
    description: "Solo acoustic performance perfect for intimate events, restaurants, and private gatherings.",
    price: 150000,
    duration: "2 hours",
    status: "Active",
    rating: 4.9,
    provider: "Sarah Melody",
    createdAt: "2024-07-10",
    bookings: 47,
    popular: true,
    icon: Mic,
    tags: ["acoustic", "solo", "intimate"]
  },
  {
    id: 8,
    name: "Recording Studio Session",
    category: "Entertainment",
    subcategory: "Recording",
    description: "Professional recording studio session with sound engineer. Includes mixing and mastering.",
    price: 200000,
    duration: "4 hours",
    status: "Active",
    rating: 4.7,
    provider: "Studio Pro",
    createdAt: "2024-08-05",
    bookings: 19,
    popular: false,
    icon: Mic,
    tags: ["recording", "studio", "music"]
  },

  // ===== HEALTHCARE & WELLNESS =====
  {
    id: 9,
    name: "Home Care Nursing",
    category: "Healthcare",
    subcategory: "Nursing",
    description: "Professional home care nursing services including vital signs monitoring, medication administration, and wound care.",
    price: 25000,
    duration: "4 hours",
    status: "Active",
    rating: 4.9,
    provider: "Care Nurses",
    createdAt: "2024-06-10",
    bookings: 98,
    popular: true,
    icon: Heart,
    tags: ["nursing", "homecare", "health"]
  },
  {
    id: 10,
    name: "Elderly Care Package",
    category: "Healthcare",
    subcategory: "Elderly Care",
    description: "Comprehensive elderly care including companionship, meal preparation, medication reminders, and mobility assistance.",
    price: 45000,
    duration: "8 hours",
    status: "Active",
    rating: 4.8,
    provider: "ElderCare Plus",
    createdAt: "2024-07-15",
    bookings: 67,
    popular: false,
    icon: Shield,
    tags: ["elderly", "care", "companionship"]
  },
  {
    id: 11,
    name: "Post-Surgery Recovery Care",
    category: "Healthcare",
    subcategory: "Recovery",
    description: "Specialized post-surgery care including wound care, mobility assistance, monitoring, and recovery support.",
    price: 35000,
    duration: "6 hours",
    status: "Active",
    rating: 4.9,
    provider: "Recovery Nurses",
    createdAt: "2024-08-01",
    bookings: 34,
    popular: false,
    icon: Stethoscope,
    tags: ["surgery", "recovery", "post-op"]
  },

  // ===== FITNESS & WELLNESS =====
  {
    id: 12,
    name: "Personal Training Session",
    category: "Fitness",
    subcategory: "Training",
    description: "One-on-one personal training session with certified fitness coach. Customized workout plan included.",
    price: 15000,
    duration: "60 mins",
    status: "Active",
    rating: 4.8,
    provider: "FitPro Training",
    createdAt: "2024-07-20",
    bookings: 156,
    popular: true,
    icon: Dumbbell,
    tags: ["training", "fitness", "workout"]
  },
  {
    id: 13,
    name: "Yoga & Meditation Class",
    category: "Fitness",
    subcategory: "Yoga",
    description: "Group yoga and meditation class for all levels. Includes breathing exercises, relaxation, and mindfulness.",
    price: 8000,
    duration: "60 mins",
    status: "Active",
    rating: 4.7,
    provider: "Zen Yoga Studio",
    createdAt: "2024-08-10",
    bookings: 89,
    popular: false,
    icon: Activity,
    tags: ["yoga", "meditation", "wellness"]
  },

  // ===== CREATIVE & ARTS =====
  {
    id: 14,
    name: "Photography Session",
    category: "Creative",
    subcategory: "Photography",
    description: "Professional photography session for portraits, events, or commercial use. Includes editing and digital delivery.",
    price: 50000,
    duration: "2 hours",
    status: "Active",
    rating: 4.9,
    provider: "Lens Masters",
    createdAt: "2024-07-25",
    bookings: 45,
    popular: true,
    icon: Camera,
    tags: ["photography", "portrait", "event"]
  },
  {
    id: 15,
    name: "Graphic Design Service",
    category: "Creative",
    subcategory: "Design",
    description: "Professional graphic design services including logos, branding, social media graphics, and print materials.",
    price: 30000,
    duration: "2 hours",
    status: "Active",
    rating: 4.6,
    provider: "Design Studio",
    createdAt: "2024-08-20",
    bookings: 34,
    popular: false,
    icon: PenTool,
    tags: ["graphic design", "branding", "logo"]
  },

  // ===== CATERING & FOOD =====
  {
    id: 16,
    name: "Event Catering Package",
    category: "Food & Catering",
    subcategory: "Events",
    description: "Full event catering service including menu planning, food preparation, setup, and service staff.",
    price: 150000,
    duration: "6 hours",
    status: "Active",
    rating: 4.8,
    provider: "Gourmet Catering",
    createdAt: "2024-08-01",
    bookings: 23,
    popular: true,
    icon: Utensils,
    tags: ["catering", "events", "food"]
  },
  {
    id: 17,
    name: "Private Chef Experience",
    category: "Food & Catering",
    subcategory: "Private Chef",
    description: "Private chef experience for intimate dinners and special occasions. Custom menu and fine dining service.",
    price: 80000,
    duration: "3 hours",
    status: "Active",
    rating: 4.9,
    provider: "Chef's Table",
    createdAt: "2024-08-25",
    bookings: 12,
    popular: false,
    icon: Coffee,
    tags: ["private chef", "dining", "experience"]
  },

  // ===== CONSULTING & BUSINESS =====
  {
    id: 18,
    name: "Business Strategy Session",
    category: "Consulting",
    subcategory: "Strategy",
    description: "Professional business strategy consultation including market analysis, growth planning, and actionable recommendations.",
    price: 75000,
    duration: "90 mins",
    status: "Active",
    rating: 4.8,
    provider: "Strategy Partners",
    createdAt: "2024-07-30",
    bookings: 28,
    popular: false,
    icon: Briefcase,
    tags: ["consulting", "strategy", "business"]
  },
  {
    id: 19,
    name: "Career Coaching Session",
    category: "Consulting",
    subcategory: "Coaching",
    description: "One-on-one career coaching including resume review, interview preparation, and career path planning.",
    price: 35000,
    duration: "60 mins",
    status: "Active",
    rating: 4.7,
    provider: "Career Boost",
    createdAt: "2024-08-15",
    bookings: 42,
    popular: false,
    icon: GraduationCap,
    tags: ["coaching", "career", "development"]
  },

  // ===== HOME SERVICES =====
  {
    id: 20,
    name: "Home Cleaning Service",
    category: "Home Services",
    subcategory: "Cleaning",
    description: "Professional home cleaning service including deep cleaning, sanitization, and organization.",
    price: 25000,
    duration: "4 hours",
    status: "Active",
    rating: 4.6,
    provider: "Clean Home Pro",
    createdAt: "2024-08-20",
    bookings: 78,
    popular: false,
    icon: Home,
    tags: ["cleaning", "home", "sanitization"]
  }
];

// Category colors
const categoryColors: Record<string, string> = {
  "Hair & Beauty": "bg-pink-100 text-pink-800 border-pink-200",
  "Entertainment": "bg-purple-100 text-purple-800 border-purple-200",
  "Healthcare": "bg-blue-100 text-blue-800 border-blue-200",
  "Fitness": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Creative": "bg-amber-100 text-amber-800 border-amber-200",
  "Food & Catering": "bg-orange-100 text-orange-800 border-orange-200",
  "Consulting": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Home Services": "bg-cyan-100 text-cyan-800 border-cyan-200"
};

// Category icons
const categoryIcons: Record<string, any> = {
  "Hair & Beauty": Scissors,
  "Entertainment": Music,
  "Healthcare": Heart,
  "Fitness": Dumbbell,
  "Creative": Palette,
  "Food & Catering": Utensils,
  "Consulting": Briefcase,
  "Home Services": Home
};

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    provider: "",
    subcategory: ""
  });
  const itemsPerPage = 9;

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get unique categories
  const categories = ["All", ...new Set(servicesData.map(s => s.category))];

  // Calculate stats
  const totalServices = servicesData.length;
  const activeServices = servicesData.filter(s => s.status === "Active");
  const popularServices = servicesData.filter(s => s.popular);
  const totalBookings = servicesData.reduce((sum, s) => sum + s.bookings, 0);
  const avgPrice = servicesData.reduce((sum, s) => sum + s.price, 0) / servicesData.length;

  // Filter services
  const filteredServices = servicesData.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || service.category === filterCategory;
    const matchesStatus = filterStatus === "All" || service.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

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

  // Render stars
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

  const handleViewService = (service: any) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      provider: service.provider,
      subcategory: service.subcategory || ""
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✅ ${selectedService?.name} updated successfully!`, "success");
    setShowEditModal(false);
  };

  const handleDeleteService = (service: any) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedService) {
      showToast(`🗑️ Deleted ${selectedService.name}`, "error");
      setShowDeleteConfirm(false);
      setSelectedService(null);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      showToast("⚠️ Please fill in all required fields", "error");
      return;
    }
    showToast("✅ Service added successfully!", "success");
    setShowAddModal(false);
    setFormData({ name: "", category: "", description: "", price: "", duration: "", provider: "", subcategory: "" });
  };

  const handleExport = () => {
    showToast("📥 Exporting service data...", "info");
    setTimeout(() => {
      showToast("✅ Services exported successfully!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterStatus("All");
    setCurrentPage(1);
    showToast("🔄 Filters reset", "info");
  };

  const handleFilterByStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    showToast(`📋 Showing ${status} services`, "info");
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

  const handleOpenAddModal = () => {
    setFormData({ name: "", category: "", description: "", price: "", duration: "", provider: "", subcategory: "" });
    setShowAddModal(true);
  };

  const handleDuplicateService = (service: any) => {
    showToast(`📋 Duplicating ${service.name}...`, "info");
    setTimeout(() => {
      showToast(`✅ ${service.name} duplicated successfully!`, "success");
    }, 1000);
  };

  const handleShareService = (service: any) => {
    showToast(`🔗 Share link for ${service.name} copied!`, "info");
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
            <Briefcase className="w-6 h-6 text-blue-500" />
            Services
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalServices} services
            </span>
          </h1>
          <p className="text-sm text-slate-500">Manage your service offerings</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={handleOpenAddModal}
          >
            <Plus className="w-4 h-4" />
            Add Service
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
            <p className="text-xs font-medium text-slate-500">Total Services</p>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalServices}</p>
          <p className="text-xs text-slate-500">Active: {activeServices.length}</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400"
          onClick={() => handleFilterByStatus("Active")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600">{activeServices.length}</p>
          <p className="text-xs text-emerald-600">Available</p>
        </div>

        <div 
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
          onClick={() => handleFilterByStatus("Inactive")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Inactive</p>
            <XCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold mt-1 text-amber-600">{servicesData.filter(s => s.status === "Inactive").length}</p>
          <p className="text-xs text-amber-600">Unavailable</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Bookings</p>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{totalBookings.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Avg Price: {formatCurrency(avgPrice)}</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs ${filterCategory === "All" && filterStatus === "All" ? "bg-blue-50 border-blue-400" : ""}`}
          onClick={handleReset}
        >
          All Services
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
          className="text-xs border-red-300 text-red-700"
          onClick={() => handleFilterByStatus("Inactive")}
        >
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Button>
        {categories.filter(c => c !== "All").map((cat) => (
          <Button 
            key={cat}
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => { setFilterCategory(cat); setCurrentPage(1); showToast(`📋 Showing ${cat} services`, "info"); }}
          >
            {cat}
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
              placeholder="Search by name, category, provider, or description..."
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
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
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

            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((service) => {
            const Icon = service.icon || categoryIcons[service.category] || Briefcase;
            return (
              <div key={service.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      service.status === "Active" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm flex items-center gap-1">
                        {service.name}
                        {service.popular && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                      </h3>
                      <p className="text-xs text-slate-500">{service.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    service.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                  }`}>
                    {service.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{service.description}</p>

                {/* Details */}
                <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="font-bold text-sm">{formatCurrency(service.price)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="font-bold text-sm">{service.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Rating</p>
                    {renderStars(service.rating)}
                  </div>
                </div>

                {/* Provider & Bookings */}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {service.provider}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {service.bookings} bookings
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {service.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {service.tags?.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      +{service.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => handleViewService(service)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs px-2"
                    onClick={() => handleDuplicateService(service)}
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-slate-400">{formatDate(service.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[service.category] || "bg-slate-100"}`}>
                        {service.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(service.price)}</td>
                    <td className="px-4 py-3 text-sm">{service.duration}</td>
                    <td className="px-4 py-3 text-sm">{service.provider}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        service.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleViewService(service)} className="p-1 hover:bg-blue-50 rounded"><Eye className="w-4 h-4 text-blue-500" /></button>
                        <button onClick={() => handleEditService(service)} className="p-1 hover:bg-amber-50 rounded"><Edit className="w-4 h-4 text-amber-500" /></button>
                        <button onClick={() => handleDuplicateService(service)} className="p-1 hover:bg-purple-50 rounded"><Copy className="w-4 h-4 text-purple-500" /></button>
                        <button onClick={() => handleDeleteService(service)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
              <div className="text-5xl mb-3">💼</div>
              <p className="text-slate-500 font-medium">No services found</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleOpenAddModal}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Service
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredServices.length > itemsPerPage && (
        <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium">{currentItems.length}</span> of <span className="font-medium">{filteredServices.length}</span> services
            {filteredServices.length > 0 && (
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

      {/* ==================== MODALS ==================== */}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Add New Service
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">Select category...</option>
                    <option value="Hair & Beauty">Hair & Beauty</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Creative">Creative</option>
                    <option value="Food & Catering">Food & Catering</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Home Services">Home Services</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Describe the service..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 45 mins"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Provider</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter provider name"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Service
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Hair & Beauty">Hair & Beauty</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Creative">Creative</option>
                    <option value="Food & Catering">Food & Catering</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Home Services">Home Services</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Provider</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
      {showDeleteConfirm && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-extrabold text-lg">Delete Service</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold">{selectedService.name}</span>?
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

      {/* View Service Modal */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Service Details
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Service Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedService.status === "Active" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                }`}>
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedService.name}</h2>
                    {selectedService.popular && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-sm text-slate-500">{selectedService.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedService.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {selectedService.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                      {renderStars(selectedService.rating)}
                    </span>
                    {selectedService.popular && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Price</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedService.price)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-2xl font-bold">{selectedService.duration}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Bookings</p>
                  <p className="text-2xl font-bold">{selectedService.bookings}</p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm text-slate-700">{selectedService.description}</p>
              </div>

              {/* Provider */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Provider</p>
                <p className="text-sm font-medium">{selectedService.provider}</p>
              </div>

              {/* Tags */}
              {selectedService.tags && selectedService.tags.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedService.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => { setShowDetailModal(false); handleEditService(selectedService); }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleDuplicateService(selectedService)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleShareService(selectedService)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}