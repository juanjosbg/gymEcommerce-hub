// DonutChart.tsx
import type { CategorySlice } from "../types/dashboard";

type Props = {
  categories: CategorySlice[];
};

// Mapea las clases Tailwind de fondo a valores hex para usarlos como fill en el SVG
const classToHex: Record<string, string> = {
  "bg-sky-400": "#38bdf8",
  "bg-indigo-400": "#818cf8",
  "bg-emerald-400": "#34d399",
  "bg-amber-400": "#fbbf24",
  "bg-fuchsia-400": "#e879f9",
  "bg-cyan-400": "#22d3ee",
  "bg-rose-400": "#fb7185",
  "bg-purple-400": "#c084fc",
  "bg-lime-400": "#a3e635",
  "bg-teal-400": "#2dd4bf",
};

export function DonutChart({ categories }: Props) {
  const total = categories.reduce((acc, c) => acc + c.value, 0);
  let cumulative = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-52 w-52">
      {categories.map((cat) => {
        const fill = classToHex[cat.color] || "#38bdf8";
        const startAngle = (cumulative / total) * Math.PI * 2;
        const slice = (cat.value / total) * Math.PI * 2;
        cumulative += cat.value;
        const endAngle = startAngle + slice;
        const largeArc = slice > Math.PI ? 1 : 0;
        const x1 = 60 + 50 * Math.cos(startAngle);
        const y1 = 60 + 50 * Math.sin(startAngle);
        const x2 = 60 + 50 * Math.cos(endAngle);
        const y2 = 60 + 50 * Math.sin(endAngle);
        return (
          <path
            key={cat.name}
            d={`M60,60 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={fill}
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="60" cy="60" r="25" className="fill-white" />
    </svg>
  );
}
