import { useEffect, useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { Text } from ".";
import colors from "./Colors";
import { Exercise, TreinoType } from "./WorkoutSelector";

export default function ExerciseSelected({
  treino,
  onLongPress,
}: {
  treino: TreinoType | null;
  onLongPress: (exercise: Exercise, event: GestureResponderEvent) => void;
}) {
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({}).current;

  useEffect(() => {
    if (treino?.exercises) {
      // Ensure an Animated.Value exists for each exercise.
      treino.exercises.forEach((exercise) => {
        if (!animatedValues[exercise.id]) {
          animatedValues[exercise.id] = new Animated.Value(0);
        }
      });

      // Reset animations to 0 before starting a new sequence.
      // This is crucial for when the user selects a new treino.
      Object.values(animatedValues).forEach((val) => val.setValue(0));

      const animations = treino.exercises.map((exercise) =>
        Animated.timing(animatedValues[exercise.id], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, animations).start();
    }
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
          const opacity = animatedValues[exercise.id] || new Animated.Value(0);

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
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(exercise, event);
                }}
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
