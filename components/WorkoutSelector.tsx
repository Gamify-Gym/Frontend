import { Pressable, StyleSheet, View } from "react-native";
import { Text } from ".";
import colors from "./Colors";

type Exercicio = {
  nome: string;
  repeticoes: number;
  series: number;
  complete: boolean;
};

export type TreinoType = {
  nome: string;
  exercicio: Exercicio[];
  complete: boolean;
  totalExercicio: number;
  totalSeries: number;
};

type TreinoData = TreinoType[];

export default function TreinoSelector({treinoData,onPress,} : {treinoData: TreinoData;onPress: (treino: TreinoType) => void;}) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.secondary,
      width: "90%",
      height: "50%",  
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      borderColor: colors.borderOnSecondary,
      borderWidth: 1,
      borderStyle: "solid",
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    selectorContainer: {
      width: "110%",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: 12,
    },
    selectorWrapper: {
      margin: 5,
      borderRadius: 12,
      overflow: "hidden",
    },
    selector: {
      height: 50,
      backgroundColor: colors.white,
      padding: 12,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      width: "95%",
      borderWidth: 1,
      borderColor: colors.borderOnWhite,
      borderRadius: 12,
    },
    selectorLabel: {
      fontSize: 18,
      fontWeight: "bold",
    },
    selectorDivisor: {
      justifyContent: "center",
      alignItems: "center",
    },
    line: {
      backgroundColor: "black",
      width: "100%",
      height: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treinos</Text>
      <View style={styles.selectorContainer}>
        {treinoData.map((treino, index) => (
          <View key={index} style={styles.selectorWrapper}>
            <Pressable
              android_ripple={{ borderless: true }}
              style={styles.selector}
              onPress={() => onPress(treino)}
            >
              <Text style={styles.selectorLabel}>{treino.nome}</Text>
              <View style={styles.selectorDivisor}>
                <Text>{treino.totalExercicio} Exercícios</Text>
                <View style={styles.line} />
                <Text>{treino.totalSeries} Séries</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
