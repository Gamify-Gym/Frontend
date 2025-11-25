import WorkoutSelected from "@/components/treino/WorkoutSelected";
import TreinoSelector from "@/components/treino/WorkoutSelector";
import {
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { TreinoType, ExerciseType } from "@/components/general/types";
import EditMenu from "@/components/general/ContextMenu";
import FAB from "@/components/general/FAB";
import FormCreationDialogue from "@/components/treino/FormCreationDialogue";
import { useMenu } from "@/hooks/useMenu";
import { useWorkout } from "@/hooks/useWorkout";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import ParentView from "@/components/general/ParentView";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

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

  const { user: authUser } = useAuth();

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
      await new Promise(resolve => setTimeout(resolve, 500));

      Alert.alert(
        "Modo Demo",
        "Criação de novos treinos e exercícios está desabilitada no modo de demonstração."
      );
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

  const MENU_ACTIONS = [
    {
      label: "Editar",
      icon: "pencil",
      action: () => Alert.alert("Modo Demo", "Edição desabilitada no modo de demonstração."),
    },
    {
      label: "Apagar",
      icon: "delete",
      destructive: true,
      action: () => Alert.alert("Modo Demo", "Exclusão desabilitada no modo de demonstração."),
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
      <LinearGradient
        colors={['#1a0f2e', '#2d1654', '#3d1f5c', '#2d1654']}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradient}
      >
        <Pressable style={styles.container} onPress={closeMenu}>
          {menuVisible && (
            <EditMenu
              selectedItem={selectedItem}
              actions={MENU_ACTIONS}
              coords={{ x: menuCoords.x, y: menuCoords.y }}
              onClose={closeMenu}
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
            {authUser && (
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>💪 Meus Treinos</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <MaterialDesignIcons name="calendar-month" size={16} color="#4caf50" />
                    <Text style={styles.statText}>{authUser.monthlyWorkoutDays || 0}/30 dias</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <MaterialDesignIcons name="fire" size={16} color="#ff6b9d" />
                    <Text style={styles.statText}>{authUser.weeklyStreak} seguidos</Text>
                  </View>
                </View>
              </View>
            )}

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
      </LinearGradient>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
  },
  statsHeader: {
    backgroundColor: 'rgba(27, 16, 49, 0.6)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(223, 128, 255, 0.3)',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(223, 128, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dfb7ff',
  },
});