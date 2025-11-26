import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PromotionalPage from "@/components/Promocional-product/PromotionalPag";
import CountDownTimer from "@/components/Promocional-product/CountDownTimer";
import ProductSlider from "@/components/Promocional-product/ProductSlider";

import WhatsApp from "@/components/WhatsApp";
import Filter from "@/components/Filters/Filter";

import { productsSection } from "@/data/ui";
import { filterProducts as applyFilters } from "@/data/filterByProduct";
import { products as localCatalog } from "@/data/products";

import Hero1 from "../../public/Hero/hero_bg_1_1.png"
import Hero2 from "../../public/Hero/hero_bg_1_2.png"

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  previousPrice?: number;
  image_url?: string | null;
  category: string;
  stock: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [limit, setLimit] = useState(8);
  
  const heroSlides = [
    {
      title: "Energía, fuerza y recuperación",
      subtitle: "Todo lo que necesitas para alcanzar tus metas fitness.",
      image: Hero1,
    },
    {
      title: "Encunetra el suplemento perfecto",
      subtitle: "Portencia tu rendimiento con nuestra fórmulas avanzadas.",
      image: Hero2,
    },
  ];

  // ------ LOAD PRODUCTS FROM LOCAL DATA ------
  useEffect(() => {
    const mapped = localCatalog.map((p) => ({
      id: p.slug,
      name: p.name,
      description: p.overview || "",
      price: p.price,
      previousPrice: p.previousPrice,
      image_url: p.coverImage || p.shots?.[0],
      category: p.category,
      stock: 20, // valor ficticio para mostrar disponibilidad
    }));
    setProducts(mapped);
    setFilteredProducts(mapped);
    setLoading(false);
  }, []);

  // ------ SLIDER AUTO ------
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  // ------ HANDLE FILTER ------
  const handleFilter = (selectedFilters: string[]) => {
    const filtered = applyFilters(products, selectedFilters);
    setFilteredProducts(filtered);
    setLimit(8);
  };

  // =====================
  // Función para cargar más productos
  const handleLoadMore = () => {
    setLimit((prev) => prev + 4);
  };

  // ------ RENDER ------
  return (
    <div className="min-h-screen bg-white">
      {/* HERO CAROUSEL */}
      <section className="relative h-[800px] overflow-hidden mb-10">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 " />
            </div>
            <div className="relative h-full container flex items-center">
              <div className="max-w-2xl text-white">
                <h2 className="text-5xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-200">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* CONTROLES */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>

        {/* INDICADORES */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10 -ml-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* PROMO PAGE */}
      <PromotionalPage />

      {/* PRODUCTOS EN PROMO SLIDER */}
      <section className="container">
        <div className="overflow-hidden rounded-2xl bg-[#f3f3f3] p-5">
          <div className="mb-5 items-center justify-between space-y-5 md:flex md:space-y-0">
            <h3 className="text-3xl font-medium">Productos en Promoción!</h3>
            <CountDownTimer />
          </div>

          <div className="pb-2">
            <ProductSlider />
          </div>
        </div>
      </section>

      {/* HAZ TU COMPRA AHORA */}
      <section className="container py-16">
        <div className="mb-10 space-y-5 flex">
          <div className="flex flex-col items-center text-center">
            <h2 className="md:text-5xl font-semibold uppercase py-5 px-10 lineHeight text-3xl">{productsSection.heading}</h2>
            <p className="text-neutral-500">{productsSection.description}</p>
          </div>
        </div>
        <Filter onFilter={handleFilter} />

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay productos disponibles.
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, limit).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* BOTÓN VER MÁS */}
            {limit < filteredProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
                >
                  Ver más
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <WhatsApp />
    </div>
  );
};

export default Home;
