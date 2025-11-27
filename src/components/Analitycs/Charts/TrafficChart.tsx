"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Lun", visits: 300 },
  { name: "Mar", visits: 500 },
  { name: "Mié", visits: 450 },
  { name: "Jue", visits: 700 },
  { name: "Vie", visits: 650 },
];

export default function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}