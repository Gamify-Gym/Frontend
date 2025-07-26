import FAB from "@/components/FAB";
import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/context/authContext";

export default function home() {
  const { logout } = useAuth();
  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
  });
  return (
    <View style={styles.container}>
      <FAB
        label={"Logout"}
        icon="add"
        onClick={() => {
          logout();
        }}
      ></FAB>
    </View>
  );
}
