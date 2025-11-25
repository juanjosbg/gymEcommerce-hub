// /src/hooks/useAuth.ts
"use client";
import { useState } from "react";

export function useAuth() {
  // Usuario simulado temporalmente
  const [user] = useState({
    uid: "local-user-123",
    email: "test@example.com",
  });

  return { user };
}
