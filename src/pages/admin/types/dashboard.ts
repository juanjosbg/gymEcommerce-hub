export type StatCard = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: any;
};

export type CategorySlice = {
  name: string;
  value: number; // porcentaje
  color: string; // clase tailwind para el color
};
