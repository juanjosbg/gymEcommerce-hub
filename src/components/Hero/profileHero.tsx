import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Hero1 from "../../../public/Hero/hero_bg_1_1.png";
import Hero2 from "../../../public/Hero/hero_bg_1_2.png";

const heroSlides = [
  {
    title: "Energía, fuerza y recuperación",
    subtitle: "Todo lo que necesitas para alcanzar tus metas fitness.",
    image: Hero1,
  },
  {
    title: "Encuentra el suplemento perfecto",
    subtitle: "Potencia tu rendimiento con nuestras fórmulas avanzadas.",
    image: Hero2,
  },
];

const ProfileHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section
      className="relative mb-10 h-[600px] overflow-hidden"
      aria-label="Destacados para tu perfil"
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
            role="img"
            aria-label={`${slide.title} - ${slide.subtitle}`}
          >
          </div>
          <div className="container relative flex h-full items-center md:ml-20">
            <div className="max-w-2xl text-white">
              <h2 className="mb-4 text-5xl font-bold md:text-6xl">{slide.title}</h2>
              <p className="text-xl text-gray-200 md:text-2xl">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </button>

      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 flex gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Ir al slide ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ProfileHero;
