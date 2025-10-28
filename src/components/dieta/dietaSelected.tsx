import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Text } from "../general";
import { Alimento } from "../general/types";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DietaWithMealsType } from "../../utils/mockData";
import Svg, { Circle, G } from "react-native-svg";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const MEAL_CONFIG = {
  "Café da manhã": {
    icon: "coffee" as const,
    color: "#ff9a76",
    gradient: ["#ff9a76", "#ff6b9d"],
  },
  "Almoço": {
    icon: "silverware-fork-knife" as const,
    color: "#ffa64d",
    gradient: ["#ffa64d", "#ff9a76"],
  },
  "Lanche": {
    icon: "cookie" as const,
    color: "#b88aff",
    gradient: ["#b88aff", "#9f7dcc"],
  },
  "Janta": {
    icon: "moon-waning-crescent" as const,
    color: "#4dabff",
    gradient: ["#4dabff", "#6b9dff"],
  },
  "Outros": {
    icon: "food-apple" as const,
    color: "#9f7dcc",
    gradient: ["#9f7dcc", "#8b5fbf"],
  },
};

export default function DietaSelected({
  dieta,
  onLongPress,
}: {
  dieta: DietaWithMealsType | null;
  onLongPress: (alimento: Alimento, event: GestureResponderEvent) => void;
}) {
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    if (dieta?.meals) {
      dieta.meals.forEach((meal) => {
        if (!animatedValues[meal.id]) {
          animatedValues[meal.id] = new Animated.Value(0);
        }
      });
    }
  }, [dieta]);

  const toggleMeal = useCallback((mealId: string) => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    
    setExpandedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
        if (animatedValues[mealId]) {
          Animated.timing(animatedValues[mealId], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      } else {
        newSet.add(mealId);
        if (animatedValues[mealId]) {
          Animated.timing(animatedValues[mealId], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
      return newSet;
    });
  }, []); 

  const dailyTotals = useMemo(() => {
    if (!dieta) return { calories: 0, proteins: 0, carbs: 0, fats: 0 };
    
    return dieta.meals.reduce(
      (acc, meal) => {
        const mealTotal = meal.alimentos.reduce(
          (mealAcc, alimento) => ({
            calories: mealAcc.calories + alimento.calories,
            proteins: mealAcc.proteins + alimento.proteins,
            carbs: mealAcc.carbs + alimento.carbs,
            fats: mealAcc.fats + alimento.fats,
          }),
          { calories: 0, proteins: 0, carbs: 0, fats: 0 }
        );
        return {
          calories: acc.calories + mealTotal.calories,
          proteins: acc.proteins + mealTotal.proteins,
          carbs: acc.carbs + mealTotal.carbs,
          fats: acc.fats + mealTotal.fats,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );
  }, [dieta]);

  if (!dieta) return null;

  return (
    <View style={styles.container}>
      {/* Header com nome da dieta */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialDesignIcons name="silverware-fork-knife" size={28} color="#b88aff" />
          <Text style={styles.title}>{dieta.name}</Text>
        </View>
        {dieta.description && (
          <Text style={styles.description}>{dieta.description}</Text>
        )}
      </View>

      {/* Metas Diárias */}
      {dieta.dailyCalorieGoal && (
        <View style={styles.dailyGoalsContainer}>
          <View style={styles.goalsHeader}>
            <MaterialDesignIcons name="target" size={20} color="#b88aff" />
            <Text style={styles.goalsTitle}>Metas do Dia</Text>
          </View>
          <View style={styles.goalsGrid}>
            <View style={styles.goalItem}>
              <MaterialDesignIcons name="fire" size={20} color="#ff9a76" />
              <Text style={styles.goalValue}>
                {Math.round(dailyTotals.calories)}/{dieta.dailyCalorieGoal}
              </Text>
              <Text style={styles.goalLabel}>kcal</Text>
              <View style={styles.progressBarSmall}>
                <View
                  style={[
                    styles.progressFillSmall,
                    {
                      width: `${Math.min(
                        (dailyTotals.calories / dieta.dailyCalorieGoal) * 100,
                        100
                      )}%`,
                      backgroundColor: "#ff9a76",
                    },
                  ]}
                />
              </View>
            </View>

            {dieta.dailyProteinGoal && (
              <View style={styles.goalItem}>
                <MaterialDesignIcons name="food-steak" size={20} color="#ff6b9d" />
                <Text style={styles.goalValue}>
                  {Math.round(dailyTotals.proteins)}/{dieta.dailyProteinGoal}g
                </Text>
                <Text style={styles.goalLabel}>proteínas</Text>
                <View style={styles.progressBarSmall}>
                  <View
                    style={[
                      styles.progressFillSmall,
                      {
                        width: `${Math.min(
                          (dailyTotals.proteins / dieta.dailyProteinGoal) * 100,
                          100
                        )}%`,
                        backgroundColor: "#ff6b9d",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {dieta.dailyCarbGoal && (
              <View style={styles.goalItem}>
                <MaterialDesignIcons name="bread-slice" size={20} color="#ffa64d" />
                <Text style={styles.goalValue}>
                  {Math.round(dailyTotals.carbs)}/{dieta.dailyCarbGoal}g
                </Text>
                <Text style={styles.goalLabel}>carbos</Text>
                <View style={styles.progressBarSmall}>
                  <View
                    style={[
                      styles.progressFillSmall,
                      {
                        width: `${Math.min(
                          (dailyTotals.carbs / dieta.dailyCarbGoal) * 100,
                          100
                        )}%`,
                        backgroundColor: "#ffa64d",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {dieta.dailyFatGoal && (
              <View style={styles.goalItem}>
                <MaterialDesignIcons name="water" size={20} color="#4dabff" />
                <Text style={styles.goalValue}>
                  {Math.round(dailyTotals.fats)}/{dieta.dailyFatGoal}g
                </Text>
                <Text style={styles.goalLabel}>gorduras</Text>
                <View style={styles.progressBarSmall}>
                  <View
                    style={[
                      styles.progressFillSmall,
                      {
                        width: `${Math.min(
                          (dailyTotals.fats / dieta.dailyFatGoal) * 100,
                          100
                        )}%`,
                        backgroundColor: "#4dabff",
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      )}
{/* Gráfico de Pizza dos Macronutrientes */}
      {(dailyTotals.proteins > 0 || dailyTotals.carbs > 0 || dailyTotals.fats > 0) && (
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <MaterialDesignIcons name="chart-donut" size={20} color="#b88aff" />
            <Text style={styles.chartTitle}>Distribuição de Macros</Text>
          </View>
          
          <View style={styles.chartWrapper}>
            <Svg width={200} height={200}>
              <G rotation="-90" origin="100, 100">
                <Circle
                  cx={100}
                  cy={100}
                  r={85}
                  stroke="#4dabff"
                  strokeWidth={30}
                  fill="none"
                  strokeDasharray={`${(dailyTotals.fats / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 534} 534`}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                
                <Circle
                  cx={100}
                  cy={100}
                  r={85}
                  stroke="#ffa64d"
                  strokeWidth={30}
                  fill="none"
                  strokeDasharray={`${(dailyTotals.carbs / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 534} 534`}
                  strokeDashoffset={-((dailyTotals.fats / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 534)}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                
                <Circle
                  cx={100}
                  cy={100}
                  r={85}
                  stroke="#ff6b9d"
                  strokeWidth={30}
                  fill="none"
                  strokeDasharray={`${(dailyTotals.proteins / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 534} 534`}
                  strokeDashoffset={-((dailyTotals.fats + dailyTotals.carbs) / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 534}
                  strokeLinecap="round"
                  opacity={0.9}
                />
              </G>
            </Svg>
            
            <View style={styles.chartCenter}>
              <MaterialDesignIcons name="fire" size={32} color="#ff9a76" />
              <Text style={styles.chartCalories}>
                {Math.round(dailyTotals.proteins * 4 + dailyTotals.carbs * 4 + dailyTotals.fats * 9)}
              </Text>
              <Text style={styles.chartLabel}>kcal totais</Text>
            </View>
          </View>
          
          <View style={styles.chartLegend}>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#ff6b9d' }]} />
              <Text style={styles.chartLegendText}>Proteínas</Text>
              <Text style={styles.chartLegendValue}>{Math.round(dailyTotals.proteins)}g</Text>
              <Text style={styles.chartLegendPercent}>
                {((dailyTotals.proteins / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 100).toFixed(0)}%
              </Text>
            </View>
            
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#ffa64d' }]} />
              <Text style={styles.chartLegendText}>Carboidratos</Text>
              <Text style={styles.chartLegendValue}>{Math.round(dailyTotals.carbs)}g</Text>
              <Text style={styles.chartLegendPercent}>
                {((dailyTotals.carbs / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 100).toFixed(0)}%
              </Text>
            </View>
            
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#4dabff' }]} />
              <Text style={styles.chartLegendText}>Gorduras</Text>
              <Text style={styles.chartLegendValue}>{Math.round(dailyTotals.fats)}g</Text>
              <Text style={styles.chartLegendPercent}>
                {((dailyTotals.fats / (dailyTotals.proteins + dailyTotals.carbs + dailyTotals.fats)) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>
      )}
      <View style={styles.mealsContainer}>
        {dieta.meals.map((meal) => {
          const isExpanded = expandedMeals.has(meal.id);
          const config = MEAL_CONFIG[meal.name];
          
          if (!animatedValues[meal.id]) {
            animatedValues[meal.id] = new Animated.Value(0);
          }
    
          const mealTotals = meal.alimentos.reduce(
            (acc, alimento) => ({
              calories: acc.calories + alimento.calories,
              proteins: acc.proteins + alimento.proteins,
              carbs: acc.carbs + alimento.carbs,
              fats: acc.fats + alimento.fats,
            }),
            { calories: 0, proteins: 0, carbs: 0, fats: 0 }
          );

          const rotateAnim = animatedValues[meal.id].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          });

          return (
            <View key={meal.id} style={styles.mealCardWrapper}>
              <Pressable
                style={[
                  styles.mealCard,
                  isExpanded && styles.mealCardExpanded,
                ]}
                onPress={() => toggleMeal(meal.id)}
                android_ripple={{ color: "rgba(184, 138, 255, 0.2)" }}
              >
                <View style={styles.mealCardHeader}>
                  <View style={styles.mealLeft}>
                    <Animated.View
                      style={[
                        styles.chevronContainer,
                        { transform: [{ rotate: rotateAnim }] },
                      ]}
                    >
                      <MaterialDesignIcons
                        name="chevron-down"
                        size={28}
                        color="#b88aff"
                      />
                    </Animated.View>

                    <View style={styles.mealInfo}>
                      <View style={styles.mealTitleRow}>
                        <View
                          style={[
                            styles.mealIconContainer,
                            { backgroundColor: `${config.color}20` },
                          ]}
                        >
                          <MaterialDesignIcons
                            name={config.icon}
                            size={22}
                            color={config.color}
                          />
                        </View>
                        <Text style={styles.mealName}>{meal.name}</Text>
                      </View>
                      {meal.time && (
                        <View style={styles.mealTimeRow}>
                          <MaterialDesignIcons
                            name="clock-outline"
                            size={13}
                            color="#c5a8e0"
                          />
                          <Text style={styles.mealTime}>{meal.time}</Text>
                        </View>
                      )}
                      {meal.alimentos.length > 0 && (
                        <Text style={styles.mealItemCount}>
                          {meal.alimentos.length} {meal.alimentos.length === 1 ? 'alimento' : 'alimentos'}
                        </Text>
                      )}
                    </View>
                  </View>

                  <Pressable
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MaterialDesignIcons name="plus" size={24} color="#ffffff" />
                  </Pressable>
                </View>

                {/* Mini stats quando não expandido */}
                {!isExpanded && meal.alimentos.length > 0 && (
                  <View style={styles.miniStatsContainer}>
                    <View style={styles.miniStat}>
                      <MaterialDesignIcons name="fire" size={14} color="#ff9a76" />
                      <Text style={styles.miniStatText}>
                        {Math.round(mealTotals.calories)} kcal
                      </Text>
                    </View>
                    <View style={styles.miniStatDivider} />
                    <View style={styles.miniStat}>
                      <MaterialDesignIcons name="food-steak" size={14} color="#ff6b9d" />
                      <Text style={styles.miniStatText}>
                        {Math.round(mealTotals.proteins)}g
                      </Text>
                    </View>
                    <View style={styles.miniStatDivider} />
                    <View style={styles.miniStat}>
                      <MaterialDesignIcons name="bread-slice" size={14} color="#ffa64d" />
                      <Text style={styles.miniStatText}>
                        {Math.round(mealTotals.carbs)}g
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>

              {/* Conteúdo Expandido (Alimentos) */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  {meal.alimentos.length === 0 ? (
                    <View style={styles.emptyMealState}>
                      <MaterialDesignIcons
                        name="food-off"
                        size={48}
                        color="#9f7dcc"
                        style={{ opacity: 0.5 }}
                      />
                      <Text style={styles.emptyMealText}>
                        Nenhum alimento adicionado
                      </Text>
                      <Text style={styles.emptyMealSubtext}>
                        Toque no botão + para adicionar
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* Stats completas da refeição */}
                      <View style={styles.expandedStatsContainer}>
                        <View style={styles.expandedStatItem}>
                          <MaterialDesignIcons name="fire" size={18} color="#ff9a76" />
                          <View style={styles.expandedStatInfo}>
                            <Text style={styles.expandedStatValue}>
                              {Math.round(mealTotals.calories)}
                            </Text>
                            <Text style={styles.expandedStatLabel}>kcal</Text>
                          </View>
                        </View>

                        <View style={styles.expandedStatDivider} />

                        <View style={styles.expandedStatItem}>
                          <MaterialDesignIcons name="food-steak" size={18} color="#ff6b9d" />
                          <View style={styles.expandedStatInfo}>
                            <Text style={styles.expandedStatValue}>
                              {Math.round(mealTotals.proteins)}g
                            </Text>
                            <Text style={styles.expandedStatLabel}>proteínas</Text>
                          </View>
                        </View>

                        <View style={styles.expandedStatDivider} />

                        <View style={styles.expandedStatItem}>
                          <MaterialDesignIcons name="bread-slice" size={18} color="#ffa64d" />
                          <View style={styles.expandedStatInfo}>
                            <Text style={styles.expandedStatValue}>
                              {Math.round(mealTotals.carbs)}g
                            </Text>
                            <Text style={styles.expandedStatLabel}>carbos</Text>
                          </View>
                        </View>

                        <View style={styles.expandedStatDivider} />

                        <View style={styles.expandedStatItem}>
                          <MaterialDesignIcons name="water" size={18} color="#4dabff" />
                          <View style={styles.expandedStatInfo}>
                            <Text style={styles.expandedStatValue}>
                              {Math.round(mealTotals.fats)}g
                            </Text>
                            <Text style={styles.expandedStatLabel}>gorduras</Text>
                          </View>
                        </View>
                      </View>

                      {/* Lista de Alimentos */}
                      <View style={styles.alimentosListContainer}>
                        {meal.alimentos.map((alimento, index) => (
                          <Pressable
                            key={`${alimento.id}-${index}`}
                            style={styles.alimentoCard}
                            onLongPress={(event) => onLongPress(alimento, event)}
                            android_ripple={{ color: "rgba(139, 95, 191, 0.1)" }}
                          >
                            <View style={styles.alimentoCardContent}>
                              <View style={styles.alimentoHeader}>
                                <View style={styles.alimentoNameRow}>
                                  <View style={styles.foodIconWrapper}>
                                    <MaterialDesignIcons
                                      name="food-apple"
                                      size={20}
                                      color="#b88aff"
                                    />
                                  </View>
                                  <Text style={styles.alimentoName} numberOfLines={2}>
                                    {alimento.name}
                                  </Text>
                                </View>
                                <View style={styles.caloriesBadge}>
                                  <MaterialDesignIcons
                                    name="fire"
                                    size={12}
                                    color="#ffffff"
                                  />
                                  <Text style={styles.badgeText}>
                                    {Math.round(alimento.calories)}
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.alimentoDetails}>
                                <View style={styles.nutrientGrid}>
                                  <View style={[styles.nutrientItem, styles.proteinItem]}>
                                    <Text style={styles.nutrientLabel}>Proteínas</Text>
                                    <Text style={[styles.nutrientValue, styles.proteinValue]}>
                                      {Math.round(alimento.proteins)}g
                                    </Text>
                                  </View>

                                  <View style={[styles.nutrientItem, styles.carbsItem]}>
                                    <Text style={styles.nutrientLabel}>Carbos</Text>
                                    <Text style={[styles.nutrientValue, styles.carbsValue]}>
                                      {Math.round(alimento.carbs)}g
                                    </Text>
                                  </View>

                                  <View style={[styles.nutrientItem, styles.fatsItem]}>
                                    <Text style={styles.nutrientLabel}>Gorduras</Text>
                                    <Text style={[styles.nutrientValue, styles.fatsValue]}>
                                      {Math.round(alimento.fats)}g
                                    </Text>
                                  </View>

                                  {alimento.fibers > 0 && (
                                    <View style={[styles.nutrientItem, styles.fibersItem]}>
                                      <Text style={styles.nutrientLabel}>Fibras</Text>
                                      <Text style={[styles.nutrientValue, styles.fibersValue]}>
                                        {Math.round(alimento.fibers)}g
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "92%",
    alignSelf: "center",
    marginBottom: 20,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.4,
  },
  description: {
    fontSize: 13,
    color: "#c5a8e0",
    textAlign: "center",
    marginTop: 4,
  },
  dailyGoalsContainer: {
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(169, 112, 255, 0.25)",
    marginBottom: 20,
  },
  goalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  goalsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  goalItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(43, 25, 70, 0.4)",
    padding: 12,
    borderRadius: 12,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  goalLabel: {
    fontSize: 10,
    color: "#9f7dcc",
    fontWeight: "500",
  },
  progressBarSmall: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(43, 25, 70, 0.6)",
    borderRadius: 4,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFillSmall: {
    height: "100%",
    borderRadius: 4,
  },
  mealsContainer: {
    gap: 12,
  },
  mealCardWrapper: {
    width: "100%",
  },
  mealCard: {
    backgroundColor: "rgba(25, 15, 45, 0.7)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(169, 112, 255, 0.4)",
    padding: 18,
    shadowColor: "#a970ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
   
  },
  mealCardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  mealCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  chevronContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
    gap: 4,
  },
  mealTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mealIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mealName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  mealTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  mealTime: {
    fontSize: 12,
    color: "#c5a8e0",
    fontWeight: "500",
  },
  mealItemCount: {
    fontSize: 11,
    color: "#9f7dcc",
    fontWeight: "500",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#b88aff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#b88aff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  miniStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(169, 112, 255, 0.2)",
    gap: 12,
  },
  miniStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e5d4f0",
  },
  miniStatDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(169, 112, 255, 0.3)",
  },
  expandedContent: {
    backgroundColor: "rgba(20, 12, 35, 0.8)",
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "rgba(169, 112, 255, 0.4)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
  expandedStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(43, 25, 70, 0.5)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  expandedStatItem: {
    alignItems: "center",
    gap: 6,
  },
  expandedStatInfo: {
    alignItems: "center",
  },
  expandedStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  expandedStatLabel: {
    fontSize: 10,
    color: "#9f7dcc",
    fontWeight: "500",
  },
  expandedStatDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: "rgba(169, 112, 255, 0.3)",
  },
  alimentosListContainer: {
    gap: 10,
  },
  emptyMealState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyMealText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#c5a8e0",
  },
  emptyMealSubtext: {
    fontSize: 12,
    color: "#9f7dcc",
  },
  alimentoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#a970ff",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: "rgba(139, 95, 191, 0.15)",
  },
  alimentoCardContent: {
    padding: 14,
  },
  alimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  alimentoNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  foodIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(139, 95, 191, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  alimentoName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2a1a45",
    flex: 1,
  },
  caloriesBadge: {
    backgroundColor: "#8b5fbf",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    shadowColor: "#8b5fbf",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  alimentoDetails: {
    gap: 8,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  nutrientItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    minWidth: "22%",
    alignItems: "center",
  },
  proteinItem: {
    backgroundColor: "rgba(255, 107, 157, 0.08)",
    borderColor: "rgba(255, 107, 157, 0.25)",
  },
  carbsItem: {
    backgroundColor: "rgba(255, 166, 77, 0.08)",
    borderColor: "rgba(255, 166, 77, 0.25)",
  },
  fatsItem: {
    backgroundColor: "rgba(77, 171, 255, 0.08)",
    borderColor: "rgba(77, 171, 255, 0.25)",
  },
  fibersItem: {
    backgroundColor: "rgba(139, 95, 191, 0.08)",
    borderColor: "rgba(139, 95, 191, 0.25)",
  },
  nutrientLabel: {
    fontSize: 9,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  proteinValue: {
    color: "#ff6b9d",
  },
  carbsValue: {
    color: "#ffa64d",
  },
  fatsValue: {
    color: "#4dabff",
  },
  fibersValue: {
    color: "#8b5fbf",
  },
  fibersValue: {
    color: "#8b5fbf",
  },
  // ADICIONAR AQUI ⬇️
  chartSection: {
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(169, 112, 255, 0.25)",
    marginBottom: 20,
    width: "92%",
    alignSelf: "center",
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  chartWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  chartCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  chartCalories: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 4,
  },
  chartLabel: {
    fontSize: 13,
    color: "#9f7dcc",
    fontWeight: "600",
  },
  chartLegend: {
    width: "100%",
    gap: 10,
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(43, 25, 70, 0.4)",
    padding: 12,
    borderRadius: 12,
  },
  chartLegendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  chartLegendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  chartLegendValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#b88aff",
    marginRight: 8,
  },
  chartLegendPercent: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9f7dcc",
    minWidth: 40,
    textAlign: "right",
  },
});
