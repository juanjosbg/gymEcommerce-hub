import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { productCategories } from "@/data/Filter";

const BUCKET = "product-images";

type Props = {
  open: boolean;
  onClose: () => void;
  product?: {
    id?: string;
    slug?: string;
    name?: string | null;
    category?: string | null;
    price?: number | null;
    previousPrice?: number | null;
    previous_price?: number | null;
    stock?: number | null;
    coverImage?: string | null;
    cover_image?: string | null;
    shots?: string[];
    images?: string[];
    overview?: string | null;
    shipment_details?: { title: string; description: string }[];
  };
  onSaved: (product: {
    id: string;
    slug: string;
    name: string;
    category: string | null;
    price: number | null;
    previousPrice?: number;
    stock: number | null;
    coverImage: string | null;
    shots?: string[];
    images?: string[];
    overview?: string;
    shipment_details?: { title: string; description: string }[];
  }) => void;
};

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const EditProductModal: React.FC<Props> = ({ open, onClose, product, onSaved }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(productCategories[0] || "");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [allowImageEdit, setAllowImageEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [removedExisting, setRemovedExisting] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_IMAGES = 6;
  const displayImages = useMemo(
    () =>
      allowImageEdit
        ? [
            ...(files.map((f) => URL.createObjectURL(f)) as string[]),
            ...existingImages,
          ]
        : existingImages,
    [allowImageEdit, files, existingImages]
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(name || "producto"), [name]);
  const discountOptions = useMemo(() => {
    const initial = [2, 3, 4, 5];
    const stepped: number[] = [];
    for (let i = 10; i <= 50; i += 5) stepped.push(i);
    const base = [...initial, ...stepped];
    if (discountPercent && !base.includes(discountPercent)) {
      return [...base, discountPercent].sort((a, b) => a - b);
    }
    return base;
  }, [discountPercent]);
  const discountedPrice = useMemo(() => {
    if (price === null) return null;
    if (!hasDiscount || !discountPercent) return price;
    const result = price * (1 - discountPercent / 100);
    return Number(result.toFixed(2));
  }, [price, hasDiscount, discountPercent]);

  const getStoragePath = (url: string) => {
    try {
      const parsed = new URL(url);
      const marker = `/object/public/${BUCKET}/`;
      const idx = parsed.pathname.indexOf(marker);
      if (idx >= 0) {
        return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
      }
    } catch {
      // fallback abajo
    }
    return decodeURIComponent(url.split(`${BUCKET}/`)[1] || "");
  };

  useEffect(() => {
    if (!open || !product) return;
    setName(product.name ?? "");
    setCategory(product?.category ?? (productCategories[0] ?? ""));
    setPrice(product.price ?? null);
    setStock(product.stock ?? null);
    setOverview(product.overview ?? "");
    setAllowImageEdit(false);
    const prev = typeof product.previousPrice === "number" ? product.previousPrice : null;
    const current = typeof product.price === "number" ? product.price : null;
    if (prev && current && prev > current) {
      const pct = Math.round(((prev - current) / prev) * 100);
      setHasDiscount(true);
      setDiscountPercent(pct > 0 ? pct : 0);
    } else {
      setHasDiscount(false);
      setDiscountPercent(0);
    }
    setShipmentDetails(product.shipment_details ?? [
      { title: "Descuento", description: "" },
      { title: "Tiempo de entrega", description: "" },
      { title: "Presentación", description: "" },
      { title: "Llegada estimada", description: "" },
    ]);
    const imgs =
      (Array.isArray(product.images) && product.images.length && product.images) ||
      (Array.isArray(product.shots) && product.shots.length && product.shots) ||
      [];
    const cover = product.coverImage ?? product.cover_image;
    const baseImages = imgs.length ? imgs : cover ? [cover] : [];
    setExistingImages(baseImages);
    setOriginalImages(baseImages);
    setFiles([]);
    setRemovedExisting([]);
    setSelectedImage(0);
  }, [open, product]);

  useEffect(() => {
    setSelectedImage((prev) =>
      prev >= displayImages.length ? Math.max(0, displayImages.length - 1) : prev
    );
  }, [displayImages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const uploaded: string[] = [...existingImages];

    setUploading(true);
    // Siempre recalculamos portada con el primer slot disponible
    let coverUrl: string | null = uploaded[0] ?? null;

    // Subir nuevas imágenes si se adjuntan y está habilitado
    if (allowImageEdit && files.length) {
      for (const [index, file] of files.entries()) {
        const extFromName = file.name.split(".").pop()?.toLowerCase();
        const extFromType = file.type.split("/")[1];
        const ext = extFromName || extFromType || "jpg";
        const filePath = `${slug}/${Date.now()}-${index}.${ext}`.replace(
          /\s+/g,
          "-"
        );

        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, file, { upsert: true });

        if (uploadErr) {
          setError(uploadErr.message || "No se pudo subir la imagen");
          setUploading(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(filePath);

        uploaded.push(publicData.publicUrl);
      }
      coverUrl = uploaded[0] || null;
    }

    if (allowImageEdit && uploaded.length < 3) {
      setError("Debes tener al menos 3 imágenes en el producto.");
      setUploading(false);
      return;
    }

    // Calcular paths a borrar (las removidas explícitamente + las que ya no están)
    const pathsFromRemoved = removedExisting.filter(Boolean);
    const pathsFromDiff = originalImages
      .filter((url) => !uploaded.includes(url))
      .map(getStoragePath)
      .filter(Boolean);
    const pathsToRemove = Array.from(new Set([...pathsFromRemoved, ...pathsFromDiff]));

    if (pathsToRemove.length) {
      await supabase.storage.from(BUCKET).remove(pathsToRemove);
    }

    // Datos finales de precio
    const finalPrice = hasDiscount ? discountedPrice ?? price : price;
    const previousPrice = hasDiscount ? price : null;

    // Insertar en Supabase
    const { data, error: upsertErr } = await supabase
      .from("products")
      .upsert(
        {
          id: product?.id,
          slug,
          name,
          category: category || null,
          price: finalPrice,
          previous_price: previousPrice,
          stock,
          cover_image: coverUrl,
          images: uploaded.length ? uploaded : product?.images ?? product?.shots ?? [],
          overview: overview || null,
          shipment_details: shipmentDetails,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    setUploading(false);

    if (upsertErr || !data) {
      setError(upsertErr?.message || "No se pudo guardar el producto");
      return;
    }

    // Mapear a camelCase para el front
    const row = data as {
      id: string;
      slug?: string | null;
      name: string;
      category: string | null;
      price: number | null;
      previous_price?: number | null;
      stock: number | null;
      cover_image?: string | null;
      image_url?: string | null;
      images?: string[];
      overview?: string | null;
      shipment_details?: unknown;
    };
    const persistedShipmentDetails = Array.isArray(row.shipment_details)
      ? (row.shipment_details as { title: string; description: string }[])
      : [];
    onSaved({
      id: row.id,
      slug: row.slug || slug,
      name: row.name,
      category: row.category,
      price: row.price,
      previousPrice: row.previous_price ?? undefined,
      stock: row.stock,
      coverImage: row.cover_image || row.image_url || coverUrl,
      shots: row.images ?? [],
      images: row.images ?? uploaded,
      overview: row.overview ?? undefined,
      shipment_details: persistedShipmentDetails,
    });

    onClose();
    setName("");
    setCategory(productCategories[0] || "");
    setPrice(null);
    setStock(null);
    setOverview("");
    setShipmentDetails([
      { title: "Descuento", description: "" },
      { title: "Tiempo de entrega", description: "" },
      { title: "Presentación", description: "" },
      { title: "Llegada estimada", description: "" },
    ]);
    setExistingImages([]);
    setOriginalImages([]);
    setFiles([]);
    setRemovedExisting([]);
    setAllowImageEdit(false);
    setSelectedImage(0);
    setHasDiscount(false);
    setDiscountPercent(0);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm text-neutral-500">Editar producto</p>
            <h2 className="text-xl font-semibold text-neutral-900">
              Editar producto
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

                <hr className="mt-5" />
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
                      onChange={(e) => {
                        const enabled = e.target.value === "si";
                        setHasDiscount(enabled);
                        if (!enabled) {
                          setDiscountPercent(0);
                        } else if (!discountPercent) {
                          setDiscountPercent(2);
                        }
                      }}
                    >
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>
                </div>

                {hasDiscount && (
                  <div className="mt-3 flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-neutral-700">
                        % Para el descuento
                      </label>
                      <select
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                        value={discountPercent || ""}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      >
                        {discountOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}%
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium text-neutral-700">
                        Nuevo precio (aplicado)
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none bg-neutral-50 text-neutral-700"
                        value={discountedPrice ?? ""}
                        readOnly
                        placeholder="Calculado automáticamente"
                      />
                    </div>
                  </div>
                )}

                <hr className="mt-5" />

                <div className="mt-3 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                      Categoria
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

          {/* Columna derecha: imágenes */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-800">
                  Imágenes actuales
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAllowImageEdit((v) => {
                      const next = !v;
                      setFiles([]);
                      setSelectedImage(0);
                      return next;
                    });
                  }}
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary"
                >
                  <input type="checkbox" checked={allowImageEdit} readOnly />
                  <span>Editar imágenes</span>
                </button>
              </div>
              <div className="mt-3">
                {displayImages.length === 0 && (
                  <p className="text-sm text-neutral-500">
                    Sin imágenes guardadas.
                  </p>
                )}
                {displayImages.length > 0 && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <div className="w-full overflow-hidden rounded-xl bg-white">
                      <img
                        src={displayImages[selectedImage] || displayImages[0]}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {displayImages.map((url, idx) => (
                        <div
                          key={idx}
                          className={`relative h-16 w-full overflow-hidden rounded-lg border ${
                            idx === selectedImage ? "border-primary" : "border-neutral-200"
                          } bg-white`}
                          onClick={() => setSelectedImage(idx)}
                        >
                          <img
                            src={url}
                            alt={`img-${idx}`}
                            className="h-full w-full object-cover"
                          />
                          {allowImageEdit && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!allowImageEdit) return;
                                const isFileThumb = idx < files.length;
                                if (isFileThumb) {
                                  setFiles((prev) => prev.filter((_, i) => i !== idx));
                                } else {
                                  const existingIdx = idx - files.length;
                                  const urlToRemove = existingImages[existingIdx];
                                  if (urlToRemove) {
                                    const path = getStoragePath(urlToRemove);
                                    if (path) {
                                      setRemovedExisting((prev) =>
                                        prev.includes(path) ? prev : [...prev, path]
                                      );
                                      try {
                                        await supabase.storage.from(BUCKET).remove([path]);
                                      } catch (err) {
                                        console.error("Error al eliminar imagen", err);
                                      }
                                    }
                                  }
                                  setExistingImages((prev) =>
                                    prev.filter((_, i) => i !== existingIdx)
                                  );
                                }
                                setSelectedImage(0);
                              }}
                              className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-red-500 shadow hover:bg-white"
                              disabled={uploading}
                              title="Eliminar imagen"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {allowImageEdit && displayImages.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-primary hover:text-primary"
                          title="Agregar imagen"
                          disabled={uploading}
                        >
                          +
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files ? Array.from(e.target.files) : [];
                        if (!selected.length) return;
                        const currentTotal = files.length + existingImages.length;
                        const remainingSlots = MAX_IMAGES - currentTotal;
                        if (remainingSlots <= 0) return;
                        const nextFiles = selected.slice(0, remainingSlots);
                        setFiles((prev) => [...prev, ...nextFiles]);
                        e.target.value = "";
                      }}
                    />
                  </div>
                )}
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
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
