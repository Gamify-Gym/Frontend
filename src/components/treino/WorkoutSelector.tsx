import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { Text } from "../general";
import { TreinoType } from "../general/types";
import colors from "../general/Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type TreinoData = TreinoType[];

export default function TreinoSelector({
  treinoData,
  onPress,
  onLongPress,
}: {
  treinoData: TreinoData;
  onPress: (treino: TreinoType) => void;
  onLongPress: (treino: TreinoType, event: GestureResponderEvent) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialDesignIcons name="dumbbell" size={28} color="#df80ff" />
        <Text style={styles.title}>Meus Treinos</Text>
      </View>

      {treinoData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialDesignIcons
            name="clipboard-text-outline"
            size={64}
            color="#df80ff"
            style={{ opacity: 0.5, marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>Nenhum treino criado ainda</Text>
          <Text style={styles.emptySubtext}>Toque no botão + para começar</Text>
        </View>
      ) : (
        <View style={styles.selectorContainer}>
          {treinoData.map((treino, index) => (
            <View key={index} style={styles.selectorWrapper}>
              <Pressable
                android_ripple={{ color: "#4a1a7f", borderless: false }}
                style={({ pressed }) => [
                  styles.selector,
                  pressed && styles.selectorPressed,
                ]}
                onPress={() => onPress(treino)}
                onLongPress={(event) => {
                  Vibration.vibrate(75);
                  onLongPress(treino, event);
                }}
              >
                <View style={styles.selectorContent}>
                  <View style={styles.selectorMain}>
                    <View style={styles.titleRow}>
                      <MaterialDesignIcons
                        name="weight-lifter"
                        size={20}
                        color="#df80ff"
                      />
                      <Text style={styles.selectorLabel}>{treino.name}</Text>
                    </View>
                    {treino.description && (
                      <Text
                        style={styles.selectorDescription}
                        numberOfLines={2}
                      >
                        {treino.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.selectorDivisor}>
                    <View style={styles.statsContainer}>
                      <MaterialDesignIcons
                        name="format-list-bulleted"
                        size={16}
                        color="#df80ff"
                      />
                      <Text style={styles.statNumber}>
                        {treino.totalExercises}
                      </Text>
                      <Text style={styles.statLabel}>exercícios</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.statsContainer}>
                      <MaterialDesignIcons
                        name="counter"
                        size={16}
                        color="#df80ff"
                      />
                      <Text style={styles.statNumber}>
                        {treino.totalSeries}
                      </Text>
                      <Text style={styles.statLabel}>séries</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
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
  selectorDescription: {
    fontSize: 14,
    color: "#dfb7ff",
    lineHeight: 20,
    marginTop: 4,
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
