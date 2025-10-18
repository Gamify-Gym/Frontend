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
      <Text style={styles.title}>Treinos</Text>

      {treinoData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum treino, vamos criar alguns?
          </Text>
          <Text style={styles.emptySubtext}>Toque no botão + para começar</Text>
        </View>
      ) : (
        <View style={styles.selectorContainer}>
          {treinoData.map((treino, index) => (
            <View key={index} style={styles.selectorWrapper}>
              <Pressable
                android_ripple={{ color: colors.lightGray, borderless: false }}
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
                    <Text style={styles.selectorLabel}>{treino.name}</Text>
                    {treino.description && (
                      <Text
                        style={styles.selectorDescription}
                        numberOfLines={1}
                      >
                        {treino.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.selectorDivisor}>
                    <View style={styles.statsContainer}>
                      <Text style={styles.statNumber}>
                        {treino.totalExercises}
                      </Text>
                      <Text style={styles.statLabel}>Exercícios</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.statsContainer}>
                      <Text style={styles.statNumber}>
                        {treino.totalSeries}
                      </Text>
                      <Text style={styles.statLabel}>Séries</Text>
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
    paddingHorizontal: 20, 
    paddingVertical: 36,
    alignItems: "center", 
    backgroundColor: colors.darkPurple, 
    borderRadius: 20,
    borderWidth: 0.54,
    borderColor: "#ffffff", 
    marginBottom: 20, 
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffffff",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
    color: "#ccc",
  },
  selectorContainer: {
    width: "100%",
    gap: 12,
  },
  selectorWrapper: {
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: "#2b0b4f",
  borderWidth: 0.4,
  borderColor: "#ffffff", 
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
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
  },
  selectorMain: {
    flex: 1,
    marginRight: 16,
  },
  selectorLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  selectorDescription: {
    fontSize: 14,
    color: "#dfb7ff",
    opacity: 0.85,
  },
  selectorDivisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statsContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#df80ff",
  },
  statLabel: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 2,
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: "#7a2be0",
  },
});