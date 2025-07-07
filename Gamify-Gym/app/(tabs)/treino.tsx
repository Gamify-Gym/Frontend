import { Text, View, StyleSheet } from "react-native";

export default function Treino() {
  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
  });

  return (
    <View style={styles.container}>
      <Text>Treino Screen</Text>
    </View>
  );
}
