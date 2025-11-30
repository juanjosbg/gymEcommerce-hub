"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import FormItem from "@/shared/Input/FormItem";
import Input from "@/shared/Input/Input";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      emailSchema.parse({ email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    const { error } = await resetPassword(email);
    if (error) {
      setShowVerification(false);
      setMessage(error.message || "No se pudo enviar el correo. Verifica el email.");
      toast.error(error.message || "No se pudo enviar el correo.");
      return;
    }

    setShowVerification(true);
    setMessage("¡Se envió un enlace de recuperación! Verifica tu correo electrónico.");
    setTimer(20);
    toast.success("Email enviado, revisa tu bandeja.");
  };

  const handleVerified = () => {
    setEmail("");
    setShowVerification(false);
    setMessage(null);
    setTimer(0);
  };

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          ¿Olvidaste tu contraseña?
        </h2>
      </header>

      <div className="mx-auto max-w-md space-y-6">
        <form onSubmit={handleSubmit}>
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
              disabled={showVerification && timer > 0}
            />
          </FormItem>

          {timer === 0 && (
            <div className="flex justify-center">
              <ButtonPrimary className="-mb-3 mt-4" type="submit">
                {showVerification ? "Volver a reenviar verificación" : "Recuperar contraseña"}
              </ButtonPrimary>
            </div>
          )}
        </form>

        {showVerification && timer > 0 && (
          <div className="text-center text-sm text-primary">
            {message}
            <div className="mt-2 text-neutral-700">
              Tienes {timer} segundos para revisar tu correo.
            </div>
            <div className="mt-4">
              <ButtonPrimary type="button" onClick={handleVerified} disabled={timer > 0}>
                Ya verifiqué mi correo
              </ButtonPrimary>
            </div>
          </div>
        )}

        <span className="block text-center text-neutral-500">
          Regresar a{" "}
          <Link to="/auth/login" className="text-primary">
            Iniciar sesión
          </Link>
          {" / "}
          <Link to="/auth/register" className="text-primary">
            Registrarse
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;
