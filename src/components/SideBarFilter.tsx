import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import React, { useState, useEffect } from "react";
import Heading from "@/shared/Heading/Heading";
import { filters } from "@/data/content"; // primer array son las categorías

interface Brand {
  name: string;
}

type SidebarFiltersProps = {
  onFilterChange: (brand: string, priceRange: number[]) => void;
  priceRange?: number[];
};

const categoryOptions: Brand[] = [
  { name: "Mostrar todo" },
  ...filters[0].filter((c) => c !== "Todos").map((name) => ({ name })),
];

const SidebarFilters = ({
  onFilterChange,
  priceRange = [0, 10000],
}: SidebarFiltersProps) => {
  const [rangePrices, setRangePrices] = useState(priceRange);
  const [activeBrand, setActiveBrand] = useState("Mostrar todo");

  useEffect(() => {
    setRangePrices(priceRange);
  }, [priceRange]);

  const handleBrandClick = (brand: string) => {
    setActiveBrand(brand);
    onFilterChange(brand, rangePrices);
  };

  const handlePriceChange = (input: number | number[]) => {
    const newRange = input as number[];
    setRangePrices(newRange);
    onFilterChange(activeBrand, newRange);
  };

  return (
    <div className="top-28 lg:sticky">
      <Heading className="mb-0">Filtro por Productos</Heading>
      <div className="divide-y divide-neutral-300">
        <div className="relative flex flex-col space-y-4 pb-8">
          <div className="space-y-5">
            <span className="font-semibold">Productos</span>
            <div className="grid grid-cols-2 gap-4">
              {categoryOptions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleBrandClick(item.name)}
                  className={`rounded-lg py-4 ${
                    activeBrand === item.name
                      ? "text-sm bg-primary text-white"
                      : "bg-[#f3f3f3]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col space-y-5 py-8 pr-3">
          <div className="space-y-5">
            <span className="font-semibold">Rango de precio</span>
            <Slider
              range
              min={priceRange[0]}
              max={priceRange[1]}
              step={1}
              value={rangePrices}
              allowCross={false}
              onChange={handlePriceChange}
            />
          </div>
          <div className="flex justify-between space-x-5">
            <div>
              <div className="block text-sm font-medium">Min price</div>
              <div className="relative mt-1 rounded-md">
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                  $
                </span>
                <input
                  type="text"
                  name="minPrice"
                  disabled
                  id="minPrice"
                  className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                  value={rangePrices[0]}
                />
              </div>
            </div>
            <div>
              <div className="block text-sm font-medium">Max price</div>
              <div className="relative mt-1 rounded-md">
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                  $
                </span>
                <input
                  type="text"
                  disabled
                  name="maxPrice"
                  id="maxPrice"
                  className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                  value={rangePrices[1]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
