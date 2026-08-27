"use client";

import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-black text-2xl">
              OS
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">AI SalesOS</h1>
          <p className="text-sm text-slate-500">Enterprise Sales Operating System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} AI SalesOS. All rights reserved.
        </p>
      </div>
    </div>
  );
}