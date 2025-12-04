"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Series = { label: string; color: string; points: number[] };
type Bucket = {
  label: string; // ej: 12 Ene
  nuevos: number;
  viejos: number;
  recurrentes: number;
};
type ProfileRow = { id: string; created_at: string };

const GraficUser: React.FC = () => {
  const [data, setData] = useState<Bucket[]>([]);

  const formatDay = (date: Date) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
    }).format(date);

  // Construye los buckets de los últimos 30 días:
  // - nuevos: registros en el día
  // - viejos: usuarios existentes antes de ese día
  // - recurrentes: usuarios con más de 14 días de antigüedad (proxy de cuentas “frecuentes”)
  const buildBuckets = (rows: ProfileRow[]): Bucket[] => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 29); // 30 días atrás

    const all = rows
      .map((r) => ({ ...r, createdAt: new Date(r.created_at) }))
      .filter((r) => r.createdAt <= today)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const buckets: Bucket[] = [];
    let cumulative = 0;

    for (
      let cursor = new Date(start);
      cursor <= today;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const dayStart = new Date(cursor);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(cursor);
      dayEnd.setHours(23, 59, 59, 999);

      const nuevos = all.filter(
        (u) => u.createdAt >= dayStart && u.createdAt <= dayEnd
      ).length;

      const before = all.filter((u) => u.createdAt < dayStart).length;
      const cutoff14 = new Date(dayStart);
      cutoff14.setDate(cutoff14.getDate() - 14);
      const recurrentes = all.filter((u) => u.createdAt < cutoff14).length;

      cumulative += nuevos;
      buckets.push({
        label: formatDay(dayStart),
        nuevos,
        viejos: before,
        recurrentes,
      });
    }

    // Si no hay datos, devolvemos arreglo vacío y el fallback tomará el control
    return buckets.filter((b) => b.nuevos || b.viejos || b.recurrentes);
  };

  useEffect(() => {
    const load = async () => {
      const { data: rows, error } = await supabase
        .from("user_profiles")
        .select("id, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error cargando usuarios:", error);
        return;
      }
      if (!rows) return;
      const buckets = buildBuckets(rows as ProfileRow[]);
      setData(buckets);
    };

    load();
  }, []);

  // Fallback ilustrativo si no hay datos
  const fallback: Bucket[] = [
    { label: "01 Ene", nuevos: 8, viejos: 5, recurrentes: 2 },
    { label: "05 Ene", nuevos: 10, viejos: 7, recurrentes: 3 },
    { label: "10 Ene", nuevos: 12, viejos: 9, recurrentes: 5 },
    { label: "15 Ene", nuevos: 6, viejos: 10, recurrentes: 8 },
    { label: "20 Ene", nuevos: 15, viejos: 11, recurrentes: 9 },
    { label: "25 Ene", nuevos: 9, viejos: 13, recurrentes: 10 },
    { label: "30 Ene", nuevos: 11, viejos: 14, recurrentes: 12 },
  ];

  const buckets = data.length ? data : fallback;

  const chartWidth = 480;
  const chartHeight = 200;

  const { series, maxVal, labels } = useMemo(() => {
    const labels = buckets.map((d) => d.label);
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

  // Curva suavizada (linea estilo "onda")
  const buildSmoothPath = (values: number[]) => {
    if (!values.length) return "";
    const stepX = chartWidth / Math.max(values.length - 1, 1);
    const points = values.map((v, i) => {
      const x = i * stepX;
      const y = chartHeight - (v / maxVal) * chartHeight;
      return { x, y };
    });

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` Q ${cx},${p0.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  return (
    <div className="p-4 text-neutral-900">
      <div className="relative rounded-2xl bg-gradient-to-br from-white via-white to-slate-50 shadow-inner ring-1 ring-neutral-100/70">
        <svg
          className="block w-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
            </linearGradient>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#e5e7eb" opacity="0.35" />
            </pattern>
          </defs>

          <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="url(#dots)"
          />

          {series
            .filter((s) => s.points.some((p) => p > 0))
            .map((s, idx) => (
              <path
                key={s.label}
                d={buildSmoothPath(s.points)}
                fill="none"
                stroke={s.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={idx === 0 ? 0.95 : 0.8}
              />
            ))}
        </svg>

        <div className="mt-3 grid grid-cols-6 gap-2 text-xs font-medium text-neutral-600">
          {labels.map((label, idx) => (
            <span key={label + idx} className="text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Datos agrupados por día (últimos 30). <br />
        Nuevos = registros del día. <br />
        Viejos = usuarios existentes antes del día. <br />
        Recurrentes = cuentas con más de 14 días de antigüedad (se muestra solo si hay datos).
      </p>
    </div>
  );
};

export default GraficUser;
