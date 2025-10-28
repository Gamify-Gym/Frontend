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
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

export default function WorkoutSelected({
  treino,
  onLongPress,
  startTreino,
}: {
  treino: TreinoType | null;
  onLongPress: (exercise: ExerciseType, event: GestureResponderEvent) => void;
  startTreino: (treino: TreinoType) => void;
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

      Animated.stagger(80, animations).start();
    }
  }, [treino]);

  if (!treino) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialDesignIcons
            name="clipboard-check"
            size={28}
            color="#b88aff"
          />
          <Text style={styles.title}>{treino.name}</Text>
        </View>
        
        <View style={styles.treinoStats}>
          <View style={styles.statBadge}>
            <MaterialDesignIcons
              name="format-list-numbered"
              size={14}
              color="#b88aff"
            />
            <Text style={styles.statsText}>
              {treino.exercises.length} exercícios
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBadge}>
            <MaterialDesignIcons name="counter" size={14} color="#ff9a76" />
            <Text style={styles.statsText}>{treino.totalSeries} séries</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {treino.exercises.length !== 0 && (
            <Pressable 
              style={styles.startButton}
              onPress={() => startTreino(treino)}
            >
              <MaterialDesignIcons name="play-circle" size={22} color="#ffffff" />
              <Text style={styles.startButtonText}>Iniciar Treino</Text>
            </Pressable>
          )}
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
                android_ripple={{ color: "rgba(139, 95, 191, 0.1)" }}
                style={styles.exercisePressable}
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(exercise, event);
                }}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNameRow}>
                    <View style={styles.exerciseIconWrapper}>
                      <MaterialDesignIcons
                        name="dumbbell"
                        size={18}
                        color="#8b5fbf"
                      />
                    </View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                  </View>
                  <View style={styles.exerciseBadge}>
                    <MaterialDesignIcons
                      name="counter"
                      size={13}
                      color="#ffffff"
                    />
                    <Text style={styles.badgeText}>
                      {exercise.series}x
                    </Text>
                  </View>
                </View>

                <View style={styles.exerciseDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <MaterialDesignIcons
                        name="repeat"
                        size={15}
                        color="#ff006fff"
                      />
                      <Text style={styles.detailValue}>{exercise.repeticoes}</Text>
                      <Text style={styles.detailLabel}>reps</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialDesignIcons
                        name="counter"
                        size={15}
                        color="#216dafff"
                      />
                      <Text style={styles.detailValue}>{exercise.series}</Text>
                      <Text style={styles.detailLabel}>séries</Text>
                    </View>
                  </View>
                  {exercise.muscles && (
                    <View style={styles.muscleRow}>
                      <MaterialDesignIcons
                        name="arm-flex"
                        size={14}
                        color="#9f7dcc"
                      />
                      <Text style={styles.muscleText}>{exercise.muscles}</Text>
                    </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(169, 112, 255, 0.25)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.4,
  },
  treinoStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(43, 25, 70, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(169, 112, 255, 0.2)",
  },
  statsText: {
    fontSize: 12,
    color: "#e5d4f0",
    fontWeight: "600",
  },
  statDivider: {
    width: 1.5,
    height: 14,
    backgroundColor: "rgba(169, 112, 255, 0.3)",
    borderRadius: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#8b5fbf",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: "#6a3fa0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  exerciseContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 30,
  },
  exerciseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#a970ff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(139, 95, 191, 0.15)",
    overflow: "hidden",
  },
  exercisePressable: {
    padding: 18,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  exerciseNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  exerciseIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(139, 95, 191, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2a1a45",
    flex: 1,
  },
  exerciseBadge: {
    backgroundColor: "#8b5fbf",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#8b5fbf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  exerciseDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 95, 191, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(139, 95, 191, 0.2)",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2a1a45",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(159, 125, 204, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(159, 125, 204, 0.25)",
  },
  muscleText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});