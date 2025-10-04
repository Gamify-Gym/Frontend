import { Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";

export default function Perfil() {
  return <KeyboardAvoidingView style={styles.container}></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
