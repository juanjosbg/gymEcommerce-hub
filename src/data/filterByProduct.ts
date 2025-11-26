const normalize = (s: string) =>
  s
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")  
    .toLowerCase();

export const filterProducts = (products, selected) => {
  const [type, discount, priceRange] = selected;
  return products.filter((p) => {
    const cat = normalize(p.category);
    const typeNorm = normalize(type);

    const matchType = type === "Todos" || cat.includes(typeNorm);

    const hasDiscount = typeof p.previousPrice === "number" && p.previousPrice > p.price;
    const matchDiscount =
      discount === "Todos" ||
      (discount === "Con descuento" && hasDiscount) ||
      (discount === "Sin descuento" && !hasDiscount);

    let matchPrice = true;
    if (priceRange === "Menos de 100") matchPrice = p.price < 100;
    else if (priceRange === "100 - 500") matchPrice = p.price >= 100 && p.price <= 500;
    else if (priceRange === "500 - 1000") matchPrice = p.price > 500 && p.price <= 1000;
    else if (priceRange === "Más de 1000") matchPrice = p.price > 1000;

    return matchType && matchDiscount && matchPrice;
  });
};
