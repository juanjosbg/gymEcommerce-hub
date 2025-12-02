// StatChip.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatChip({ trend, delta }: { trend: "up" | "down"; delta: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
      trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {delta}
    </span>
  );
}
