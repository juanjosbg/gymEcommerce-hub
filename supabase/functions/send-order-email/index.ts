import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore - Deno std lib types resolved in Edge runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - types resolved by Deno at runtime for npm spec imports
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // cámbialo a tu dominio si quieres restringir
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (globalThis as any).Deno?.env;
const resendApiKey = env?.get("RESEND_API_KEY") ?? "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const defaultFrom = env?.get("EMAIL_FROM") || "Fitmex Store <no-reply@fitmex.store>";
const adminFallback = env?.get("ADMIN_EMAIL") || "fitmexstore@gmail.com";
const sendgridApiKey = env?.get("SENDGRID_API_KEY") || "";
const sendgridFrom = env?.get("SENDGRID_FROM") || defaultFrom;

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const order = await req.json();
    const adminEmail = order.adminEmail || adminFallback;
    const customerEmail = order.customer_info?.email;

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = items
      .map(
        (item: any) => `
          <tr>
            <td style="padding:8px; border:1px solid #eee;">
              ${item.coverImage ? `<img src="${item.coverImage}" alt="${item.nombreProducto || ""}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;" />` : "Sin imagen"}
            </td>
            <td style="padding:8px; border:1px solid #eee;">
              <div style="font-weight:600;">${item.nombreProducto || "Producto"}</div>
              <div style="color:#555;font-size:12px;">ID: ${item.product_id || "-"}</div>
            </td>
            <td style="padding:8px; border:1px solid #eee; text-align:center;">${item.cantidad || 1}</td>
            <td style="padding:8px; border:1px solid #eee; text-align:right;">$${item.precio ?? ""}</td>
          </tr>
        `
      )
      .join("");

    const address = order.customer_info?.address || {};
    const html = `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#111; max-width:640px; margin:0 auto; padding:16px;">
        <h1 style="font-size:20px; margin:0 0 12px;">Nuevo pedido</h1>
        <p style="margin:4px 0;"><strong>Cliente:</strong> ${order.customer_info?.fullName || "Sin nombre"}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${customerEmail || "N/D"}</p>
        <p style="margin:4px 0;"><strong>Teléfono:</strong> ${order.customer_info?.phone || "N/D"}</p>
        <p style="margin:4px 0;"><strong>Fecha de nacimiento:</strong> ${order.customer_info?.birthday || "N/D"}</p>
        <p style="margin:4px 0;"><strong>Dirección:</strong> ${address.address || ""}, ${address.city || ""}, ${address.department || ""}, ${address.country || ""}</p>
        <p style="margin:4px 0;"><strong>Extra:</strong> ${address.extra || "N/D"}</p>
        <p style="margin:8px 0 16px;"><strong>Total:</strong> $${order.total ?? 0}</p>

        <h3 style="margin:12px 0 8px;">Productos</h3>
        <table style="border-collapse:collapse; width:100%; font-size:14px;">
          <thead>
            <tr>
              <th style="padding:8px; border:1px solid #eee; text-align:left;">Imagen</th>
              <th style="padding:8px; border:1px solid #eee; text-align:left;">Producto</th>
              <th style="padding:8px; border:1px solid #eee; text-align:center;">Cantidad</th>
              <th style="padding:8px; border:1px solid #eee; text-align:right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml || `<tr><td colspan="4" style="padding:12px; text-align:center;">Sin items</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    let sentVia: "none" | "resend" | "sendgrid" = "none";

    // Intento Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: defaultFrom,
          to: [adminEmail].filter(Boolean),
          subject: `Nuevo pedido de ${order.customer_info?.fullName || "cliente"}`,
          html,
        });
        if (customerEmail) {
          await resend.emails.send({
            from: defaultFrom,
            to: [customerEmail],
            subject: "Hemos recibido tu pedido",
            html: `<p>Gracias por tu compra. Tu pedido está en proceso.</p>${html}`,
          });
        }
        sentVia = "resend";
      } catch (err) {
        console.error("Resend falló, probando SendGrid", err);
      }
    }

    // Fallback SendGrid
    if (sentVia === "none" && sendgridApiKey) {
      const sendGridPayload = (to: string, subject: string, body: string) => ({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: sendgridFrom },
        subject,
        content: [{ type: "text/html", value: body }],
      });
      const sendEmail = async (payload: any) => {
        const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`SendGrid error ${resp.status}: ${txt}`);
        }
      };
      try {
        await sendEmail(
          sendGridPayload(
            adminEmail,
            `Nuevo pedido de ${order.customer_info?.fullName || "cliente"}`,
            html,
          ),
        );
        if (customerEmail) {
          await sendEmail(
            sendGridPayload(
              customerEmail,
              "Hemos recibido tu pedido",
              `<p>Gracias por tu compra. Tu pedido está en proceso.</p>${html}`,
            ),
          );
        }
        sentVia = "sendgrid";
      } catch (err) {
        console.error("SendGrid también falló", err);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, sentTo: { admin: adminEmail, customer: !!customerEmail }, via: sentVia }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to process order" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
