import { Text } from "@/components/general";
import ParentView from "@/components/general/ParentView";
import { ExerciseType, TreinoType } from "@/components/general/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState, useEffect, useRef } from "react";
import { 
  Alert, 
  BackHandler, 
  ScrollView, 
  StyleSheet, 
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/treino/ExerciseCard";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

export default function TreinoCompleter() {
  const [completedExercises, setCompletedExercises] = useState<ExerciseType[]>([]);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCardio, setShowCardio] = useState(false);
  const [cardioData, setCardioData] = useState({
    incline: "",
    speed: "",
  });
  const [cardioStartTime, setCardioStartTime] = useState<number | null>(null);
  const [cardioElapsed, setCardioElapsed] = useState(0);
  const [isCardioRunning, setIsCardioRunning] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscles: "",
    repeticoes: "",
    series: "",
  });

  const navigation = useNavigation();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { treino } = useLocalSearchParams();
  const data: TreinoType = JSON.parse(treino as string);

  useEffect(() => {
    setExercises(data.exercises);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime]);

  useEffect(() => {
    if (isCardioRunning && cardioStartTime) {
      cardioIntervalRef.current = setInterval(() => {
        setCardioElapsed(Math.floor((Date.now() - cardioStartTime) / 1000));
      }, 1000);
    } else {
      if (cardioIntervalRef.current) {
        clearInterval(cardioIntervalRef.current);
      }
    }

    return () => {
      if (cardioIntervalRef.current) clearInterval(cardioIntervalRef.current);
    };
  }, [isCardioRunning, cardioStartTime]);

  useFocusEffect(
    useCallback(() => {
      setCompletedExercises([]);
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
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (cardioIntervalRef.current) clearInterval(cardioIntervalRef.current);
          
                setTimeout(() => {
                  router.replace("/(tabs)/treino");
                }, 100);
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
    }, [navigation, router])
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
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (cardioIntervalRef.current) clearInterval(cardioIntervalRef.current);
                setTimeout(() => {
                  router.replace("/(tabs)/treino");
                }, 100);
              },
            },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
      
      return () => subscription.remove();
    }, [router])
  );

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteExercise = (exercise: ExerciseType) => {
    setCompletedExercises(prev => [...prev, exercise]);
  };

  const handleUncompleteExercise = (exerciseId: number) => {
    setCompletedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    setCompletedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleEditExerciseName = (exerciseId: number, newName: string) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === exerciseId ? { ...ex, name: newName } : ex))
    );
  };

  const handleStartCardio = () => {
    if (!cardioData.incline || !cardioData.speed) {
      Alert.alert("Atenção", "Preencha inclinação e velocidade!");
      return;
    }
    setCardioStartTime(Date.now());
    setCardioElapsed(0);
    setIsCardioRunning(true);
  };

  const handleStopCardio = () => {
    setIsCardioRunning(false);
  };

  const handleFinishWorkout = () => {
    const totalExercises = exercises.length;
    const completed = completedExercises.length;

    Alert.alert(
      "Finalizar Treino",
      `Você completou ${completed} de ${totalExercises} exercícios.\n\nTempo total: ${formatTime(elapsedTime)}\n\nDeseja finalizar o treino?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          onPress: () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (cardioIntervalRef.current) clearInterval(cardioIntervalRef.current);
            
            Alert.alert("Parabéns! 🎉", "Treino finalizado com sucesso!", [
              {
                text: "OK",
                onPress: () => {
                  setTimeout(() => {
                    router.replace("/(tabs)/treino");
                  }, 100);
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const allExercisesCompleted = completedExercises.length === exercises.length && exercises.length > 0;

  return (
    <ParentView>
      <LinearGradient
        colors={["#1a0f2e", "#2d1654", "#3d1f5c", "#2d1654"]}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{data.name}</Text>
                <Text style={styles.headerSubtitle}>
                  {exercises.length} exercícios
                </Text>
              </View>
              <View style={styles.timerContainer}>
                <MaterialDesignIcons name="timer" size={18} color="#b88aff" />
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(completedExercises.length / exercises.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {completedExercises.length}/{exercises.length} completos
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={`${resetKey}-${index}`}
                exercise={exercise}
                onComplete={handleCompleteExercise}
                onUncomplete={handleUncompleteExercise}
                onRemove={handleRemoveExercise}
                onEditName={handleEditExerciseName}
                isCompleted={completedExercises.some(ex => ex.id === exercise.id)}
              />
            ))}

            <View style={styles.cardioSection}>
              <Pressable
                style={styles.cardioToggle}
                onPress={() => setShowCardio(!showCardio)}
              >
                <MaterialDesignIcons name="run" size={24} color="#ff9a76" />
                <Text style={styles.cardioToggleText}>Adicionar Cardio</Text>
                <MaterialDesignIcons
                  name={showCardio ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#ffffff"
                />
              </Pressable>

              {showCardio && (
                <View style={styles.cardioContent}>
                  <View style={styles.cardioInputs}>
                    <View style={styles.cardioInputGroup}>
                      <Text style={styles.cardioLabel}>Inclinação (0-15°)</Text>
                      <TextInput
                        style={styles.cardioInput}
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        value={cardioData.incline}
                        onChangeText={(value) => {
                          const num = parseInt(value) || 0;
                          if (num <= 15) {
                            setCardioData(prev => ({ ...prev, incline: value }));
                          }
                        }}
                      />
                    </View>

                    <View style={styles.cardioInputGroup}>
                      <Text style={styles.cardioLabel}>Velocidade (0-18)</Text>
                      <TextInput
                        style={styles.cardioInput}
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="decimal-pad"
                        value={cardioData.speed}
                        onChangeText={(value) => {
                          const num = parseFloat(value) || 0;
                          if (num <= 18) {
                            setCardioData(prev => ({ ...prev, speed: value }));
                          }
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.cardioTimerContainer}>
                    <MaterialDesignIcons name="timer" size={24} color="#ff9a76" />
                    <Text style={styles.cardioTimerText}>
                      {formatTime(cardioElapsed)}
                    </Text>
                  </View>

                  <View style={styles.cardioButtons}>
                    {!isCardioRunning ? (
                      <Pressable
                        style={styles.cardioButton}
                        onPress={handleStartCardio}
                      >
                        <MaterialDesignIcons name="play" size={20} color="#ffffff" />
                        <Text style={styles.cardioButtonText}>Iniciar</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.cardioButton, styles.cardioButtonStop]}
                        onPress={handleStopCardio}
                      >
                        <MaterialDesignIcons name="stop" size={20} color="#ffffff" />
                        <Text style={styles.cardioButtonText}>Parar</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            </View>

            {allExercisesCompleted && (
              <Pressable
                style={styles.finishButton}
                onPress={handleFinishWorkout}
              >
                <MaterialDesignIcons name="flag-checkered" size={24} color="#ffffff" />
                <Text style={styles.finishButtonText}>Finalizar Treino</Text>
              </Pressable>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
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
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c5a8e0",
    fontWeight: "500",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(25, 15, 45, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(184, 138, 255, 0.3)",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    fontVariant: ["tabular-nums"],
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9f7dcc",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardioSection: {
    backgroundColor: "rgba(25, 15, 45, 0.5)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 154, 118, 0.3)",
    marginTop: 8,
    marginBottom: 20,
  },
  cardioToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardioToggleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  cardioContent: {
    marginTop: 20,
    gap: 20,
  },
  cardioInputs: {
    flexDirection: "row",
    gap: 12,
  },
  cardioInputGroup: {
    flex: 1,
    gap: 8,
  },
  cardioLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e5d4f0",
  },
  cardioInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "rgba(255, 154, 118, 0.3)",
    textAlign: "center",
  },
  cardioTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(43, 25, 70, 0.6)",
    paddingVertical: 16,
    borderRadius: 12,
  },
  cardioTimerText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ff9a76",
    fontVariant: ["tabular-nums"],
  },
  cardioButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cardioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ff9a76",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#ff9a76",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardioButtonStop: {
    backgroundColor: "#ef4444",
  },
  cardioButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#4ade80",
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#4ade80",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 12,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});