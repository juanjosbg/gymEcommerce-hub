"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { TbTruckDelivery } from "react-icons/tb";
import { MdContactMail } from "react-icons/md";
import { db } from "@/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const AccountPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [isEditing, setIsEditing] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.shippingAddress) setShippingAddress(data.shippingAddress);
      }
    };
    fetchUserData();
  }, [user]);

  const isContactValid =
    contactInfo.fullName &&
    contactInfo.phone &&
    contactInfo.email &&
    contactInfo.birthDate;

  const isShippingValid =
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.country &&
    shippingAddress.postalCode;

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setStep(1);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContactValid || !isShippingValid) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    if (!user) {
      alert("Debes iniciar sesión para guardar tus datos.");
      return;
    }
    await setDoc(doc(db, "users", user.uid), {
      contactInfo,
      shippingAddress,
    });
    alert("Datos guardados correctamente");
    setIsEditing(false);
    setStep(1);
  };

  const inputClass = (editing: boolean) =>
    `bg-white ${editing ? "text-neutral-900" : "text-neutral-400"} placeholder:text-neutral-400`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <main className="container lg:pb-28 lg:pt-12">
        <div className="mb-14">
          <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Mi Cuenta
          </h2>
        </div>

        <hr className="my-10 border-neutral-300 xl:my-12" />

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <form
            className="flex-1 w-full max-w-xl space-y-10 mt-6"
            onSubmit={
              step === 1
                ? handleNext
                : handleSave
            }
          >
            <div className="bg-white rounded-2xl shadow p-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                {step === 1 && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:block">
                      <MdContactMail className="text-3xl text-primary" />
                    </span>
                    <h3 className="text-lg font-semibold">Información de contacto</h3>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:block">
                      <TbTruckDelivery className="text-3xl text-primary" />
                    </span>
                    <h3 className="text-lg font-semibold">Dirección de envío</h3>
                  </div>
                )}
                {isEditing && (
                  <ButtonSecondary
                    sizeClass="py-2 px-4"
                    className="border-2 border-neutral-400 text-neutral-400"
                    onClick={handleCancelEdit}
                    type="button"
                  >
                    Cancelar
                  </ButtonSecondary>
                )}
                {!isEditing && step === 1 && (
                  <ButtonSecondary
                    sizeClass="py-2 px-4"
                    className="border-2 border-primary text-primary"
                    onClick={handleEdit}
                    type="button"
                  >
                    Editar
                  </ButtonSecondary>
                )}
              </div>
              {step === 1 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Nombre completo</label>
                    <Input
                      name="fullName"
                      value={contactInfo.fullName}
                      onChange={handleContactChange}
                      required
                      placeholder="Ej: Juan Pérez"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Número telefónico</label>
                    <Input
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      required
                      placeholder="Ej: +52 123 456 7890"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Correo electrónico</label>
                    <Input
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      type="email"
                      required
                      placeholder="Ej: correo@ejemplo.com"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Fecha de nacimiento</label>
                    <Input
                      name="birthDate"
                      value={contactInfo.birthDate}
                      onChange={handleContactChange}
                      type="date"
                      required
                      placeholder="mm / dd / yyyy"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Calle y número</label>
                    <Input
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleShippingChange}
                      required
                      placeholder="Ej: Calle 123 #45-67"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Departamento, casa, etc.</label>
                    <Input
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleShippingChange}
                      placeholder="Ej: Apto 202, Casa 5"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Ciudad</label>
                    <Input
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      required
                      placeholder="Ej: Ciudad de México"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Estado o provincia</label>
                    <Input
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      required
                      placeholder="Ej: CDMX, Jalisco"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">País</label>
                    <Input
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      required
                      placeholder="Ej: México"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Código postal</label>
                    <Input
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleShippingChange}
                      required
                      placeholder="Ej: 12345"
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </div>
                </>
              )}
              {isEditing && (
                <div className="flex gap-3 mt-6">
                  {step === 2 && (
                    <ButtonSecondary
                      type="button"
                      onClick={handleBack}
                      sizeClass="py-2 px-4"
                      className="border-2 border-primary text-primary"
                    >
                      Retroceder
                    </ButtonSecondary>
                  )}
                  {step === 1 && (
                    <ButtonPrimary className="w-full" type="submit">
                      Siguiente
                    </ButtonPrimary>
                  )}
                  {step === 2 && (
                    <ButtonPrimary className="w-full" type="submit">
                      Guardar
                    </ButtonPrimary>
                  )}
                </div>
              )}
            </div>
          </form>
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <Image
              src="/OFF.webp"
              alt="Imagen de perfil"
              width={400}
              height={400}
              className="rounded-2xl object-cover shadow"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;