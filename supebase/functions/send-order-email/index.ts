import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Ejemplo con Resend (ajusta remitente y destinatarios):
// import { Resend } from "npm:resend@2.0.0";
// const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // cámbialo a tu dominio si quieres restringir
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const order = await req.json();

    // TODO: valida y arma el correo
    // Ejemplo con Resend:
    // await resend.emails.send({
    //   from: "Fitmex Store <tu-remitente@tudominio>",
    //   to: ["fitmexstore@gmail.com"], // o order.customer_info.email
    //   subject: `Nuevo pedido de ${order.customer_info.fullName || "cliente"}`,
    //   html: `<p>Total: $${order.total}</p><pre>${JSON.stringify(order.items, null, 2)}</pre>`,
    // });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to process order" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
