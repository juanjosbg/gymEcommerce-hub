import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductImages } from "@/data/ImgContent";
import AddProductModal from "./AddProductModal";

type Product = {
  id: string;
  slug?: string | null;
  name: string | null;
  price: number | null;
  stock: number | null;
  coverImage?: string | null;
  category?: string | null;
  overview?: string | null;
};

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const findFallbackImage = (slug?: string | null, name?: string | null) => {
  const keys = Object.keys(ProductImages as any);
  const mapSlugToKey: Record<string, string> = {
    Vemon: "venom",
    "psychotic-orange": "psychotic",
    "dymatize-iso100-vainilla": "iso100",
    "cbum-itholate": "cbum",
    "cbum-itholate-cake": "cake",
    "raw-mint-chip": "cream",
    "gold-standard-chocolate": "gold",
    "gold-standard-whey": "whey",
    Ryse: "ryse",
    Pak: "pak",
    Muscletech: "muscletech",
    Falcon: "falcon",
    Bordan: "bordan",
    Bcaas: "bcaas",
    "modern-eaa-plus": "modernEaa",
    "omega-3-90-softgels": "omega3",
    "creatina-monohidratada-birdman-450g": "creatinaBirdman",
    "creatina-dragon-pharma-1kg": "dragonCreatine",
    "glutamina-creatina": "glutamina",
    "mutant-whey-chocolate-5lb": "whey",
    "mass-tech-extreme-2000": "muscletech",
    "birdman-bcaa-glutamina-405g": "bcaas",
  };
  const candidates: string[] = [];
  if (slug) candidates.push(slug);
  if (name) candidates.push(slugify(name));

  for (const candidate of candidates) {
    const mapped = mapSlugToKey[candidate];
    if (mapped && keys.includes(mapped)) {
      return (ProductImages as any)[mapped]?.[0] || null;
    }
  }

  for (const candidate of candidates) {
    const exact = keys.find((k) => k === candidate);
    if (exact) return (ProductImages as any)[exact]?.[0] || null;

    const partial = keys.find(
      (k) => candidate.includes(k) || k.includes(candidate)
    );
    if (partial) return (ProductImages as any)[partial]?.[0] || null;
  }

  const lowerName = (name || "").toLowerCase();
  const matchByName = keys.find((k) => lowerName.includes(k.toLowerCase()));
  if (matchByName) return (ProductImages as any)[matchByName]?.[0] || null;

  return null;
};

const AdminProductosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, price, stock, category, cover_image")
        .order("name");
      if (error) {
        setError(error.message);
      } else {
        const normalized = (data ?? []).map((p: any) => {
          const fallback = findFallbackImage(p.slug, p.name);
          return {
            id: p.id,
            slug: p.slug ?? null,
            name: p.name ?? null,
            price: p.price ?? null,
            stock: p.stock ?? null,
            category: p.category ?? null,
            coverImage: p.cover_image || fallback,
          };
        });
        setProducts(normalized);
      }
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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary/50"
            >
              <Plus className="h-4 w-4" />
              Add product
            </button>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50 text-left text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Imagen</th>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Undidad</th>
                    <th className="px-4 py-3 font-semibold">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                        Cargando productos…
                      </td>
                    </tr>
                  )}

                  {error && !loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                        Error: {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                        No hay productos registrados.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="h-12 w-12 overflow-hidden rounded-lg border bg-neutral-100">
                            {p.coverImage ? (
                              <img
                                src={p.coverImage}
                                alt={p.name ?? "Producto"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                Sin img
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{p.name ?? "Producto"}</td>
                        <td className="px-4 py-3">{p.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          {typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">
                          {typeof p.stock === "number" ? p.stock : 0}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary"></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <AddProductModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(p) => {
          setProducts((prev) => [p as any, ...prev]);
        }}
      />
    </div>
  );
};

export default AdminProductosPage;
