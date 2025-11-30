import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";

export type NotificationRow = Tables<"notifications">;

export const fetchNotifications = async (userId: string) => {
  return supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

export const addNotification = async (payload: TablesInsert<"notifications">) => {
  return supabase.from("notifications").insert(payload);
};

export const upsertNotification = async (payload: TablesInsert<"notifications">) => {
  return supabase.from("notifications").upsert(payload);
};

export const deleteNotification = async (id: number) => {
  return supabase.from("notifications").delete().eq("id", id);
};

export const markRead = async (id: number) => {
  return supabase.from("notifications").update({ is_read: true }).eq("id", id);
};
