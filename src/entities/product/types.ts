import type { Tables } from "@/integrations/supabase/types";

export type ProductRow = Tables<"products">;
export type ProductRowLoose = Partial<ProductRow>;

export type ShipmentDetail = {
  title: string;
  description: string;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  coverImage: string;
  shots?: string[];
  overview?: string;
  shipmentDetails?: ShipmentDetail[] | null;
  justIn?: boolean | null;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  previousPrice?: number;
  image_url?: string | null;
  category: string;
  stock: number;
};
