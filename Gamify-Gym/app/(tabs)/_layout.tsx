import { Tabs } from "expo-router";
import SvgUri from "react-native-svg";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="home">
      <Tabs.Screen
        name="treino"
        options={{
          title: "Treino",
        }}
      />
      <Tabs.Screen
        name="dieta"
        options={{
          title: "Dieta",
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
        }}
      />

      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium",
        }}
      />
    </Tabs>
  );
}
