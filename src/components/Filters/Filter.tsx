"use client";

import React, { useState } from "react";
import { LuFilter } from "react-icons/lu";
import { filters } from "@/data/Filter"; // ojo: ruta mayúscula F
import Button from "@/shared/Button/Button";
import Select from "@/shared/Select/Select";

const Filter = ({ onFilter }: { onFilter: (filters: string[]) => void }) => {
  const defaultSelected = filters.map((f) => f[0]);
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (value: string, idx: number) => {
    const updated = [...selected];
    updated[idx] = value;
    setSelected(updated);
  };

  const handleFilterClick = () => onFilter(selected);

  const handleClear = () => {
    setSelected(defaultSelected);
    onFilter(defaultSelected);
  };

  const isFiltered = selected.some((v, idx) => v !== defaultSelected[idx]);

  return (
    <div className="mx-auto mb-10 max-w-5xl items-center justify-between space-y-3 bg-[#f3f3f3] rounded-full border border-[#e6e6e6] p-3 md:flex md:space-y-0">
      <div className="grid basis-3/4 gap-3 md:grid-cols-3">
        {filters.map((filter, idx) => (
          <Select
            key={`filter-${idx}`}
            sizeClass="h-11"
            value={selected[idx]}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="bg-white text-black font-semibold border border-transparent px-3 shadow-sm"
          >
            {filter.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="flex items-center gap-1 bg-white text-black font-semibold rounded-full px-6 py-2 shadow-sm border border-transparent hover:border-black/20"
          onClick={handleFilterClick}
        >
          Filtrar
          <LuFilter />
        </Button>
        {isFiltered && (
          <Button
            className="flex items-center gap-1 bg-neutral-200 text-neutral-600 rounded-full px-6 py-2"
            onClick={handleClear}
          >
            Borrar
          </Button>
        )}
      </div>
    </div>
  );
};

export default Filter;
