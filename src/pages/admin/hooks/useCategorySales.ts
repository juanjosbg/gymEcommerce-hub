import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CategorySlice } from "../types/dashboard";

const palette = [
  "bg-sky-400",
  "bg-indigo-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-fuchsia-400",
  "bg-cyan-400",
  "bg-rose-400",
  "bg-purple-400",
  "bg-lime-400",
  "bg-teal-400",
];

export function useCategorySales() {
  const [categories, setCategories] = useState<CategorySlice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("category");

      if (error || !data) {
        setCategories([]);
        setLoading(false);
        return;
      }

      const counts: Record<string, number> = {};
      data.forEach((row: any) => {
        const key = row.category || "Otros";
        counts[key] = (counts[key] || 0) + 1;
      });

      const total = Object.values(counts).reduce((acc, v) => acc + v, 0) || 1;
      const slices: CategorySlice[] = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count], idx) => ({
          name,
          value: Math.round((count / total) * 100),
          color: palette[idx % palette.length],
        }));

      setCategories(slices);
      setLoading(false);
    };

    load();
  }, []);

  const totalPercent = useMemo(
    () => categories.reduce((acc, c) => acc + c.value, 0),
    [categories]
  );

  return { categories, loading, totalPercent };
}
