"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Ene", sales: 1200 },
  { name: "Feb", sales: 2100 },
  { name: "Mar", sales: 1800 },
  { name: "Abr", sales: 2500 },
];

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}