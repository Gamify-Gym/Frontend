import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { Text } from "../general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { DietaWithMealsType } from "@/utils/mockData";

interface dietaSelectorProp {
  data: DietaWithMealsType[];
  onPress: (dieta: DietaWithMealsType) => void;
  onLongPress: (dieta: DietaWithMealsType, event: GestureResponderEvent) => void;
}

export default function DietaSelector({
  data,
  onPress,
  onLongPress,
}: dietaSelectorProp) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialDesignIcons name="food-apple" size={26} color="#b88aff" />
        <Text style={styles.title}>Minhas Dietas</Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialDesignIcons
            name="clipboard-text-outline"
            size={56}
            color="#8b5fbf"
            style={{ opacity: 0.6, marginBottom: 12 }}
          />
          <Text style={styles.emptyText}>Nenhuma dieta criada</Text>
          <Text style={styles.emptySubtext}>Toque no botão + para começar</Text>
        </View>
      ) : (
        <View style={styles.selectorContainer}>
          {data.map((dieta, index) => {
            const totalCalories = dieta.meals.reduce((sum, meal) => {
              return sum + meal.alimentos.reduce((mealSum, alimento) => mealSum + alimento.calories, 0);
            }, 0);
            
            const totalAlimentos = dieta.meals.reduce((sum, meal) => sum + meal.alimentos.length, 0);

            return (
              <View key={index} style={styles.selectorWrapper}>
                <Pressable
                  android_ripple={{ color: "rgba(139, 95, 191, 0.3)", borderless: false }}
                  style={({ pressed }) => [
                    styles.selector,
                    pressed && styles.selectorPressed,
                  ]}
                  onPress={() => onPress(dieta)}
                  onLongPress={(event) => {
                    Vibration.vibrate(75);
                    onLongPress(dieta, event);
                  }}
                >
                  <View style={styles.selectorContent}>
                    <View style={styles.selectorMain}>
                      <View style={styles.titleRow}>
                        <MaterialDesignIcons
                          name="silverware-fork-knife"
                          size={20}
                          color="#b88aff"
                        />
                        <Text style={styles.selectorLabel}>{dieta.name}</Text>
                      </View>
                      {dieta.description && (
                        <Text style={styles.selectorDescription} numberOfLines={2}>
                          {dieta.description}
                        </Text>
                      )}
                    </View>
                    <View style={styles.selectorDivisor}>
                      <View style={styles.statsContainer}>
                        <MaterialDesignIcons
                          name="format-list-bulleted"
                          size={15}
                          color="#9f7dcc"
                        />
                        <Text style={styles.statNumber}>
                          {totalAlimentos}
                        </Text>
                        <Text style={styles.statLabel}>alimentos</Text>
                      </View>
                      <View style={styles.verticalLine} />
                      <View style={styles.statsContainer}>
                        <MaterialDesignIcons
                          name="fire"
                          size={15}
                          color="#ff9a76"
                        />
                        <Text style={styles.statNumber}>
                          {Math.round(totalCalories)}
                        </Text>
                        <Text style={styles.statLabel}>kcal</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "92%",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(169, 112, 255, 0.25)",
    marginBottom: 20,
    alignSelf: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#e5d4f0",
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: "center",
    color: "#9f7dcc",
  },
  selectorContainer: {
    width: "100%",
    gap: 12,
    alignItems: "center",
  },
  selectorWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(43, 25, 70, 0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(169, 112, 255, 0.2)",
    shadowColor: "#a970ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
  },
  selector: {
    padding: 0,
  },
  selectorPressed: {
    backgroundColor: "rgba(58, 35, 85, 0.8)",
  },
  selectorContent: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },
  selectorMain: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  selectorLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
    letterSpacing: 0.3,
  },
  selectorDescription: {
    fontSize: 13,
    color: "#c5a8e0",
    lineHeight: 18,
    marginTop: 4,
  },
  selectorDivisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statsContainer: {
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#b88aff",
  },
  statLabel: {
    fontSize: 10,
    color: "#9f7dcc",
    fontWeight: "500",
  },
  verticalLine: {
    width: 1.5,
    height: 28,
    backgroundColor: "rgba(169, 112, 255, 0.25)",
    borderRadius: 1,
  },
});