import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { DietaType } from "../../components/general/types";
import { useDieta } from "@/hooks/useDietas";

export default function Dieta() {
  const { dieta, handleRerun } = useDieta();
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
