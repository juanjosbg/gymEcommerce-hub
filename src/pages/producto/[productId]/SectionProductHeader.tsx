"use client";

import type { FC } from "react";
import React, { useMemo } from "react";
import { GoDotFill } from "react-icons/go";
import { MdStar } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";

import ImageShowCase from "@/components/Products/ImageShowCase";
import { products } from "@/data/content";
import nike_profile from "@/images/nike_profile.png";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AddToCartButton from "@/components/AddToCartButton";

interface SectionProductHeaderProps {
  shots: string[];
  shoeName: string;
  prevPrice: number;
  currentPrice: number;
  rating: number;
  pieces_sold: number;
  reviews: number;
  coverImage: string;
  slug: string;
  shoeCategory?: string;
  stock?: number; // opcional si tu data lo trae
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  shots,
  shoeName,
  prevPrice,
  currentPrice,
  rating,
  pieces_sold,
  reviews,
  coverImage,
  slug,
  shoeCategory,
  stock,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const producto = {
    id: slug,
    nombreProducto: shoeName,
    coverImage,
    precio: currentPrice,
    cantidad: 1,
    shoeCategory,
    rating,
  };

  const related = useMemo(
    () =>
      products
        .filter((p) => p.category === shoeCategory && p.slug !== slug)
        .slice(0, 3),
    [shoeCategory, slug]
  );

  const handleAddToCart = () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
    addToCart(producto);
  };

  return (
    <div className="items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      <div className="basis-[50%]">
        <ImageShowCase shots={shots} product={producto} />
      </div>

      <div className="basis-[45%]">
        <Heading className="mb-0" isMain title="new arrival!">
          {shoeName}
        </Heading>

        <div className="mb-10 flex items-center">
          <div className="flex items-center gap-1">
            <ButtonCircle3
              className="overflow-hidden border border-neutral-400"
              size="w-11 h-11"
            >
              <img
                src={nike_profile}
                alt="nike_profile"
                className="h-full w-full object-cover"
              />
            </ButtonCircle3>
            <span className="font-medium">FITMEX STORE</span>
            <PiSealCheckFill className="text-blue-600" />
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          <div className="flex items-center gap-1">
            <MdStar className="text-yellow-400" />
            <p className="text-sm">
              {rating}{" "}
              <span className="text-neutral-500">{`(${reviews} Reviews)`}</span>
            </p>
          </div>
          <GoDotFill className="mx-3 text-neutral-500" />
          <p className="text-neutral-500">{`${pieces_sold} items sold`}</p>
        </div>

        <div className="mb-5 space-y-1">
          <p className="text-neutral-500 line-through">${prevPrice}</p>
          <h1 className="text-3xl font-medium">${currentPrice}</h1>
          <p className="text-sm text-neutral-600">
            Disponibilidad:{" "}
            {typeof stock === "number"
              ? stock > 0
                ? `En stock (${stock} uds)`
                : "Agotado"
              : "Consulta disponibilidad"}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <ButtonPrimary className="w-full">Buy Now</ButtonPrimary>
          <AddToCartButton producto={producto} />
          {/* <ButtonSecondary
            className="flex w-full items-center gap-1 border-2 border-primary text-primary"
            onClick={handleAddToCart}
          >
            <BsBag /> Add to cart
          </ButtonSecondary> */}
        </div>

        {related.length > 0 && (
          <div className="mt-8 space-y-2">
            <p className="text-sm font-semibold">También te puede interesar</p>
            <ul className="space-y-1">
              {related.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center justify-between text-sm text-neutral-700"
                >
                  <span>{item.name}</span>
                  <span className="text-primary">${item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionProductHeader;
