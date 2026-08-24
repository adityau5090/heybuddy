import { create } from "zustand";
import { authClient } from "../lib/auth-client";
import { disconnectSocket } from "../lib/socket";
import type { User } from "../types/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      // Opens the system browser for the Google OAuth flow and redirects
      // back into the app via the `scheme` configured in expoClient().
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // in-app path to land on after success
      });
      if (error) {
        console.log("Google sign-in error:", JSON.stringify(error, null, 2));
        set({ isLoading: false, error: error.message ?? "Google sign-in failed" });
        return;
      }
      // The session cookie is now stored; AuthSync (mounted at the root)
      // will pick up the new session via useSession() and call setUser.
      set({ isLoading: false });
    } catch (err) {
      console.log("Google sign-in exception:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Google sign-in failed",
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authClient.signOut();
    disconnectSocket();
    set({ isLoading: false, user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));