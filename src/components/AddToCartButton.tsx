"use client";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { BsBag } from "react-icons/bs";

interface AddToCartButtonProps {
  producto: any;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ producto }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
    console.log("Producto a agregar al carrito:", producto);
    addToCart(producto);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full items-center justify-center gap-2
        border-2 rounded-full border-primary text-primary px-5 py-3"
      type="button"
      >
      <BsBag /> Agregar al carrito
    </button>
  );
};

export default AddToCartButton;
