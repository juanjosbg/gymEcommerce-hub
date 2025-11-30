"use client";

import React, { useMemo } from "react";
import { HeartOff } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  const normalizedWishlist = useMemo(
    () => wishlist.map((item) => ({ ...item, id: item.id || item.slug || item.name })),
    [wishlist],
  );

  const isEmpty = normalizedWishlist.length === 0;

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos de interés</h1>
          <p className="text-sm text-muted-foreground">
            Tus productos guardados con like.
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <HeartOff className="mb-3 h-10 w-10" />
          <p className="text-sm">Aún no tienes productos marcados como favoritos.</p>
          <p className="text-xs">Usa el icono de corazón en los productos para agregarlos aquí.</p>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {normalizedWishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
