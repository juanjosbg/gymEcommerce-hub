import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";
import { addNotification } from "@/lib/supabase/notifications";
import Swal from "sweetalert2";

interface InfoProducBuyProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  totalItems: number;
  onConfirmed?: () => Promise<void> | void;
}

const InfoProducBuy: React.FC<InfoProducBuyProps> = ({
  open,
  onClose,
  cart,
  total,
  totalItems,
  onConfirmed,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) {
      alert("Debes iniciar sesión para continuar.");
      return;
    }
    const addr = user.user_metadata || {};
    const required = [addr.address, addr.city, addr.department, addr.country];
    const missingAddress = required.some((v) => !v || String(v).trim() === "");
    if (missingAddress) {
      Swal.fire({
        icon: "error",
        title: "Datos faltantes",
        text: "Asegurate de que todos los datos esten completo.",
        footer: '<span style="color:#888">Revisa tu perfil → Direcciones para completar los datos.</span>',
      });
      return;
    }

    setLoading(true);

    try {
      // Insert order into Supabase
      const orderData = {
        user_id: user.id,
        items: cart.map(item => ({
          product_id: item.id,
          nombreProducto: item.nombreProducto,
          coverImage: item.coverImage,
          cantidad: item.cantidad || 1,
          precio: item.precio,
        })),
        total,
        customer_info: {
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || "",
          email: user.email,
          phone: user.user_metadata?.phone || "",
          birthday: user.user_metadata?.birthday || "",
          address: {
            country: user.user_metadata?.country || "",
            department: user.user_metadata?.department || "",
            city: user.user_metadata?.city || "",
            address: user.user_metadata?.address || "",
            extra: user.user_metadata?.extra || "",
          },
        },
        status: "pending",
      };   

      const { error } = await supabase.from("orders").insert(orderData);
      if (error) throw error;

      // Call Supabase Edge Function to send email
      const adminEmail = "fitmexstore@gmail.com";
      const { error: funcError } = await supabase.functions.invoke("send-order-email", {
        body: { ...orderData, adminEmail },
      });
      if (funcError) throw funcError;

      // Crear notificación para el usuario
      const itemList = cart.map((item) => `${item.nombreProducto} x${item.cantidad || 1}`).join(", ");
      await addNotification({
        user_id: user.id,
        type: "order",
        title: "Venta de Artículos en proceso",
        body: `Tu pedido con ${totalItems} artículo(s) está en proceso: ${itemList}. Total $${total.toFixed(2)}`,
      });

      // Close modal and show success
      onClose();
      if (onConfirmed) {
        await onConfirmed();
      }
      alert("Pedido enviado exitosamente. Te contactaremos pronto.");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Error al procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirmar Pedido</DialogTitle>
          <DialogDescription>
            Revisa tu información y productos antes de confirmar el pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Información del Cliente</h3>
              <p><strong>Nombre:</strong> {user?.user_metadata?.full_name || user?.user_metadata?.name || "N/A"}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Teléfono:</strong> {user?.user_metadata?.phone || "N/A"}</p>
              <p><strong>Fecha de Nacimiento:</strong> {user?.user_metadata?.birthday || "N/A"}</p>
              <p><strong>Dirección:</strong> {user?.user_metadata?.address || "N/A"}, {user?.user_metadata?.city || "N/A"}, {user?.user_metadata?.department || "N/A"}, {user?.user_metadata?.country || "N/A"}</p>
              <p><strong>Extra:</strong> {user?.user_metadata?.extra || "N/A"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Productos ({totalItems})</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 mb-2">
                  <img src={item.coverImage || "/placeholder.svg"} alt={item.nombreProducto} className="w-16 h-16 object-cover" />
                  <div>
                    <p className="font-semibold">{item.nombreProducto}</p>
                    <p>Cantidad: {item.cantidad || 1}</p>
                    <p>Precio: ${item.precio}</p>
                  </div>
                </div>
              ))}
              <p className="font-bold text-lg mt-4">Total: ${total}</p>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirmar y Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoProducBuy;
