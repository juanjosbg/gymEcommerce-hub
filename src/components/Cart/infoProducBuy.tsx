import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";

interface InfoProducBuyProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  totalItems: number;
}

const InfoProducBuy: React.FC<InfoProducBuyProps> = ({
  open,
  onClose,
  cart,
  total,
  totalItems,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Insert order into Supabase
      // Note: You need to create the "orders" table in Supabase with appropriate columns
      // Columns: id (uuid, primary), user_id (uuid), items (jsonb), total (numeric), customer_info (jsonb), status (text), created_at (timestamptz)
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

      // Since "orders" table is not in types, use any for now or update types
      const { error } = await (supabase as any).from("orders").insert(orderData);
      if (error) throw error;

      // Send email using Resend (install resend library first)
      // Note: You need to install resend: npm install resend
      // And set RESEND_API_KEY in your environment variables
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Replace with your verified domain
          to: "fitmexstore@gmail.com",
          subject: "Nuevo pedido recibido",
          html: generateEmailHTML(orderData),
        }),
      });

      if (!resendResponse.ok) throw new Error("Failed to send email");

      // Close modal and perhaps navigate or show success
      onClose();
      alert("Pedido enviado exitosamente. Te contactaremos pronto.");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Error al procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmailHTML = (orderData: any) => {
    const itemsHTML = orderData.items.map((item: any) => `
      <div style="margin-bottom: 10px;">
        <img src="${item.coverImage}" alt="${item.nombreProducto}" style="width: 100px; height: 100px; object-fit: cover;" />
        <p><strong>Producto:</strong> ${item.nombreProducto}</p>
        <p><strong>Cantidad:</strong> ${item.cantidad}</p>
        <p><strong>Precio:</strong> $${item.precio}</p>
      </div>
    `).join("");

    return `
      <h1>Nuevo Pedido</h1>
      <h2>Información del Cliente</h2>
      <p><strong>Nombre:</strong> ${orderData.customer_info.fullName}</p>
      <p><strong>Email:</strong> ${orderData.customer_info.email}</p>
      <p><strong>Teléfono:</strong> ${orderData.customer_info.phone}</p>
      <p><strong>Fecha de Nacimiento:</strong> ${orderData.customer_info.birthday}</p>
      <p><strong>Dirección:</strong> ${orderData.customer_info.address.address}, ${orderData.customer_info.address.city}, ${orderData.customer_info.address.department}, ${orderData.customer_info.address.country}</p>
      <p><strong>Extra:</strong> ${orderData.customer_info.address.extra}</p>
      <h2>Productos</h2>
      ${itemsHTML}
      <h2>Total: $${orderData.total}</h2>
    `;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirmar Pedido</DialogTitle>
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