import WorkoutSelected from "@/components/treino/WorkoutSelected";
import TreinoSelector from "@/components/treino/WorkoutSelector";
import {
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { TreinoType, ExerciseType } from "@/components/general/types";
import EditMenu from "@/components/general/ContextMenu";
import FAB from "@/components/general/FAB";
import FormCreationDialogue from "@/components/treino/FormCreationDialogue";
import { useMenu } from "@/hooks/useMenu";
import { useWorkout } from "@/hooks/useWorkout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import ParentView from "@/components/general/ParentView";
import { router, useNavigation, useRouter } from "expo-router";

export default function Treino() {
  const [selectedTreino, setSelectedTreino] = useState<TreinoType | null>(null);
  const [creationMenuVisible, setCreationMenuVisible] = useState(false);
  const [creationType, setCreationType] = useState<
    "treino" | "exercise" | null
  >(null);

  const [treinoTitle, setTreinoTitle] = useState("");
  const [treinoDescription, setTreinoDescription] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseMuscles, setExerciseMuscles] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");
  const [exerciseSeries, setExerciseSeries] = useState("");
  const [exerciseWorkout, setExerciseWorkout] = useState("");

  const router = useRouter();

  const {
    menuVisible,
    menuCoords,
    selectedItem,
    setSelectedItem,
    handleLongPress,
    closeMenu,
  } = useMenu();

  const { token } = useAuth();

  const { treino, setRerun } = useWorkout();

  const handleTreinoChange = (treino: TreinoType) => {
    setSelectedTreino(null);
    setTimeout(() => setSelectedTreino(treino), 0);
  };

  const handleItemLongPress = (
    item: ExerciseType | TreinoType,
    event: GestureResponderEvent
  ) => {
    setSelectedItem(item);
    handleLongPress(event);
  };

  const closeCreationMenu = () => {
    setCreationMenuVisible(false);
    setCreationType(null);
  };

  const handleCreate = async () => {
    try {
      if (creationType === "treino") {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/training/workout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
            body: JSON.stringify({
              name: treinoTitle,
              description: treinoDescription,
            }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error response:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        let responseData;
        const responseText = await res.text();

        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            console.warn("Response is not JSON:", responseText);
          }
        }

        setRerun((prev) => prev + 1);
        Alert.alert("Sucesso!", "Novo Treino criado com sucesso!");
      }

      if (creationType === "exercise") {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/training/exercise`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
            body: JSON.stringify({
              nameExercise: exerciseName,
              muscles: exerciseMuscles,
              repeticoes: exerciseReps,
              series: exerciseSeries,
              workout_name: exerciseWorkout,
            }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error response:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        let responseData;
        const responseText = await res.text();

        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            console.warn("Response is not JSON:", responseText);
          }
        }

        setRerun((prev) => prev + 1);
        Alert.alert("Sucesso!", "Novo exercício criado com sucesso!");
      }
    } catch (error) {
      console.error("Create error:", error);
      Alert.alert(
        "Erro!",
        error instanceof Error ? error.message : "Erro ao criar novo item."
      );
    } finally {
      closeCreationMenu();
    }
  };

  // const handleAlter = async () => {
  //   try {
  //     if (selectedItem) {
  //
  //    }
  //    }
  //}

  const MENU_ACTIONS = [
    {
      label: "Editar",
      action: () => console.log("Editar " + selectedItem?.name),
    },
    {
      label: "Apagar",
      action: () => console.log("Apagar " + selectedItem?.name),
    },
  ];

  const FAB_OPTIONS = [
    {
      label: "Treino",
      action: () => {
        setCreationType("treino");
        setCreationMenuVisible(true);
      },
      icon: "add" as const,
    },
    {
      label: "Exercício",
      action: () => {
        setCreationType("exercise");
        setCreationMenuVisible(true);
      },
      icon: "add" as const,
    },
  ];

  const FORM_OPTIONS =
    creationType === "treino"
      ? [
          {
            placeholder: "titulo",
            value: treinoTitle,
            onChange: setTreinoTitle,
          },
          {
            placeholder: "descrição",
            value: treinoDescription,
            onChange: setTreinoDescription,
          },
        ]
      : creationType === "exercise"
      ? [
          {
            placeholder: "nome",
            value: exerciseName,
            onChange: setExerciseName,
          },
          {
            placeholder: "músculos",
            value: exerciseMuscles,
            onChange: setExerciseMuscles,
          },
          {
            placeholder: "repetições",
            value: exerciseReps,
            onChange: setExerciseReps,
          },
          {
            placeholder: "séries",
            value: exerciseSeries,
            onChange: setExerciseSeries,
          },
          {
            type: "select" as const,
            placeholder: "treino vinculado",
            value: exerciseWorkout,
            onChange: setExerciseWorkout,
            options: treino.map((t: TreinoType) => ({
              label: t.name,
              value: t.name,
            })),
          },
        ]
      : [];

  const handleStartTreino = (treino: TreinoType) => {
    router.push({
      pathname: "/(tabs)/[treino]",
      params: { treino: JSON.stringify(treino) },
    });
  };

  return (
    <ParentView>
      <Pressable style={styles.container} onPress={closeMenu}>
        {menuVisible && (
          <EditMenu
            selectedItem={selectedItem}
            actions={MENU_ACTIONS}
            //@ts-expect-error
            coords={{ x: menuCoords.x - 15, y: menuCoords.y - 100 }}
          />
        )}

        {creationMenuVisible && (
          <FormCreationDialogue
            onSubmit={handleCreate}
            onClose={closeCreationMenu}
            title={creationType === "treino" ? "Novo Treino" : "Novo Exercício"}
            options={FORM_OPTIONS}
            submitTitle="Adicionar"
          />
        )}

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <TreinoSelector
            treinoData={treino}
            onPress={handleTreinoChange}
            onLongPress={(item, event) => handleItemLongPress(item, event)}
          />

          <WorkoutSelected
            treino={selectedTreino}
            onLongPress={(item, event) => handleItemLongPress(item, event)}
            startTreino={handleStartTreino}
          />
        </ScrollView>

        <FAB icon="add" options={FAB_OPTIONS} />
      </Pressable>
    </ParentView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1031",
    paddingTop: 60,
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
  },
});
