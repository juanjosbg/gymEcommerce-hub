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

  let userId: string | undefined;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.code === "email_exists") {
      // Busca el usuario existente
      const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) throw listErr;
      userId = usersData?.users?.find((u) => u.email === email)?.id;
      if (!userId) throw new Error("No se encontró el usuario existente");
      await supabase.auth.admin.updateUserById(userId, { password });
    } else {
      throw error;
    }
  } else {
    userId = data.user?.id;
  }

  if (!userId) throw new Error("No user id");

  const { error: roleErr } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" });
  if (roleErr) throw roleErr;

  console.log("Admin creado/marcado:", email, userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
