import { useParams } from "react-router-dom";
import { pathOr } from "ramda";
import React from "react";
import { products } from "@/data/content";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import SectionProductInfo from "./SectionProductInfo";

const SingleProductPage = () => {
  const { productId = "" } = useParams();
  const selectedProduct = products.find((item) => item.slug === productId);

  return (
    <div className="container">
      <SectionNavigation />
      <div className="mb-20">
        <SectionProductHeader
          shots={pathOr([], ["shots"], selectedProduct)}
          shoeName={pathOr("", ["name"], selectedProduct)}
          prevPrice={pathOr(0, ["previousPrice"], selectedProduct)}
          currentPrice={pathOr(0, ["price"], selectedProduct)}
          overview={pathOr("", ["overview"], selectedProduct)}
          rating={pathOr(0, ["rating"], selectedProduct)}
          pieces_sold={pathOr(0, ["pieces_sold"], selectedProduct)}
          reviews={pathOr(0, ["reviews"], selectedProduct)}
          coverImage={pathOr("", ["coverImage"], selectedProduct)}
          slug={pathOr("", ["slug"], selectedProduct)}
          shoeCategory={pathOr("", ["category"], selectedProduct)}
        />
      </div>
      <div className="mb-28">
        <SectionProductInfo
          overview={pathOr("", ["overview"], selectedProduct)}
          shipment_details={pathOr([], ["shipment_details"], selectedProduct)}
          ratings={pathOr(0, ["rating"], selectedProduct)}
          reviews={pathOr(0, ["reviews"], selectedProduct)}
        />
      </div>
      <div className="mb-28">
        <SectionMoreProducts />
      </div>
    </div>
  );
};

export default SingleProductPage;
