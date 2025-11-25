import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PromotionalPage from "@/components/Promocional-product/PromotionalPag";
import CountDownTimer from "@/components/Promocional-product/CountDownTimer";
import ProductSlider from "@/components/Promocional-product/ProductSlider";
import WhatsApp from "@/components/WhatsApp";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Energía, fuerza y recuperación",
      subtitle: "Todo lo que necesitas para alcanzar tus metas.",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=800&fit=crop",
    },
    {
      title: "Encuentra el suplemento perfecto",
      subtitle: "Potencia tu rendimiento con nuestras fórmulas avanzadas.",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=800&fit=crop",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
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
              <div className="absolute inset-0 bg-black/50" />
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

        {/* Navigation Arrows */}
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

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

      {/* Promocion de productos */}
      <PromotionalPage />

      {/* Promocion en productos */}
      <div className="container ">
        <div className="overflow-hidden rounded-2xl bg-gray p-5 bg-[#f3f3f3]">
          <div className="mb-5 items-center justify-between space-y-5 md:flex md:space-y-0 ">
            <h3 className="text-3xl font-medium">Productos en Promoción!</h3>
            <CountDownTimer />
          </div>
          <div className="pb-2">
            <ProductSlider />
          </div>
        </div>
      </div>

      {/* Haz tu compra ahora */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Productos en Promoción!</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay productos disponibles aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <WhatsApp/>
    </div>
  );
};

export default Home;
