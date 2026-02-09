import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "../../components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductRowLoose } from "@/entities/product/types";
import type { MarketingContentRow } from "@/entities/marketing/types";
import EditProductModal, {
  type EditProductInput,
} from "@/pages/admin/pages/productos/EdditProductModal";
import { products as localProducts } from "@/data/content";
import ProductSlider from "@/components/Promocional-product/ProductSlider";
import ProductCard from "@/components/Promocional-product/ProductCard";
import { ProductImages } from "@/data/ImgContent";
import AddProductModal from "@/pages/admin/pages/productos/AddProductModal";

const PROMO_ID = "home_promo";
const PROMO_KEY = "home_slider";
const BUCKET = "product-images";

const slugify = (str: string) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getFallbackCover = (slug: string, name: string) => {
  const keyDirect = ProductImages[slug as keyof typeof ProductImages]
    ? slug
    : undefined;
  const keyByMatch =
    keyDirect ||
    (Object.keys(ProductImages).find((k) => {
      const lowerK = k.toLowerCase();
      const lowerSlug = slug.toLowerCase();
      const lowerName = name.toLowerCase();
      return (
        lowerSlug.includes(lowerK) ||
        lowerK.includes(lowerSlug) ||
        lowerName.includes(lowerK)
      );
    }) as keyof typeof ProductImages | undefined);
  if (keyByMatch) {
    const imgSet = ProductImages[keyByMatch];
    if (imgSet?.length) return imgSet[0];
  }
  return "";
};

