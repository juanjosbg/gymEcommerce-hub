import React from "react";
import PromoTag from "./PromoTag";
import { Content } from "@/data/content";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const psychoticImages = [
  "../../public/PSYCCHOTIC1.png",
  "../../public/PSYCCHOTIC2.png",
  "../../public/PSYCCHOTIC3.png",
  "../../public/PSYCCHOTIC4.png",
];

const { headerSection } = Content.ui;

function PromotionalPag() {
  return (
    <section className="container items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0 py-12 from-gray-50 to-white">
      <div className="basis-[68%] pl-10 items-center space-y-10 rounded-2xl bg-[#f3f3f3] p-5 md:flex md:space-y-0 hover:shadow-md transition-shadow">
        <div className="basis-[63%]">
          <h4 className="mb-5 text-xl font-medium text-primary">
            {headerSection.title}
          </h4>
          <h1
            className="text-[50px] font-medium tracking-tight"
            style={{ lineHeight: "1em" }}
          >
            {headerSection.heading}
          </h1>
          <p className="my-10 w-4/5 text-neutral-500">
            {headerSection.description}
          </p>
          <button className="px-5 py-4 rounded-full bg-primary text-white hover:bg-primary/80 disabled:bg-opacity-70">
            View Product
          </button>
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
            {psychoticImages.map((src, index) => (
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
