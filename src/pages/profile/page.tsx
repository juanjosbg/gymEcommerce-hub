import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  UserRound,
  Pencil,
  Calendar,
  Star,
  Heart,
  Lock,
  Package,
  CreditCard,
  Store,
  Clock,
  MapPin,
  Globe,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { useWishlist } from "@/hooks/useWishlist";
import ProfileHero from "@/components/Hero/profileHero";
import { supabase } from "@/integrations/supabase/client";
import { upsertUserProfile } from "@/lib/supabase/profile";
import { toast } from "sonner";
import ProfileContactCard from "@/components/profile/ProfileContactCard";
import AddressCard from "@/components/profile/AddressCard";
import PermisosCars from "@/components/profile/PermisosCars";
import Security from "@/components/profile/Security";

type Section =
  | "info"
  | "orders"
  | "reviews"
  | "stores"
  | "history"
  | "address"
  | "region"
  | "payment"
  | "security"
  | "permissions";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const sliderImages = ["/PreEntreno.webp", "/OFF2.webp", "/OFF.webp"];
  const [activeSlide, setActiveSlide] = useState(0);
  const { wishlist } = useWishlist();
  const [activeSection, setActiveSection] = useState<Section>("info");

  const initialData = useMemo(
    () => ({
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      birthday: user?.user_metadata?.birthday || "",
    }),
    [user],
  );

  const [form, setForm] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [addressForm, setAddressForm] = useState({
    country: "Colombia",
    fullName: "",
    birthday: "",
    phone: "",
    department: "",
    city: "",
    address: "",
    extra: "",
  });
  const [addressDirty, setAddressDirty] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth/login");
  }, [user, navigate]);

  useEffect(() => {
    setForm(initialData);
    setIsDirty(false);
    // precarga el nombre completo en el formulario de dirección
    setAddressForm((prev) => ({
      ...prev,
      fullName: initialData.fullName,
      birthday: initialData.birthday || "",
      phone: initialData.phone || "",
    }));
  }, [initialData]);

  useEffect(() => {
    if (!sliderImages.length) return;
    const id = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [sliderImages.length]);

  if (!user) return null;

  const totalLiked = wishlist.length;
  const totalReviews = 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      setIsDirty(
        next.fullName !== initialData.fullName ||
          next.phone !== initialData.phone ||
          next.birthday !== initialData.birthday,
      );
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: form.fullName,
          phone: form.phone,
          birthday: form.birthday,
        },
      });
      if (authError) throw authError;

      const { error: profileError } = await upsertUserProfile({
        id: user.id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        marketing_consent: null,
      });
      if (profileError) throw profileError;

      toast.success("Perfil actualizado correctamente.");
      setIsDirty(false);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.message || "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
    setAddressDirty(true);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    setAddressSaving(true);
    try {
      toast.success("Dirección guardada (integra Supabase cuando tengas la tabla de direcciones).");
      setAddressDirty(false);
      setAddressEditing(false);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo guardar la dirección.");
    } finally {
      setAddressSaving(false);
    }
  };

  const rightPromo = (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-gray-50 shadow-sm">
        <div className="relative h-full min-h-[520px] w-full">
          {sliderImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Promo ${idx + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                idx === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                idx === activeSlide ? "bg-primary w-4" : "bg-white/70"
              }`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <ProfileHero />
      <div className="container mb-12">
        <div className="mb-12 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
              <img src="/avatar.png" alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {form.fullName || "Usuario"}
                <span className="ml-1 align-middle text-sm text-muted-foreground">✎</span>
              </h2>
              <div className="mt-1 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-semibold">{totalReviews}</p>
                  <p className="text-xs text-muted-foreground">Total reviews</p>
                </div>
                <span className="h-6 w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-semibold">{totalLiked}</p>
                  <p className="text-xs text-muted-foreground">Productos gustados</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Lock className="h-4 w-4" />
            <span>Tu información y privacidad se mantendrá segura y protegida.</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <Card className="p-4 shadow-sm border border-gray-200">
            <nav className="space-y-1 text-sm">
              {[
                { label: "Información de contacto", icon: User, section: "info" as Section },
                { label: "Direcciones", icon: MapPin, section: "address" as Section },
                { label: "Tus pedidos", icon: Package, section: "orders" as Section },
                { label: "Tus reseñas", icon: Star, section: "reviews" as Section },
                { label: "Tiendas seguidas", icon: Store, section: "stores" as Section },
                { label: "Historial de navegación", icon: Clock, section: "history" as Section },
                { label: "Región & Idioma", icon: Globe, section: "region" as Section },
                { label: "Métodos de pago", icon: CreditCard, section: "payment" as Section },
                { label: "Seguridad de cuenta", icon: Shield, section: "security" as Section },
                { label: "Permisos", icon: Lock, section: "permissions" as Section },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveSection(item.section)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted ${
                    activeSection === item.section ? "bg-muted" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] items-start">
            {activeSection === "address" ? (
              <>
                <AddressCard
                  form={addressForm}
                  dirty={addressDirty}
                  saving={addressSaving}
                  isEditing={addressEditing}
                  isDirty={addressDirty}
                  onToggleEdit={() => {
                    setAddressEditing((v) => !v);
                    if (addressEditing) {
                      setAddressForm((prev) => ({
                        ...prev,
                        fullName: initialData.fullName,
                        birthday: initialData.birthday || "",
                        phone: initialData.phone || "",
                      }));
                      setAddressDirty(false);
                    }
                  }}
                  onChange={handleAddressChange}
                  onSave={handleSaveAddress}
                />
                {rightPromo}
              </>
            ) : activeSection === "permissions" ? (
              <>
                <PermisosCars />
                {rightPromo}
              </>
            ) : activeSection === "security" ? (
              <>
                <Security
                  phone={form.phone}
                  email={form.email}
                  providers={[user?.app_metadata?.provider || ""]}
                />
                {rightPromo}
              </>
            ) : (
              <>
                <ProfileContactCard
                  form={form}
                  isEditing={isEditing}
                  isDirty={isDirty}
                  saving={saving}
                  onChange={handleChange}
                  onSave={handleSave}
                  onToggleEdit={() => {
                    setIsEditing((v) => !v);
                    if (isEditing) {
                      setForm(initialData);
                      setIsDirty(false);
                    }
                  }}
                />
                {rightPromo}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
