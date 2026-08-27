"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  CreditCard,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Plus,
  X,
  Upload,
  Briefcase,
  Award,
  Calendar,
  FileText,
} from "lucide-react";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    industry: "technology",
    country: "Nigeria",
    plan: "business",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    confirmPassword: "",
    staffCount: 5,
    taxId: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Admin passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.adminPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        router.push("/owner/companies");
      }, 2000);
    } catch (err) {
      setError("Failed to register company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#171A24] dark:text-white">Company Registered Successfully!</h2>
          <p className="mt-2 text-[#737987] dark:text-gray-400">
            {formData.companyName} has been onboarded to AI SalesOS.
          </p>
          <p className="text-sm text-[#737987] dark:text-gray-400 mt-1">
            An email has been sent to {formData.adminEmail} with login credentials.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/owner/companies">
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium text-[#737987] dark:text-gray-400">
                View All Companies
              </button>
            </Link>
            <Link href="/owner/companies/new">
              <button className="px-4 py-2 bg-[#635BFF] text-white rounded-xl hover:bg-[#5549e8] transition text-sm font-medium">
                Register Another
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/owner/companies">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#635BFF]" />
            Register New Company
          </h1>
          <p className="text-sm text-[#737987] dark:text-gray-400">Onboard a new business to AI SalesOS.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#635BFF]' : 'text-[#737987]'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#635BFF] text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#737987]'}`}>
            1
          </div>
          <span className="text-sm font-medium">Company</span>
        </div>
        <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-[#635BFF]' : 'bg-slate-200 dark:bg-slate-700'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#635BFF]' : 'text-[#737987]'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#635BFF] text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#737987]'}`}>
            2
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
        <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-[#635BFF]' : 'bg-slate-200 dark:bg-slate-700'}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#635BFF]' : 'text-[#737987]'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-[#635BFF] text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#737987]'}`}>
            3
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#635BFF]" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="info@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="Business address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                >
                  <option value="technology">Technology</option>
                  <option value="retail">Retail</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="logistics">Logistics</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Subscription Plan *
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                >
                  <option value="startup">🚀 Startup (₦50,000/month)</option>
                  <option value="business">💼 Business (₦150,000/month)</option>
                  <option value="enterprise">🏢 Enterprise (₦300,000/month)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Initial Staff Count
                </label>
                <input
                  type="number"
                  name="staffCount"
                  value={formData.staffCount}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="TAX-12345678"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-[#635BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5549e8] transition"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              Administrator Account
            </h2>
            <p className="text-sm text-[#737987] dark:text-gray-400 mb-4">This will be the primary admin for the company.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="admin@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737987] dark:text-gray-400 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-[#737987] dark:text-gray-400"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-[#635BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5549e8] transition"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100/50 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#171A24] dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Review & Submit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-[#14171f] rounded-xl">
              <div>
                <p className="text-xs text-[#737987] dark:text-gray-400 font-medium">Company</p>
                <p className="font-medium text-[#171A24] dark:text-white">{formData.companyName || 'Not provided'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.email || 'Not provided'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.phone || 'Not provided'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.industry || 'Not selected'}</p>
              </div>
              <div>
                <p className="text-xs text-[#737987] dark:text-gray-400 font-medium">Plan & Details</p>
                <p className="font-medium text-[#171A24] dark:text-white capitalize">{formData.plan || 'Not selected'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.staffCount} staff</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.country || 'Not selected'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.taxId || 'No tax ID'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-[#737987] dark:text-gray-400 font-medium">Admin</p>
                <p className="font-medium text-[#171A24] dark:text-white">{formData.adminName || 'Not provided'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.adminEmail || 'Not provided'}</p>
                <p className="text-sm text-[#737987] dark:text-gray-400">{formData.adminPhone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-[#737987] dark:text-gray-400"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#635BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5549e8] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Register Company
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}