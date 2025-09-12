import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from ".";
import colors from "./Colors";
import { TreinoType } from "./WorkoutSelector";

export default function ExerciseSelected({
  treino,
}: {
  treino: TreinoType | null;
}) {
  const animatedValues = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (!treino) return;

    animatedValues.current = treino.exercises.map(() => new Animated.Value(0));

    const animations = animatedValues.current.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 300,
        delay: i * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, [treino]);

  if (!treino) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{treino.name}</Text>
      <ScrollView
        style={styles.exerciseContainer}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
      >
        {treino.exercises.map((exercise, index) => {
          const opacity = animatedValues.current[index];

          return (
            <Animated.View
              key={index}
              style={[
                styles.exerciseCard,
                {
                  opacity,
                  transform: [
                    {
                      translateY: opacity
                        ? opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          })
                        : 0,
                    },
                  ],
                },
              ]}
            >
              <Pressable
                android_ripple={{ color: "#eee" }}
                style={{ padding: 16 }}
              >
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseInfo}>
                  {exercise.repeticoes} Repetições
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
  exerciseContainer: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  exerciseInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
