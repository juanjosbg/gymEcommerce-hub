"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import FormItem from "@/shared/Auth/FormItem";
import Input from "@/shared/Input/Input";

const schema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "No se pudo actualizar la contraseña");
      return;
    }

    toast.success("Contraseña actualizada. Inicia sesión nuevamente.");
    navigate("/auth/login");
  };

  if (!hasSession) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
          <p className="text-sm text-neutral-600">
            Abre el enlace que enviamos a tu correo para continuar con el cambio de contraseña.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Nueva contraseña</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <FormItem label="Contraseña nueva">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rounded="rounded-full"
              sizeClass="h-12 px-4 py-3"
              placeholder="********"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              required
            />
          </FormItem>
          <FormItem label="Confirmar contraseña">
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              rounded="rounded-full"
              sizeClass="h-12 px-4 py-3"
              placeholder="********"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              required
            />
          </FormItem>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
