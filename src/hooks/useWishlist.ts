"use client";   import { useWindowSize } from "react-use";

import { useEffect, useState } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const updateStorage = (items: any[]) => {
    setWishlist(items);
    localStorage.setItem("wishlist", JSON.stringify(items));
  };

  const add = (product: any) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) return;

    updateStorage([...wishlist, product]);
  };

  const remove = (productId: string) => {
    updateStorage(wishlist.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((p) => p.id === productId);

  return { wishlist, add, remove, isInWishlist };
}
