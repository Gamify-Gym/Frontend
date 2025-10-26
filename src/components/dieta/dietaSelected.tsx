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
import { DietaType, Alimento } from "../general/types";
import colors from "../general/Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

export default function DietaSelected({
  dieta,
  onLongPress,
}: {
  dieta: DietaType | null;
  onLongPress: (alimento: Alimento, event: GestureResponderEvent) => void;
}) {
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({}).current;

  useEffect(() => {
    if (dieta?.alimentos) {
      dieta.alimentos.forEach((alimento) => {
        if (!animatedValues[alimento.id]) {
          animatedValues[alimento.id] = new Animated.Value(0);
        }
      });

      Object.values(animatedValues).forEach((val) => val.setValue(0));

      const animations = dieta.alimentos.map((alimento) =>
        Animated.timing(animatedValues[alimento.id], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, animations).start();
    }
  }, [dieta]);

  if (!dieta) return null;

  const totalCalories = dieta.alimentos.reduce(
    (sum, alimento) => sum + alimento.calories,
    0
  );

  const totalProteins = dieta.alimentos.reduce(
    (sum, alimento) => sum + alimento.proteins,
    0
  );

  const totalCarbs = dieta.alimentos.reduce(
    (sum, alimento) => sum + alimento.carbs,
    0
  );

  const totalFats = dieta.alimentos.reduce(
    (sum, alimento) => sum + alimento.fats,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialDesignIcons
            name="silverware-fork-knife"
            size={32}
            color="#df80ff"
          />
          <Text style={styles.title}>{dieta.name}</Text>
        </View>
        <View style={styles.dietaStats}>
          <View style={styles.statBadge}>
            <MaterialDesignIcons
              name="food-apple"
              size={16}
              color="#df80ff"
            />
            <Text style={styles.statsText}>
              {dieta.alimentos.length} alimentos
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBadge}>
            <MaterialDesignIcons name="fire" size={16} color="#df80ff" />
            <Text style={styles.statsText}>{Math.round(totalCalories)} kcal</Text>
          </View>
        </View>

        {/* Macronutrients Summary */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <MaterialDesignIcons name="food-steak" size={18} color="#ff6b9d" />
            <Text style={styles.macroValue}>{Math.round(totalProteins)}g</Text>
            <Text style={styles.macroLabel}>Proteínas</Text>
          </View>
          <View style={styles.macroItem}>
            <MaterialDesignIcons name="bread-slice" size={18} color="#ffa64d" />
            <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
            <Text style={styles.macroLabel}>Carboidratos</Text>
          </View>
          <View style={styles.macroItem}>
            <MaterialDesignIcons name="water" size={18} color="#4dabff" />
            <Text style={styles.macroValue}>{Math.round(totalFats)}g</Text>
            <Text style={styles.macroLabel}>Gorduras</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.alimentoContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dieta.alimentos.map((alimento, index) => {
          const opacity = animatedValues[alimento.id] || new Animated.Value(0);

          return (
            <Animated.View
              key={index}
              style={[
                styles.alimentoCard,
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
                style={styles.alimentoPressable}
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(alimento, event);
                }}
              >
                <View style={styles.alimentoHeader}>
                  <View style={styles.alimentoNameRow}>
                    <MaterialDesignIcons
                      name="food"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.alimentoName}>{alimento.name}</Text>
                  </View>
                  <View style={styles.caloriesBadge}>
                    <MaterialDesignIcons
                      name="fire"
                      size={14}
                      color={colors.white}
                    />
                    <Text style={styles.badgeText}>
                      {Math.round(alimento.calories)} kcal
                    </Text>
                  </View>
                </View>

                <View style={styles.alimentoDetails}>
                  <View style={styles.nutrientGrid}>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientLabel}>Proteínas</Text>
                      <Text style={styles.nutrientValue}>
                        {Math.round(alimento.proteins)}g
                      </Text>
                    </View>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientLabel}>Carboidratos</Text>
                      <Text style={styles.nutrientValue}>
                        {Math.round(alimento.carbs)}g
                      </Text>
                    </View>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientLabel}>Gorduras</Text>
                      <Text style={styles.nutrientValue}>
                        {Math.round(alimento.fats)}g
                      </Text>
                    </View>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientLabel}>Fibras</Text>
                      <Text style={styles.nutrientValue}>
                        {Math.round(alimento.fibers)}g
                      </Text>
                    </View>
                  </View>
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
  dietaStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
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
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(223, 128, 255, 0.2)",
    gap: 8,
  },
  macroItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  macroLabel: {
    fontSize: 11,
    color: "#b8a3c9",
    fontWeight: "500",
  },
  alimentoContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 30,
  },
  alimentoCard: {
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
  alimentoPressable: {
    padding: 20,
  },
  alimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  alimentoNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  alimentoName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  caloriesBadge: {
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
  alimentoDetails: {
    gap: 8,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nutrientItem: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    minWidth: "22%",
    alignItems: "center",
  },
  nutrientLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  nutrientValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "700",
  },
});
