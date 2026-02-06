import React, { useEffect, useMemo, useState } from "react";
import PromoTag from "./PromoTag";
import { Content } from "@/data/content";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { supabase } from "@/integrations/supabase/client";

const psychoticImages = [
  "../../public/PSYCCHOTIC1.png",
  "../../public/PSYCCHOTIC2.png",
  "../../public/PSYCCHOTIC3.png",
  "../../public/PSYCCHOTIC4.png",
];

const { headerSection } = Content.ui;
const PROMO_ID = "home_promo";

function PromotionalPag() {
  const [title, setTitle] = useState(headerSection.title);
  const [heading, setHeading] = useState(headerSection.heading);
  const [description, setDescription] = useState(headerSection.description);
  const [ctaText, setCtaText] = useState("View Product");
  const [ctaLink, setCtaLink] = useState("/producto");
  const [images, setImages] = useState<string[]>(psychoticImages);

  useEffect(() => {
    const loadPromo = async () => {
      const { data, error } = await supabase
        .from("marketing_content")
        .select("*")
        .eq("id", PROMO_ID)
        .maybeSingle();

      if (error || !data) return;
      setTitle(data.title || headerSection.title);
      setHeading(data.heading || headerSection.heading);
      setDescription(data.description || headerSection.description);
      setCtaText(data.cta_text || "View Product");
      setCtaLink(data.cta_link || "/producto");
      if (Array.isArray(data.images) && data.images.length) {
        setImages(data.images);
      }
    };

    loadPromo();
  }, []);

  const sliderImages = useMemo(
    () => (images.length ? images : psychoticImages),
    [images]
  );

  return (
    <section className="container items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0 py-12 from-gray-50 to-white">
      <div className="basis-[68%] pl-10 items-center space-y-10 rounded-2xl bg-[#f3f3f3] p-5 md:flex md:space-y-0 hover:shadow-md transition-shadow">
        <div className="basis-[63%]">
          <h4 className="mb-5 text-xl font-medium text-primary">
            {title}
          </h4>
          <h1
            className="text-[50px] font-medium tracking-tight"
            style={{ lineHeight: "1em" }}
          >
            {heading}
          </h1>
          <p className="my-10 w-4/5 text-neutral-500">
            {description}
          </p>
          <a
            href={ctaLink || "/producto"}
            className="inline-flex px-5 py-4 rounded-full bg-primary text-white hover:bg-primary/80 disabled:bg-opacity-70"
          >
            {ctaText || "View Product"}
          </a>
        </div>

        <div className="basis-[37%]">
          <Splide
            options={{
              type: "loop",
              autoplay: true,
              interval: 3000,
              pauseOnHover: false,
              arrows: false,
              pagination: false,
            }}
          >
            {sliderImages.map((src, index) => (
              <SplideSlide key={index}>
                <img
                  src={src}
                  alt="Psychotic product"
                  className="w-full h-full object-contain"
                />
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>

      <div className="mt-5 basis-[30%] lg:mt-0">
        <PromoTag />
      </div>
    </section>
  );
}

export default PromotionalPag;
