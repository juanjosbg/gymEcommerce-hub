import React from "react";
import { CheckCircle, Smartphone, Mail, Shield, Lock, KeyRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  phone?: string;
  email?: string;
  providers?: string[];
}

const Security: React.FC<Props> = ({ phone, email, providers = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
        <CheckCircle className="h-5 w-5 mt-0.5" />
        <div>
          <p className="font-semibold">Tu cuenta está protegida</p>
          <p className="text-sm text-green-800/80">
            Mantén tus datos actualizados para reforzar la seguridad de tu cuenta.
          </p>
        </div>
      </div>

      <Card className="divide-y">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">Teléfono móvil</p>
            <p className="text-sm text-muted-foreground">{phone || "Sin número registrado"}</p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary rounded-full">
            Editar
          </Button>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">Correo electrónico</p>
            <p className="text-sm text-muted-foreground">{email || "Sin correo registrado"}</p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary rounded-full">
            Editar
          </Button>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">Contraseña</p>
            <p className="text-sm text-muted-foreground">Añade una contraseña segura.</p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary rounded-full">
            Cambiar
          </Button>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">Autenticación en dos pasos</p>
            <p className="text-sm text-muted-foreground">
              Protege tu cuenta con una capa extra de seguridad.
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary rounded-full">
            Activar
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm font-semibold">Cuentas de terceros</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground rounded-full">
            <Shield className="h-4 w-4" />
            <span>{providers.length ? providers.join(", ") : "Ninguna vinculada"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Security;
