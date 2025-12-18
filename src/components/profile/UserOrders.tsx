import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingBag } from "lucide-react";

type OrderItem = {
  product_id?: string;
  nombreProducto?: string;
  coverImage?: string;
  cantidad?: number;
  precio?: number;
};

type OrderRow = {
  id: string;
  items: OrderItem[];
  total?: number;
  status?: string;
  created_at?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const UserOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("orders")
        .select("id, items, total, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setOrders((data as OrderRow[]) || []);
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando tus pedidos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
        No se pudieron cargar tus pedidos: {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-3 shadow-sm text-sm text-muted-foreground">
        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
        Aún no tienes pedidos.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        const itemCount = items.reduce((acc, itm) => acc + (itm.cantidad || 1), 0);
        return (
          <Card key={order.id} className="p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Orden</p>
                  <p className="text-sm font-semibold truncate">#{order.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {order.status || "pendiente"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <div className="h-14 w-14 overflow-hidden rounded-md bg-neutral-100">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.nombreProducto || "Producto"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        Sin img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-semibold">
                      {item.nombreProducto || "Producto"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cantidad: {item.cantidad || 1}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {typeof item.precio === "number" ? `$${item.precio}` : ""}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-sm font-semibold">
              <span className="text-muted-foreground">
                Total artículos: {itemCount}
              </span>
              <span className="text-lg text-primary">
                Total: ${order.total?.toFixed(2) || "0.00"}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default UserOrders;
