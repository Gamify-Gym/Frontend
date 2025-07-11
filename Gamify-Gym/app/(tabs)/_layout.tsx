import { Tabs } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShadowVisible: false,
        animation: "fade",
        tabBarStyle: {
          backgroundColor: "#F3EDF7",
          paddingTop: 10,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="treino"
        options={{
          title: "Treino",
          tabBarIcon: ({ focused }) => (
            <>
              <View style={[styles.pill, focused && styles.pillFocus]}>
                <FontAwesome6 name="dumbbell" size={20} color="#4A4459" />
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
                  color="#4A4459"
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
                <MaterialCommunityIcons name="home" size={26} color="#4A4459" />
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
                <FontAwesome6 name="user-group" size={20} color="#4A4459" />
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
                <FontAwesome6 name="crown" size={20} color="#4A4459" />
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
    backgroundColor: "#E8DEF8",
  },
  text: {
    fontSize: 8,
    fontWeight: 600,
  },
  textFocus: {
    color: "#625B71",
  },
});
