// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Building2, 
    Mail, 
    Lock, 
    User, 
    Smartphone,
    ArrowRight,
    Check,
    Sparkles
} from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        phone: '',
        fullName: '',
        plan: 'professional',
        industry: '',
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Register company
            const response = await fetch('/api/company/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                // Redirect to payment or dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        </div>
                    ))}
                </div>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Set Up Your Business</h1>
                    <p className="text-slate-500 mt-1">
                        {step === 1 && 'Tell us about your company'}
                        {step === 2 && 'Create your admin account'}
                        {step === 3 && 'Choose your plan'}
                    </p>
                </div>

                {/* Step 1: Company Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-xl"
                                    placeholder="Acme Solutions Ltd"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Industry
                            </label>
                            <select
                                className="w-full p-3 border border-slate-300 rounded-xl"
                                value={formData.industry}
                                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                            >
                                <option value="">Select Industry</option>
                                <option value="retail">Retail</option>
                                <option value="services">Services</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="tech">Technology</option>
                                <option value="consulting">Consulting</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-xl"
                                    placeholder="+234 800 000 0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Step 2: Admin Account */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-xl"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-xl"
                                    placeholder="admin@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-xl"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setStep(1)}
                                className="flex-1 p-3 border border-slate-300 rounded-xl hover:bg-slate-50"
                            >
                                Back
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Choose Plan */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                    formData.plan === 'starter' 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setFormData({...formData, plan: 'starter'})}
                            >
                                <h3 className="font-bold">Starter</h3>
                                <p className="text-2xl font-bold text-blue-600">₦49,000</p>
                                <p className="text-xs text-slate-500">/month</p>
                                <ul className="mt-3 text-sm space-y-1">
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> 5 users</li>
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Basic features</li>
                                </ul>
                            </div>
                            <div 
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                    formData.plan === 'professional' 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setFormData({...formData, plan: 'professional'})}
                            >
                                <h3 className="font-bold">Professional</h3>
                                <p className="text-2xl font-bold text-blue-600">₦99,000</p>
                                <p className="text-xs text-slate-500">/month</p>
                                <ul className="mt-3 text-sm space-y-1">
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> 20 users</li>
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> AI assistant</li>
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Advanced features</li>
                                </ul>
                            </div>
                            <div 
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                    formData.plan === 'enterprise' 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setFormData({...formData, plan: 'enterprise'})}
                            >
                                <h3 className="font-bold">Enterprise</h3>
                                <p className="text-2xl font-bold text-blue-600">₦249,000</p>
                                <p className="text-xs text-slate-500">/month</p>
                                <ul className="mt-3 text-sm space-y-1">
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Unlimited users</li>
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Custom features</li>
                                    <li className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Dedicated support</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setStep(2)}
                                className="flex-1 p-3 border border-slate-300 rounded-xl hover:bg-slate-50"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : '🚀 Start Your Business'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}