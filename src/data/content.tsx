import { headerSection, promotionTag } from "./ui";
import { products } from "./products";
import { filterProducts } from "./filterByProduct";
import { ProductImages } from "./ImgContent";
import { filters } from "./Filter"; 
import { faqsData } from "./faqsData";
import { contact } from "./contact";

export {
  products,
  headerSection,
  promotionTag,
  ProductImages,
  filterProducts,
  filters, 
  faqsData,
  contact,
};

export const Content = {
  ui: {
    headerSection,
    promotionTag,
  },
  products,
  faqsData,
  contact,
  images: ProductImages,
  filters,
};
