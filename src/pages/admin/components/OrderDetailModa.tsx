import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import StateUserproduct from "./StateUserproduct";
import { Mail, Phone, MapPin, User } from "lucide-react";

type OrderItem = {
  product_id?: string;
  nombreProducto?: string;
  coverImage?: string;
  cantidad?: number;
  precio?: number;
};

type CustomerInfo = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  birthday?: string | null;
  address?: {
    country?: string | null;
    department?: string | null;
    city?: string | null;
    address?: string | null;
    extra?: string | null;
  } | null;
};

type OrderRow = {
  id: string;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
  items?: OrderItem[] | null;
  customer_info?: CustomerInfo | null;
};

type Props = {
  order: OrderRow | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
};

const formatMoney = (value?: number | null) =>
  typeof value === "number" ? `$${value.toFixed(2)}` : "—";

const OrderDetailModal: React.FC<Props> = ({
  order,
  open,
  onClose,
  onStatusChange,
}) => {
  const items = Array.isArray(order?.items) ? order?.items : [];
  const info = order?.customer_info || {};
  const address = info.address || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalle de orden:</span>
          </DialogTitle>
          <hr className="py-1"/>
          <DialogDescription className="flex items-center justify-between">
            {order?.id ? (
              <span className="text-sm font-mono text-neutral-500">
                <span className="text-sm font-semibold text-neutral-800">
                  No. de orden:{" "}
                </span>{" "}
                {order.id}
              </span>
            ) : null}
            {order?.id ? (
              <div>
                <StateUserproduct
                  orderId={order.id}
                  status={order.status}
                  onUpdated={(status) => onStatusChange?.(status)}
                />
              </div>
            ) : null}
          </DialogDescription>
          <DialogDescription className="mb-10">
            Revisa los productos y la información del cliente.
          </DialogDescription>
        </DialogHeader>

        {/* Items */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-neutral-50 p-4">
            <div className="mb-3 text-sm font-semibold text-neutral-700">
              Productos
            </div>
            {!items?.length ? (
              <p className="text-sm text-neutral-500">Sin productos.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={`${item.product_id ?? idx}-${idx}`}
                    className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-md bg-neutral-100">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.nombreProducto || "Producto"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                          Sin img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold">
                        {item.nombreProducto || "Producto"}
                      </span>
                      <span className="text-xs text-neutral-500">
                        Cantidad: {item.cantidad ?? 1}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {formatMoney(item.precio)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end text-sm font-semibold text-primary">
              Total: {formatMoney(order?.total)}
            </div>
          </div>

          {/* Customer info */}
          <div className="rounded-xl border bg-neutral-50 p-4">
            <div className="mb-3 text-sm font-semibold text-neutral-700">
              Información personal
            </div>
            <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-neutral-500" />
                <span>{info.fullName || "Sin nombre"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span>{info.email || "Sin correo"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neutral-500" />
                <span>{info.phone || "Sin teléfono"}</span>
              </div>
              {info.birthday ? (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Cumpleaños:</span>
                  <span>{info.birthday}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <span>
                  {[
                    address.address,
                    address.city,
                    address.department,
                    address.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Sin dirección"}
                </span>
              </div>
              {address.extra ? (
                <div className="text-neutral-500">
                  Detalles: {address.extra}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
