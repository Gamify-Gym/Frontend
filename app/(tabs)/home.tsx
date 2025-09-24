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
        label="Ações"
        icon="add"
        options={[
          {
            label: "Editar",
            action: () => console.log("Editar"),
            icon: "edit",
          },
          {
            label: "Excluir",
            action: () => console.log("Excluir"),
            icon: "delete",
          },
          {
            label: "Logout",
            action: () => logout(),
            icon: "share",
          },
        ]}
      />
    </View>
  );
}
