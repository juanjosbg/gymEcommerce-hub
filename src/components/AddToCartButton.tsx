"use client";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { BsBag } from "react-icons/bs";

interface AddToCartButtonProps {
  producto: any;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ producto }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesion",
        text: "Debes iniciar sesion antes de agregar productos al carrito.",
        confirmButtonText: "Entendido",
      });
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
