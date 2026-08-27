"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/debug", {
          credentials: "include",
        });
        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading debug info...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#07111f] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Debug: Session & Auth</h1>
      
      <div className="bg-white/5 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Session Status</h2>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      </div>

      <div className="bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Actions</h2>
        <button
          onClick={() => window.location.href = "/auth/login"}
          className="bg-blue-600 px-4 py-2 rounded mr-2"
        >
          Go to Login
        </button>
        <button
          onClick={async () => {
            const response = await fetch("/api/auth/session", {
              credentials: "include",
            });
            const data = await response.json();
            setSessionData(data);
          }}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Refresh Session
        </button>
      </div>
    </div>
  );
}