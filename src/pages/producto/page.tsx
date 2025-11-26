"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/Products/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import { products } from "@/data/content";
import { branch } from "@/data/filterByProduct";
import { Header } from "@/components/Header";

const getMinMaxPrice = () => {
  const prices = products.map((item) => item.price || 0);
  return [Math.min(...prices), Math.max(...prices)];
};

const Page = () => {
  const [priceRange, setPriceRange] = useState(getMinMaxPrice());
  const [filteredShoes, setFilteredShoes] = useState(products);

  const handleFilterChange = (brand: string, range: number[]) => {
    setPriceRange(range);
    let filtered = [...products];

    if (brand !== "Mostrar todo") {
      const branchObj = branch.find((b) => b.name === brand);
      if (branchObj) {
        filtered = filtered.filter((item) =>
          branchObj.categorias.some(
            (cat) =>
              item.category &&
              cat &&
              item.category.trim().toLowerCase() === cat.trim().toLowerCase()
          )
        );
      } else {
        filtered = [];
      }
    }

    filtered = filtered.filter(
      (item) =>
        typeof item.price === "number" &&
        range[0] !== undefined &&
        range[1] !== undefined &&
        item.price >= range[0] &&
        item.price <= range[1]
    );

    setFilteredShoes(filtered);
  };

  useEffect(() => {
    setFilteredShoes(products);
    setPriceRange(getMinMaxPrice());
  }, []);

  return (
    <div>
      <Header />
      <div className="container relative flex flex-col lg:flex-row" id="body">
        <div className="pr-4 pt-10 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters
            onFilterChange={handleFilterChange}
            priceRange={priceRange}
          />
        </div>
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="grid flex-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 py-10 mt-2">
            {filteredShoes.map((item) => (
              <ProductCard showPrevPrice product={item} key={item.slug} />
            ))}
          </div>
        </div>
      </div>
      <div className="my-24" />
    </div>
  );
};

export default Page;
