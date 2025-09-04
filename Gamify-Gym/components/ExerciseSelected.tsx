import { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "./Colors";
import { TreinoType } from "./TreinoSelector";

export default function ExerciseSelected({ treino }: { treino: TreinoType | null }) {
  if (!treino) return null;

  
  const animatedValues = useRef<Animated.Value[]>(
    treino.exercicio.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
   
    animatedValues.forEach((val) => val.setValue(0));

    //luigibrugs esteve aqui as 00h45 do dia 04/09
    const animations = animatedValues.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 300,
        delay: i * 150, // cada exercício aparece com 150ms de diferença
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, [treino]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{treino.nome}</Text>
      <ScrollView
        style={styles.exerciseContainer}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
      >
        {treino.exercicio.map((exercicio, index) => {
          const opacity = animatedValues[index] || new Animated.Value(0);

          return (
            <Animated.View
              key={index}
              style={[
                styles.exerciseCard,
                { opacity, transform: [{ translateY: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }) }] },
              ]}
            >
              <Pressable android_ripple={{ color: "#eee" }} style={{ padding: 16 }}>
                <Text style={styles.exerciseName}>{exercicio.nome}</Text>
                <Text style={styles.exerciseInfo}>{exercicio.repeticoes} Repetições</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
      // oq que vc veio olhar aqui?
    </View>
  );
}
 // oq que vc veio olhar aqui?
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 12,
  },
  exerciseContainer: {},
  exerciseCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  exerciseInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
