import React, { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import items from "@/data/Profile/permisos";

import { Card } from "@/components/ui/card";

const PermisosCars = () => {
  const pageSize = 4;
  const totalPages = useMemo(() => Math.ceil(items.length / pageSize), []);
  const [page, setPage] = useState(0);

  const current = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [page]);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-700">
        <Lock className="h-5 w-5 mt-0.5" />
        <div>
          <p className="font-semibold">No accedemos a tus permisos en el navegador</p>
          <p className="text-sm text-green-800/80">
            Solo usaremos los permisos que autorices explícitamente en tu navegador.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {current.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full px-3 py-1 text-sm hover:shadow-lg ml-5 bg-primary/90 text-white hover:translate-y-1"
        >
          Anterior
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPage(idx)}
              className={`h-2 w-2 rounded-full ${
                idx === page ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Ir al grupo ${idx + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full px-3 py-1 text-sm hover:shadow-lg mr-5 bg-primary/90 text-white hover:translate-y-1"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PermisosCars;
