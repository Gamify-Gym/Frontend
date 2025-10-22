import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { DietaType } from "../../components/general/types";
import { useDieta } from "@/hooks/useDietas";
import DietaSelector from "@/components/dieta/dietaSelector";

export default function Dieta() {
  const { dieta, handleRerun } = useDieta();
  return (
    <View style={styles.container}>
      <DietaSelector data={dieta} onPress={() => {}} onLongPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b1031",
    paddingTop: 60,
  },
});
