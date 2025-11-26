import React, { useMemo, useState } from "react";
import { ShoppingCart, User, Search, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { products } from "@/data/content";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 10);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/producto?search=${encodeURIComponent(searchTerm.trim())}`);
    setOpen(false);
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setSearchTerm("");
    navigate(`/producto/${slug}`);
  };

  return (
    <>
      {/* Top Black Bar */}
      <div className="bg-black text-white py-2">
        <div className="container flex items-center justify-between text-sm">
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="hover:text-gray-300 transition-colors">
              colecciones
            </Link>
            <Link to="/faqs" className="hover:text-gray-300 transition-colors">
              FAQs
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">
              Contacto
            </Link>
          </nav>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            ¿Necesitas Ayuda?
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-black">FITMEX</span>
                <span className="text-primary ml-1">STORE</span>
              </div>
            </Link>

            {/* Search Bar con sugerencias */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative rounded-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos"
                className="w-full pl-10 bg-gray-50 border-gray-200"
                value={searchTerm}
                onFocus={() => filtered.length && setOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOpen(true);
                }}
              />

              {open && filtered.length > 0 && (
                <div className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-lg border bg-white shadow-lg">
                  {filtered.map((item) => (
                    <button
                      type="button"
                      key={item.slug}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(item.slug)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <span className="text-xs text-neutral-500 capitalize">
                          {item.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>

              <Link to="/cart">
                <Button variant="ghost" className="relative gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">{cartCount} items</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <span>Mi cuenta</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => signOut()}>
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth/login")}
                  className="gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span>Iniciar sesión</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