const isPlaceholderImage = (url: string | null | undefined) =>
  !!url && url.startsWith("https://TU_URL/");


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
      category?: string | null;
      images?: string[];
      slug?: string | null;
      overview?: string | null;
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
  const [editProduct, setEditProduct] = useState<EditProductInput | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [syncingPromo, setSyncingPromo] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const allProductsSectionRef = useRef<HTMLDivElement | null>(null);

  const promoCardItems = useMemo<
    {
      id: string;
      name: string;
      image: string | null;
      price: number | null;
      previousPrice: number | null;
      category?: string | null;
      images?: string[];
      slug?: string | null;
      overview?: string | null;
    }[]
  >(() => {
    const mapItem = (p: {
      id: string;
      name: string;
      image: string | null;
      price: number | null;
      previousPrice: number | null;
      category?: string | null;
      images?: string[];
      slug?: string | null;
      overview?: string | null;
    }) => {
      const slugValue = p.slug ?? slugify(p.name);
      const img =
        p.image && !isPlaceholderImage(p.image)
          ? p.image
          : getFallbackCover(slugValue, p.name);
      return {
        ...p,
        image: img,
        slug: slugValue,
      };
    };

    const fromIds = form.promo_product_ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) =>
        mapItem({
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          previousPrice: p.previousPrice,
          category: p.category,
          images: p.images,
          slug: p.slug,
          overview: p.overview,
        })
      );

    if (fromIds.length) return fromIds.slice(0, 10);

    const fromDbPromo = allProducts
      .filter((p) => typeof p.previousPrice === "number" && p.previousPrice > 0)
      .map((p) =>
        mapItem({
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          previousPrice: p.previousPrice,
          category: p.category,
          images: p.images,
          slug: p.slug,
          overview: p.overview,
        })
      );

    if (fromDbPromo.length) return fromDbPromo.slice(0, 10);

    return localProducts
      .filter((p) => p.previousPrice)
      .map((p) =>
        mapItem({
          id: p.slug,
          name: p.name,
          image: p.coverImage || p.shots?.[0] || null,
          price: p.price,
          previousPrice: p.previousPrice ?? null,
          category: p.category,
          images: p.shots ?? [],
          slug: p.slug,
          overview: p.overview,
        })
      )
      .slice(0, 10);
  }, [allProducts, form.promo_product_ids]);

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

        let promoIdsFromBridge: string[] = [];
        const { data: promoRows } = await supabase
          .from("promo_products")
          .select("product_id, sort_order")
          .eq("promo_key", PROMO_KEY)
          .order("sort_order", { ascending: true });
        if (promoRows && promoRows.length) {
          promoIdsFromBridge = promoRows
            .map((row) => String(row.product_id))
            .filter(Boolean);
        }

        if (data) {
          const row = data as MarketingContentRow;
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
            promo_product_ids: promoIdsFromBridge.length
              ? promoIdsFromBridge
              : Array.isArray(row.promo_product_ids)
                ? row.promo_product_ids
                : [],
          });
        }

        const { data: products } = await supabase
          .from("products")
          .select(
            "id, name, price, previous_price, cover_image, image_url, images"
          )
          .order("created_at", { ascending: false });
        const urls = new Set<string>();
        const all: {
          id: string;
          name: string;
          price: number | null;
          previousPrice: number | null;
          image: string | null;
          category?: string | null;
          images?: string[];
          slug?: string | null;
          overview?: string | null;
        }[] = [];
        (products || []).forEach((p: ProductRowLoose) => {
          if (p.cover_image) urls.add(p.cover_image);
          if (p.image_url) urls.add(p.image_url);
          if (Array.isArray(p.images)) {
            p.images.forEach((u: string) => u && urls.add(u));
          }
          const baseImage =
            p.cover_image ||
            p.image_url ||
            (Array.isArray(p.images) && p.images.length ? p.images[0] : null);
          const slugValue = p.slug || slugify(p.name || String(p.id));
          const img =
            baseImage && !isPlaceholderImage(baseImage)
              ? baseImage
              : getFallbackCover(slugValue, p.name || "");
          all.push({
            id: String(p.id || p.name || crypto.randomUUID()),
            name: p.name || "Producto",
            price: typeof p.price === "number" ? p.price : null,
            previousPrice:
              typeof p.previous_price === "number" ? p.previous_price : null,
            image: img,
            category: typeof p.category === "string" ? p.category : null,
            images: Array.isArray(p.images) ? p.images : [],
            slug: slugValue ?? null,
            overview: p.overview ?? null,
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

      await syncPromoProducts(form.promo_product_ids);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el contenido";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const syncPromoProducts = async (ids: string[]) => {
    setSyncingPromo(true);
    try {
      const { error: deletePromoError } = await supabase
        .from("promo_products")
        .delete()
        .eq("promo_key", PROMO_KEY);
      if (deletePromoError) throw deletePromoError;

      if (ids.length) {
        const inserts = ids.map((product_id, idx) => ({
          promo_key: PROMO_KEY,
          product_id: String(product_id),
          sort_order: idx + 1,
        }));
        const { error: insertPromoError } = await supabase
          .from("promo_products")
          .insert(inserts);
        if (insertPromoError) throw insertPromoError;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo sincronizar el carrusel";
      setError(message);
    } finally {
      setSyncingPromo(false);
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
    setForm((prev) => {
      const next = prev.promo_product_ids.includes(id)
        ? prev.promo_product_ids
        : [...prev.promo_product_ids, id];
      void syncPromoProducts(next);
      return {
        ...prev,
        promo_product_ids: next,
      };
    });
  };

  const removePromoProduct = (id: string) => {
    setForm((prev) => {
      const next = prev.promo_product_ids.filter((pid) => pid !== id);
      void syncPromoProducts(next);
      return {
        ...prev,
        promo_product_ids: next,
      };
    });
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

  const handleOpenEdit = async (id: string, name?: string) => {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      );
      const baseQuery = supabase.from("products").select("*").limit(1);
      let data: ProductRowLoose | null = null;
      let error: unknown = null;

      if (isUuid) {
        const res = await baseQuery.eq("id", id).maybeSingle();
        data = (res.data as ProductRowLoose | null) ?? null;
        error = res.error;
      } else {
        const resBySlug = await baseQuery.eq("slug", id).maybeSingle();
        data = (resBySlug.data as ProductRowLoose | null) ?? null;
        error = resBySlug.error;

        if (!data && name) {
          const resByName = await baseQuery.eq("name", name).maybeSingle();
          data = (resByName.data as ProductRowLoose | null) ?? null;
          error = resByName.error;
        }
      }

      if (error) return;
      if (!data) {
        setError("Este producto no existe en la base de datos.");
        return;
      }
      const row = data as ProductRowLoose;
      const normalized: EditProductInput = {
        id: row.id ? String(row.id) : undefined,
        slug: row.slug ?? undefined,
        name: row.name ?? null,
        category: row.category ?? null,
        price: typeof row.price === "number" ? row.price : null,
        previous_price:
          typeof row.previous_price === "number" ? row.previous_price : null,
        stock: typeof row.stock === "number" ? row.stock : null,
        cover_image: row.cover_image ?? null,
        images: Array.isArray(row.images) ? row.images : [],
        overview: row.overview ?? null,
        shipment_details: Array.isArray(row.shipment_details)
          ? (row.shipment_details as { title: string; description: string }[])
          : undefined,
      };
      setEditProduct(normalized);
      setShowEditModal(true);
    } catch {
      // ignore
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

              {/*  Productos Slider */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="text-2md font-semibold text-neutral-800">
                  Promo <span className="text-md uppercase text-red-400">(Slider)</span>
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Productos que se muestran en el carrusel de promociones.
                  <br />
                  Puedes agregar o quitar desde aquí.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {promoCardItems.map((p) => {
                    const isSelected = form.promo_product_ids.includes(String(p.id));
                    return (
                      <div
                        key={p.id}
                        className="relative"
                        onClick={() => handleOpenEdit(String(p.id), p.name)}
                      >
                        <ProductCard
                          showPrevPrice={Boolean(p.previousPrice)}
                          product={{
                            id: String(p.id),
                            slug: p.slug ?? String(p.id),
                            name: p.name,
                            category: p.category ?? "Otros",
                            price: p.price ?? 0,
                            previousPrice: p.previousPrice ?? undefined,
                            coverImage: p.image || "",
                            shots: p.images ?? [],
                            overview: p.overview ?? undefined,
                            justIn: false,
                          } as Product}
                          className="bg-white cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              removePromoProduct(String(p.id));
                            } else {
                              addPromoProduct(String(p.id));
                            }
                          }}
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs shadow ${isSelected
                              ? "bg-white text-red-500 border border-red-200"
                              : "bg-primary text-white"
                            }`}
                        >
                          {isSelected ? "Quitar" : "Agregar"}
                        </button>
                      </div>
                    );
                  })}
                  {promoCardItems.length === 0 && (
                    <p className="text-sm text-neutral-500">
                      No hay productos para mostrar.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Agregar productos al slider
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPromoModal(true)}
                        className="rounded-lg border border-neutral-200 px-3 py-1 text-xs hover:border-primary/50"
                      >
                        Agregar nuevo
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          allProductsSectionRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })
                        }
                        className="rounded-lg border border-neutral-200 px-3 py-1 text-xs hover:border-primary/50"
                      >
                        Seleccionar existente
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* TODOS LOS PRODUCTOS */}
              <div
                ref={allProductsSectionRef}
                className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2"
              >
                <h3 className="text-2md font-semibold text-neutral-800">
                  Todos los Productos <span className="text-md uppercase text-red-400">(Slider)</span>
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Prodcutos actuales del slider
                  </p>
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
                    Todos los productos
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {allProducts.map((p) => {
                      const isSelected = form.promo_product_ids.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className={`rounded-xl border p-3 ${isSelected ? "bg-primary/5 border-primary/40" : "bg-neutral-50"
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
                        className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-neutral-50 hover:border-primary/50 ${selected ? "border-red-500 ring-2 ring-red-300" : ""
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

      <EditProductModal
        open={showEditModal}
        product={editProduct ?? undefined}
        onClose={() => {
          setShowEditModal(false);
          setEditProduct(null);
        }}
        onSaved={(updated) => {
          setShowEditModal(false);
          setEditProduct(null);
          setAllProducts((prev) =>
            prev.map((p) =>
              String(p.id) === String(updated.id)
                ? {
                  ...p,
                  name: updated.name,
                  price: updated.price ?? null,
                  previousPrice: updated.previousPrice ?? null,
                  image: updated.coverImage || p.image,
                }
                : p
            )
          );
        }}
      />

      <AddProductModal
        open={showAddPromoModal}
        onClose={() => setShowAddPromoModal(false)}
        onCreated={(product) => {
          setShowAddPromoModal(false);
          const newId = String(product.id);
          setAllProducts((prev) => [
            {
              id: newId,
              name: product.name,
              price: product.price ?? null,
              previousPrice: product.previousPrice ?? null,
              image: product.coverImage || product.images?.[0] || null,
              category: product.category ?? null,
              images: product.images ?? product.shots ?? [],
              slug: product.slug ?? null,
              overview: product.overview ?? null,
            },
            ...prev,
          ]);
          setForm((prev) => {
            const next = prev.promo_product_ids.includes(newId)
              ? prev.promo_product_ids
              : [...prev.promo_product_ids, newId];
            void syncPromoProducts(next);
            return {
              ...prev,
              promo_product_ids: next,
            };
          });
        }}
      />
    </div>
  );
};

export default MarketingContentPage;
