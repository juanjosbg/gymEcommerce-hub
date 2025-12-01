// scripts/seedStock.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  const stocks: Record<string, number> = {
    // PRE-ENTRENO
    "cbum5peat": 15,
    "peachbum": 12,
    "Vemon": 30,
    "psychotic-orange": 25,

    // PROTEÍNAS
    "dymatize-iso100-vainilla": 18,
    "cbum-itholate": 14,
    "cbum-itholate-cake": 10,
    "raw-mint-chip": 20,
    "gold-standard-chocolate": 16,
    "gold-standard-whey": 22,

    // SUPLEMENTOS / CREATINA / AMINOÁCIDOS
    "creatine": 40,
    "aminox": 35,
    "Ryse": 28,
    "Pak": 26,
    "Muscletech": 24,
    "Falcon": 22,
    "Bordan": 20,
    "Bcaas": 30,
    "modern-eaa-plus": 18,
    "omega-3-90-softgels": 32,
    "creatina-monohidratada-birdman-450g": 15,
    "creatina-dragon-pharma-1kg": 20,
    "glutamina-creatina": 10,

    // OTROS / GANADOR / AMINO EXTRA
    "mutant-whey-chocolate-5lb": 12,
    "mass-tech-extreme-2000": 8,
    "birdman-bcaa-glutamina-405g": 14,
  };

  for (const [slug, stock] of Object.entries(stocks)) {
    const { error } = await supabase
      .from("products")
      .update({ stock })
      .eq("slug", slug);

    if (error) {
      console.error(`Error al actualizar ${slug}:`, error);
    } else {
      console.log(`Stock actualizado: ${slug} -> ${stock}`);
    }
  }
}

main()
  .then(() => {
    console.log("Listo");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
