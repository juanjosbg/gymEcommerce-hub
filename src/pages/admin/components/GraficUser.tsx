"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Series = { label: string; color: string; points: number[] };
type Bucket = {
  hour: string;
  nuevos: number;
  viejos: number;
  recurrentes: number;
};
type ProfileRow = { id: string; created_at: string };

const GraficUser: React.FC = () => {
  const [data, setData] = useState<Bucket[]>([]);

  // Agrupa por hora (ejemplo). Ajusta para tu caso real.
  const buildBuckets = (rows: ProfileRow[]): Bucket[] => {
    const buckets: Record<string, Bucket> = {};
    rows.forEach((r) => {
      const d = new Date(r.created_at);
      const hourLabel = d.toLocaleTimeString("es-ES", {
        hour: "numeric",
        hour12: true,
      });

      if (!buckets[hourLabel]) {
        buckets[hourLabel] = {
          hour: hourLabel,
          nuevos: 0,
          viejos: 0,
          recurrentes: 0,
        };
      }

      // Ejemplo: todo se considera “nuevo”
      buckets[hourLabel].nuevos += 1;
    });

    return Object.values(buckets).sort((a, b) => {
      const toNum = (h: string) => {
        const [num, ap] = h.split(" ");
        const n = Number(num);
        return ap?.toLowerCase().startsWith("p") ? n + 12 : n;
      };
      return toNum(a.hour) - toNum(b.hour);
    });
  };

  useEffect(() => {
    const load = async () => {
      const { data: rows, error } = await supabase
        .from("user_profiles")
        .select("id, created_at")
        .order("created_at", { ascending: true });

      if (error || !rows) return;
      setData(buildBuckets(rows as ProfileRow[]));
    };

    load();
  }, []);

  // Fallback ilustrativo si aún no hay datos
  const fallback: Bucket[] = [
    { hour: "7 am", nuevos: 8, viejos: 5, recurrentes: 3 },
    { hour: "9 am", nuevos: 10, viejos: 7, recurrentes: 4 },
    { hour: "11 am", nuevos: 12, viejos: 6, recurrentes: 6 },
    { hour: "1 pm", nuevos: 6, viejos: 5, recurrentes: 5 },
    { hour: "3 pm", nuevos: 15, viejos: 9, recurrentes: 7 },
    { hour: "5 pm", nuevos: 9, viejos: 7, recurrentes: 6 },
    { hour: "7 pm", nuevos: 11, viejos: 8, recurrentes: 7 },
    { hour: "9 pm", nuevos: 7, viejos: 6, recurrentes: 5 },
  ];

  const buckets = data.length ? data : fallback;

  const chartWidth = 480;
  const chartHeight = 180;

  const { series, maxVal, labels } = useMemo(() => {
    const labels = buckets.map((d) => d.hour);
    const series: Series[] = [
      {
        label: "Nuevos",
        color: "#38bdf8",
        points: buckets.map((d) => d.nuevos),
      },
      {
        label: "Viejos",
        color: "#fbbf24",
        points: buckets.map((d) => d.viejos),
      },
      {
        label: "Recurrentes",
        color: "#34d399",
        points: buckets.map((d) => d.recurrentes),
      },
    ];
    const maxVal = Math.max(...series.flatMap((s) => s.points), 1);
    return { series, maxVal, labels };
  }, [buckets]);

  const buildPath = (values: number[]) => {
    if (!values.length) return "";
    const stepX = chartWidth / Math.max(values.length - 1, 1);
    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = chartHeight - (v / maxVal) * chartHeight;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="p-4 text-neutral-900">
      <div>
        <svg
          width="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          {series.map((s, idx) => (
            <path
              key={s.label}
              d={buildPath(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={idx === 0 ? 0.9 : 0.8}
            />
          ))}
        </svg>

        <div className="mt-3 grid grid-cols-8 text-xs">
          {labels.map((label) => (
            <span key={label} className="text-center text-neutral-600">
              {label}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Ajusta el agrupado en <code>buildBuckets</code> y las reglas de
        “nuevos/viejos/recurrentes” usando <code>user_profiles.created_at</code>{" "}
        (por hora/día/mes, según necesites).
      </p>
    </div>
  );
};

export default GraficUser;
