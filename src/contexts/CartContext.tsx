import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import {
  fetchCartItems,
  saveCartItems,
  clearCart as clearCartApi,
} from "@/services/cartApi";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string) => Promise<void>;
  addMultipleToCart: (items: { productId: string; quantity: number; priceAtAdd?: number }[]) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      const items = await fetchCartItems();
      setCartItems((items as any) || []);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    try {
      const existing = cartItems.find((i) => i.product_id === productId);
      const nextQty = existing ? existing.quantity + 1 : 1;
      await saveCartItems([{ productId, quantity: nextQty }]);
      await refreshCart();
      toast.success("Producto agregado al carrito");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error("Error al agregar producto al carrito");
    }
  };

  const addMultipleToCart = async (items: { productId: string; quantity: number; priceAtAdd?: number }[]) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    try {
      await saveCartItems(items);
      await refreshCart();
      toast.success("Productos agregados al carrito");
    } catch (error: any) {
      console.error("Error adding multiple items:", error);
      toast.error("Error al agregar productos");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await supabase.from("cart_items").delete().eq("id", itemId);
      await refreshCart();
      toast.success("Producto eliminado del carrito");
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast.error("Error al eliminar producto");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
      await refreshCart();
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast.error("Error al actualizar cantidad");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      setCartItems([]);
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Error al vaciar carrito");
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    cartCount,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
