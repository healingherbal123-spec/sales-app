"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Camera,
  Shield,
  Users,
  Home,
  FileText,
  Clock,
  UserCheck,
} from "lucide-react";

interface Guarantor {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  relationship: string;
  occupation: string;
  address: string;
  years_known: string;
  photo_preview: string | null;
  photo_file: File | null;
}

export default function AddStaffPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guarantor1FileRef = useRef<HTMLInputElement>(null);
  const guarantor2FileRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    status: "active",
    employee_id: "",
    joined_date: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
  });

  const [guarantors, setGuarantors] = useState<Guarantor[]>([
    {
      id: "1",
      full_name: "",
      phone: "",
      email: "",
      relationship: "",
      occupation: "",
      address: "",
      years_known: "",
      photo_preview: null,
      photo_file: null,
    },
    {
      id: "2",
      full_name: "",
      phone: "",
      email: "",
      relationship: "",
      occupation: "",
      address: "",
      years_known: "",
      photo_preview: null,
      photo_file: null,
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuarantorChange = (index: number, field: string, value: string) => {
    const updated = [...guarantors];
    updated[index] = { ...updated[index], [field]: value };
    setGuarantors(updated);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Please upload a JPG, PNG, GIF, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be less than 5MB.');
      return;
    }

    setPhotoError("");
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGuarantorPhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const updated = [...guarantors];
      updated[index] = { 
        ...updated[index], 
        photo_preview: event.target?.result as string,
        photo_file: file 
      };
      setGuarantors(updated);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeGuarantorPhoto = (index: number) => {
    const updated = [...guarantors];
    updated[index] = { ...updated[index], photo_preview: null, photo_file: null };
    setGuarantors(updated);
    if (index === 0 && guarantor1FileRef.current) {
      guarantor1FileRef.current.value = '';
    }
    if (index === 1 && guarantor2FileRef.current) {
      guarantor2FileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate guarantor fields
    for (let i = 0; i < guarantors.length; i++) {
      const g = guarantors[i];
      if (!g.full_name || !g.phone || !g.relationship || !g.occupation || !g.address || !g.years_known) {
        setError(`Please fill in all guarantor ${i + 1} fields.`);
        setLoading(false);
        return;
      }
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push("/hr/staff");
      }, 2000);
    } catch (err) {
      setError("Failed to add staff member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Staff Added Successfully!</h2>
          <p className="mt-2 text-slate-500">The staff member has been added to the directory.</p>
          {photoPreview && (
            <div className="mt-4 inline-block">
              <img 
                src={photoPreview} 
                alt="Staff photo" 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
              />
            </div>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/hr/staff">
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                View All Staff
              </button>
            </Link>
            <Link href="/hr/staff/new">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Another
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ============================================
      HEADER
      ============================================ */}
      <div className="flex items-center gap-4">
        <Link href="/hr/staff">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Staff Member</h1>
          <p className="text-sm text-slate-500">Add a new employee with guarantor information.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================
        PERSONAL INFORMATION WITH PHOTO
        ============================================ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
              <div 
                className="relative group cursor-pointer"
                onClick={handlePhotoClick}
              >
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="Staff preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 group-hover:border-blue-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center group-hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs text-slate-500 mt-1">Upload Photo</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              {photoError && (
                <p className="text-xs text-red-500 mt-2 text-center max-w-[200px]">{photoError}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                JPG, PNG, GIF, WEBP<br />Max 5MB
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="+234 800 123 4567"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
        EMPLOYMENT DETAILS
        ============================================ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Employment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="EMP-001"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select Role</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Rep">Sales Rep</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Inventory Staff">Inventory Staff</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Delivery Agent">Delivery Agent</option>
                <option value="Accountant">Accountant</option>
                <option value="HR Manager">HR Manager</option>
                <option value="HR Staff">HR Staff</option>
                <option value="IT Support">IT Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Logistics">Logistics</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Joined Date *
              </label>
              <input
                type="date"
                name="joined_date"
                value={formData.joined_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="123 Business Street, Lagos, Nigeria"
              />
            </div>
          </div>
        </div>

        {/* ============================================
        EMERGENCY CONTACT
        ============================================ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="+234 800 999 8888"
              />
            </div>
          </div>
        </div>

        {/* ============================================
        GUARANTORS SECTION
        ============================================ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Guarantors Information
            </h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              2 Guarantors Required
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Please provide information for two guarantors.</p>

          {/* Guarantor 1 */}
          <div className="border border-slate-200 rounded-lg p-4 mb-4 bg-slate-50/30">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-purple-500" />
              Guarantor 1
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => guarantor1FileRef.current?.click()}
                >
                  {guarantors[0].photo_preview ? (
                    <div className="relative">
                      <img 
                        src={guarantors[0].photo_preview} 
                        alt="Guarantor 1" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 group-hover:border-purple-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeGuarantorPhoto(0); }}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center group-hover:border-purple-400 transition-colors">
                      <Camera className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <input
                    ref={guarantor1FileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleGuarantorPhotoChange(0, e)}
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Photo</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={guarantors[0].full_name}
                  onChange={(e) => handleGuarantorChange(0, 'full_name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={guarantors[0].phone}
                  onChange={(e) => handleGuarantorChange(0, 'phone', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guarantors[0].email}
                  onChange={(e) => handleGuarantorChange(0, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Relationship to Employee *
                </label>
                <select
                  value={guarantors[0].relationship}
                  onChange={(e) => handleGuarantorChange(0, 'relationship', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Occupation *
                </label>
                <input
                  type="text"
                  value={guarantors[0].occupation}
                  onChange={(e) => handleGuarantorChange(0, 'occupation', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Occupation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  How long have you known them? *
                </label>
                <select
                  value={guarantors[0].years_known}
                  onChange={(e) => handleGuarantorChange(0, 'years_known', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="">Select Years</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="6-10 years">6-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={guarantors[0].address}
                  onChange={(e) => handleGuarantorChange(0, 'address', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Guarantor 2 */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-purple-500" />
              Guarantor 2
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => guarantor2FileRef.current?.click()}
                >
                  {guarantors[1].photo_preview ? (
                    <div className="relative">
                      <img 
                        src={guarantors[1].photo_preview} 
                        alt="Guarantor 2" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 group-hover:border-purple-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeGuarantorPhoto(1); }}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center group-hover:border-purple-400 transition-colors">
                      <Camera className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <input
                    ref={guarantor2FileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleGuarantorPhotoChange(1, e)}
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Photo</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={guarantors[1].full_name}
                  onChange={(e) => handleGuarantorChange(1, 'full_name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={guarantors[1].phone}
                  onChange={(e) => handleGuarantorChange(1, 'phone', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guarantors[1].email}
                  onChange={(e) => handleGuarantorChange(1, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Relationship to Employee *
                </label>
                <select
                  value={guarantors[1].relationship}
                  onChange={(e) => handleGuarantorChange(1, 'relationship', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Occupation *
                </label>
                <input
                  type="text"
                  value={guarantors[1].occupation}
                  onChange={(e) => handleGuarantorChange(1, 'occupation', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Occupation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  How long have you known them? *
                </label>
                <select
                  value={guarantors[1].years_known}
                  onChange={(e) => handleGuarantorChange(1, 'years_known', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="">Select Years</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="6-10 years">6-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={guarantors[1].address}
                  onChange={(e) => handleGuarantorChange(1, 'address', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
        SUBMIT
        ============================================ */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-slate-200 -mx-4 px-4">
          <Link href="/hr/staff">
            <button
              type="button"
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding Staff...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Staff Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}