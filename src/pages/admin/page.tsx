"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

import { StatChip } from "./components/StatChip";
import { Sidebar } from "./components/Sidebar";
import { BarChart } from "./components/BarChart";
import { DonutChart } from "./components/DonutChart";
import { DonutLegend } from "./components/DonutLegend";

import type { StatCard } from "./types/dashboard";
import { statCards as statCardsStatic } from "./data/dashboard";
import GraficUser from "./components/GraficUser";

const AdminDashboard: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [products, setProducts] = useState<
    Array<{ name: string; stock: number }>
  >([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const { count, error } = await supabase
          .from("user_profiles")
          .select("*", { head: true, count: "exact" });
        if (!error && typeof count === "number") setUsersCount(count);
      } catch {
        setUsersCount(null);
      }

      try {
        const { count, error } = await supabase
          .from("products")
          .select("*", { head: true, count: "exact" });
        if (!error && typeof count === "number") setProductsCount(count);
      } catch {
        setProductsCount(null);
      }

      try {
        const { data: prodRows, error: prodListErr } = await supabase
          .from("products")
          .select("name, stock")
          .order("name");
        if (!prodListErr && prodRows) {
          setProducts(
            prodRows.map((p) => ({
              name: p.name ?? "Producto",
              stock: typeof p.stock === "number" ? p.stock : 0,
            }))
          );
        }
      } catch {
        setProducts([]);
      }
    };

    loadCounts();
  }, []);

  const statCards: StatCard[] = useMemo(
    () =>
      statCardsStatic.map((card) => {
        if (card.title === "Clientes Registrados") {
          return {
            ...card,
            value: usersCount !== null ? usersCount.toLocaleString() : "--",
          };
        }
        if (card.title === "Total Productos") {
          return {
            ...card,
            value:
              productsCount !== null ? productsCount.toLocaleString() : "--",
          };
        }
        return card;
      }),
    [usersCount, productsCount]
  );

  const displayedProducts = useMemo(() => {
    if (showAllProducts) return products;
    const half = Math.ceil(products.length / 2);
    return products.slice(0, half);
  }, [products, showAllProducts]);

  const totalStock = useMemo(
    () =>
      products.reduce(
        (acc, p) => acc + (Number.isFinite(p.stock) ? p.stock : 0),
        0
      ),
    [products]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 text-neutral-900">
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Overview</p>
              <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
                Dashboard
              </h1>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary/50">
              <Plus className="h-4 w-4" />
              Add data
            </button>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                    {(() => {
                      const Icon = card.icon;
                      return <Icon className="h-4 w-4 text-primary" />;
                    })()}
                    {card.title}
                  </div>
                  <StatChip trend={card.trend} delta={card.delta} />
                </div>
                <p className="mt-3 text-3xl font-bold text-neutral-900">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Dashboard */}
            <div className="xl:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Ventas de productos
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Margen bruto vs. Ingresos
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sky-300" />
                    Margen bruto
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    Ingresos
                  </span>
                </div>
              </div>
              <BarChart />
            </div>

            {/* Products */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Inventario de productos
              </h2>
              <p className="text-sm text-neutral-500">
                Consulta el stock actual por producto.
              </p>
              <div className="mt-4 space-y-3">
                {products.length === 0 ? (
                  <div className="p-4 text-sm text-neutral-500">
                    No hay productos registrados aún.
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-primary/10 rounded-lg">
                      {displayedProducts.map((p) => (
                        <li
                          key={p.name}
                          className="flex items-center justify-between px-4 py-2 text-sm"
                        >
                          <span className="text-neutral-800">{p.name}</span>
                          <span className="font-semibold text-primary">
                            {p.stock}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {products.length > displayedProducts.length &&
                      !showAllProducts && (
                        <button
                          type="button"
                          className="w-full rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/80 bg-primary text-white"
                          onClick={() => setShowAllProducts(true)}
                        >
                          Ver más
                        </button>
                      )}

                    {showAllProducts && products.length > 0 && (
                      <button
                        type="button"
                        className="w-full rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/80 bg-primary text-white"
                        onClick={() => setShowAllProducts(false)}
                      >
                        Ver menos
                      </button>
                    )}

                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800">
                      <div>
                        <span className="text-neutral-800 text-sm">
                          Total de productos:{" "}
                        </span>
                        <span className="ml-2 font-semibold text-primary">
                          {" "}
                          {productsCount}{" "}
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-800 text-sm">
                          Cantidad de productos:{" "}
                        </span>
                        <span className="ml-2 font-semibold text-primary">
                          {" "}
                          {totalStock}{" "}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Flujo de usuarios
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Margen bruto vs. Ingresos
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sky-300" />
                    Nuevos
                  </span>
                  
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    Viejos
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-300" />
                    Recurrentes
                  </span>
                </div>
              </div>
                <GraficUser/>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Sales by product category
              </h2>
              <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <DonutLegend />
                </div>
                <div className="flex-1 flex justify-center">
                  <DonutChart />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
