"use client";
import React from "react";
import { products } from "@/data/content";
import Slider from "@/shared/Slider/Slider";
import ProductCard from "./ProductCard";

const data = products.slice(0, 10);

const ProductSlider = () => {
  return (
    <div>
      <Slider
        itemPerRow={4}
        data={data}
        renderItem={(item) => {
          if (!item) return null;

          return (
            <ProductCard
              showPrevPrice
              product={item}
              className="bg-white"
            />
          );
        }}
      />
    </div>
  );
};

export default ProductSlider;
