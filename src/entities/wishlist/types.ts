export type WishlistProductData = {
  slug?: string | null;
  name?: string | null;
  overview?: string | null;
  price?: number | null;
  stock?: number | null;
  category?: string | null;
  cover_image?: string | null;
  image_url?: string | null;
};

export type WishlistItem = {
  id?: string | number | null;
  slug?: string | null;
  name?: string | null;
  overview?: string | null;
  price?: number | null;
  stock?: number | null;
  category?: string | null;
  cover_image?: string | null;
  image_url?: string | null;
  product_data?: WishlistProductData;
} & Record<string, unknown>;
