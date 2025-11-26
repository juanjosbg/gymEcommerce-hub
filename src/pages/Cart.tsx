import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">Ver productos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-24 w-24 object-cover rounded bg-gray-50"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-2xl font-bold text-black mb-4">
                          ${item.product.price.toFixed(0)}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-muted-foreground">Subtotal</p>
                        <p className="text-xl font-bold">
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="font-semibold text-green-600">Gratis</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold text-xl">Total</span>
                      <span className="font-bold text-3xl text-black">
                        ${total.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Proceder al pago
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full mt-3 border-gray-300">
                      Continuar comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;