import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "../../components/Sidebar";
import { supabase } from "@/integrations/supabase/client";

const PROMO_ID = "home_promo";
const BUCKET = "product-images";

type MarketingRow = {
  id: string;
  title: string | null;
  heading: string | null;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  images: string[] | null;
  promo_tag_title?: string | null;
  promo_tag_cta_text?: string | null;
  promo_tag_cta_link?: string | null;
  promo_tag_images?: string[] | null;
  products_heading?: string | null;
  products_description?: string | null;
  promo_product_ids?: string[] | null;
};

const InlineSectionHeader: React.FC<{
  title: string;
  actionLabel: string;
  onAction: () => void;
}> = ({ title, actionLabel, onAction }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs uppercase tracking-wide text-neutral-700">{title}</p>
    <button
      type="button"
      onClick={onAction}
      className="rounded-lg border border-neutral-200 px-3 py-1 text-xs hover:border-primary/50"
    >
      {actionLabel}
    </button>
  </div>
);

const defaultState = {
  title: "🔥 LLEGÓ LA BESTIA 🔥",
  heading: "PSYCHOTIC – POTENCIA AL LÍMITE",
  description:
    "No es un simple pre-entreno. PSYCHOTIC desata una energía brutal.",
  cta_text: "View Product",
  cta_link: "/producto",
  images: [] as string[],
  promo_tag_title: "¡Descubre Descuentos Irresistibles!",
  promo_tag_cta_text: "Conocer Más",
  promo_tag_cta_link: "/producto",
  promo_tag_images: [] as string[],
  products_heading: "Haz tu compra ahora, tu progreso empieza hoy.",
  products_description:
    "¡Tenemos una gran variedad de colecciones para ti! Explora y encuentra los zapatos de tus sueños, ¡hazlo realidad!",
  promo_product_ids: [] as string[],
};

const defaultPromoImages = [
  "/PSYCCHOTIC1.png",
  "/PSYCCHOTIC2.png",
  "/PSYCCHOTIC3.png",
  "/PSYCCHOTIC4.png",
];

const defaultPromoTagImages = ["/OFF.webp", "/OFF2.webp", "/PreEntreno.webp"];

