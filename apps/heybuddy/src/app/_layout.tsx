import { Stack } from "expo-router";
import { AppProviders } from "@/lib/query-provider";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: true }} />
    </AppProviders>
  );
}
