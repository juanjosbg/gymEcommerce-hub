import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus } from "lucide-react";

const AdminProductosPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 text-neutral-900">
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Overview</p>
            <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
              Productos
            </h1>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary/50">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>
      </main>
    </div>
  </div>
);

export default AdminProductosPage;



