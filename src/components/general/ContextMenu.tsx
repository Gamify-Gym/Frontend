import { Pressable, View } from "react-native";
import { Text } from ".";
import { StyleSheet } from "react-native";

type MenuAction = {
  label: string;
  action: () => void;
};

type EditMenuProps = {
  coords: { x: number | null; y: number | null };
  actions: MenuAction[];
  selectedItem: object | null;
};
export default function EditMenu({
  actions,
  coords,
  selectedItem,
}: EditMenuProps) {
  return (
    <View style={[styles.menuContainer, { left: coords.x, top: coords.y }]}>
      {actions.map((item, index) => (
        <Pressable onPress={item.action} key={index} style={styles.menuItem}>
          <View>
            <Text style={styles.menuText}>{item.label}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  menuContainer: {
    zIndex: 999,
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
  },
});
