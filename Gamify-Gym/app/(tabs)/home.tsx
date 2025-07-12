import FAB from "@/components/FAB";
import { Text, View, StyleSheet } from "react-native";

export default function home() {
  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
  });
  return (
    <View style={styles.container}>
      <FAB
        label={"Test"}
        icon="add"
        onClick={() => {
          null;
        }}
      ></FAB>
    </View>
  );
}
