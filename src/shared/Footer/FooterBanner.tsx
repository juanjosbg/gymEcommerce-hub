import React from "react";

import { footerBannerData } from "@/data/content";
import Heading from "@/shared/Heading/Heading";

import ButtonPrimary from "../Button/ButtonPrimary";

const FooterBanner = () => {
  return (
    <div className="relative rounded-2xl bg-[url('https://crazybulk.com/cdn/shop/articles/HERO_860a6de3-a322-464b-bd11-4cca8b3ef2da.jpg?v=1706098760')] bg-cover bg-center bg-no-repeat py-16 text-white">
      <div className="absolute inset-0 rounded-2xl bg-black/70" />
      <div className="relative z-10">
        <Heading className="mb-0 font-semibold uppercase" isMain isCenter>
          {footerBannerData.heading}
        </Heading>
        <p className="mx-auto w-4/5 text-center md:w-1/2">
          {footerBannerData.description}
        </p>
        <div className="mt-10 flex items-center justify-center">
          <ButtonPrimary sizeClass="px-6 py-4">More about us</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
