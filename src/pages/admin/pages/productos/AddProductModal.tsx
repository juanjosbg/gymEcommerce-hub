import React, { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Upload, Loader2, Image, Trash2 } from "lucide-react";
import { productCategories } from "@/data/Filter";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (product: {
    id: string;
    slug: string;
    name: string;
    category: string | null;
    price: number | null;
    stock: number | null;
    coverImage: string | null;
  }) => void;
};

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const AddProductModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(productCategories[0] || "");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [overview, setOverview] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState<
    { title: string; description: string }[]
  >([
    { title: "Descuento", description: "" },
    { title: "Tiempo de entrega", description: "" },
    { title: "Presentación", description: "" },
    { title: "Llegada estimada", description: "" },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(name || "producto"), [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (files.length !== 3) {
      setError("Debes subir exactamente 3 imágenes.");
      return;
    }
    setUploading(true);
    let coverUrl: string | null = null;
    const uploaded: string[] = [];

    // Sube imagen si existe
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${slug}/${Date.now()}-${file.name}`.replace(/\s+/g, "-");
      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);
      if (uploadErr) {
        setError("No se pudo subir la imagen");
        setUploading(false);
        return;
      }
      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      uploaded.push(publicData.publicUrl);
    }
    coverUrl = uploaded[0] || null;

    // Inserta producto
    const { data, error: insertErr } = await supabase
      .from("products")
      .insert({
        slug,
        name,
        category: category || null,
        price,
        previous_price: null,
        stock,
        cover_image: coverUrl,
        overview: overview || null,
        shipment_details: shipmentDetails,
      })
      .select()
      .single();

    setUploading(false);

    if (insertErr || !data) {
      setError(insertErr?.message || "No se pudo crear el producto");
      return;
    }

    const row: any = data;
    onCreated({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      price: row.price,
      stock: row.stock,
      coverImage: row.cover_image || row.image_url || coverUrl,
    });
    onClose();
    setName("");
    setCategory("");
    setPrice(null);
    setStock(null);
    setOverview("");
    setFiles([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm text-neutral-500">Agregar producto</p>
            <h2 className="text-xl font-semibold text-neutral-900">
              Nuevo producto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6 lg:grid-cols-2">
          {/* Columna izquierda: subida de imágenes */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-neutral-700">
                    Nombre
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Pre-entreno X"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border-neutral-200 bg-neutral-50/80 mt-3 p-4">
                <label className="text-sm font-medium text-neutral-700">
                  Descripción general
                </label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                  rows={6}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Breve descripción del producto"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
                <div className="mt-3 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Slug
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none bg-neutral-50 text-neutral-500"
                      value={slug}
                      readOnly
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Cantidad del producto
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={stock ?? ""}
                      onChange={(e) => setStock(Number(e.target.value) || 0)}
                      min={0}
                      placeholder="0"
                    />
                  </div>
                </div>

                <hr className="mt-5"/>
                <div className="mt-3 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Precio
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={price ?? ""}
                      onChange={(e) => setPrice(Number(e.target.value) || 0)}
                      min={0}
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Producto con descuento
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      value={hasDiscount ? "si" : "no"}
                      onChange={(e) => setHasDiscount(e.target.value === "si")}
                    >
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      % Para el descuento
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Precio con descuento
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={price ?? ""}
                      onChange={(e) => setPrice(Number(e.target.value) || 0)}
                      min={0}
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <hr className="mt-5"/>
                <div className="mt-3 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Categoría
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: formulario de datos */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 px-4 py-5">
              <p className="text-sm font-semibold text-neutral-800 mb-3">
                Añadir imágenes
              </p>
              <label className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed ${files.length === 3 ? "border-green-400 bg-green-50/60" : "border-primary/40 bg-white"} transition hover:border-primary/70`}>
                <Upload className={`h-10 w-10 ${files.length === 3 ? "text-green-500" : "text-primary/60"}`} />
                <span className="mt-2 text-sm text-neutral-600">
                  {files.length === 3 ? "Listo: 3 imágenes cargadas" : <>Arrastra o suelta, o <span className="text-primary">explora</span></>}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    const incoming = e.target.files ? Array.from(e.target.files) : [];
                    setFiles((prev) => {
                      const next = [...prev, ...incoming].slice(0, 3);
                      return next;
                    });
                  }}
                  disabled={files.length >= 3}
                />
              </label>
              <div className="mt-4 space-y-2">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Image className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-neutral-800">
                          {f.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {Math.round(f.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) =>
                          prev.filter((_, fileIdx) => fileIdx !== idx)
                        )
                      }
                      className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      disabled={uploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {!files.length && (
                  <p className="text-xs text-neutral-400">
                    No hay imágenes seleccionadas.
                  </p>
                )}
                <p className="text-xs text-neutral-500">
                  Requeridas: 3 imágenes. Restantes: {Math.max(0, 3 - files.length)}.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
              >
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                Publicar producto
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
