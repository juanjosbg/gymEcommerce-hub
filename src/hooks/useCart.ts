import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  addToCart,
  removeFromCart,
  subscribeToCart,
  updateCartItemQuantity,
  clearUserCart,
} from "@/utils/cartUtils";

export interface CartItem {
  id: string;
  cantidad: number;
  precio: number;
  nombreProducto: string;
  coverImage?: string;
  rating?: number;
  shoeCategory?: string;
}

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const getUserId = (u: any) => u?.id || u?.uid || "anon";

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    const userId = getUserId(user);
    const unsubscribe = subscribeToCart(userId, (items) => {
      setCart(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddToCart = async (item: CartItem) => {
    if (!user) return;
    const userId = getUserId(user);
    await addToCart(userId, item);
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!user) return;
    const userId = getUserId(user);
    await removeFromCart(userId, itemId);
  };

  const handleUpdateQuantity = async (itemId: string, cantidad: number) => {
    if (!user) return;
    const userId = getUserId(user);
    await updateCartItemQuantity(userId, itemId, cantidad);
  };

  const handleClearCart = async () => {
    if (!user) return;
    const userId = getUserId(user);
    await clearUserCart(userId);
    setCart([]);
  };

  return {
    cart,
    loading,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
}
