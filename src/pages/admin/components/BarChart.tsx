// BarChart.tsx
import { barData } from "../data/dashboard";

export function BarChart() {
  const max = Math.max(...barData.map((b) => Math.max(b.gross, b.revenue)));
  return (
    <div className="mt-4 grid grid-cols-12 gap-3">
      {barData.map((item) => (
        <div key={item.label} className="flex flex-col items-center justify-end gap-1">
          <div className="flex flex-col gap-1">
            <div className="w-8 rounded-md bg-sky-300" style={{ height: `${(item.gross / max) * 160}px` }} />
            <div className="w-8 rounded-md bg-amber-300" style={{ height: `${(item.revenue / max) * 160}px` }} />
          </div>
          <span className="text-xs text-neutral-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
