import { BarChart3, Users, ShoppingBag, RotateCcw } from "lucide-react";
import type { StatCard } from "../types/dashboard";

export const statCards: StatCard[] = [
  { title: "Clientes Registrados", value: "--", delta: "+2.5%", trend: "up", icon: Users },
  { title: "Total Productos", value: "--", delta: "-0.2%", trend: "down", icon: ShoppingBag },
  { title: "Total revenue", value: "$3,456 M", delta: "+0.5%", trend: "up", icon: BarChart3 },
  { title: "Total returns", value: "1,789", delta: "+0.12%", trend: "up", icon: RotateCcw },
];

export const barData = [
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

export const categories = [
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

export const countries = [
  { name: "Poland", value: 19 },
  { name: "Austria", value: 15 },
  { name: "Spain", value: 13 },
  { name: "Romania", value: 12 },
  { name: "France", value: 11 },
  { name: "Italy", value: 11 },
  { name: "Germany", value: 10 },
  { name: "Ukraine", value: 9 },
];
