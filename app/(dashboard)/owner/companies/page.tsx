"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Users,
  DollarSign,
  ShoppingBag,
  Trash2,
  RefreshCw,
  X,
  UserPlus,
  Settings,
  BarChart,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'startup' | 'business' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  staffCount: number;
  revenue: number;
  orders: number;
  joinedDate: string;
  lastActive: string;
  industry: string;
  country: string;
  usage: number;
}

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const mockCompanies: Company[] = [
        { id: "1", name: "Tech Solutions Ltd", email: "info@techsolutions.com", phone: "+234 800 111 2222", plan: 'enterprise', status: 'active', staffCount: 15, revenue: 5600000, orders: 245, joinedDate: "2024-01-15", lastActive: "Today", industry: "Technology", country: "Nigeria", usage: 65 },
        { id: "2", name: "Global Retail Corp", email: "contact@globalretail.com", phone: "+234 800 333 4444", plan: 'business', status: 'active', staffCount: 8, revenue: 3200000, orders: 178, joinedDate: "2024-02-20", lastActive: "Today", industry: "Retail", country: "Nigeria", usage: 45 },
        { id: "3", name: "Healthcare Solutions", email: "admin@healthcare.com", phone: "+234 800 555 6666", plan: 'enterprise', status: 'active', staffCount: 22, revenue: 8900000, orders: 412, joinedDate: "2023-11-01", lastActive: "2 hours ago", industry: "Healthcare", country: "Nigeria", usage: 82 },
        { id: "4", name: "Eco Logistics", email: "info@ecologistics.com", phone: "+234 800 777 8888", plan: 'startup', status: 'inactive', staffCount: 3, revenue: 450000, orders: 34, joinedDate: "2024-03-10", lastActive: "2 days ago", industry: "Logistics", country: "Nigeria", usage: 12 },
        { id: "5", name: "Digital Marketing Pro", email: "hello@digitalmarketing.com", phone: "+234 800 999 0000", plan: 'business', status: 'active', staffCount: 6, revenue: 2100000, orders: 98, joinedDate: "2024-04-05", lastActive: "Yesterday", industry: "Marketing", country: "Nigeria", usage: 38 },
        { id: "6", name: "Food Delivery Express", email: "support@fooddelivery.com", phone: "+234 800 111 3333", plan: 'business', status: 'suspended', staffCount: 4, revenue: 780000, orders: 56, joinedDate: "2024-05-12", lastActive: "3 days ago", industry: "Food & Beverage", country: "Nigeria", usage: 8 },
        { id: "7", name: "EduTech Africa", email: "info@edutechafrica.com", phone: "+234 800 555 7777", plan: 'startup', status: 'active', staffCount: 5, revenue: 850000, orders: 67, joinedDate: "2024-06-01", lastActive: "Today", industry: "Education", country: "Nigeria", usage: 28 },
        { id: "8", name: "FinTech Solutions", email: "contact@fintechsolutions.com", phone: "+234 800 999 1111", plan: 'enterprise', status: 'active', staffCount: 18, revenue: 7200000, orders: 320, joinedDate: "2024-07-15", lastActive: "1 hour ago", industry: "Finance", country: "Nigeria", usage: 73 },
      ];
      setCompanies(mockCompanies);
      setLoading(false);
    }, 1000);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getPlanBadge = (plan: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'startup': { color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', label: '🚀 Startup' },
      'business': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: '💼 Business' },
      'enterprise': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', label: '🏢 Enterprise' },
    };
    const { color, label } = config[plan] || config.startup;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, label: string }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle, label: 'Active' },
      'inactive': { color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', icon: Clock, label: 'Inactive' },
      'suspended': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle, label: 'Suspended' },
    };
    const { color, icon: Icon, label } = config[status] || config.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const handleDelete = () => {
    if (selectedCompany) {
      setCompanies(prev => prev.filter(c => c.id !== selectedCompany.id));
      setShowDeleteModal(false);
      setSelectedCompany(null);
      showToast(`🗑️ ${selectedCompany.name} deleted`);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || c.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm ${
          toast.type === 'success' ? 'bg-[#16A36D]' : 'bg-[#EF4444]'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/owner">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#635BFF]" />
            Companies
          </h1>
          <p className="text-sm text-[#737987] dark:text-gray-400">Manage all registered companies.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Companies</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">{companies.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{companies.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Suspended</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{companies.filter(c => c.status === 'suspended').length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">{formatCurrency(companies.reduce((sum, c) => sum + c.revenue, 0))}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 border border-gray-100/50 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-slate-50 dark:bg-[#14171f] rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
            <Search className="w-4 h-4 text-[#737987]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#171A24] dark:text-white outline-none w-full"
            />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-slate-50 dark:bg-[#14171f] rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm text-[#171A24] dark:text-white outline-none focus:border-[#635BFF]"
          >
            <option value="all">All Plans</option>
            <option value="startup">Startup</option>
            <option value="business">Business</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-[#14171f] rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm text-[#171A24] dark:text-white outline-none focus:border-[#635BFF]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <Link href="/owner/companies/new">
            <button className="px-4 py-2 bg-[#635BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5549e8] transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Register Company
            </button>
          </Link>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-[#14171f]">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Company</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Plan</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Staff</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Orders</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[#737987] dark:text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#171A24] dark:text-white">{company.name}</p>
                      <p className="text-xs text-[#737987] dark:text-gray-400">{company.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPlanBadge(company.plan)}</td>
                  <td className="px-4 py-3 text-sm text-[#171A24] dark:text-white">{company.staffCount}</td>
                  <td className="px-4 py-3 font-medium text-[#171A24] dark:text-white">{formatCurrency(company.revenue)}</td>
                  <td className="px-4 py-3 text-sm text-[#171A24] dark:text-white">{company.orders}</td>
                  <td className="px-4 py-3">{getStatusBadge(company.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/owner/companies/${company.id}`}>
                        <button className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition">
                          <Eye className="w-4 h-4 text-[#635BFF]" />
                        </button>
                      </Link>
                      <Link href={`/owner/companies/${company.id}/edit`}>
                        <button className="p-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition">
                          <Edit className="w-4 h-4 text-amber-500" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-[#737987] mx-auto mb-3 opacity-50" />
            <p className="text-[#737987] font-medium">No companies found</p>
            <Link href="/owner/companies/new">
              <button className="mt-2 text-sm text-[#635BFF] hover:underline">Register a company</button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-[#14171f]/50 flex items-center justify-between">
            <p className="text-xs text-[#737987] dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of{' '}
              {filteredCompanies.length} companies
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 text-[#737987]" />
              </button>
              <span className="px-3 py-2 text-sm text-[#737987]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4 text-[#737987]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Delete Company
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-[#737987] hover:text-[#171A24] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#737987] dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-[#171A24] dark:text-white">{selectedCompany.name}</span>?
            </p>
            <p className="text-sm text-[#737987] dark:text-gray-400 mt-2">This action cannot be undone. All data associated with this company will be permanently deleted.</p>
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition">
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}