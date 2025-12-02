// /src/hooks/useAuth.ts
// Mantiene la misma firma pero utiliza el AuthContext real.
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  return useAuthContext();
}
