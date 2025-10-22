import colors from "@/components/general/Colors";
import { AuthProvider, useAuth } from "@/context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
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
    <LinearGradient
      colors={["#1b1031", "#341256ff", colors.brightPurple]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <Stack
            screenOptions={{ headerShown: false, statusBarStyle: "light" }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="assignType" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </View>
    </LinearGradient>
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
