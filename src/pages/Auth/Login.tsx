"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

import { useAuth } from "@/contexts/AuthContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import FormItem from "@/shared/Auth/FormItem";
import Input from "@/shared/Input/Input";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || "Correo o contraseña incorrectos.");
      return;
    }
    toast.success("¡Bienvenido de vuelta!");
    navigate("/");
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message || "Error al iniciar con Google.");
    } else {
      toast.info("Redirigiendo a Google...");
    }
  };

  return (
    <div className="nc-PageLogin" data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Iniciar sesión
        </h2>
        <div className="mx-auto max-w-md">
          <div className="space-y-6">
            <div>
              <ButtonSecondary
                className="flex w-full items-center gap-3 border-2 border-primary text-primary"
                onClick={handleGoogleLogin}
                type="button"
              >
                <FaGoogle className="text-2xl" /> Continue with Google
              </ButtonSecondary>
            </div>
            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-neutral-300 px-4 text-sm font-medium ">
                OR
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-300" />
            </div>
            <form onSubmit={handleLogin}>
              <div className="grid gap-6">
                <FormItem label="Email address">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    placeholder="example@example.com"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
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
                  {loading ? "Iniciando..." : "Continue"}
                </ButtonPrimary>
              </div>
            </form>
            <div className="flex flex-col items-center justify-center gap-2">
              <Link to="/auth/forgot-password" className="text-sm text-neutral-500">
                ¿Olvidaste tu contraseña?
                <span className="text-primary"> No hay problema</span>
              </Link>
              <span className="block text-center text-sm text-neutral-500">
                ¿No posees cuenta?{" "}
                <Link to="/auth/register" className="text-primary">
                  Regístrate
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
