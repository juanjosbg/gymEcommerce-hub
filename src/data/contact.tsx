// /src/data/contact.tsx
import { FiBox } from "react-icons/fi";
import { IoChatboxOutline } from "react-icons/io5";
import { MdOutlineCameraAlt } from "react-icons/md";

export const contact = {
  heading: "Contacto",
  Title: "¿Tienes alguna duda, queja o sugerencia?",
  description:
    "Si necesitas asistencia con tu pedido, tienes algún reclamo o simplemente quieres compartir tu experiencia, no dudes en escribirnos. " +
    "Nuestro equipo de atención estará encantado de responderte lo antes posible.",

  directContactInfoHeader: {
    heading: "¿Prefieres contactarnos directamente?",
    description:
      "Escríbenos por cualquiera de estos canales y te responderemos lo antes posible.",
  },

  directContactInfo: [
    {
      icon: <FiBox className="text-5xl" />,
      title: "Ventas",
      description:
        "Consultas sobre productos, disponibilidad, precios o cotizaciones especiales.",
      contactLink: {
        href: "mailto:ventas@fixgym.com",
        title: "ventas@fixgym.com",
      },
    },
    {
      icon: <IoChatboxOutline className="text-5xl" />,
      title: "Soporte",
      description:
        "¿Problemas con tu pedido o experiencia en la tienda? Estamos aquí para ayudarte.",
      contactLink: {
        href: "mailto:soporte@fixgym.com",
        title: "soporte@fixgym.com",
      },
    },
    {
      icon: <MdOutlineCameraAlt className="text-5xl" />,
      title: "Colaboraciones",
      description:
        "Si eres creador de contenido o influencer, hablemos de posibles colaboraciones.",
      contactLink: {
        href: "mailto:colaboraciones@fixgym.com",
        title: "colaboraciones@fixgym.com",
      },
    },
  ],

  instagramPhotos: [
    "/images/products/WhatsApp Image 2025-05-28 at 4.18.34 PM.jpeg",
    "/images/products/WhatsApp Image 2025-05-28 at 4.18.09 PM(2).jpeg",
    "/images/products/BUM.jpeg",
    "/images/products/WhatsApp Image 2025-05-28 at 4.18.10 PM.jpeg",
    "/images/products/ISO-100-DYMATIZE.jpeg",
  ],
};
