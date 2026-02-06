import React, { useState } from "react";
import type { FilterOrdenUserProps } from "@/pages/admin/types/filterOrdenUser";

const FilterOrdenUser: React.FC<FilterOrdenUserProps> = ({ onFilter, className }) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onFilter(value.trim());
  };

  return (
    <div className={`flex items-center gap-2  ${className || ""}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder="Filtrar por nombre, correo o No. de orden.."
        className="w-80 rounded-full border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none "
      />
      <button
        onClick={handleSearch}
        className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Filtrar
      </button>
      <button
        onClick={() => {
          setValue("");
          onFilter("");
        }}
        className="rounded-full border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:border-primary/60"
      >
        Limpiar
      </button>
    </div>
  );
};

export default FilterOrdenUser;


