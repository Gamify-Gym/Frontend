import {
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useDieta } from "@/hooks/useDietas";
import DietaSelector from "@/components/dieta/dietaSelector";
import DietaSelected from "@/components/dieta/dietaSelected";
import ParentView from "@/components/general/ParentView";
import { Alimento, DietaType } from "@/components/general/types";
import { useState } from "react";
import EditMenu from "@/components/general/ContextMenu";
import { useMenu } from "@/hooks/useMenu";

export default function Dieta() {
  const { dieta } = useDieta();
  const [selectedDieta, setSelectedDieta] = useState<DietaType | null>(null);

  const {
    menuVisible,
    menuCoords,
    selectedItem,
    setSelectedItem,
    handleLongPress,
    closeMenu,
  } = useMenu();

  const handleDietaChange = (dieta: DietaType) => {
    setSelectedDieta(null);
    setTimeout(() => setSelectedDieta(dieta), 0);
  };

  const handleItemLongPress = (
    item: Alimento | DietaType,
    event: GestureResponderEvent
  ) => {
    setSelectedItem(item);
    handleLongPress(event);
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

  return (
    <ParentView>
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
            data={dieta}
            onPress={handleDietaChange}
            onLongPress={(item, event) => handleItemLongPress(item, event)}
          />

          <DietaSelected
            dieta={selectedDieta}
            onLongPress={(item, event) => handleItemLongPress(item, event)}
          />
        </ScrollView>
      </Pressable>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1031",
    paddingTop: 60,
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
  },
});
