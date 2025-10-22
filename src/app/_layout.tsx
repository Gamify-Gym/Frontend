import colors from "@/components/general/Colors";
import { AuthProvider, useAuth } from "@/context/authContext";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function Protected() {
  const { isLogged, isLoading, user } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = ["/login", "/assignType", "/createUser"];
    const isInProtectedRoute = !publicRoutes.includes(pathName);

    if (!isLogged && isInProtectedRoute) {
      router.replace("/login");
    } else if (isLogged && pathName === "/login") {
      if (user === null) {
        router.replace("/assignType");
      } else {
        router.replace("/home");
      }
    } else if (isLogged && user == null && isInProtectedRoute) {
      router.replace("/assignType");
    }
  }, [isLogged, isLoading, pathName, router, user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:colors.brightPurple }}>
      <Stack screenOptions={{ headerShown: false, statusBarStyle: "dark" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="assignType" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Protected />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
