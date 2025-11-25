export const productCategories = [
  {
    name: "Aminoácidos",
    includes: ["Aminoácidos", "BCAA", "EAA", "AMINOx"],
  },
  {
    name: "Creatina",
    includes: ["Creatina", "Creatine micronized", "Creatina monohidratada"],
  },
  {
    name: "Glutamina",
    includes: ["Glutamina", "L-Glutamina"],
  },
  {
    name: "Omega 3",
    includes: ["Omega 3"],
  },
  {
    name: "Pre-entreno",
    includes: [
      "Pre-entreno",
      "Pre Workout",
      "PSYCHOTIC",
      "Venom",
      "Pre-entrenamiento",
    ],
  },
  {
    name: "Proteína",
    includes: [
      "Proteína",
      "ISO 100",
      "Whey Protein",
      "CBUM Itholate Protein",
    ],
  },
];

export const filterProducts = (products, { type, price, discount }) => {
  return products.filter((p) => {
    const matchType =
      type === "Todos" ||
      productCategories
        .find((c) => c.name === type)
        ?.includes.includes(p.category);

    const matchPrice =
      price[0] <= p.price && p.price <= price[1];

    const matchDiscount =
      discount === "Todos" ||
      (discount === "Con descuento" && p.previousPrice > p.price) ||
      (discount === "Sin descuento" && p.previousPrice === p.price);

    return matchType && matchPrice && matchDiscount;
  });
};
