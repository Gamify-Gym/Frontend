import FAB from "@/components/general/FAB";
import { View, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/authContext";
import Button from "@/components/general/Button";
import ParentView from "@/components/general/ParentView";

export default function home() {
  const { logout } = useAuth();

  return (
    <ParentView>
      <View style={styles.container}>
      <Button
        onClick={() => {}}
        onLongClick={() => Alert.alert("Clique longo")}
        label="Test"
        icon="check"
        iconProps={{ size: 18 }}
        textStyle={{ fontSize: 18 }}
        animationConfig={{ scale: 0.95, duration: 80 }}
        width={200}
        height={50}
      />
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
    </ParentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b1031",
  },
});
