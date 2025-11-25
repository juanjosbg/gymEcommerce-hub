export const productCategories = [
  "Todos",
  "Pre-entreno",
  "Proteína",
  "Creatina",
  "Glutamina",
  "Aminoácidos",
  "Omega 3",
  "Suplemento",
];

// Función principal de filtrado
export const filterProducts = (products, selected) => {
  const [type, discount, priceRange] = selected;

  return products.filter((p) => {
    // --------------------
    // FILTRO POR TIPO
    // --------------------
    const matchType =
      type === "Todos" ||
      p.category.toLowerCase().includes(type.toLowerCase());

    // --------------------
    // FILTRO POR DESCUENTO
    // --------------------
    const hasDiscount =
      typeof p.previousPrice === "number" && p.previousPrice > p.price;

    const matchDiscount =
      discount === "Todos" ||
      (discount === "Con descuento" && hasDiscount) ||
      (discount === "Sin descuento" && !hasDiscount);

    // --------------------
    // FILTRO POR RANGO DE PRECIO
    // --------------------
    let matchPrice = true;

    if (priceRange === "Menos de 100") matchPrice = p.price < 100;
    else if (priceRange === "100 - 500")
      matchPrice = p.price >= 100 && p.price <= 500;
    else if (priceRange === "500 - 1000")
      matchPrice = p.price > 500 && p.price <= 1000;
    else if (priceRange === "Más de 1000") matchPrice = p.price > 1000;

    return matchType && matchDiscount && matchPrice;
  });
};
