import { headerSection, promotionTag } from "./ui";
import { products } from "./products";
import { filterProducts } from "./filterByProduct";
import { ProductImages } from "./ImgContent";
import { filters } from "./Filter"; 

export {
  products,
  headerSection,
  promotionTag,
  ProductImages,
  filterProducts,
  filters, 
};

export const Content = {
  ui: {
    headerSection,
    promotionTag,
  },
  products,
  images: ProductImages,
  filters,
};
