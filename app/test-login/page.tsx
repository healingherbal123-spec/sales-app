"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setResult({ success: false, error: error.message });
      } else {
        setResult({ success: true, data });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setResult({ success: false, error: error.message });
      } else {
        setResult({ success: true, data });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-8">
      <div className="max-w-md mx-auto bg-white/5 p-6 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold mb-4">Test Auth</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="test@test.com"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="password123"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl transition"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl transition"
            >
              Login
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}