import { Text } from "@/components/general";
import Button from "@/components/general/Button";
import ParentView from "@/components/general/ParentView";
import { TreinoType } from "@/components/general/types";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TreinoCompleter() {
  const { treino } = useLocalSearchParams();
  const data: TreinoType = JSON.parse(treino as string);

  return (
    <ParentView>
      <View style={style.mainContainer}>
        <View style={style.contentContainer}>
          <Text>{data.complete}</Text>
          <Text>{data.description}</Text>
          <Text>{data.name}</Text>
          <Text>{data.totalExercises}</Text>
          <Text>{data.totalSeries}</Text>
          <Text>{JSON.stringify(data.exercises)}</Text>
        </View>
      </View>
    </ParentView>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});
