"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function TestSupabasePage() {
  const [result, setResult] = useState("Testing...");
  
  async function testConnection() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setResult(`ERROR: ${error.message}`);
      return;
    }
    setResult(
      `Supabase connection OK. Session: ${
        data.session ? "Active" : "No active session"
      }`
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Supabase Test</h1>
      <button
        onClick={testConnection}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Test Supabase
      </button>
      <pre className="mt-6 whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}