import ExerciseSelected from "@/components/WorkoutSelected";
import { fakeTreinoData } from "@/components/fakeData";
import TreinoSelector, { TreinoType } from "@/components/WorkoutSelector";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "@/context/authContext";

export default function Treino() {
  const [selectedTreino, setSelectedTreino] = useState<TreinoType | null>(null);
  const [treino, setTreino] = useState<[TreinoType] | []>([]);
  const { token } = useAuth();

  const handleTreinoChange = (treino: TreinoType) => setSelectedTreino(treino);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/training/workout`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        const json = await res.json();
        setTreino(json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <TreinoSelector
        treinoData={treino}
        onPress={handleTreinoChange}
      ></TreinoSelector>

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
