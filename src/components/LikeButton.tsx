// src/components/LikeButton.tsx
"use client";

import React from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

export interface LikeButtonProps {
  className?: string;
  product: any;
  onRequireLogin?: () => void; // opcional si quieres seguir usando tu modal
}

const LikeButton: React.FC<LikeButtonProps> = ({ className = "", product, onRequireLogin }) => {
  const { user } = useAuth();
  const { isInWishlist, add, remove } = useWishlist();
  const liked = user && product && product.id ? isInWishlist(product.id) : false;

  const handleClick = async () => {
    if (!user) {
      // Si tienes un modal externo, dispáralo; de lo contrario usa SweetAlert
      if (onRequireLogin) {
        onRequireLogin();
      } else {
        Swal.fire({
          icon: "info",
          title: "Upps!",
          text: "Asegúrate de iniciar sesión para poder agregar este producto como favorito.",
          confirmButtonText: "Entendido",
          customClass: { popup: "rounded-2xl" },
        });
      }
      return;
    }

    if (!product || !product.id) return;

    if (liked) {
      await remove(product.id);
    } else {
      await add(product);
    }
  };

  return (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white ${className}`}
      onClick={handleClick}
      aria-label={liked ? "Quitar de deseos" : "Agregar a deseos"}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
          stroke={liked ? "#e94e07" : "currentColor"}
          fill={liked ? "#e94e07" : "none"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default LikeButton;
