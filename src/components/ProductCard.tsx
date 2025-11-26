import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "./ui/badge";
import { ProductImages } from "@/data/ImgContent";

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
    <Card className="overflow-hidden transition-all hover:shadow-xl border-gray-200">
      <div className="relative">
        <Badge className="absolute top-3 left-3 bg-primary z-10">
          ¡Acabo de llegar!
        </Badge>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-110"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-black">
            ${product.price.toFixed(0)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
        {product.stock <= 0 && (
          <p className="text-sm text-destructive mt-2">Sin stock</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
};
