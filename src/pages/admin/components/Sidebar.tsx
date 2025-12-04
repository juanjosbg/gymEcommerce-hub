// src/pages/admin/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { BarChart3, ShoppingBag, Users, PieChart } from "lucide-react";

const base = "flex items-center gap-3 rounded-xl px-3 py-2";
const active = "bg-primary/10 text-primary";
const idle = "hover:bg-neutral-100 text-neutral-600";

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-60 flex-col border-r bg-white/80 p-6 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          FIT
        </div>
        <div className="text-lg font-semibold text-neutral-900">Admin</div>
      </div>

      <nav className="flex flex-1 flex-col gap-3 text-sm font-medium text-neutral-600">
        <div className="text-xs uppercase tracking-wide text-neutral-400">
          Marketing
        </div>

        <NavLink
          to="/admin"
          className={({ isActive }) => `${base} ${isActive ? active : idle}`}
          end
        >
          <BarChart3 className="h-4 w-4" />
          Data
        </NavLink>

        <NavLink
          to="/admin/productos"
          className={({ isActive }) => `${base} ${isActive ? active : idle}`}
        >
          <ShoppingBag className="h-4 w-4" />
          Stock de productos
        </NavLink>

        <NavLink
          to="/admin/ordenes"
          className={({ isActive }) => `${base} ${isActive ? active : idle}`}
        >
          <Users className="h-4 w-4" />
          Ordenes de compra
        </NavLink>

        <div className="mt-6 text-xs uppercase tracking-wide text-neutral-400">
          System
        </div>

        <NavLink
          to="/admin/reportes"
          className={({ isActive }) => `${base} ${isActive ? active : idle}`}
        >
          <PieChart className="h-4 w-4" />
          Reports
        </NavLink>
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
}
