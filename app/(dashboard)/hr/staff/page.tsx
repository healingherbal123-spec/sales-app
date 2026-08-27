"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  LayoutGrid,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Building2,
} from "lucide-react";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive' | 'pending';
  joined_date: string;
  avatar_url?: string;
  employee_id?: string;
}

export default function StaffDirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Simulate data loading - Replace with Supabase
    setTimeout(() => {
      const mockStaff: StaffMember[] = [
        { 
          id: "1", 
          full_name: "John Doe", 
          email: "john@company.com", 
          phone: "+234 800 111 2222", 
          role: "Sales Manager", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-01-15",
          employee_id: "EMP-001"
        },
        { 
          id: "2", 
          full_name: "Jane Smith", 
          email: "jane@company.com", 
          phone: "+234 800 333 4444", 
          role: "Senior Sales Rep", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-02-20",
          employee_id: "EMP-002"
        },
        { 
          id: "3", 
          full_name: "Mike Johnson", 
          email: "mike@company.com", 
          phone: "+234 800 555 6666", 
          role: "Inventory Manager", 
          department: "Operations", 
          status: 'active', 
          joined_date: "2024-03-10",
          employee_id: "EMP-003"
        },
        { 
          id: "4", 
          full_name: "Sarah Williams", 
          email: "sarah@company.com", 
          phone: "+234 800 777 8888", 
          role: "Dispatcher", 
          department: "Logistics", 
          status: 'on_leave', 
          joined_date: "2024-04-05",
          employee_id: "EMP-004"
        },
        { 
          id: "5", 
          full_name: "David Brown", 
          email: "david@company.com", 
          phone: "+234 800 999 0000", 
          role: "Sales Rep", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-05-12",
          employee_id: "EMP-005"
        },
        { 
          id: "6", 
          full_name: "Lisa Chen", 
          email: "lisa@company.com", 
          phone: "+234 800 111 3333", 
          role: "Accountant", 
          department: "Finance", 
          status: 'active', 
          joined_date: "2024-06-01",
          employee_id: "EMP-006"
        },
        { 
          id: "7", 
          full_name: "Robert Taylor", 
          email: "robert@company.com", 
          phone: "+234 800 555 7777", 
          role: "Dispatcher", 
          department: "Logistics", 
          status: 'active', 
          joined_date: "2024-07-15",
          employee_id: "EMP-007"
        },
        { 
          id: "8", 
          full_name: "Grace Okonkwo", 
          email: "grace@company.com", 
          phone: "+234 800 999 1111", 
          role: "Delivery Agent", 
          department: "Logistics", 
          status: 'pending', 
          joined_date: "2024-08-01",
          employee_id: "EMP-008"
        },
        { 
          id: "9", 
          full_name: "James Wilson", 
          email: "james@company.com", 
          phone: "+234 800 222 4444", 
          role: "HR Manager", 
          department: "HR", 
          status: 'active', 
          joined_date: "2024-01-20",
          employee_id: "EMP-009"
        },
        { 
          id: "10", 
          full_name: "Emily Davis", 
          email: "emily@company.com", 
          phone: "+234 800 666 8888", 
          role: "IT Support", 
          department: "IT", 
          status: 'inactive', 
          joined_date: "2024-03-15",
          employee_id: "EMP-010"
        },
        { 
          id: "11", 
          full_name: "Michael Obi", 
          email: "michael@company.com", 
          phone: "+234 800 123 4567", 
          role: "Sales Rep", 
          department: "Sales", 
          status: 'active', 
          joined_date: "2024-07-01",
          employee_id: "EMP-011"
        },
        { 
          id: "12", 
          full_name: "Chioma Nwosu", 
          email: "chioma@company.com", 
          phone: "+234 800 765 4321", 
          role: "Inventory Staff", 
          department: "Operations", 
          status: 'on_leave', 
          joined_date: "2024-06-15",
          employee_id: "EMP-012"
        },
      ];
      setStaff(mockStaff);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any }> = {
      'active': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      'on_leave': { color: 'bg-amber-100 text-amber-800', icon: Clock },
      'inactive': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'pending': { color: 'bg-blue-100 text-blue-800', icon: Clock },
    };
    const { color, icon: Icon } = config[status] || config.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getDepartments = () => {
    const depts = [...new Set(staff.map(s => s.department))];
    return ['all', ...depts];
  };

  const getStatuses = () => {
    const statuses = [...new Set(staff.map(s => s.status))];
    return ['all', ...statuses];
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || s.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading staff directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================
      HEADER
      ============================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Staff Directory
          </h1>
          <p className="text-sm text-slate-500">Manage all staff members and their information.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hr/staff/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
          </Link>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ============================================
      FILTERS
      ============================================ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, role, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              {getStatuses().map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
            <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
      RESULTS COUNT
      ============================================ */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium">{paginatedStaff.length}</span> of{' '}
          <span className="font-medium">{filteredStaff.length}</span> staff members
        </p>
      </div>

      {/* ============================================
      TABLE VIEW
      ============================================ */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStaff.map((staffMember) => (
                  <tr key={staffMember.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {staffMember.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-900">{staffMember.full_name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="w-3 h-3" />
                            {staffMember.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">
                      {staffMember.employee_id || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{staffMember.role}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {staffMember.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(staffMember.status)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(staffMember.joined_date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/hr/staff/${staffMember.id}`}>
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                        </Link>
                        <Link href={`/hr/staff/${staffMember.id}/edit`}>
                          <button className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-amber-500" />
                          </button>
                        </Link>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No staff found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* ============================================
          PAGINATION
          ============================================ */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
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
      )}

      {/* ============================================
      GRID VIEW
      ============================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStaff.map((staffMember) => (
            <div key={staffMember.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base font-bold">
                    {staffMember.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{staffMember.full_name}</p>
                    <p className="text-xs text-slate-500">{staffMember.role}</p>
                    <p className="text-xs text-slate-400">{staffMember.employee_id || 'N/A'}</p>
                  </div>
                </div>
                {getStatusBadge(staffMember.status)}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {staffMember.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {staffMember.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {staffMember.department}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Joined {formatDate(staffMember.joined_date)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <Link href={`/hr/staff/${staffMember.id}`} className="flex-1">
                  <button className="w-full px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    View Profile
                  </button>
                </Link>
                <Link href={`/hr/staff/${staffMember.id}/edit`}>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    <Edit className="w-4 h-4 text-slate-500" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'grid' && paginatedStaff.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No staff found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* ============================================
      GRID PAGINATION
      ============================================ */}
      {viewMode === 'grid' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500">
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
      )}
    </div>
  );
}