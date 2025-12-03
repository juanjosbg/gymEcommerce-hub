import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string | null;
  price: number | null;
  stock: number | null;
  category?: string | null;
};

const AdminProductosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, category")
        .order("name");
      if (error) setError(error.message);
      else setProducts(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const totalStock = useMemo(
    () =>
      products.reduce(
        (acc, p) => acc + (Number.isFinite(p.stock ?? 0) ? Number(p.stock) : 0),
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
                Productos
              </h1>
              <p className="text-sm text-neutral-500">
                Total items en inventario: {totalStock}
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary/50">
              <Plus className="h-4 w-4" />
              Add product
            </button>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50 text-left text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                        Cargando productos…
                      </td>
                    </tr>
                  )}

                  {error && !loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-red-600">
                        Error: {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                        No hay productos registrados.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">{p.name ?? "Producto"}</td>
                        <td className="px-4 py-3">{p.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          {typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">
                          {typeof p.stock === "number" ? p.stock : 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProductosPage;
