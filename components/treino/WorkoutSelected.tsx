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
import { Text } from "../general";
import { TreinoType, ExerciseType } from "../general/types";
import colors from "../general/Colors";

export default function ExerciseSelected({
  treino,
  onLongPress,
}: {
  treino: TreinoType | null;
  onLongPress: (exercise: ExerciseType, event: GestureResponderEvent) => void;
}) {
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({}).current;

  useEffect(() => {
    if (treino?.exercises) {
      treino.exercises.forEach((exercise) => {
        if (!animatedValues[exercise.id]) {
          animatedValues[exercise.id] = new Animated.Value(0);
        }
      });

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
      <View style={styles.header}>
        <Text style={styles.title}>{treino.name}</Text>
        <View style={styles.treinoStats}>
          <Text style={styles.statsText}>
            {treino.exercises.length} exercícios
          </Text>
          <View style={styles.statDivider} />
          <Text style={styles.statsText}>
            {treino.totalSeries} séries totais
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.exerciseContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
                android_ripple={{ color: colors.lightGray }}
                style={styles.exercisePressable}
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(exercise, event);
                }}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseBadge}>
                    <Text style={styles.badgeText}>
                      {exercise.series || exercise.series} séries
                    </Text>
                  </View>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseInfo}>
                    {exercise.repeticoes} repetições
                  </Text>
                  {exercise.muscles && (
                    <Text style={styles.muscleText}>{exercise.muscles}</Text>
                  )}
                </View>
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
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  treinoStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  exerciseContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 30,
  },
  exerciseCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  exercisePressable: {
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  exerciseBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  exerciseDetails: {
    gap: 4,
  },
  exerciseInfo: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  muscleText: {
    fontSize: 13,
    color: colors.gray,
    fontStyle: "italic",
  },
});
