"use client";
import React, { useEffect, useMemo, useState } from "react";
import { products as localProducts } from "@/data/content";
import Slider from "@/shared/Slider/Slider";
import ProductCard from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { ProductImages } from "@/data/ImgContent";
import type { Product, ProductRowLoose } from "@/entities/product/types";

const slugify = (str: string) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isPlaceholderImage = (url: string | null | undefined) =>
  !!url && url.startsWith("https://TU_URL/");

const ProductSlider = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getFallbackCover = (slug: string, name: string) => {
    const keyDirect = ProductImages[slug as keyof typeof ProductImages]
      ? slug
      : undefined;

    const keyByMatch =
      keyDirect ||
      (Object.keys(ProductImages).find((k) => {
        const lowerK = k.toLowerCase();
        const lowerSlug = slug.toLowerCase();
        const lowerName = name.toLowerCase();
        return (
          lowerSlug.includes(lowerK) ||
          lowerK.includes(lowerSlug) ||
          lowerName.includes(lowerK)
        );
      }) as keyof typeof ProductImages | undefined);

    if (keyByMatch) {
      const imgSet = ProductImages[keyByMatch];
      if (imgSet?.length) return imgSet[0];
    }
    return "";
  };

  useEffect(() => {
    const loadPromos = async () => {
      setLoading(true);
      try {
        const { data: promoRows } = await supabase
          .from("promo_products")
          .select("product_id, sort_order")
          .eq("promo_key", "home_slider")
          .order("sort_order", { ascending: true });

        const promoIds: string[] = Array.isArray(promoRows)
          ? promoRows
              .map((row) => String(row.product_id))
              .filter(Boolean)
          : [];

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const rows = (data ?? []) as ProductRowLoose[];
        const mapRow = (p: ProductRowLoose) => {
          const slug = p.slug || slugify(p.name || String(p.id));
          const baseImage =
            p.cover_image ||
            p.image_url ||
            (Array.isArray(p.images) && p.images.length ? p.images[0] : null);
          const cover =
            baseImage && !isPlaceholderImage(baseImage)
              ? baseImage
              : getFallbackCover(slug, p.name || "");

          return {
            slug,
            name: p.name || "Producto",
            category: typeof p.category === "string" ? p.category : "Otros",
            price: Number(p.price ?? 0),
            previousPrice:
              typeof p.previous_price === "number" ? p.previous_price : undefined,
            coverImage: cover || "",
            shots: Array.isArray(p.images) ? p.images : [],
            overview: p.overview ?? undefined,
            justIn: !!p.just_in,
          } as Product;
        };

        let promosFromDb: Product[] = [];
        if (promoIds.length) {
          const byId = new Map<string, ProductRowLoose>();
          rows.forEach((p) => byId.set(String(p.id), p));
          promosFromDb = promoIds
            .map((id) => byId.get(String(id)))
            .filter(Boolean)
            .map(mapRow);
        } else {
          promosFromDb = rows
            .filter(
              (p) => typeof p.previous_price === "number" && p.previous_price > 0
            )
            .map(mapRow);
        }

        const fallback = localProducts.filter((p) => p.previousPrice);
        const finalList = promosFromDb.length ? promosFromDb : fallback;
        setItems(finalList);
      } catch (err) {
        const fallback = localProducts.filter((p) => p.previousPrice);
        setItems(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadPromos();
  }, []);

  const data = useMemo(() => items, [items]);

  return (
    <div>
      {!loading && (
        <Slider
          itemPerRow={4}
          data={data}
          renderItem={(item) => {
            if (!item) return null;

            return (
              <ProductCard
                showPrevPrice={item.previousPrice !== undefined}
                product={item}
                className="bg-white"
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductSlider;
