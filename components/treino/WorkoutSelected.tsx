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
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

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
        <View style={styles.titleRow}>
          <MaterialDesignIcons name="clipboard-check" size={32} color="#df80ff" />
          <Text style={styles.title}>{treino.name}</Text>
        </View>
        <View style={styles.treinoStats}>
          <View style={styles.statBadge}>
            <MaterialDesignIcons name="format-list-numbered" size={16} color="#df80ff" />
            <Text style={styles.statsText}>
              {treino.exercises.length} exercícios
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBadge}>
            <MaterialDesignIcons name="counter" size={16} color="#df80ff" />
            <Text style={styles.statsText}>
              {treino.totalSeries} séries
            </Text>
          </View>
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
                android_ripple={{ color: colors.hover }}
                style={styles.exercisePressable}
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(exercise, event);
                }}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNameRow}>
                    <MaterialDesignIcons name="dumbbell" size={20} color={colors.primary} />
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                  </View>
                  <View style={styles.exerciseBadge}>
                    <MaterialDesignIcons name="numeric" size={14} color={colors.white} />
                    <Text style={styles.badgeText}>
                      {exercise.series} séries
                    </Text>
                  </View>
                </View>
                <View style={styles.exerciseDetails}>
                  <View style={styles.detailRow}>
                    <MaterialDesignIcons name="repeat" size={16} color={colors.primary} />
                    <Text style={styles.exerciseInfo}>
                      {exercise.repeticoes} repetições
                    </Text>
                  </View>
                  {exercise.muscles && (
                    <View style={styles.muscleRow}>
                      <MaterialDesignIcons name="arm-flex" size={16} color={colors.textSecondary} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  treinoStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(43, 11, 79, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.2)",
  },
  statsText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },
  statDivider: {
    width: 2,
    height: 16,
    backgroundColor: "rgba(223, 128, 255, 0.4)",
    borderRadius: 1,
  },
  exerciseContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 30,
  },
  exerciseCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    overflow: "hidden",
  },
  exercisePressable: {
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  exerciseNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  exerciseBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  exerciseDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseInfo: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.background,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  muscleText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
