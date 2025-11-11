import {
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDieta } from "@/hooks/useDietas";
import DietaSelector from "@/components/dieta/dietaSelector";
import DietaSelected from "@/components/dieta/dietaSelected";
import ParentView from "@/components/general/ParentView";
import { Alimento } from "@/components/general/types";
import { useState } from "react";
import EditMenu from "@/components/general/ContextMenu";
import { useMenu } from "@/hooks/useMenu";
import { LinearGradient } from "expo-linear-gradient";
import FAB from "@/components/general/FAB";
import { DietaWithMealsType, getMockDietsWithMeals } from "@/utils/mockData";

export default function Dieta() {
  const dietasComRefeicoes = getMockDietsWithMeals();
  const [selectedDieta, setSelectedDieta] = useState<DietaWithMealsType | null>(null);

  const {
    menuVisible,
    menuCoords,
    selectedItem,
    setSelectedItem,
    handleLongPress,
    closeMenu,
  } = useMenu();

  const handleDietaChange = (dieta: DietaWithMealsType) => {
    setSelectedDieta(null);
    setTimeout(() => setSelectedDieta(dieta), 0);
  };

  const handleItemLongPress = (
    item: Alimento,
    event: GestureResponderEvent
  ) => {
    setSelectedItem(item);
    handleLongPress(event);
  };

  const handleAddDieta = () => {
    Alert.alert(
      "Modo Demo",
      "Criação de novas dietas está desabilitada no modo de demonstração."
    );
  };

  const handleAddAlimento = () => {
    Alert.alert(
      "Modo Demo",
      "Adição de alimentos está desabilitada no modo de demonstração."
    );
  };

  const MENU_ACTIONS = [
    {
      label: "Editar",
      icon: "pencil",
      action: () =>
        Alert.alert(
          "Modo Demo",
          "Edição desabilitada no modo de demonstração."
        ),
    },
    {
      label: "Apagar",
      icon: "delete",
      destructive: true,
      action: () =>
        Alert.alert(
          "Modo Demo",
          "Exclusão desabilitada no modo de demonstração."
        ),
    },
  ];

  const FAB_OPTIONS = [
    {
      label: "Dieta",
      action: handleAddDieta,
      icon: "add" as const,
    },
    {
      label: "Alimento",
      action: handleAddAlimento,
      icon: "add" as const,
    },
  ];

  return (
    <ParentView>
      <LinearGradient
        colors={["#1a0f2e", "#2d1654", "#3d1f5c", "#2d1654"]}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradient}
      >
        <Pressable style={styles.container} onPress={closeMenu}>
          {menuVisible && (
            <EditMenu
              selectedItem={selectedItem}
              actions={MENU_ACTIONS}
              coords={{ x: menuCoords.x, y: menuCoords.y }}
              onClose={closeMenu}
            />
          )}

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <DietaSelector
              data={dietasComRefeicoes}
              onPress={handleDietaChange}
              onLongPress={(item: any, event: GestureResponderEvent) =>
                handleItemLongPress(item, event)
              }
            />

            <DietaSelected
              dieta={selectedDieta}
              onLongPress={(item, event) => handleItemLongPress(item, event)}
            />
          </ScrollView>

          <FAB icon="add" options={FAB_OPTIONS} />
        </Pressable>
      </LinearGradient>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
  },
});