import { headerSection, promotionTag } from "./ui";
import { products } from "./products";
import { productCategories, filterProducts } from "./filterByProduct";
import { ProductImages } from "./ImgContent";

export { products, headerSection, promotionTag, ProductImages, productCategories, filterProducts };

export const Content = {
  ui: {
    headerSection,
    promotionTag,
  },
  products,
  images: ProductImages,
  filters: {
    categories: productCategories,
    filterProducts,
  },
};
