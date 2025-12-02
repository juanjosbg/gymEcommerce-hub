// src/services/cartApi.ts
import { supabase } from "@/integrations/supabase/client";

type CartItemInput = { productId: string; quantity: number; priceAtAdd?: number };

async function getOrCreateCart(userId: string) {
  let { data: cart, error } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error && (error as any).code === "PGRST116") {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (createError) throw createError;
    cart = newCart;
  } else if (error) {
    throw error;
  }
  if (!cart) throw new Error("No se pudo obtener/crear carrito");
  return cart.id as string;
}

export async function saveCartItems(items: CartItemInput[]) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Debe iniciar sesión");

  const cartId = await getOrCreateCart(user.id);

  const rows = items.map((i) => ({
    cart_id: cartId,
    product_id: i.productId,
    quantity: Math.max(1, i.quantity),
    price_at_add: i.priceAtAdd,
  }));

  const { error: upsertError } = await supabase
    .from("cart_items")
    .upsert(rows, { onConflict: "cart_id,product_id" });

  if (upsertError) throw upsertError;
  return rows.length;
}

export async function fetchCartItems() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Debe iniciar sesión");

  const cartId = await getOrCreateCart(user.id);

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      product_id,
      quantity,
      price_at_add,
      product:products(id, name, price, image_url:cover_image)
    `)
    .eq("cart_id", cartId);

  if (error) throw error;
  return data || [];
}

export async function clearCart() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Debe iniciar sesión");

  const cartId = await getOrCreateCart(user.id);
  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId);
  if (error) throw error;
}
