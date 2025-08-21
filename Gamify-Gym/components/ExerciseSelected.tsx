import { Pressable, StyleSheet, View } from "react-native";
import { TreinoType } from "./TreinoSelector";
import { Text } from ".";
import colors from "./Colors";
import { useEffect } from "react";

export default function ExerciseSelected({
  treino,
}: {
  treino: TreinoType | null;
}) {
  useEffect(() => {
    console.log(treino);
  }, [treino]);
  if (treino === null) return;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.secondary,
      width: "80%",
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      borderColor: colors.borderOnSecondary,
      borderWidth: 1,
      borderStyle: "solid",
      elevation: 3,
    },
    titleContainer: {
      width: "100%",
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
    },
    selectorContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: 12,
    },
    selectorWrapper: {
      margin: 5,
      borderRadius: 12,
      overflow: "hidden",
      width: "100%",
    },
    selector: {
      height: 50,
      backgroundColor: colors.white,
      padding: 12,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      width: "100%",
      borderWidth: 1,
      borderColor: colors.borderOnWhite,
      borderRadius: 12,
    },
    selectorLabel: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{treino.nome}</Text>
        <View style={styles.selectorContainer}>
          {treino.exercicio.map((exercicio, index) => (
            <View style={styles.selectorWrapper} key={index}>
              <Pressable
                style={styles.selector}
                android_ripple={{ borderless: true }}
              >
                <View>
                  <Text style={styles.selectorLabel}>{exercicio.nome}</Text>
                  <Text>{exercicio.repeticoes} Repetições</Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
