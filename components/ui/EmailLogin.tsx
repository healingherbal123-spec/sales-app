// components/EmailLogin.tsx
'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, User, Sparkles, AlertCircle } from 'lucide-react';

interface EmailLoginProps {
    children: React.ReactNode;
}

// ✅ REAL CREDENTIALS - These work!
const VALID_USERS = {
    'admin@example.com': {
        password: 'Admin@2024',
        name: 'Admin User',
        role: 'admin'
    },
    'john@example.com': {
        password: 'John@123',
        name: 'John Doe',
        role: 'manager'
    },
    'jane@example.com': {
        password: 'Jane@456',
        name: 'Jane Smith',
        role: 'manager'
    },
    'boss@example.com': {
        password: 'Boss@789',
        name: 'Boss Man',
        role: 'boss'
    }
};

export function EmailLogin({ children }: EmailLoginProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    // Check if already logged in
    useEffect(() => {
        const user = localStorage.getItem('dashboard_user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                if (parsed.email && parsed.name) {
                    setUserData(parsed);
                    setIsLoggedIn(true);
                }
            } catch {
                localStorage.removeItem('dashboard_user');
            }
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate inputs
        if (!email || !password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // ✅ Check credentials against valid users
        const user = VALID_USERS[email.toLowerCase()];
        if (user && user.password === password) {
            // Login successful
            const userData = {
                email: email.toLowerCase(),
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('dashboard_user', JSON.stringify(userData));
            setUserData(userData);
            setIsLoggedIn(true);
            setLoading(false);
            setError('');
        } else {
            // Login failed
            setError('Invalid email or password. Please try again.');
            setLoading(false);
            setPassword('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('dashboard_user');
        setIsLoggedIn(false);
        setUserData(null);
        setEmail('');
        setPassword('');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 transition-all"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* ✅ Show Valid Credentials */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
                            <p className="text-xs font-semibold text-blue-800">✅ Valid Credentials:</p>
                            <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                                <div><span className="font-medium">admin@example.com</span> / Admin@2024</div>
                                <div><span className="font-medium">john@example.com</span> / John@123</div>
                                <div><span className="font-medium">jane@example.com</span> / Jane@456</div>
                                <div><span className="font-medium">boss@example.com</span> / Boss@789</div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </span>
                            )}
                        </button>

                        <p className="text-xs text-slate-400 text-center mt-2">
                            🔒 Secure demo login • Use credentials above
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    // Pass user data to children
    return (
        <>
            {children}
        </>
    );
}