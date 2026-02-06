"use client";

import React, { useEffect, useMemo, useState } from "react";
import "@splidejs/react-splide/css";
import { Content } from "@/data/content";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { supabase } from "@/integrations/supabase/client";

const { promotionTag } = Content.ui;
const promoImages = ["/OFF.webp", "/OFF2.webp", "/PreEntreno.webp"];
const PROMO_ID = "home_promo";

const PromoTag = () => {
  const [title, setTitle] = useState(promotionTag.title);
  const [ctaText, setCtaText] = useState("Conocer Más");
  const [ctaLink, setCtaLink] = useState("/producto");
  const [images, setImages] = useState<string[]>(promoImages);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("marketing_content")
        .select("promo_tag_title, promo_tag_cta_text, promo_tag_cta_link, promo_tag_images")
        .eq("id", PROMO_ID)
        .maybeSingle();
      if (error || !data) return;
      setTitle(data.promo_tag_title || promotionTag.title);
      setCtaText(data.promo_tag_cta_text || "Conocer Más");
      setCtaLink(data.promo_tag_cta_link || "/producto");
      if (Array.isArray(data.promo_tag_images) && data.promo_tag_images.length) {
        setImages(data.promo_tag_images);
      }
    };
    load();
  }, []);

  const slides = useMemo(() => (images.length ? images : promoImages), [images]);

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
        {slides.map((src, index) => (
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
          {title}
        </h1>
        <div>
          <a
            href={ctaLink || "/producto"}
            className="inline-flex bg-white text-primary px-5 py-4 rounded-full font-medium"
          >
            {ctaText || "Conocer Más"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromoTag;
