// DonutLegend.tsx
import { Fragment } from "react";
import type { DonutLegendProps } from "@/pages/admin/types/donutLegend";

export function DonutLegend({ categories }: DonutLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
      {categories.map((cat) => (
        <div key={cat.name} className="flex flex-row sm:flex-col flex-wrap items-center gap-2">
          <span className={`h-3 w-3 rounded-full md:flex sm:flex-row ${cat.color}`} />
          <span className="text-neutral-700">
            {cat.name} - {cat.value}%
          </span>
        </div>
      ))}
    </div>
  );
}