const MarketingContentPage: React.FC = () => {
  type ProductRow = {
    id: string | number | null;
    name: string | null;
    price: number | null;
    previous_price?: number | null;
    cover_image?: string | null;
    images?: string[] | null;
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(defaultState);
  const [imagePool, setImagePool] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<
    {
      id: string;
      name: string;
      price: number | null;
      previousPrice: number | null;
      image: string | null;
    }[]
  >([]);
  const [promoTagImageUrl, setPromoTagImageUrl] = useState("");
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [addImageTarget, setAddImageTarget] = useState<
    "images" | "promo_tag_images"
  >("images");
  const [uploadingPromoTag, setUploadingPromoTag] = useState(false);
  const [uploadingPromoMain, setUploadingPromoMain] = useState(false);
  const [promoMainImageUrl, setPromoMainImageUrl] = useState("");
  const promoTagFileRef = useRef<HTMLInputElement | null>(null);
  const promoMainFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await supabase
          .from("marketing_content")
          .select("*")
          .eq("id", PROMO_ID)
          .maybeSingle();

        if (data) {
          const row = data as MarketingRow;
          setForm({
            title: row.title || defaultState.title,
            heading: row.heading || defaultState.heading,
            description: row.description || defaultState.description,
            cta_text: row.cta_text || defaultState.cta_text,
            cta_link: row.cta_link || defaultState.cta_link,
            images: Array.isArray(row.images) ? row.images : [],
            promo_tag_title: row.promo_tag_title || defaultState.promo_tag_title,
            promo_tag_cta_text:
              row.promo_tag_cta_text || defaultState.promo_tag_cta_text,
            promo_tag_cta_link:
              row.promo_tag_cta_link || defaultState.promo_tag_cta_link,
            promo_tag_images: Array.isArray(row.promo_tag_images)
              ? row.promo_tag_images
              : [],
            products_heading:
              row.products_heading || defaultState.products_heading,
            products_description:
              row.products_description || defaultState.products_description,
            promo_product_ids: Array.isArray(row.promo_product_ids)
              ? row.promo_product_ids
              : [],
          });
        }

        const { data: products } = await supabase
          .from("products")
          .select("id, name, price, previous_price, cover_image, images")
          .order("created_at", { ascending: false });
        const urls = new Set<string>();
        const all: {
          id: string;
          name: string;
          price: number | null;
          previousPrice: number | null;
          image: string | null;
        }[] = [];
        (products || []).forEach((p: ProductRow) => {
          if (p.cover_image) urls.add(p.cover_image);
          if (Array.isArray(p.images)) {
            p.images.forEach((u: string) => u && urls.add(u));
          }
          const img =
            p.cover_image ||
            (Array.isArray(p.images) && p.images.length ? p.images[0] : null);
          all.push({
            id: String(p.id || p.name || crypto.randomUUID()),
            name: p.name || "Producto",
            price: typeof p.price === "number" ? p.price : null,
            previousPrice:
              typeof p.previous_price === "number" ? p.previous_price : null,
            image: img,
          });
        });
        setImagePool(Array.from(urls));
        setAllProducts(all);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "No se pudo cargar el contenido";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const canSave = useMemo(
    () => form.heading.trim().length > 0 && !saving,
    [form.heading, saving]
  );

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        id: PROMO_ID,
        title: form.title || null,
        heading: form.heading || null,
        description: form.description || null,
        cta_text: form.cta_text || null,
        cta_link: form.cta_link || null,
        images: form.images.length ? form.images : null,
        promo_tag_title: form.promo_tag_title || null,
        promo_tag_cta_text: form.promo_tag_cta_text || null,
        promo_tag_cta_link: form.promo_tag_cta_link || null,
        promo_tag_images: form.promo_tag_images.length
          ? form.promo_tag_images
          : null,
        products_heading: form.products_heading || null,
        products_description: form.products_description || null,
        promo_product_ids: form.promo_product_ids.length
          ? form.promo_product_ids
          : null,
      };
      const { error } = await supabase
        .from("marketing_content")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el contenido";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const addImageTo = (key: "images" | "promo_tag_images", url: string) => {
    if (!url) return;
    setForm((prev) => {
      const base =
        key === "images" && prev.images.length === 0
          ? defaultPromoImages
          : key === "promo_tag_images" && prev.promo_tag_images.length === 0
          ? defaultPromoTagImages
          : prev[key];
      return {
        ...prev,
        [key]: base.includes(url) ? base : [...base, url],
      };
    });
  };

  const addPromoProduct = (id: string) => {
    if (!id) return;
    setForm((prev) => ({
      ...prev,
      promo_product_ids: prev.promo_product_ids.includes(id)
        ? prev.promo_product_ids
        : [...prev.promo_product_ids, id],
    }));
  };

  const removePromoProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      promo_product_ids: prev.promo_product_ids.filter((pid) => pid !== id),
    }));
  };

  const removeImageFrom = (key: "images" | "promo_tag_images", url: string) => {
    setForm((prev) => {
      const base =
        key === "images" && prev.images.length === 0
          ? defaultPromoImages
          : key === "promo_tag_images" && prev.promo_tag_images.length === 0
          ? defaultPromoTagImages
          : prev[key];
      return {
        ...prev,
        [key]: base.filter((i) => i !== url),
      };
    });
  };

  const handlePromoTagUpload = async (file: File) => {
    if (!file) return;
    setUploadingPromoTag(true);
    setError(null);
    try {
      const extFromName = file.name.split(".").pop()?.toLowerCase();
      const extFromType = file.type.split("/")[1];
      const ext = extFromName || extFromType || "jpg";
      const filePath = `promo-tag/${Date.now()}-${file.name}`.replace(/\s+/g, "-");

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      const url = publicData?.publicUrl;
      if (url) addImageTo("promo_tag_images", url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo subir la imagen";
      setError(message);
    } finally {
      setUploadingPromoTag(false);
      if (promoTagFileRef.current) promoTagFileRef.current.value = "";
    }
  };

  const handlePromoMainUpload = async (file: File) => {
    if (!file) return;
    setUploadingPromoMain(true);
    setError(null);
    try {
      const extFromName = file.name.split(".").pop()?.toLowerCase();
      const extFromType = file.type.split("/")[1];
      const ext = extFromName || extFromType || "jpg";
      const filePath = `promo-main/${Date.now()}-${file.name}`.replace(/\s+/g, "-");

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      const url = publicData?.publicUrl;
      if (url) addImageTo("images", url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo subir la imagen";
      setError(message);
    } finally {
      setUploadingPromoMain(false);
      if (promoMainFileRef.current) promoMainFileRef.current.value = "";
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 text-neutral-900">
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8">
            <p className="text-sm text-neutral-500">Marketing</p>
            <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
              Contenido promocional
            </h1>
            <p className="text-sm text-neutral-500">
              Edita el bloque principal de la página de inicio.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              Cargando contenido...
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Título superior
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="🔥 LLEGÓ LA BESTIA 🔥"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Título principal
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={form.heading}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, heading: e.target.value }))
                      }
                      placeholder="PSYCHOTIC – POTENCIA AL LÍMITE"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Descripción
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Texto de la promoción"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Texto del botón
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        value={form.cta_text}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cta_text: e.target.value,
                          }))
                        }
                        placeholder="View Product"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Link del botón
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        value={form.cta_link}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cta_link: e.target.value,
                          }))
                        }
                        placeholder="/producto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Imágenes del promo principal
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(form.images.length ? form.images : defaultPromoImages).map(
                    (url) => (
                    <div
                      key={url}
                      className="relative h-24 overflow-hidden rounded-xl border bg-neutral-50"
                    >
                      <img
                        src={url}
                        alt="promo"
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFrom("images", url)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs text-red-500 shadow"
                      >
                        Quitar
                      </button>
                    </div>
                  )
                  )}
                  {form.images.length === 0 && (
                    null
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={promoMainFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePromoMainUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => promoMainFileRef.current?.click()}
                      className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:border-primary/50 disabled:opacity-60"
                      disabled={uploadingPromoMain}
                    >
                      {uploadingPromoMain ? "Subiendo..." : "Subir imagen"}
                    </button>
                    <span className="text-xs text-neutral-500">
                      Se guardará en `{BUCKET}/promo-main/`
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <InlineSectionHeader
                    title="Productos actuales (click para agregar)"
                    actionLabel="Agregar"
                    onAction={() => {
                      setAddImageTarget("images");
                      setShowAddImageModal(true);
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-2md font-semibold text-neutral-800">
                Promo lateral <span className="text-md uppercase text-red-400">(Slider Card)</span>
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Título
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={form.promo_tag_title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          promo_tag_title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Texto del botón
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        value={form.promo_tag_cta_text}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            promo_tag_cta_text: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Link del botón
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        value={form.promo_tag_cta_link}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            promo_tag_cta_link: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Imágenes del promo lateral
                    </label>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {(form.promo_tag_images.length
                        ? form.promo_tag_images
                        : defaultPromoTagImages
                      ).map((url) => (
                        <div
                          key={url}
                          className="relative h-24 overflow-hidden rounded-xl border bg-neutral-50"
                        >
                          <img
                            src={url}
                            alt="promo-tag"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFrom("promo_tag_images", url)}
                            className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs text-red-500 shadow"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                      {form.promo_tag_images.length === 0 && null}
                    </div>
                    {form.promo_tag_images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.promo_tag_images.map((url) => (
                          <div
                            key={`${url}-mini`}
                            className="h-10 w-10 overflow-hidden rounded-md border bg-white"
                            title="Imagen actual"
                          >
                            <img
                              src={url}
                              alt="mini"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <InlineSectionHeader
                        title="Productos actuales (click para agregar)"
                        actionLabel="Agregar"
                        onAction={() => {
                          setAddImageTarget("promo_tag_images");
                          setShowAddImageModal(true);
                        }}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        ref={promoTagFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePromoTagUpload(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => promoTagFileRef.current?.click()}
                        className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:border-primary/50 disabled:opacity-60"
                        disabled={uploadingPromoTag}
                      >
                        {uploadingPromoTag ? "Subiendo..." : "Subir imagen"}
                      </button>
                      <span className="text-xs text-neutral-500">
                        Se guardará en `{BUCKET}/promo-tag/`
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-2md font-semibold text-neutral-800">
                  Sección de productos <span className="text-md uppercase text-red-400">(home)</span>
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Título
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      value={form.products_heading}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          products_heading: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Descripción
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
                      rows={4}
                      value={form.products_description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          products_description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="text-2md font-semibold text-neutral-800">
                Productos en línea <span className="text-md uppercase text-red-400">(Todos los productos)</span>
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Estos son los productos que se estan muestran en este momento.
                  <br />
                  Puedes agregar o quitar desde aquí.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {form.promo_product_ids.map((id) => {
                    const p = allProducts.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="rounded-xl border bg-neutral-50 p-3">
                        <div className="h-28 w-full overflow-hidden rounded-lg bg-white">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-sm font-medium text-neutral-900">
                          {p.name}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-neutral-500 line-through">
                            {p.previousPrice ? `$${p.previousPrice}` : ""}
                          </span>
                          <span className="text-primary">
                            {p.price !== null ? `$${p.price}` : "—"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePromoProduct(id)}
                          className="mt-2 w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs text-red-500 hover:border-red-300"
                        >
                          Quitar del carrousel
                        </button>
                      </div>
                    );
                  })}
                  {form.promo_product_ids.length === 0 && (
                    <p className="col-span-2 text-sm text-neutral-500 lg:col-span-4">
                      No hay productos en el carrousel. Agrega desde la lista inferior.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Agregar productos al carrousel
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {allProducts.map((p) => {
                      const isSelected = form.promo_product_ids.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className={`rounded-xl border p-3 ${
                            isSelected ? "bg-primary/5 border-primary/40" : "bg-neutral-50"
                          }`}
                        >
                          <div className="h-24 w-full overflow-hidden rounded-lg bg-white">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                Sin imagen
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {p.name}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              isSelected ? removePromoProduct(p.id) : addPromoProduct(p.id)
                            }
                            className="mt-2 w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs hover:border-primary/50"
                          >
                            {isSelected ? "Quitar" : "Agregar"}
                          </button>
                        </div>
                      );
                    })}
                    {allProducts.length === 0 && (
                      <p className="col-span-2 text-sm text-neutral-500 lg:col-span-4">
                        No hay productos disponibles.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 lg:col-span-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end lg:col-span-2">
                <button
                  type="button"
                  disabled={!canSave}
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-3 sm:p-6">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <p className="text-sm text-neutral-500">Productos actuales</p>
                <h2 className="text-xl font-semibold text-neutral-900">
                  {addImageTarget === "images"
                    ? "Selecciona imágenes para el promo principal"
                    : "Selecciona imágenes para el promo lateral"}
                </h2>
              </div>
              <button
                onClick={() => setShowAddImageModal(false)}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              {imagePool.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No hay imágenes en productos.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {imagePool.map((url) => {
                    const base =
                      addImageTarget === "images"
                        ? form.images.length
                          ? form.images
                          : defaultPromoImages
                        : form.promo_tag_images.length
                        ? form.promo_tag_images
                        : defaultPromoTagImages;
                    const selected = base.includes(url);
                    return (
                    <button
                      key={url}
                      type="button"
                      className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-neutral-50 hover:border-primary/50 ${
                        selected ? "border-red-500 ring-2 ring-red-300" : ""
                      }`}
                      onClick={() =>
                        selected
                          ? removeImageFrom(addImageTarget, url)
                          : addImageTo(addImageTarget, url)
                      }
                      title="Agregar"
                    >
                      <img
                        src={url}
                        alt="producto"
                        className="h-full w-full object-contain p-2"
                      />
                    </button>
                  );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAddImageModal(false)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:border-primary/50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingContentPage;
