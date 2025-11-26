// src/utils/cartUtils.ts

// Helpers
const CART_KEY = (userId: string) => `cart:${userId || "anon"}`;

type CartItem = {
  id: string;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  coverImage?: string;
  shoeCategory?: string;
  rating?: number;
  [k: string]: any;
};

const readCart = (userId: string): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY(userId));
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const writeCart = (userId: string, items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY(userId), JSON.stringify(items));
};

// API
export const addToCart = async (userId: string, item: CartItem) => {
  if (!item || !item.id) throw new Error("El producto no tiene id");
  const items = readCart(userId);
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx].cantidad += item.cantidad ?? 1;
  } else {
    items.push({ ...item, cantidad: item.cantidad ?? 1 });
  }
  writeCart(userId, items);
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const items = readCart(userId).filter((i) => i.id !== itemId);
  writeCart(userId, items);
};

export const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  cantidad: number
) => {
  const items = readCart(userId).map((i) =>
    i.id === itemId ? { ...i, cantidad } : i
  );
  writeCart(userId, items);
};

export const subscribeToCart = (
  userId: string,
  callback: (items: CartItem[]) => void,
  intervalMs = 800
) => {
  let last = "";
  const tick = () => {
    const raw = localStorage.getItem(CART_KEY(userId)) || "";
    if (raw !== last) {
      last = raw;
      callback(raw ? (JSON.parse(raw) as CartItem[]) : []);
    }
  };
  const id = setInterval(tick, intervalMs);
  tick(); 
  return () => clearInterval(id);
};

export const clearUserCart = async (userId: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY(userId));
};
