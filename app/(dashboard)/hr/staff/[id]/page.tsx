"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  MapPin,
  Users,
  Clock,
  Building2,
  FileText,
} from "lucide-react";

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.id;

  // Mock data - replace with Supabase
  const staff = {
    id: id,
    full_name: "John Doe",
    email: "john@company.com",
    phone: "+234 800 123 4567",
    role: "Sales Manager",
    department: "Sales",
    status: "active",
    employee_id: "EMP-001",
    joined_date: "2024-01-15",
    address: "123 Business Street, Lagos, Nigeria",
    emergency_contact: "Jane Doe",
    emergency_phone: "+234 800 999 8888",
    guarantors: [
      {
        full_name: "James Wilson",
        phone: "+234 800 111 2222",
        email: "james@example.com",
        relationship: "Relative",
        occupation: "Business Owner",
        address: "45 Ikeja, Lagos",
        years_known: "10+ years",
      },
      {
        full_name: "Mary Johnson",
        phone: "+234 800 333 4444",
        email: "mary@example.com",
        relationship: "Professional",
        occupation: "Accountant",
        address: "78 Victoria Island, Lagos",
        years_known: "6-10 years",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/hr/staff">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Details</h1>
          <p className="text-sm text-slate-500">View complete staff information.</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {staff.full_name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold">{staff.full_name}</h2>
            <p className="text-sm text-slate-500">{staff.role}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Active
              </span>
              <span className="text-xs text-slate-500">ID: {staff.employee_id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium">{staff.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium">{staff.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Department</p>
              <p className="text-sm font-medium">{staff.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Joined</p>
              <p className="text-sm font-medium">{new Date(staff.joined_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Address</p>
              <p className="text-sm font-medium">{staff.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm font-medium">{staff.emergency_contact}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium">{staff.emergency_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantors Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Guarantors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.guarantors.map((guarantor, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
              <h4 className="font-semibold text-sm text-purple-700 mb-3">
                Guarantor {index + 1}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium">{guarantor.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium">{guarantor.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium">{guarantor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-medium">{guarantor.relationship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Occupation</span>
                  <span className="font-medium">{guarantor.occupation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Years Known</span>
                  <span className="font-medium">{guarantor.years_known}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address</span>
                  <span className="font-medium text-right max-w-[60%]">{guarantor.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}