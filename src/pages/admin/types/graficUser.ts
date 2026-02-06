export type Series = { label: string; color: string; points: number[] };

export type Bucket = {
  label: string; // ej: 12 Ene
  nuevos: number;
  viejos: number;
  recurrentes: number;
};

export type ProfileRow = { id: string; created_at: string };
