import React, { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  Search,
  Store,
  Ticket,
  User,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { products as staticProducts } from "@/data/content";
import Notifications from "@/components/header/Notifications/pages";
import CartSideBar from "./header/CartSideBar";
import type { ProductRowLoose } from "@/entities/product/types";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  coverImage: string;
};

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Header = () => {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const slugify = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>(
    staticProducts.map((p) => ({
      id: p.slug || "producto",
      slug: p.slug,
      name: p.name,
      category: p.category,
      coverImage: p.coverImage,
    }))
  );

  useEffect(() => {
    let cancelled = false;

    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const email = user.email?.toLowerCase();
      if (email === "fitmexstore@gmail.com") {
        setIsAdmin(true);
        return;
      }

      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (!cancelled) {
          setIsAdmin(data?.role === "admin");
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
        }
      }
    };

    checkRole();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data?.length) {
          setSearchProducts(
            staticProducts.map((p) => ({
              id: p.slug || "producto",
              slug: p.slug,
              name: p.name,
              category: p.category,
              coverImage: p.coverImage,
            }))
          );
          return;
        }

        const rows = (data ?? []) as ProductRowLoose[];
        const mapped: SearchProduct[] = rows.map((p) => {
          const cover =
            p.cover_image ||
            (Array.isArray(p.images) && p.images.length ? p.images[0] : null);
          return {
            id: String(p.id || p.slug || "producto"),
            slug: p.slug || slugify(p.name || "") || p.id || "producto",
            name: p.name ?? "Producto",
            category: p.category ?? "Otros",
            coverImage: cover || "",
          };
        });
        setSearchProducts(mapped);
      } catch {
        setSearchProducts(
          staticProducts.map((p) => ({
            id: p.slug || "producto",
            slug: p.slug,
            name: p.name,
            category: p.category,
            coverImage: p.coverImage,
          }))
        );
      }
    };

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchProducts
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 10);
  }, [searchTerm, searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/producto?search=${encodeURIComponent(searchTerm.trim())}`);
    setOpen(false);
  };

  const handleSelect = (slug?: string, id?: string) => {
    setOpen(false);
    setSearchTerm("");
    const target = slug || id;
    if (!target) return;
    navigate(`/producto/${target}`);
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
                      key={item.slug || item.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(item.slug, item.id)}
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
                      {isAdmin ? (
                        <>
                          <DropdownMenuItem asChild className="gap-3">
                            <Link
                              to="/admin"
                              className="flex w-full items-center gap-3"
                            >
                              <UserRound className="h-4 w-4" />
                              <span>Admin</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3">
                            <BellRing className="h-4 w-4" />
                            <span>Notifications</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild className="gap-3">
                            <Link
                              to="/profile"
                              className="flex w-full items-center gap-3"
                            >
                              <UserRound className="h-4 w-4" />
                              <span>Your profile</span>
                            </Link>
                          </DropdownMenuItem>
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
                          <DropdownMenuItem className="gap-3">
                            <BellRing className="h-4 w-4" />
                            <span>Notifications</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </div>

                    <div className="border-t py-2 px-2">
                      {/* <DropdownMenuItem className="gap-3">
                        <Repeat2 className="h-4 w-4" />
                        <span>Switch accounts</span>
                      </DropdownMenuItem> */}
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
