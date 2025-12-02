// Sidebar.tsx
import { BarChart3, ShoppingBag, Users, PieChart, } from "lucide-react";

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
        <a
          className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-primary"
          href="#"
        >
          <BarChart3 className="h-4 w-4" />
          Data
        </a>
        <a
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100"
          href="#"
        >
          <ShoppingBag className="h-4 w-4" />
          Orders
        </a>
        <a
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100"
          href="#"
        >
          <Users className="h-4 w-4" />
          Stock de productos
        </a>
        <div className="mt-6 text-xs uppercase tracking-wide text-neutral-400">
          System
        </div>
        <a
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100"
          href="#"
        >
          <PieChart className="h-4 w-4" />
          Reports
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
}
