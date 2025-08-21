import ExerciseSelected from "@/components/ExerciseSelected";
import { fakeTreinoData } from "@/components/fakeData";
import TreinoSelector, { TreinoType } from "@/components/TreinoSelector";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Treino() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 22,
    },
  });
  const [selectedTreino, setTreino] = useState<TreinoType | null>(null);

  const handleTreinoChange = (treino: TreinoType) => {
    setTreino(treino);
  };
  return (
    <View style={styles.container}>
      <TreinoSelector
        treinoData={fakeTreinoData}
        onPress={handleTreinoChange}
      />
      <ExerciseSelected treino={selectedTreino} />
    </View>
  );
}
