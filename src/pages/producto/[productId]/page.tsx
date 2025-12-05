import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { products } from "@/data/content";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import SectionProductInfo from "./SectionProductInfo";
import { supabase } from "@/integrations/supabase/client";
import Loading from "@/components/Load/loading";

const slugify = (str: string) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type DbProduct = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  price?: number;
  previous_price?: number;
  overview?: string;
  description?: string;
  cover_image?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  shipment_details?: any[] | null;
};

const SingleProductPage = () => {
  const { productId = "" } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const staticMatch = products.find((item) => item.slug === productId);
      if (staticMatch) {
        setSelectedProduct(staticMatch);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from("products")
          .select("*")
          .or(`slug.eq.${productId},id.eq.${productId}`)
          .limit(1)
          .single();

        if (error || !data) {
          setSelectedProduct(null);
        } else {
          const row = data as DbProduct;
          // Intenta encontrar un fallback estático por slug o por nombre
          const staticFallback =
            products.find((p) => p.slug === row.slug) ||
            products.find(
              (p) => slugify(p.name) === slugify(row.name ?? "")
            );

          const shots = Array.isArray(row.images)
            ? row.images
            : row.image_url
            ? [row.image_url]
            : [];
          const cover =
            row.cover_image ||
            (shots.length ? shots[0] : "") ||
            row.image_url ||
            "";

          setSelectedProduct({
            slug: row.slug ?? row.id ?? productId,
            name: row.name ?? staticFallback?.name ?? "Producto",
            category: row.category ?? staticFallback?.category ?? "Otros",
            price: row.price ?? staticFallback?.price ?? 0,
            previousPrice:
              row.previous_price ?? staticFallback?.previousPrice ?? 0,
            overview:
              row.overview ??
              row.description ??
              staticFallback?.overview ??
              "",
            rating: staticFallback?.rating ?? 0,
            pieces_sold: staticFallback?.pieces_sold ?? 0,
            reviews: staticFallback?.reviews ?? 0,
            coverImage: cover || staticFallback?.coverImage || "",
            shots: shots.length ? shots : staticFallback?.shots ?? [],
            shipment_details:
              row.shipment_details ?? staticFallback?.shipment_details ?? [],
          });
        }
      } catch {
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return <Loading />;
  }

  if (!selectedProduct) {
    return (
      <div className="container py-10">
        <p>No se encontró el producto.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <SectionNavigation />
      <div className="mb-20">
        <SectionProductHeader
          shots={selectedProduct?.shots ?? []}
          shoeName={selectedProduct?.name ?? ""}
          prevPrice={selectedProduct?.previousPrice ?? 0}
          currentPrice={selectedProduct?.price ?? 0}
          overview={selectedProduct?.overview ?? ""}
          rating={selectedProduct?.rating ?? 0}
          pieces_sold={selectedProduct?.pieces_sold ?? 0}
          reviews={selectedProduct?.reviews ?? 0}
          coverImage={selectedProduct?.coverImage ?? ""}
          slug={selectedProduct?.slug ?? ""}
          shoeCategory={selectedProduct?.category ?? ""}
        />
      </div>
      <div className="mb-28">
        <SectionProductInfo
          overview={selectedProduct?.overview ?? ""}
          shipment_details={selectedProduct?.shipment_details ?? []}
          ratings={selectedProduct?.rating ?? 0}
          reviews={selectedProduct?.reviews ?? 0}
        />
      </div>
      <div className="mb-28">
        <SectionMoreProducts />
      </div>
    </div>
  );
};

export default SingleProductPage;
