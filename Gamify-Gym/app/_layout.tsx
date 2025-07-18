import { AuthProvider, useAuth } from "@/context/authContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function Protected() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === "(tabs)";
      if (!isLogged && !inAuthGroup) {
        router.replace("/login");
      } else if (isLogged && inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    }
  }, [isLogged, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: "dark" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Protected />
    </AuthProvider>
  );
}
