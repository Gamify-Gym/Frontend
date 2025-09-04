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


