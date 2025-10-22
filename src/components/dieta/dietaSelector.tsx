import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { DietaType } from "../general/types";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Text } from "../general";

interface dietaSelectorProp {
  data: DietaType[];
  onPress: (dieta: DietaType) => void;
  onLongPress: (dieta: DietaType, event: GestureResponderEvent) => void;
}

export default function DietaSelector({
  data,
  onPress,
  onLongPress,
}: dietaSelectorProp) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialDesignIcons
          name="silverware-fork-knife"
          size={28}
          color="#df80ff"
        />
        <Text style={styles.title}>Minhas Dietas</Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialDesignIcons
            name="clipboard-text-outline"
            size={64}
            color="#df80ff"
            style={{ opacity: 0.5, marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>Nenhuma dieta criada ainda</Text>
          <Text style={styles.emptySubtext}>Toque no botão + para começar</Text>
        </View>
      ) : (
        <View style={styles.selectorContainer}>
          {data.map((dieta, index) => {
            const totalCalories = dieta.alimentos.reduce(
              (sum, alimento) => sum + alimento.calories,
              0
            );

            return (
              <View key={index} style={styles.selectorWrapper}>
                <Pressable
                  android_ripple={{ color: "#4a1a7f", borderless: false }}
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
                          name="food-apple"
                          size={20}
                          color="#df80ff"
                        />
                        <Text style={styles.selectorLabel}>{dieta.name}</Text>
                      </View>
                    </View>
                    <View style={styles.selectorDivisor}>
                      <View style={styles.statsContainer}>
                        <MaterialDesignIcons
                          name="format-list-bulleted"
                          size={16}
                          color="#df80ff"
                        />
                        <Text style={styles.statNumber}>
                          {dieta.alimentos.length}
                        </Text>
                        <Text style={styles.statLabel}>alimentos</Text>
                      </View>
                      <View style={styles.verticalLine} />
                      <View style={styles.statsContainer}>
                        <MaterialDesignIcons
                          name="fire"
                          size={16}
                          color="#df80ff"
                        />
                        <Text style={styles.statNumber}>
                          {totalCalories}
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
    width: "90%",
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    marginBottom: 24,
    elevation: 8,
    alignSelf: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#b8a3c9",
  },
  selectorContainer: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  selectorWrapper: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#2b0b4f",
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.25)",
    elevation: 4,
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  selector: {
    padding: 0,
  },
  selectorPressed: {
    backgroundColor: "#3a0f66",
  },
  selectorContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
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
    fontSize: 19,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  selectorDivisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  statsContainer: {
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#df80ff",
  },
  statLabel: {
    fontSize: 11,
    color: "#b8a3c9",
    fontWeight: "500",
  },
  verticalLine: {
    width: 2,
    height: 32,
    backgroundColor: "rgba(223, 128, 255, 0.3)",
    borderRadius: 1,
  },
});
