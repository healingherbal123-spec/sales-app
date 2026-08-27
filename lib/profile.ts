import { createClient } from "@/lib/supabase/client";

export type UserRole =
  | "owner"
  | "admin"
  | "manager"
  | "sales_rep"
  | "inventory"
  | "finance"
  | "delivery"
  | "hr";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  company_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile error:", error);
    return null;
  }

  return data as Profile;
}