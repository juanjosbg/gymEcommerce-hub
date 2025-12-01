import React, { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CreditCard,
  FileBox,
  MapPin,
  MessageSquare,
  ScrollText,
  Search,
  ShoppingCart,
  Store,
  Ticket,
  User,
  UserRound,
  UserRoundCog,
  Repeat2,
} from "lucide-react";
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
import Notifications from "@/components/header/Notifications/pages";
import CartSideBar from "./header/CartSideBar";

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
            <Link
              to="/products"
              className="hover:text-gray-300 transition-colors"
            >
              colecciones
            </Link>
            <Link to="/faqs" className="hover:text-gray-300 transition-colors">
              FAQs
            </Link>
            <Link
              to="/contact"
              className="hover:text-gray-300 transition-colors"
            >
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
      <header className="bg-white border-b sticky top-0 z-50 pt-2 pb-2 shadow-md">
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
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl relative rounded-full"
            >
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
                        <span className="font-semibold text-sm">
                          {item.name}
                        </span>
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
              <Notifications />

              <CartSideBar />
              {/*
              <Link to="/cart">
                <Button variant="ghost" className="relative gap-2">
                  <ShoppingCart className="h-5 w-5 "/>
                  <span className="font-medium">{cartCount} items</span>
                </Button>
              </Link>*/}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src="/avatar.png"
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold leading-tight">
                          {user.user_metadata?.full_name || "Mi cuenta"}
                        </span>
                        <span className="text-xs text-neutral-500 leading-tight">
                          {user.email}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-0">
                    <div className="flex items-center gap-3 px-4 py-3 border-b">
                      <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src="/avatar.png"
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold truncate">
                          {user.user_metadata?.full_name || "Usuario"}
                        </span>
                        <span className="text-xs text-neutral-500 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="py-2 px-2">
                      <DropdownMenuItem asChild className="gap-3">
                        <Link
                          to="/profile"
                          className="flex w-full items-center gap-3"
                        >
                          <UserRound className="h-4 w-4" />
                          <span>Your profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem className="gap-3">
                        <ScrollText className="h-4 w-4" />
                        <span>Your orders</span>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild className="gap-3">
                        <Link
                          to="/wishlist"
                          className="flex w-full items-center gap-3"
                        >
                          <Store className="h-4 w-4" />
                          <span>Productos de interés</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <Ticket className="h-4 w-4" />
                        <span>Coupons &amp; offers</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem className="gap-3">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit balance</span>
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem className="gap-3">
                        <MapPin className="h-4 w-4" />
                        <span>Addresses</span>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem className="gap-3">
                        <BellRing className="h-4 w-4" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                    </div>

                    <div className="border-t py-2 px-2">
                      <DropdownMenuItem className="gap-3">
                        <Repeat2 className="h-4 w-4" />
                        <span>Switch accounts</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="gap-3"
                      >
                        <UserRoundCog className="h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </div>
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
