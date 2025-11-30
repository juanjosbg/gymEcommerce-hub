"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import FormItem from "@/shared/Input/FormItem";
import Input from "@/shared/Input/Input";
import HeroPort from "../../../public/Logo/apple-icon.png";
import { upsertUserProfile } from "@/lib/supabase/profile";

const registerSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Ingresa un teléfono válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = registerSchema.safeParse({
      fullName,
      email,
      phone,
      password,
    });

    if (!validation.success) {
      const message = validation.error.errors[0]?.message ?? "Revisa los datos ingresados.";
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await signUp(email, password, fullName);

      if (error) {
        const message = error.message.includes("already registered")
          ? "Este email ya está registrado"
          : error.message;
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Gracias por registrarte. Hemos enviado un correo de confirmación, por favor revísalo.",
      });

      const result = await Swal.fire({
        background: "#0f0f0f",
        color: "#ffffff",
        title: `HOLA ${fullName.trim() ? fullName.trim().toUpperCase() : "AMIGO"}!`,
        html: `
          Bienvenido a <span style="color:#ef4444;font-weight:800;">FITMEX STORE</span>.<br/>
          ¿Deseas recibir mensajes de productos en descuento y nuestras promociones?
        `,
        imageUrl: HeroPort,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "FITMEX",
        showCancelButton: true,
        confirmButtonText: "¡Acepto!",
        cancelButtonText: "No aceptar",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        padding: "1.5rem",
      });

      const consent = result.isConfirmed ? "accepted" : "declined";

      const userId = data?.user?.id;
      const session = data?.session;

      // Si no hay sesión (por ejemplo, registro con verificación de email), no podemos insertar por RLS.
      if (!userId || !session) {
        await Swal.fire({
          icon: "info",
          title: "Verifica tu correo",
          text: "Te enviamos un correo de confirmación. Después de confirmar, inicia sesión y completaremos tu perfil.",
        });
        navigate("/auth/login");
        return;
      }

      const { error: profileError } = await upsertUserProfile({
        id: userId,
        full_name: fullName,
        email,
        phone,
        marketing_consent: consent,
      });

      if (profileError) {
        throw profileError;
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message || "Error al crear la cuenta",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message || "Error al iniciar con Google");
    } else {
      toast.info("Redirigiendo a Google...");
    }
  };

  return (
    <div className="nc-PageSignUp" data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Registrarse
        </h2>
        <div className="mx-auto max-w-md ">
          <div className="space-y-6">
            <div>
              <ButtonSecondary
                className="flex w-full items-center gap-3 border-2 border-primary text-primary"
                onClick={handleGoogleSignUp}
                type="button"
              >
                <FaGoogle className="text-2xl" /> Continue with Google
              </ButtonSecondary>
            </div>
            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-gray px-4 text-sm font-medium bg-neutral-200">
                OR
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-200" />
            </div>
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 gap-6">
                <FormItem label="Nombre Completo">
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    placeholder="Tu Nombre Completo"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    required
                  />
                </FormItem>
                <FormItem label="Email address">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    placeholder="example@example.com"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    required
                  />
                </FormItem>
                <FormItem label="Número de teléfono">
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
              placeholder="+1 234 567 8901"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              required
            />
          </FormItem>
                <FormItem label="Password">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      rounded="rounded-full"
                      sizeClass="h-12 px-4 py-3"
                      placeholder="*********"
                      className="border-neutral-300 bg-transparent pr-10 placeholder:text-neutral-500 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </FormItem>
                <ButtonPrimary type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Registrar"}
                </ButtonPrimary>
              </div>
            </form>
            <span className="block text-center text-sm text-neutral-500">
              ¿Ya cuentas con cuenta?{" "}
              <Link to="/auth/login" className="text-primary">
                Inicia sesión
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
