import type React from "react";

export type Trend = "up" | "down";

export type StatCard = {
  title: string;
  value: string;
  delta: string;
  trend: Trend;
  icon: React.ComponentType<{ className?: string }>;
};
