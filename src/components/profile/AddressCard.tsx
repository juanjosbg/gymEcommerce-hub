import React from "react";
import { MapPin, Pencil, Calendar, UserRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressForm {
    country: string;
    fullName: string;
    birthday: string;
    phone: string;
    department: string;
    city: string;
    address: string;
    extra: string;
}

interface Props {
    form: AddressForm;
    dirty: boolean;
    saving: boolean;
    isEditing: boolean;
    isDirty: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onToggleEdit: () => void;
    onSave: () => void;
}

const AddressCard: React.FC<Props> = ({
    form,
    dirty,
    saving,
    isEditing,
    isDirty,
    onChange,
    onToggleEdit,
    onSave,
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
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-base font-semibold">Direcciones</p>
                        <p className="text-xs text-muted-foreground">Agrega o actualiza tu dirección de envío</p>
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
                        <Button className="bg-primary hover:bg-primary/90" disabled={!isDirty || saving} onClick={onSave}>
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    )}
                </div>
            </div>
            <CardContent className="space-y-4 p-0">
                <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold">
                        País / Región
                    </Label>
                    <Input
                        id="country"
                        name="country"
                        value={form.country}
                        onChange={onChange}
                        disabled={!isEditing}
                        className="rounded-full"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-semibold">
                            Departamento
                        </Label>
                        <Input
                            id="department"
                            name="department"
                            value={form.department}
                            onChange={onChange}
                            disabled={!isEditing}
                            className="rounded-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-semibold">
                            Ciudad / Municipio
                        </Label>
                        <Input
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={onChange}
                            disabled={!isEditing}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold">
                        Dirección
                    </Label>
                    <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        disabled={!isEditing}
                        className="rounded-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="extra" className="text-sm font-semibold">
                        Información adicional (opcional)
                    </Label>
                    <Input
                        id="extra"
                        name="extra"
                        value={form.extra}
                        onChange={onChange}
                        disabled={!isEditing}
                        className="rounded-full"
                    />
                </div>
                {/*  */}

                <div className="flex items-center gap-2 py-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserRound className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-md font-light text-muted-foreground">Información de contacto</p>
                        <p className="text-xs text-muted-foreground">Actualiza tus datos personales</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-muted-foreground">
                        Nombre completo
                    </Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={onChange}
                        disabled
                        className="rounded-full"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="birthday" className="text-sm font-semibold text-muted-foreground">
                            Fecha de nacimiento
                        </Label>
                        <div className="relative">
                            <Input
                                id="birthday"
                                name="birthday"
                                value={formattedBirthday}
                                readOnly
                                placeholder="mm/dd/yyyy"
                                disabled
                                className="rounded-full pl-9"
                            />
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneAddress" className="text-sm font-semibold text-muted-foreground">
                            Número telefónico
                        </Label>
                        <Input
                            id="phoneAddress"
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            disabled
                            className="rounded-full"
                        />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default AddressCard;
