// DonutChart.tsx
import { categories } from "../data/dashboard";

export function DonutChart() {
  const total = categories.reduce((acc, c) => acc + c.value, 0);
  let cumulative = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-52 w-52">
      {categories.map((cat) => {
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
          <path key={cat.name} d={`M60,60 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z`} className={cat.color} stroke="white" strokeWidth="1" />
        );
      })}
      <circle cx="60" cy="60" r="25" className="fill-white" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold fill-neutral-700">Sales</text>
    </svg>
  );
}
