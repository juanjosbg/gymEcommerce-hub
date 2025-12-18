import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type Props = {
  orderId: string;
  status?: string | null;
  onUpdated?: (newStatus: string) => void;
  disabled?: boolean;
};

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", badge: "bg-neutral-200 text-neutral-800" },
  { value: "processing", label: "En proceso", badge: "bg-orange-100 text-orange-700" },
  { value: "shipped", label: "Enviado", badge: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelado", badge: "bg-red-100 text-red-700" },
];

const StateUserproduct: React.FC<Props> = ({
  orderId,
  status,
  onUpdated,
  disabled = false,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState(status || "pending");

  useEffect(() => {
    if (status) setLocalStatus(status);
  }, [status]);

  const selectedOption = useMemo(
    () => STATUS_OPTIONS.find((opt) => opt.value === localStatus) || STATUS_OPTIONS[0],
    [localStatus]
  );

  const handleChange = async (newStatus: string) => {
    if (!orderId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    setLocalStatus(newStatus);
    onUpdated?.(newStatus);
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedOption.badge}`}
        >
          {selectedOption.label}
        </span>
        <div className="relative">
          <select
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm shadow-sm hover:border-primary/60 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100"
            value={localStatus}
            onChange={(e) => handleChange(e.target.value)}
            disabled={saving || disabled}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {saving && (
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-600">No se pudo actualizar: {error}</p>
      ) : null}
    </div>
  );
};

export default StateUserproduct;
