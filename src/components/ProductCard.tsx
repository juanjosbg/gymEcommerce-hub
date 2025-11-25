import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl border-gray-200">
      <div className="relative">
        <Badge className="absolute top-3 left-3 bg-primary z-10">
          ¡Acabo de llegar!
        </Badge>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image_url || '/placeholder.svg'}
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