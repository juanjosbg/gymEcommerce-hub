// scripts/seedProducts.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { products } from "../src/data/products-seed.ts";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const rows = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    previous_price: p.previous_price ?? null,
    stock: p.stock ?? 0,
    cover_image: p.cover_image,
    images: p.images ?? [],
    overview: p.overview,
    metadata: p.metadata ?? null,
  }));

  const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log("Productos insertados/actualizados:", rows.length);
}

main()
  .then(() => {
    console.log("Listo");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
