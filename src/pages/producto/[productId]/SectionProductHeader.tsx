"use client";

import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { MdStar } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import { Link } from "react-router-dom";

import ImageShowCase from "@/components/Products/ImageShowCase";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/data/content";
import nike_profile from "@/images/nike_profile.png";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

interface SectionProductHeaderProps {
  shots: string[];
  shoeName: string;
  prevPrice: number;
  currentPrice: number;
  overview?: string;
  rating: number;
  pieces_sold: number;
  reviews: number;
  coverImage: string;
  slug: string;
  shoeCategory?: string;
  stock?: number;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  shots,
  shoeName,
  prevPrice,
  currentPrice,
  overview = "",
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
  const [currentRelatedIndex, setCurrentRelatedIndex] = useState(0);

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

  useEffect(() => {
    if (related.length <= 1) return;
    const id = setInterval(() => {
      setCurrentRelatedIndex((prev) => (prev + 1) % related.length);
    }, 3500);
    return () => clearInterval(id);
  }, [related.length]);

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

        <div className="mb-5 space-y-2">
          <div className="">
            <p className="text-neutral-700 mb-7 text-justify">{overview}</p>
            <p className="text-neutral-500 line-through">
              antes: <span>${prevPrice}</span>
            </p>
            <h1 className="text-2xl font-normal"> Ahora:{" "}
              <span className="text-primary text-3xl font-medium"> ${currentPrice} </span>
            </h1>
          </div>
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
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold">
              También te puede interesar
            </h4>
            {related[currentRelatedIndex] && (
              <Link
                to={`/producto/${related[currentRelatedIndex].slug}`}
                className="block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-4 flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
                    <img
                      src={related[currentRelatedIndex].coverImage}
                      alt={related[currentRelatedIndex].name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="line-clamp-1 text-base font-semibold text-neutral-800">
                        {related[currentRelatedIndex].name}
                      </p>
                      <p className="text-base font-semibold text-primary mr-5">
                        ${related[currentRelatedIndex].price}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-3">
                      {related[currentRelatedIndex].overview}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {related.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {related.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentRelatedIndex(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      idx === currentRelatedIndex
                        ? "bg-primary"
                        : "bg-neutral-300"
                    }`}
                    aria-label={`Ver sugerencia ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionProductHeader;
