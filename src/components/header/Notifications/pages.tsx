import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  deleteNotification,
  fetchNotifications,
  markRead,
  NotificationRow,
  upsertNotification,
} from "@/lib/supabase/notifications";
import { supabase } from "@/integrations/supabase/client";

const formatDateTime = (isoDate?: string) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const parts = formatter.formatToParts(date).reduce<Record<string, string>>(
    (acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    },
    {},
  );

  const dayPeriod = (parts.dayPeriod || "").replace(/\./g, "").toUpperCase();

  return `${parts.day ?? ""}/${parts.month ?? ""}/${parts.year ?? ""} ${parts.hour ?? ""}:${parts.minute ?? ""}${dayPeriod ? dayPeriod : ""}`.trim();
};

const Notifications = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const hasNotifications = items.length > 0;

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setItems([]);
        setHasUnread(false);
        return;
      }
      setLoading(true);
      const { data, error } = await fetchNotifications(user.id);
      const current = data || [];
      if (!error) {
        setItems(current);
        setHasUnread(current.some((n) => !n.is_read));
      }

      // Construye lote de semillas faltantes
      const toInsert: NotificationRow[] = [];
      const hasWelcome = current.some((n) => n.type === "welcome");
      if (!hasWelcome) {
        const name = user.user_metadata?.full_name || user.email || "Usuario";
        toInsert.push({
          id: 0,
          user_id: user.id,
          type: "welcome",
          title: `Bienvenido ${name} a FITMEX STORE`,
          body: user.created_at ? `Cuenta creada el ${formatDateTime(user.created_at)}` : undefined,
          metadata: null,
          is_read: false,
          created_at: null,
        });
      }

      const missingProfile = !user.user_metadata?.phone || !user.user_metadata?.birthday;
      const hasReminder = current.some((n) => n.type === "profile_reminder");
      if (missingProfile && !hasReminder) {
        toInsert.push({
          id: 0,
          user_id: user.id,
          type: "profile_reminder",
          title: "Completa tu perfil",
          body: "Te faltan algunos datos en tu perfil. Completa tu información.",
          metadata: null,
          is_read: false,
          created_at: null,
        });
      }

      if (toInsert.length > 0) {
        // Inserta faltantes y refetch una sola vez
        await supabase
          .from("notifications")
          .upsert(toInsert.map(({ id, ...rest }) => rest)); // omitir id para que lo asigne el server
        const { data: refreshed } = await fetchNotifications(user.id);
        if (refreshed) {
          setItems(refreshed);
          setHasUnread(refreshed.some((n) => !n.is_read));
        }
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && hasUnread) {
      const unreadIds = items.filter((n) => !n.is_read).map((n) => n.id);
      unreadIds.forEach((id) => markRead(id));
      setItems((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, is_read: true } : n)));
      setHasUnread(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-10 w-10" />
          {hasUnread && (
            <span className="absolute right-2 top-2 inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-start justify-between px-4 py-3 border-b">
          <div>
            <p className="text-sm font-semibold">Notificaciones</p>
            <p className="text-xs text-muted-foreground">
              {user
                ? "Estas son las novedades de tu cuenta."
                : "Inicia sesión para ver tus notificaciones."}
            </p>
          </div>
          {hasNotifications && (
            <Badge variant="secondary" className="mt-1">
              Nuevas
            </Badge>
          )}
        </div>

        <ScrollArea className="h-64">
          <div className="divide-y">
            {!user && (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                No hay notificaciones disponibles.
              </div>
            )}

            {user && !loading && items.length === 0 && (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                No tienes notificaciones nuevas.
              </div>
            )}

            {user &&
              items.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-start gap-3 px-4 py-3 focus:bg-[#f3f3f3]"
                >
                  <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {notif.body}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {notif.created_at ? formatDateTime(notif.created_at) : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                  >
                    Quitar
                  </button>
                </DropdownMenuItem>
              ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
