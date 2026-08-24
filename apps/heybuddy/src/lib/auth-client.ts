import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// Point this at your Express server's base URL (the one that mounts
// `app.all("/api/auth/*", toNodeHandler(auth))`).
// Use your machine's LAN IP for physical devices — "localhost" only works
// on iOS simulators, not on Android emulators or real devices.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8081";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL, // NOT /api/auth — better-auth appends that itself
  plugins: [
    expoClient({
      scheme: "myapp", // must match the `scheme` in app.json
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
  ],
});

// Convenience re-exports
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
