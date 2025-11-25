import type { ProductType } from "./types";

export const filters: string[][] = [
  [
    "Tipo",
    "Todos",
    "Pre-entreno",
    "Proteína",
    "Creatina",
    "Glutamina",
    "Aminoácidos",
    "Omega 3",
    "Suplemento",
  ],
  ["Descuento", "Todos", "Con descuento", "Sin descuento"],
  [
    "Precios",
    "Todos",
    "Menos de 100",
    "100 - 500",
    "500 - 1000",
    "Más de 1000",
  ],
];

export const productCategories = filters[0].slice(1);

export function filterProducts(
  products: ProductType[],
  selected: string[]
): ProductType[] {
  const [typeFilter, discountFilter, priceFilter] = selected;

  return products.filter((product) => {
    const { category, price, previousPrice } = product;

    // ---------- FILTRO POR TIPO ----------
    let passType = true;

    switch (typeFilter) {
      case "Pre-entreno":
        passType = /pre-?entreno/i.test(category);
        break;
      case "Proteína":
      case "Creatina":
      case "Glutamina":
      case "Aminoácidos":
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

    // ---------- FILTRO POR DESCUENTO ----------
    const hasDiscount =
      typeof previousPrice === "number" && previousPrice > price;

    let passDiscount = true;

    if (discountFilter === "Con descuento") passDiscount = hasDiscount;
    else if (discountFilter === "Sin descuento") passDiscount = !hasDiscount;

    if (!passDiscount) return false;

    // ---------- FILTRO POR PRECIO ----------
    let passPrice = true;

    switch (priceFilter) {
      case "Menos de 100":
        passPrice = price < 100;
        break;
      case "100 - 500":
        passPrice = price >= 100 && price <= 500;
        break;
      case "500 - 1000":
        passPrice = price > 500 && price <= 1000;
        break;
      case "Más de 1000":
        passPrice = price > 1000;
        break;

      default:
        passPrice = true;
    }

    if (!passPrice) return false;

    return true;
  });
}
