import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export async function upsertUserProfile(payload: TablesInsert<"user_profiles">) {
  return supabase.from("user_profiles").upsert(payload);
}
