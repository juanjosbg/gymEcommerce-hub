import React from "react";
import { BarChart3, Users, ShoppingBag, RotateCcw, ArrowUpRight, ArrowDownRight, PieChart, Globe2, Plus } from "lucide-react";

type StatCard = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: React.ReactNode;
};

const statCards: StatCard[] = [
  {
    title: "Total customers",
    value: "567,899",
    delta: "+2.5%",
    trend: "up",
    icon: <Users className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: "Total revenue",
    value: "$3,456 M",
    delta: "+0.5%",
    trend: "up",
    icon: <BarChart3 className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: "Total orders",
    value: "1,136 M",
    delta: "-0.2%",
    trend: "down",
    icon: <ShoppingBag className="h-5 w-5 text-rose-500" />,
  },
  {
    title: "Total returns",
    value: "1,789",
    delta: "+0.12%",
    trend: "up",
    icon: <RotateCcw className="h-5 w-5 text-emerald-500" />,
  },
];

const barData = [
  { label: "1 Jul", gross: 20, revenue: 15 },
  { label: "2 Jul", gross: 28, revenue: 22 },
  { label: "3 Jul", gross: 35, revenue: 30 },
  { label: "4 Jul", gross: 32, revenue: 28 },
  { label: "5 Jul", gross: 40, revenue: 38 },
  { label: "6 Jul", gross: 45, revenue: 43 },
  { label: "7 Jul", gross: 30, revenue: 26 },
  { label: "8 Jul", gross: 25, revenue: 23 },
  { label: "9 Jul", gross: 27, revenue: 25 },
  { label: "10 Jul", gross: 33, revenue: 29 },
  { label: "11 Jul", gross: 29, revenue: 24 },
  { label: "12 Jul", gross: 31, revenue: 27 },
];

const categories = [
  { name: "Living room", value: 25, color: "bg-sky-400" },
  { name: "Kids", value: 17, color: "bg-indigo-400" },
  { name: "Office", value: 13, color: "bg-emerald-400" },
  { name: "Bedroom", value: 12, color: "bg-amber-400" },
  { name: "Kitchen", value: 9, color: "bg-fuchsia-400" },
  { name: "Bathroom", value: 8, color: "bg-cyan-400" },
  { name: "Dining room", value: 6, color: "bg-rose-400" },
  { name: "Decor", value: 5, color: "bg-purple-400" },
  { name: "Lighting", value: 3, color: "bg-lime-400" },
  { name: "Outdoor", value: 2, color: "bg-teal-400" },
];

const countries = [
  { name: "Poland", value: 19 },
  { name: "Austria", value: 15 },
  { name: "Spain", value: 13 },
  { name: "Romania", value: 12 },
  { name: "France", value: 11 },
  { name: "Italy", value: 11 },
  { name: "Germany", value: 10 },
  { name: "Ukraine", value: 9 },
];

const StatChip = ({ trend, delta }: { trend: "up" | "down"; delta: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
      trend === "up"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-rose-50 text-rose-700"
    }`}
  >
    {trend === "up" ? (
      <ArrowUpRight className="h-3.5 w-3.5" />
    ) : (
      <ArrowDownRight className="h-3.5 w-3.5" />
    )}
    {delta}
  </span>
);

const BarChart = () => {
  const max = Math.max(...barData.map((b) => Math.max(b.gross, b.revenue)));
  return (
    <div className="mt-4 grid grid-cols-12 gap-3">
      {barData.map((item) => (
        <div key={item.label} className="flex flex-col items-center justify-end gap-1">
          <div className="flex flex-col gap-1">
            <div
              className="w-8 rounded-md bg-sky-300"
              style={{ height: `${(item.gross / max) * 160}px` }}
            />
            <div
              className="w-8 rounded-md bg-amber-300"
              style={{ height: `${(item.revenue / max) * 160}px` }}
            />
          </div>
          <span className="text-xs text-neutral-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutLegend = () => (
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

const DonutChart = () => {
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
          <path
            key={cat.name}
            d={`M60,60 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z`}
            className={cat.color}
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="60" cy="60" r="25" className="fill-white" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold fill-neutral-700">
        Sales
      </text>
    </svg>
  );
};

const Sidebar = () => (
  <aside className="hidden min-h-screen w-60 flex-col border-r bg-white/80 p-6 lg:flex">
    <div className="mb-10 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
        FIT
      </div>
      <div className="text-lg font-semibold text-neutral-900">Admin</div>
    </div>
    <nav className="flex flex-1 flex-col gap-3 text-sm font-medium text-neutral-600">
      <div className="text-xs uppercase tracking-wide text-neutral-400">Marketing</div>
      <a className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-primary" href="#">
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </a>
      <a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100" href="#">
        <ShoppingBag className="h-4 w-4" />
        Orders
      </a>
      <a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100" href="#">
        <Users className="h-4 w-4" />
        Customers
      </a>
      <div className="mt-6 text-xs uppercase tracking-wide text-neutral-400">System</div>
      <a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100" href="#">
        <PieChart className="h-4 w-4" />
        Reports
      </a>
      <a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100" href="#">
        <Globe2 className="h-4 w-4" />
        Regions
      </a>
    </nav>
    <div className="mt-auto flex items-center gap-3 rounded-xl border p-3">
      <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200" />
      <div>
        <p className="text-sm font-semibold">Admin</p>
        <p className="text-xs text-neutral-500">admin@fitmex.com</p>
      </div>
    </div>
  </aside>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 text-neutral-900">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Overview</p>
              <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">Dashboard</h1>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary/50">
              <Plus className="h-4 w-4" />
              Add data
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div key={card.title} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                    {card.icon}
                    {card.title}
                  </div>
                  <StatChip trend={card.trend} delta={card.delta} />
                </div>
                <p className="mt-3 text-3xl font-bold text-neutral-900">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Product sales</h2>
                  <p className="text-sm text-neutral-500">Gross margin vs Revenue</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sky-300" />
                    Gross margin
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    Revenue
                  </span>
                </div>
              </div>
              <BarChart />
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Sales by countries</h2>
              <div className="mt-4 space-y-3">
                {countries.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{c.name}</span>
                    <span className="font-semibold text-neutral-900">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Sales by product category</h2>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
                <DonutChart />
                <DonutLegend />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Notes</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li>• Mantén la operación enfocada en categorías con mayor margen.</li>
                <li>• Revisa devoluciones crecientes en la última semana.</li>
                <li>• Refuerza campañas en los países top 3.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
