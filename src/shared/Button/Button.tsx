// /shared/Button/Button.tsx
"use client";

import type { ButtonHTMLAttributes, FC } from "react";
import React from "react";

export interface ButtonProps {
  className?: string;
  translate?: string;
  sizeClass?: string;
  fontSize?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  href?: string; // 🔥 ahora es string normal, no Route de next
  onClick?: () => void;
  children?: React.ReactNode;
}

const Button: FC<ButtonProps> = ({
  className = "text-neutral-200 disabled:cursor-not-allowed",
  translate = "",
  sizeClass = "py-3 px-4 sm:py-3.5 sm:px-6",
  fontSize = "text-sm sm:text-base font-medium",
  disabled = false,
  href,
  children,
  type = "button",
  loading = false,
  onClick = () => {},
}) => {
  const CLASSES = `relative h-auto inline-flex items-center justify-center rounded-full transition-colors ${fontSize} ${sizeClass} ${translate} ${className}`;

  const renderLoading = () => (
    <svg
      className="-ml-1 mr-3 h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // 🔹 Si viene href, renderizamos un <a>
  if (href) {
    return (
      <a href={href} className={CLASSES} onClick={onClick}>
        {loading && renderLoading()}
        {children || "This is Link"}
      </a>
    );
  }

  // 🔹 Si NO hay href, es un <button>
  return (
    <button
      disabled={disabled || loading}
      className={CLASSES}
      onClick={onClick}
      type={type}
    >
      {loading && renderLoading()}
      {children || "This is Button"}
    </button>
  );
};

export default Button;
