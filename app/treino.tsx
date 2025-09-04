import ExerciseSelected from "@/components/WorkoutSelected";
import { fakeTreinoData } from "@/components/fakeData";
import TreinoSelector, { TreinoType } from "@/components/WorkoutSelector";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Treino() {
  const [selectedTreino, setTreino] = useState<TreinoType | null>(null);

  const handleTreinoChange = (treino: TreinoType) => setTreino(treino);

  return (
    <View style={styles.container}>
    
      <TreinoSelector 
       treinoData={fakeTreinoData}
       onPress={handleTreinoChange}
      >
      </TreinoSelector>

      <ScrollView
        style={styles.exerciseScroll}
        contentContainerStyle={{ paddingBottom: 23 }}
        showsVerticalScrollIndicator={false}
      >
        <ExerciseSelected treino={selectedTreino} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", 
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff", 
    textShadowColor: "#ffffffff",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffffff", 
    marginTop: 6,
    textShadowColor: "#ffffffff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  exerciseScroll: {
    width: "100%",
  },
});
