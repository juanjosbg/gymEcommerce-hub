"use client";

import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import { promotionTag } from "@/data/content";

const promoImages = ["/OFF.webp", "/OFF2.webp", "/PreEntreno.webp"];

const PromoTag = () => {
  return (
    <div className="relative h-[420px] w-full rounded-2xl overflow-hidden text-white">
      <Splide
        options={{
          type: "loop",
          autoplay: true,
          interval: 4000,
          arrows: false,
          pagination: false,
        }}
        className="absolute inset-0 z-0"
      >
        {promoImages.map((src, index) => (
          <SplideSlide key={index}>
            <div
              className="w-full h-[420px] bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          </SplideSlide>
        ))}
      </Splide>

      <div className="absolute inset-0 bg-black/75 z-10" />

      <div className="absolute inset-0 z-30 flex flex-col justify-between p-8">
        <h1 className="text-[32px] md:text-[40px] font-semibold uppercase leading-tight">
          {promotionTag.title}
        </h1>
        <div>
          <button className="bg-white text-primary px-5 py-4 rounded-full font-medium">
            Conocer Más
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoTag;
