import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = "https://ycpnrakkwmohovippcaw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcG5yYWtrd21vaG92aXBwY2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NTMxNTEsImV4cCI6MjEwMzAyOTE1MX0.cZZb8Q_h2FdvXPtbHbYvQuiQkewj-vqBOmhwuj47tFM";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}