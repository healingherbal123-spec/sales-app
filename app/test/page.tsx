"use client";

import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const supabaseUrl = "https://ycpnrakkwmohovippcaw.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcG5yYWtrd21vaG92aXBwY2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NTMxNTEsImV4cCI6MjEwMzAyOTE1MX0.cZZb8Q_h2FdvXPtbHbYvQuiQkewj-vqBOmhwuj47tFM";

      // Test 1: Direct fetch
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseAnonKey,
        },
      });

      const data = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        url: supabaseUrl,
        headers: Object.fromEntries(response.headers.entries()),
      };

      setResult(data);
    } catch (error: any) {
      setResult({
        error: error.message,
        stack: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
      
      {result && (
        <div className="mt-4 bg-white/5 p-4 rounded-lg overflow-auto">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}