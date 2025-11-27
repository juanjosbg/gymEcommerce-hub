import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "./ui/badge";
import { ProductImages } from "@/data/ImgContent";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string | null;
    stock: number;
    category: string;
  };
}

const imageKeyMap: Record<string, keyof typeof ProductImages> = {
  cbum5peat: "cbum5peat",
  peachbum: "peachbum",
  vemon: "venom",
  venom: "venom",
  psychotic: "psychotic",
  iso100: "iso100",
  cbumitholateprotein: "cbum",
  cbumitholateproteincake: "cake",
  rawitholatementachispas: "cream",
  goldstandardchocolate: "gold",
  goldstandardwheyprotein: "whey",
  creatinemicronized: "creatine",
  aninox: "aminox",
  ryse: "ryse",
  pak: "pak",
  muscletech: "muscletech",
  falcon: "falcon",
  bordan: "bordan",
  bcaasglutamina: "bcaas",
  moderneaa: "modernEaa",
  omega390softgels: "omega3",
  creatinamonohidratadabirdman450g: "creatinaBirdman",
  creatinadragon: "dragonCreatine",
  glutaminacreatina600g: "glutamina",
};

const getProductImage = (name: string, fallback?: string | null) => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const mappedKey = imageKeyMap[normalized];

  if (mappedKey) {
    const image = ProductImages[mappedKey]?.[0];
    if (image) return image;
  }

  return fallback || "/placeholder.svg";
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const imageSrc = getProductImage(product.name, product.image_url);

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-gray-200 shadow transition-all hover:-translate-y-[2px] hover:shadow-lg">
      <div className="absolute right-3 top-3 z-20">
        <LikeButton product={{ ...product }} />
      </div>
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative h-[260px] w-full overflow-hidden bg-gray-50">
          <Badge className="absolute left-3 top-3 z-10 bg-primary text-white">
            ¡Acabo de llegar!
          </Badge>
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-200 hover:scale-105"
          />
        </div>
        <CardContent className="p-4 pb-3">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">{product.category}</p>
            <p className="text-lg font-medium text-primary">${product.price}</p>
          </div>
          {product.stock <= 0 && (
            <p className="mt-2 text-sm text-destructive">Sin stock</p>
          )}
        </CardContent>
      </Link>
      {/* Btn Buy
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-40 bg-primary hover:bg-primary/90 rounded-full"
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="ml-1 h-4 w-4" />
          Agregar al carrito
        </Button>
      </CardFooter> 
      */}
    </Card>
  );
};
