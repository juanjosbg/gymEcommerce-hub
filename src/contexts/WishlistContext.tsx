import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishlistItem = {
  id?: string;
  slug?: string;
  name?: string;
  [key: string]: any;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  add: (product: WishlistItem) => void;
  remove: (productId: string) => void;
  isInWishlist: (productId?: string | null) => boolean;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getProductId = (product: WishlistItem): string | undefined => {
  if (!product) return undefined;
  return product.id || product.slug || product.name;
};

const STORAGE_KEY = "wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setWishlist([]);
      }
    }
  }, []);

  const updateStorage = (items: WishlistItem[]) => {
    setWishlist(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const add = (product: WishlistItem) => {
    const normalizedId = getProductId(product);
    if (!normalizedId) return;

    setWishlist((prev) => {
      const exists = prev.some((p) => getProductId(p) === normalizedId);
      if (exists) return prev;
      const next = [...prev, { ...product, id: normalizedId }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const remove = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((p) => getProductId(p) !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    updateStorage([]);
  };

  const normalizedWishlist = useMemo(
    () => wishlist.map((item) => ({ ...item, id: getProductId(item) })),
    [wishlist],
  );

  const isInWishlist = (productId?: string | null) =>
    Boolean(productId) && normalizedWishlist.some((p) => getProductId(p) === productId);

  const value: WishlistContextType = {
    wishlist: normalizedWishlist,
    add,
    remove,
    isInWishlist,
    clear,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return ctx;
};
