// DonutLegend.tsx
import { Fragment } from "react";
import type { CategorySlice } from "../types/dashboard";

type Props = {
  categories: CategorySlice[];
};

export function DonutLegend({ categories }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
      {categories.map((cat) => (
        <div key={cat.name} className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${cat.color}`} />
          <span className="text-neutral-700">
            {cat.name} - {cat.value}%
          </span>
        </div>
      ))}
    </div>
  );
}
