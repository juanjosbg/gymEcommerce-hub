import React from "react";
import { Mail, Phone, UserRound, Pencil, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  form: {
    fullName: string;
    email: string;
    phone: string;
    birthday: string;
  };
  isEditing: boolean;
  isDirty: boolean;
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onToggleEdit: () => void;
}

const ProfileContactCard: React.FC<Props> = ({
  form,
  isEditing,
  isDirty,
  saving,
  onChange,
  onSave,
  onToggleEdit,
}) => {
  const formattedBirthday = React.useMemo(() => {
    if (!form.birthday) return "";
    const parsed = new Date(form.birthday);
    if (!Number.isNaN(parsed.getTime())) {
      const d = parsed.getDate().toString().padStart(2, "0");
      const m = (parsed.getMonth() + 1).toString().padStart(2, "0");
      const y = parsed.getFullYear();
      return `${d}/${m}/${y}`;
    }
    const digits = form.birthday.replace(/\D/g, "");
    if (digits.length === 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    return form.birthday;
  }, [form.birthday]);

  return (
    <Card className="p-8 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-base font-semibold">Información de contacto</p>
            <p className="text-xs text-muted-foreground">Actualiza tus datos personales</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? "secondary" : "outline"}
            className="border-primary text-primary hover:bg-primary/5"
            onClick={onToggleEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={!isDirty || saving}
              onClick={onSave}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </div>
      </div>
      <CardContent className="space-y-6 p-0">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-semibold">
            Nombre completo
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Tu nombre"
              disabled={!isEditing}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">
            Número telefónico
          </Label>
          <div className="relative">
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Tu número"
              disabled={!isEditing}
              className="rounded-full pl-9"
            />
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            Correo electrónico
          </Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="correo@ejemplo.com"
              disabled
              className="rounded-full pl-9 bg-muted text-muted-foreground"
            />
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthday" className="text-sm font-semibold">
            Fecha de nacimiento
          </Label>
          <div className="relative">
            <Input
              id="birthday"
              name="birthday"
              value={formattedBirthday}
              onChange={onChange}
              placeholder="mm/dd/yyyy"
              disabled={!isEditing}
              className="rounded-full pl-9"
            />
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileContactCard;
