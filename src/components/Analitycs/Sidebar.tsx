"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaChartPie,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaBars,
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menu = [
    { icon: <FaHome />, label: "Dashboard", href: "/admin" },
    { icon: <FaChartPie />, label: "Estadísticas", href: "/admin/stats" },
    { icon: <FaBoxOpen />, label: "Agregar Producto", href: "/admin/products" },
    { icon: <FaShoppingCart />, label: "Pedidos", href: "/admin/orders" },
    { icon: <FaUsers />, label: "Usuarios", href: "/admin/users" },
  ];

  return (
    <aside
      className={`
        h-screen bg-white border-r border-gray-200 
        flex flex-col justify-between transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          <h2
            className={`text-xl font-bold transition-opacity ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Admin
          </h2>

          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-6 space-y-2">
          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="
                flex items-center gap-4 px-4 py-3
                text-gray-700 hover:bg-gray-100 transition rounded-md
              "
            >
              <span className="text-xl">{item.icon}</span>

              {/* Text animado */}
              <span
                className={`
                  whitespace-nowrap overflow-hidden transition-all
                  ${isOpen ? "opacity-100 w-full" : "opacity-0 w-0"}
                `}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* USER SECTION */}
      <div className="border-t border-gray-200 px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />

        <div
          className={`
            flex flex-col transition-all
            ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
          `}
        >
          <span className="font-medium">Admin User</span>
          <span className="text-sm text-gray-500">Online</span>
        </div>
      </div>
    </aside>
  );
}
