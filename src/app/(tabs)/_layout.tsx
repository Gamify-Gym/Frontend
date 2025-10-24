import { useAuth } from "@/context/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "@/components/general/Colors";

export default function TabLayout() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLogged) {
      router.replace("/login");
    }
  }, [isLoading, isLogged]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#4c0185",
        }}
      >
        <ActivityIndicator size="large" color="#4A4459" />
      </View>
    );
  }
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.brightPurple,
          paddingTop: 10,
          height: 70,
        },
        tabBarButton: (props) => (
          //@ts-ignore
          <Pressable {...props} android_ripple={{ color: null }} />
        ),
      }}
    >
      <Tabs.Screen
        name="treino"
        options={{
          title: "Treino",
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <FontAwesome6
                  name="dumbbell"
                  size={20}
                  color={focused ? colors.pink : colors.secondaryLightGray}
                />
              </View>
              <Text
                style={[styles.text, focused && styles.textFocus]}
                numberOfLines={1}
              >
                Treino
              </Text>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="dieta"
        options={{
          title: "Dieta",
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={26}
                  color={focused ? colors.pink : colors.secondaryLightGray}
                />
              </View>
              <Text
                style={[styles.text, focused && styles.textFocus]}
                numberOfLines={1}
              >
                Dieta
              </Text>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <MaterialCommunityIcons
                  name="home"
                  size={26}
                  color={focused ? colors.pink : colors.secondaryLightGray}
                />
              </View>
              <Text
                style={[styles.text, focused && styles.textFocus]}
                numberOfLines={1}
              >
                Home
              </Text>
            </>
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <FontAwesome6
                  name="user-group"
                  size={20}
                  color={focused ? colors.pink : colors.secondaryLightGray}
                />
              </View>
              <Text
                style={[styles.text, focused && styles.textFocus]}
                numberOfLines={1}
              >
                Perfil
              </Text>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium",
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <FontAwesome6
                  name="crown"
                  size={20}
                  color={focused ? colors.pink : colors.secondaryLightGray}
                />
              </View>
              <Text
                style={[styles.text, focused && styles.textFocus]}
                numberOfLines={1}
              >
                Premium
              </Text>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="[treino]"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "transparent",
    width: 42,
    height: 32,
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pillFocus: {
    backgroundColor: "#4c0185",
    borderRadius: 30,
  },
  text: {
    fontSize: 8,
    fontWeight: "normal",
    color: colors.secondaryLightGray,
  },
  textFocus: {
    fontWeight: "bold",
    color: colors.pink,
  },
});
