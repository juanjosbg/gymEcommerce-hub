// src/lib/supabase/notifications.ts
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";

export type NotificationRow = Tables<"notifications">;

export const fetchNotifications = async (userId: string, isAdmin = false) => {
  const query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
  return isAdmin ? query : query.eq("user_id", userId);
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
