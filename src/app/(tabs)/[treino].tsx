import { Text } from "@/components/general";
import ParentView from "@/components/general/ParentView";
import { ExerciseType, TreinoType } from "@/components/general/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import colors from "@/components/general/Colors";
import ExerciseCard from "@/components/treino/ExerciseCard";

export default function TreinoCompleter() {
  const [completedExercises, setCompletedExercises] = useState<
    ExerciseType[] | null
  >(null);
  const [resetKey, setResetKey] = useState(0);
  const navigation = useNavigation();

  const { treino } = useLocalSearchParams();
  const data: TreinoType = JSON.parse(treino as string);

  useFocusEffect(
    useCallback(() => {
      setCompletedExercises(null);
      setResetKey((prev) => prev + 1);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        e.preventDefault();

        Alert.alert(
          "Sair do treino?",
          "Você tem certeza que deseja sair? Todo o progresso será perdido.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => {
                if (e?.data?.action) navigation.dispatch(e.data.action);
                else navigation.goBack();
              },
            },
          ]
        );
      };

      const unsubscribe = navigation.addListener(
        "beforeRemove",
        onBeforeRemove
      );
      return unsubscribe;
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        Alert.alert(
          "Sair do treino?",
          "Você tem certeza que deseja sair? Todo o progresso será perdido.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => {
                if (navigation.canGoBack()) navigation.goBack();
                else BackHandler.exitApp();
              },
            },
          ]
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
      return () => BackHandler;
    }, [navigation])
  );

  const handleCompleteExercise = (exercise: ExerciseType) => {
    setCompletedExercises(
      completedExercises ? [...completedExercises, exercise] : [exercise]
    );
  };

  return (
    <ParentView>
      <View style={style.mainContainer}>
        <View style={style.headerContainer}>
          <Text style={style.headerTitle}>{data.name}</Text>
          <Text style={style.headerSubtitle}>
            {data.exercises.length} exercícios
          </Text>
        </View>

        <ScrollView
          style={style.scrollContainer}
          contentContainerStyle={style.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {data.exercises.map((exercise, index) => (
            <ExerciseCard
              key={`${resetKey}-${index}`}
              exercise={exercise}
              onComplete={handleCompleteExercise}
            />
          ))}
        </ScrollView>
      </View>
    </ParentView>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1b1031",
    paddingTop: 60,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.pink,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondaryLightGray,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
});
