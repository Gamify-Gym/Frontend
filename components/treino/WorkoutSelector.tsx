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
    backgroundColor: colors.secondary,
    width: "90%",
    minHeight: "50%",
    maxHeight: "70%",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderColor: colors.borderOnSecondary,
    borderWidth: 1,
    borderStyle: "solid",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: colors.gray,
  },
  selectorContainer: {
    width: "100%",
    gap: 12,
  },
  selectorWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selector: {
    backgroundColor: colors.white,
    padding: 0,
  },
  selectorPressed: {
    backgroundColor: colors.secondaryLight,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  selectorDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.8,
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
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderOnWhite,
  },
});
