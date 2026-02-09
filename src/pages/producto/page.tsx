"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/Products/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import { products as staticProducts } from "@/data/content";
import { branch } from "@/data/filterByProduct";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductRowLoose } from "@/entities/product/types";

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const computeMinMaxPrice = (list: Product[]) => {
  const prices = list
    .map((item) => item.price)
    .filter((n): n is number => typeof n === "number");
  if (!prices.length) return [0, 0];
  return [Math.min(...prices), Math.max(...prices)];
};

const applyFilters = (
  list: Product[],
  brand: string,
  range: number[],
  search: string
) => {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredByBrand = list.filter((item) => {
    if (brand === "Mostrar todo") return true;
    const branchObj = branch.find((b) => b.name === brand);
    if (!branchObj) return false;
    return branchObj.categorias.some(
      (cat) =>
        item.category &&
        cat &&
        item.category.trim().toLowerCase() === cat.trim().toLowerCase()
    );
  });

  const filteredByPrice = filteredByBrand.filter(
    (item) =>
      typeof item.price === "number" &&
      range[0] !== undefined &&
      range[1] !== undefined &&
      (item.price as number) >= range[0] &&
      (item.price as number) <= range[1]
  );

  const filteredBySearch = filteredByPrice.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.slug.toLowerCase().includes(normalizedSearch)
    );
  });

  return filteredBySearch;
};

const Page = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [baseProducts, setBaseProducts] =
    useState<Product[]>(staticProducts);
  const [filteredShoes, setFilteredShoes] = useState<Product[]>(
    staticProducts
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Mostrar todo");
  const [selectedRange, setSelectedRange] = useState<number[]>([0, 0]);
  const searchTerm = useMemo(
    () => searchParams.get("search")?.trim() ?? "",
    [searchParams]
  );


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, slug, name, category, price, previous_price, cover_image, images, overview, shipment_details, created_at"
          )
          .order("created_at", { ascending: false });

        if (error || !data?.length) {
          const range = computeMinMaxPrice(staticProducts);
          setBaseProducts(staticProducts);
          setPriceRange(range);
          setSelectedRange(range);
          setFilteredShoes(staticProducts);
          return;
        }

        const mapped: Product[] = (data as ProductRowLoose[]).map((p) => {
          const staticFallback =
            staticProducts.find((s) => s.slug === p.slug) ||
            staticProducts.find(
              (s) => slugify(s.name) === slugify(p.name ?? "")
            );
          const shots = Array.isArray(p.images) ? p.images : [];
          const cover =
            p.cover_image ||
            (shots.length ? shots[0] : null) ||
            staticFallback?.coverImage ||
            "";

          return {
            slug: p.slug || p.id || slugify(p.name || "producto"),
            name: p.name || staticFallback?.name || "Producto",
            category: p.category || staticFallback?.category || "Otros",
            price: typeof p.price === "number" ? p.price : staticFallback?.price || 0,
            previousPrice:
              typeof p.previous_price === "number"
                ? p.previous_price
                : staticFallback?.previousPrice,
            coverImage: cover,
            shots: shots.length ? shots : staticFallback?.shots,
            overview: p.overview ?? staticFallback?.overview,
            shipment_details: p.shipment_details ?? staticFallback?.shipment_details,
          };
        });

        const range = computeMinMaxPrice(mapped);
        setBaseProducts(mapped);
        setPriceRange(range);
        setSelectedRange(range);
        setFilteredShoes(mapped);
      } catch {
        const range = computeMinMaxPrice(staticProducts);
        setBaseProducts(staticProducts);
        setPriceRange(range);
        setSelectedRange(range);
        setFilteredShoes(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setFilteredShoes(
      applyFilters(baseProducts, selectedBrand, selectedRange, searchTerm)
    );
  }, [baseProducts, selectedBrand, selectedRange, searchTerm]);

  const handleFilterChange = (brand: string, range: number[]) => {
    setSelectedBrand(brand);
    setSelectedRange(range);
  };

  return (
    <div>
      <div className="container relative flex flex-col lg:flex-row" id="body">
        <div className="pr-4 pt-10 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters
            onFilterChange={handleFilterChange}
            priceRange={priceRange}
          />
        </div>
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          {loading ? (
            <div className="py-10 text-center text-neutral-500">
              Cargando productos...
            </div>
          ) : filteredShoes.length ? (
            <div className="grid flex-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 py-10 mt-2">
              {filteredShoes.map((item) => (
                <ProductCard showPrevPrice product={item} key={item.slug} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-neutral-500">
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>
      <div className="my-24" />
    </div>
  );
};

export default Page;
