import { AuthProvider, useAuth } from "@/context/authContext";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";

function Protected() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isLoading) return;
    const isInProtectedRoute = pathName?.startsWith("/(tabs)");

    if (!isLogged && isInProtectedRoute) {
      router.replace("/login");
    } else if (isLogged && !isInProtectedRoute) {
      router.replace("/(tabs)/home");
    }
  }, [isLogged, isLoading, pathName]);

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
