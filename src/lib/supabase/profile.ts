import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";

export type UserProfileRow = Tables<"user_profiles">;

export async function fetchUserProfile(userId: string) {
  return supabase.from("user_profiles").select("*").eq("id", userId).single();
}

export async function upsertUserProfile(payload: TablesInsert<"user_profiles">) {
  return supabase.from("user_profiles").upsert(payload);
}

export async function fetchUserRole(userId: string) {
  return (supabase as any)
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
}