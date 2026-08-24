import { useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { useAuthStore } from "./auth-store";
import type { User } from "../types/api";

/**
 * Mount this once near the root of the app (inside your QueryClientProvider).
 * It keeps `useAuthStore` in sync with better-auth's reactive session,
 * so any CRUD screen can read `useAuthStore((s) => s.user)` without
 * needing to know about better-auth directly.
 */
export function AuthSync() {
  const { data, isPending } = useSession();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!isPending) {
      setUser((data?.user as unknown as User) ?? null);
    }
  }, [data?.user, isPending, setUser]);

  return null;
}
