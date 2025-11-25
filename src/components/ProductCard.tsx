import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <p className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        {product.stock <= 0 && (
          <p className="text-sm text-destructive mt-2">Sin stock</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
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