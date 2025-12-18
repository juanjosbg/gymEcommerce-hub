import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Loader2, Mail, Package, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import OrderDetailModal from "@/pages/admin/components/OrderDetailModa";
import { STATUS_OPTIONS } from "@/pages/admin/components/StateUserproduct";

type OrderItem = {
  product_id?: string;
  nombreProducto?: string;
  coverImage?: string;
  cantidad?: number;
  precio?: number;
};

type OrderRow = {
  id: string;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
  items?: OrderItem[] | null;
  customer_info?: {
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminOrdenesPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, created_at, customer_info, items")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setOrders((data as OrderRow[]) || []);
      }
      setLoading(false);
    };

    loadOrders();
  }, []);

  const totalOrders = useMemo(() => orders.length, [orders]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 text-neutral-900">
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Overview</p>
              <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
                Ordenes
              </h1>
              <p className="text-sm text-neutral-500">
                Total de órdenes: {totalOrders}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50 text-left text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Orden</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Correo</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {loading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-neutral-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cargando órdenes…
                        </div>
                      </td>
                    </tr>
                  )}

                  {error && !loading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-red-600"
                      >
                        Error al cargar órdenes: {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-neutral-500"
                      >
                        No hay órdenes registradas.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    orders.map((order, idx) => {
                      const info = order.customer_info || {};
                      return (
                        <tr key={order.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 font-semibold text-neutral-600">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-neutral-900">
                                #{order.id.slice(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-neutral-500" />
                              <span>{info.fullName || "Sin nombre"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-neutral-500" />
                              <span>{info.email || "Sin correo"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {(() => {
                              const statusObj = STATUS_OPTIONS.find(
                                (s) => s.value === order.status
                              );
                              return statusObj ? (
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusObj.badge}`}
                                >
                                  {statusObj.label}
                                </span>
                              ) : (
                                order.status || "pendiente"
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary">
                            {typeof order.total === "number"
                              ? `$${order.total.toFixed(2)}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-primary hover:underline"
                            >
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <OrderDetailModal
            order={selectedOrder}
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(newStatus) => {
              if (!selectedOrder) return;
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === selectedOrder.id ? { ...o, status: newStatus } : o
                )
              );
              setSelectedOrder((prev) =>
                prev ? { ...prev, status: newStatus } : prev
              );
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminOrdenesPage;
