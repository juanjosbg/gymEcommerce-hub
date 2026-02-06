import type { Product } from "@/entities/product/types";

export const filters: string[][] = [
  ["Todos", "Pre-entreno", "ProteÃ­na", "Creatina", "Glutamina", "AminoÃ¡cidos", "Omega 3", "Suplemento"],
  ["Todos", "Con descuento", "Sin descuento"],
  ["Todos", "Menos de 100", "100 - 500", "500 - 1000", "MÃ¡s de 1000"],
];

export const productCategories = filters[0].slice(1);

export function filterProducts(products: Product[], selected: string[]): Product[] {
  const [typeFilter, discountFilter, priceFilter] = selected;

  return products.filter(({ category, price, previousPrice }) => {
    // tipo
    let passType = true;
    switch (typeFilter) {
      case "Pre-entreno":
        passType = /pre-?entreno/i.test(category);
        break;
      case "ProteÃ­na":
      case "Creatina":
      case "Glutamina":
      case "AminoÃ¡cidos":
      case "Omega 3":
        passType = category.toLowerCase().includes(typeFilter.toLowerCase());
        break;
      case "Suplemento":
        passType = category.toLowerCase().includes("suplement");
        break;
      default:
        passType = true;
    }
    if (!passType) return false;

    // descuento
    const hasDiscount = typeof previousPrice === "number" && previousPrice > price;
    if (discountFilter === "Con descuento" && !hasDiscount) return false;
    if (discountFilter === "Sin descuento" && hasDiscount) return false;

    // precio
    switch (priceFilter) {
      case "Menos de 100":
        return price < 100;
      case "100 - 500":
        return price >= 100 && price <= 500;
      case "500 - 1000":
        return price > 500 && price <= 1000;
      case "MÃ¡s de 1000":
        return price > 1000;
      default:
        return true;
    }
  });
}

