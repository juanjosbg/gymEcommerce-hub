export interface ProductType {
  slug: string;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  rating?: number;
  reviews?: number;
  coverImage: string;
  shots?: string[];
  overview?: string;
  shipment?: any[];
  shipment_details?: any[];
  justIn?: boolean;
}
