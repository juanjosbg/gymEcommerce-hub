// scripts/createAdmin.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const email = "fitmexstore@gmail.com";
  const password = "adminFit-3211*";

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("No user id");

  const { error: roleErr } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" });
  if (roleErr) throw roleErr;

  console.log("Admin creado y marcado:", email, userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
