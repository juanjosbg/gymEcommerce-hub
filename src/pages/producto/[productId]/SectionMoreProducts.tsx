import React from "react";
import ProductCard from "@/components/Products/ProductCard";
import { products } from "@/data/content";
import Heading from "@/shared/Heading/Heading";

const SectionMoreProducts = () => (
  <div>
    <Heading className="mb-0">Explora más productos</Heading>
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
      {products.slice(0, 9).map((item) => (
        <ProductCard
          key={item.slug}
          product={item}
          className="border-neutral-300"
        />
      ))}
    </div>
  </div>
);

export default SectionMoreProducts;
