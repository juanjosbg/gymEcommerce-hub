// /src/data/products.tsx
import React from "react";
import { ProductImages } from "@/data/ImgContent";
import { PiPercentFill } from "react-icons/pi";
import { FaCalendarAlt } from "react-icons/fa";
import { BsBoxFill } from "react-icons/bs";
import { FaTruckFast } from "react-icons/fa6";

export const products = [
  // ================= PRE-ENTRENO / PRE-ENTRENAMIENTO =================

  // -------- cbum5peat --------
  {
    slug: "cbum5peat",
    name: "cbum5peat",
    category: "Pre-entreno",
    price: 10000,
    previousPrice: 2000,
    rating: 4.9,
    reviews: 10500,
    pieces_sold: 85000,
    justIn: true,
    coverImage: ProductImages.cbum5peat[0],
    shots: ProductImages.cbum5peat,
    overview:
      "El pre-entreno CBUM Thavage, creado por el campeón mundial Chris Bumstead, está diseñado para quienes entrenan con intensidad. Su fórmula incluye ingredientes como L-Citrulina, Beta-Alanina y Alpha-GPC para mayor bombeo muscular, concentración mental y resistencia. Con un sabor delicioso y rendimiento comprobado, es ideal para elevar tus sesiones al siguiente nivel.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "15% en compras superiores a $180.000 COP",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "2 - 5 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Envase con 20 servicios",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Llegada estimada",
        description: "13 - 16 Junio 2025",
      },
    ],
  },

  // -------- peachbum --------
  {
    slug: "peachbum",
    name: "PEACHBUM",
    category: "Pre-entreno",
    price: 10000,
    previousPrice: 2000,
    rating: 4.9,
    reviews: 8700,
    pieces_sold: 68000,
    justIn: true,
    coverImage: ProductImages.peachbum[0],
    shots: ProductImages.peachbum,
    overview:
      "Thavage Pre-Workout en sabor Peach Bum ofrece energía explosiva, concentración mental y bombeo muscular intenso. Con 40 servicios, esta fórmula incluye Beta-Alanina, L-Citrulina y Alpha-GPC para entrenamientos de alto rendimiento. Su sabor a durazno dulce te encantará desde el primer scoop.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% en compras desde $180.000 COP",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "2 - 5 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Envase con 40 servicios sabor Peach Bum",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Llegada estimada",
        description: "13 - 16 Junio 2025",
      },
    ],
  },

  // -------- Vemon --------
  {
    slug: "Vemon",
    name: "VEMON",
    category: "Pre-entreno",
    price: 199,
    previousPrice: 250,
    rating: 4.9,
    reviews: 310,
    pieces_sold: 2400,
    justIn: true,
    coverImage: ProductImages.venom[0],
    shots: ProductImages.venom,
    overview:
      "Venom® es un pre-entrenamiento extremadamente potente formulado para atletas que desean niveles extremos de energía, enfoque y rendimiento. Con ingredientes como Beta-Alanina, Alpha-GPC y Caffeine Anhydrous, Venom® te lleva al siguiente nivel para que puedas aplastar cada entrenamiento con intensidad y concentración máximas.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "> $100 Disc 10%",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 8 Working days",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Dragon Pharma Secure Bottle",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 18 June 2025",
      },
    ],
  },

  // -------- psychotic-orange --------
  {
    slug: "psychotic-orange",
    name: "PSYCHOTIC",
    category: "Pre-entreno",
    price: 280,
    previousPrice: 350,
    rating: 4.8,
    reviews: 56,
    pieces_sold: 600,
    justIn: true,
    coverImage: ProductImages.psychotic[0],
    shots: ProductImages.psychotic,
    overview:
      "Psychotic Pre Workout Orange, es un suplemento de pre entrenamiento extremo con 35 servicios por envase. Está formulado con Ampiberry®, un ingrediente que prolonga el efecto de los estimulantes por más de 3 horas. Contiene de 3 a 4 veces más potencia que otros pre entrenos del mercado. Sometido a pruebas microbiológicas estrictas, cuenta con certificación cGMP que garantiza su calidad.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% en compras mayores a $100 MXN",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "6 - 12 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Bote de 200g / 35 servicios",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Sabor Natural y a Naranja",
      },
    ],
  },

  // ================= PROTEÍNAS =================

  // -------- dymatize-iso100-vainilla --------
  {
    slug: "dymatize-iso100-vainilla",
    name: "ISO 100",
    category: "Proteína",
    price: 950,
    previousPrice: 1150,
    rating: 5,
    reviews: 76,
    pieces_sold: 600,
    justIn: true,
    coverImage: ProductImages.iso100[0],
    shots: ProductImages.iso100,
    overview:
      "Aislado de proteína de suero de leche 100% hidrolizado, científicamente probado y de digestión rápida. Cada porción proporciona 25 g de proteína, 5.5 g de BCAA y 2.7 g de leucina, con solo 120 calorías, menos de 1 g de azúcar, lactosa y grasa. Libre de gluten. Se mezcla fácilmente incluso solo con cuchara. Cada envase contiene 2.27 kg con 76 servicios aproximados. Ideal para apoyar la recuperación muscular y el desarrollo de masa magra.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "Descuento del 17%",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Empaque",
        description: "76 porciones | 2.27 kg | ~$12.50 MXN por porción",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Calorias",
        description: "120 calorías, menos de 0.04 oz de azúcar",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Sabor",
        description: "Vainilla / FRUITY PEBBLES",
      },
    ],
  },

  // -------- cbum-itholate --------
  {
    slug: "cbum-itholate",
    name: "CBUM Itholate Protein",
    category: "Proteína",
    price: 1250,
    previousPrice: 1450,
    rating: 4.5,
    reviews: 194,
    pieces_sold: 700,
    justIn: false,
    coverImage: ProductImages.cbum[0],
    shots: ProductImages.cbum,
    overview:
      "Proteína de suero aislada de alta calidad con 25 g por porción, sabor a avena con vainilla. Bajo en grasas, con solo 1 g de carbohidratos, y derivada 100 % de vacas alimentadas con pasto. Ideal para apoyar el desarrollo muscular magro, la recuperación post-entrenamiento y mejorar el rendimiento físico. Fácil de digerir gracias a su proceso de microfiltración, sin molestias estomacales.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "¡10% en compras mayores a $1000 MXN!",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Sabor avena con vainilla - 2 lbs (25 servicios)",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Proteína en polvo, envase de 2 libras",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Envío estimado",
        description: "6 - 12 días hábiles",
      },
    ],
  },

  // -------- cbum-itholate-cake --------
  {
    slug: "cbum-itholate-cake",
    name: "CBUM Itholate Protein Cake",
    category: "Proteína",
    price: 1250,
    previousPrice: 1450,
    rating: 4.5,
    reviews: 194,
    pieces_sold: 700,
    justIn: false,
    coverImage: ProductImages.cake[0],
    shots: ProductImages.cake,
    overview:
      "Proteína de suero aislada de alta calidad con 25 g por porción, sabor a avena con vainilla. Bajo en grasas, con solo 1 g de carbohidratos, y derivada 100 % de vacas alimentadas con pasto. Ideal para apoyar el desarrollo muscular magro, la recuperación post-entrenamiento y mejorar el rendimiento físico. Fácil de digerir gracias a su proceso de microfiltración, sin molestias estomacales.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "¡10% en compras mayores a $1000 MXN!",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Sabor de pastel de cumpleaños - 2.25 lbs (25 porciones)",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Proteína en polvo, envase de 2.25 libras",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Envío estimado",
        description: "6 - 12 días hábiles",
      },
    ],
  },

  // -------- raw-mint-chip --------
  {
    slug: "raw-mint-chip",
    name: "RAW Itholate - Menta Chispas",
    category: "Proteína",
    price: 900,
    previousPrice: 1050,
    rating: 4.3,
    reviews: 1676,
    pieces_sold: 1200,
    justIn: false,
    coverImage: ProductImages.cream[0],
    shots: ProductImages.cream,
    overview:
      "Proteína aislada tipo Itholate de RAW Nutrition, formulada por Chris Bumstead, con sabor a helado de chispas de menta. Contiene 25 g de proteína por servicio, sin rellenos ni hormonas, microfiltrada y libre de ingredientes artificiales. Perfecta para apoyar el crecimiento muscular magro y la recuperación rápida post-entreno. Presentación de 2.2 lbs (25 porciones).",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "¡10% en compras mayores a $1000 MXN!",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Sabor",
        description: "Helado de chips de menta",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "2.2 lbs (25 porciones)",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Envío estimado",
        description: "6 - 12 días hábiles",
      },
    ],
  },

  // -------- gold-standard-chocolate --------
  {
    slug: "gold-standard-chocolate",
    name: "Gold Standard Chocolate",
    category: "Suplementos",
    price: 1949,
    previousPrice: 2359,
    rating: 4.1,
    reviews: 157,
    pieces_sold: 50,
    justIn: true,
    coverImage: ProductImages.gold[0],
    shots: ProductImages.gold,
    overview:
      "Optimum Nutrition Gold Standard 100% Isolate sabor Chocolate es una proteína de suero aislada, diseñada para apoyar el desarrollo muscular y la recuperación después del entrenamiento. Con 5 libras de producto, es ideal para adultos que buscan calidad y pureza en cada porción. Su fórmula se obtiene mediante microfiltración, eliminando grasas y carbohidratos, y ofreciendo una proteína de alta concentración y rápida absorción.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "17% de ahorro aplicado",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "4 - 8 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Bolsa o bote premium con sello de seguridad",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Envío estimado",
        description: "Enviado por Amazon México",
      },
    ],
  },

  // -------- gold-standard-whey --------
  {
    slug: "gold-standard-whey",
    name: "Gold Standard - Whey Protein",
    category: "Proteína",
    price: 20000,
    previousPrice: 19000,
    rating: 4.8,
    reviews: 22500,
    pieces_sold: 150000,
    justIn: false,
    coverImage: ProductImages.whey[0],
    shots: ProductImages.whey,
    overview:
      "Optimum Nutrition Gold Standard 100% Whey es la fórmula de proteína más vendida en el mundo. Elaborada con aislado de proteína de suero como ingrediente principal, ofrece 24 g de proteína de alta calidad por porción para apoyar el crecimiento y mantenimiento muscular. Sabor: Extreme Milk Chocolate.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% en compras superiores a $150.000 COP",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "3 - 5 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Presentación",
        description: "Tarro de 2 lb (907 g)",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Llegada estimada",
        description: "Entre 14 - 17 Junio 2025",
      },
    ],
  },

  // ================= SUPLEMENTOS / AMINOÁCIDOS / CREATINA =================

  // -------- creatine --------
  {
    slug: "creatine",
    name: "Creatine micronized",
    category: "Suplementos",
    price: 165,
    previousPrice: 210,
    rating: 4.9,
    reviews: 124,
    pieces_sold: 3200,
    justIn: true,
    coverImage: ProductImages.creatine[0],
    shots: ProductImages.creatine,
    overview:
      "La Creatine Powder de Optimum Nutrition te ayuda a mejorar tu rendimiento físico durante ejercicios de alta intensidad. Cada porción contiene 5g de monohidrato de creatina micronizada para una mejor absorción y resultados comprobados. Ideal para deportistas que buscan aumentar su fuerza y resistencia.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "Compra > $100 y obtén 10% OFF",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 8 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase plástico resistente ON®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 18 de junio 2025",
      },
    ],
  },

  // -------- aminox --------
  {
    slug: "aminox",
    name: "ANINOX",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.aminox[0],
    shots: ProductImages.aminox,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Ryse --------
  {
    slug: "Ryse",
    name: "Ryse",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.ryse[0],
    shots: ProductImages.ryse,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Pak --------
  {
    slug: "Pak",
    name: "Pak",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.pak[0],
    shots: ProductImages.pak,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Muscletech --------
  {
    slug: "Muscletech",
    name: "Muscletech",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.muscletech[0],
    shots: ProductImages.muscletech,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Falcon --------
  {
    slug: "Falcon",
    name: "Falcon",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.falcon[0],
    shots: ProductImages.falcon,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Bordan --------
  {
    slug: "Bordan",
    name: "Bordan",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.bordan[0],
    shots: ProductImages.bordan,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- Bcaas --------
  {
    slug: "Bcaas",
    name: "Bcaas & Glutamina",
    category: "Suplementos",
    price: 145,
    previousPrice: 180,
    rating: 4.7,
    reviews: 89,
    pieces_sold: 2300,
    justIn: true,
    coverImage: ProductImages.bcaas[0],
    shots: ProductImages.bcaas,
    overview:
      "AMINOx de BSN es un suplemento efervescente que combina BCAA’s y aminoácidos esenciales para favorecer la recuperación muscular y mejorar el rendimiento deportivo. Con sabor a sandía, no contiene cafeína y es ideal para cualquier hora del día. Aporta 10g de aminoácidos por porción y ayuda a combatir la fatiga post-entrenamiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Discount",
        description: "10% OFF por compras > $100",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Delivery Time",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Package",
        description: "Envase de plástico sellado BSN®",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Estimated Arrival",
        description: "14 - 17 de junio 2025",
      },
    ],
  },

  // -------- modern-eaa-plus --------
  {
    slug: "modern-eaa-plus",
    name: "Modern EAA+",
    category: "Aminoácidos",
    price: 699,
    previousPrice: 799,
    rating: 4.8,
    reviews: 154,
    pieces_sold: 3150,
    justIn: false,
    coverImage: ProductImages.modernEaa[0],
    shots: ProductImages.modernEaa,
    overview:
      "Modern EAA+ de USP Labs combina aminoácidos esenciales (EAA) con electrolitos para optimizar la hidratación, recuperación y crecimiento muscular. Ideal para consumir antes, durante o después del entrenamiento. Su fórmula avanzada ayuda a prevenir la degradación muscular y acelerar la síntesis proteica. Libre de estimulantes y con delicioso sabor a ponche de frutas.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% OFF por compras mayores a $1,000 MXN",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "3 - 6 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Bote sellado USP Labs® 450g",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Entrega estimada",
        description: "25 - 28 de junio 2025",
      },
    ],
  },

  // -------- omega-3-90-softgels --------
  {
    slug: "omega-3-90-softgels",
    name: "Omega-3 90 Softgels",
    category: "Omega 3",
    price: 299,
    previousPrice: 349,
    rating: 4.6,
    reviews: 78,
    pieces_sold: 1820,
    justIn: false,
    coverImage: ProductImages.omega3[0],
    shots: ProductImages.omega3,
    overview:
      "Omega-3 90 Softgels es un suplemento de ácidos grasos esenciales que apoya la salud cardiovascular, cerebral y articular. Cada cápsula blanda contiene una alta concentración de EPA y DHA de calidad premium. Ideal para uso diario, mejora la circulación, reduce la inflamación y favorece el bienestar general. Sin sabor a pescado ni aditivos artificiales.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "5% OFF por compras mayores a $500 MXN",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "2 - 5 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Frasco sellado con 90 cápsulas blandas",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Entrega estimada",
        description: "22 - 25 de junio 2025",
      },
    ],
  },

  // -------- creatina-monohidratada-birdman-450g --------
  {
    slug: "creatina-monohidratada-birdman-450g",
    name: "Creatina Monohidratada Birdman 450g",
    category: "Creatina",
    price: 499,
    previousPrice: 599,
    rating: 4.8,
    reviews: 132,
    pieces_sold: 3200,
    justIn: false,
    coverImage: ProductImages.creatinaBirdman[0],
    shots: ProductImages.creatinaBirdman,
    overview:
      "La Creatina Monohidratada Birdman 450g es un suplemento vegano de alta pureza que mejora el rendimiento físico, la fuerza muscular y acelera la recuperación post-entrenamiento. Apta para atletas y deportistas exigentes, esta creatina es 100% micronizada, sin saborizantes, colorantes ni aditivos artificiales. Perfecta para consumo diario.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "15% OFF por compras mayores a $800 MXN",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "3 - 6 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Bolsa resellable ecológica Birdman® 450g",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Entrega estimada",
        description: "23 - 27 de junio 2025",
      },
    ],
  },

  // -------- creatina-dragon-pharma-1kg --------
  {
    slug: "creatina-dragon-pharma-1kg",
    name: "Creatina Dragon",
    category: "Creatina",
    price: 749,
    previousPrice: 899,
    rating: 4.9,
    reviews: 176,
    pieces_sold: 4100,
    justIn: false,
    coverImage: ProductImages.dragonCreatine[0],
    shots: ProductImages.dragonCreatine,
    overview:
      "La Creatina Monohidratada Dragon Pharma 1 kg proporciona 200 porciones de alta pureza, ideal para aumentar la fuerza, resistencia y volumen muscular. Formulada para atletas de alto rendimiento, esta creatina no contiene saborizantes ni aditivos. Perfecta para ciclos de carga y mantenimiento.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% OFF por compras mayores a $1,000 MXN",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "4 - 7 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Envase plástico hermético Dragon Pharma® 1 kg",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Entrega estimada",
        description: "24 - 28 de junio 2025",
      },
    ],
  },

  // -------- glutamina-creatina --------
  {
    slug: "glutamina-creatina",
    name: "Glutamina + Creatina 600g",
    category: "Glutamina",
    price: 579,
    previousPrice: 699,
    rating: 4.6,
    reviews: 98,
    pieces_sold: 2650,
    justIn: true,
    coverImage: ProductImages.glutamina[0],
    shots: ProductImages.glutamina,
    overview:
      "El suplemento Glutamina + Creatina combina dos potentes ingredientes para mejorar la recuperación muscular, aumentar la energía y reducir el catabolismo tras entrenamientos intensos. Ideal para quienes buscan fortalecer masa muscular y acelerar el tiempo de recuperación. Fórmula sin sabor, fácil de mezclar.",
    shipment_details: [
      {
        icon: <PiPercentFill className="text-xl text-secondary" />,
        title: "Descuento",
        description: "10% OFF por compras mayores a $700 MXN",
      },
      {
        icon: <FaCalendarAlt className="text-xl text-secondary" />,
        title: "Tiempo de entrega",
        description: "3 - 6 días hábiles",
      },
      {
        icon: <BsBoxFill className="text-xl text-secondary" />,
        title: "Empaque",
        description: "Bote plástico sellado de 600g",
      },
      {
        icon: <FaTruckFast className="text-xl text-secondary" />,
        title: "Entrega estimada",
        description: "24 - 27 de junio 2025",
      },
    ],
  },
];
