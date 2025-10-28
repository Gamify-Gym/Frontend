import { Text } from "@/components/general";
import { ExerciseType } from "@/components/general/types";
import { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Pressable,
  Alert,
  Animated,
  Vibration
} from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface SerieData {
  number: number;
  weight: string;
  reps: string;
  completed: boolean;
}

interface ExerciseCardProps {
  exercise: ExerciseType;
  onComplete: (exercise: ExerciseType) => void;
  onUncomplete?: (exerciseId: number) => void;
  onRemove?: (exerciseId: number) => void;
  onEditName?: (exerciseId: number, newName: string) => void;
  lastWorkoutWeight?: number;
  restTime?: number;
  isCompleted?: boolean;
}

export default function ExerciseCard({
  exercise,
  onComplete,
  onUncomplete,
  onRemove,
  onEditName,
  lastWorkoutWeight,
  restTime = 60,
  isCompleted = false,
}: ExerciseCardProps) {
  const [series, setSeries] = useState<SerieData[]>(
    Array.from({ length: exercise.series }, (_, i) => ({
      number: i + 1,
      weight: "",
      reps: exercise.repeticoes.toString(),
      completed: false,
    }))
  );
  const [notes, setNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(isCompleted);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(exercise.name);
  const [showMenu, setShowMenu] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(restTime);
  const restIntervalRef = useRef<NodeJS.Timeout>();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showRestTimer && restTimeLeft > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setShowRestTimer(false);
            Vibration.vibrate([0, 200, 100, 200]);
            return restTime;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, [showRestTimer, restTimeLeft]);

  const handleWeightChange = (serieNumber: number, value: string) => {
    setSeries(prev =>
      prev.map(s =>
        s.number === serieNumber ? { ...s, weight: value } : s
      )
    );
  };

  const handleRepsChange = (serieNumber: number, value: string) => {
    setSeries(prev =>
      prev.map(s =>
        s.number === serieNumber ? { ...s, reps: value } : s
      )
    );
  };

  const toggleSerieComplete = (serieNumber: number) => {
    const serie = series.find(s => s.number === serieNumber);
    
    if (!serie?.completed) {
      if (!serie?.weight || !serie?.reps) {
        Alert.alert("Atenção", "Preencha peso e repetições antes de completar!");
        return;
      }

      setSeries(prev =>
        prev.map(s =>
          s.number === serieNumber ? { ...s, completed: true } : s
        )
      );

      Vibration.vibrate(50);
    } else {
      // Desmarcar
      setSeries(prev =>
        prev.map(s =>
          s.number === serieNumber ? { ...s, completed: false } : s
        )
      );
    }
  };

  const addExtraSerie = () => {
    const lastSerie = series[series.length - 1];
    setSeries(prev => [
      ...prev,
      {
        number: prev.length + 1,
        weight: lastSerie?.weight || "",
        reps: lastSerie?.reps || exercise.repeticoes.toString(),
        completed: false,
      },
    ]);
  };

  const removeSerie = (serieNumber: number) => {
    if (series.length <= 1) {
      Alert.alert("Atenção", "Você precisa ter pelo menos 1 série!");
      return;
    }

    Alert.alert(
      "Remover série",
      `Tem certeza que deseja remover a série ${serieNumber}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setSeries(prev =>
              prev
                .filter(s => s.number !== serieNumber)
                .map((s, index) => ({ ...s, number: index + 1 }))
            );
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    const completedCount = series.filter(s => s.completed).length;
    if (completedCount === 0) {
      Alert.alert("Atenção", "Complete pelo menos uma série!");
      return;
    }

    setIsCompleting(true);
    Vibration.vibrate([0, 100, 50, 100]);

    // Animação de conclusão
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        onComplete(exercise);
      }, 200);
    });
  };

  const handleRemoveExercise = () => {
    Alert.alert(
      "Remover exercício",
      `Tem certeza que deseja remover "${exercise.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => onRemove?.(exercise.id),
        },
      ]
    );
  };

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== exercise.name) {
      onEditName?.(exercise.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const completedCount = series.filter(s => s.completed).length;
  const isFullyCompleted = completedCount >= exercise.series;
  const hasEvolution = lastWorkoutWeight && series.some(s => 
    s.weight && parseFloat(s.weight) > lastWorkoutWeight
  );

  return (
    <Animated.View 
      style={[
        isCompleting ? styles.exerciseCardCompleted : styles.exerciseCardMain,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrapper, isCompleting && styles.iconWrapperCompleted]}>
            <MaterialDesignIcons 
              name={isCompleting ? "check-circle" : "dumbbell"} 
              size={20} 
              color={isCompleting ? "#4ade80" : "#8b5fbf"} 
            />
          </View>
          <View style={styles.headerInfo}>
            {isEditingName ? (
              <TextInput
                style={[styles.exerciseNameInput, isCompleting && styles.textCompleted]}
                value={editedName}
                onChangeText={setEditedName}
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
                autoFocus
              />
            ) : (
              <Text style={[styles.exerciseName, isCompleting && styles.textCompleted]}>
                {exercise.name}
              </Text>
            )}
            {exercise.muscles && (
              <Text style={[styles.muscleText, isCompleting && styles.textCompletedSecondary]} numberOfLines={1}>
                {exercise.muscles}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          {!isCompleting && (
            <Pressable 
              style={styles.menuButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <MaterialDesignIcons name="dots-vertical" size={24} color={isCompleting ? "#ffffff" : "#666"} />
            </Pressable>
          )}
          {(isFullyCompleted || isCompleting) && (
            <Pressable 
              style={styles.completedBadge}
              onPress={() => {
                if (isCompleting && onUncomplete) {
                  setIsCompleting(false);
                  onUncomplete(exercise.id);
                }
              }}
            >
              <MaterialDesignIcons name="check-circle" size={18} color="#4ade80" />
              <Text style={styles.completedText}>Completo</Text>
            </Pressable>
          )}
        </View>
      </View>

      {showMenu && !isCompleting && (
        <View style={styles.menuDropdown}>
          <Pressable 
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              setIsEditingName(true);
            }}
          >
            <MaterialDesignIcons name="pencil" size={18} color="#8b5fbf" />
            <Text style={styles.menuItemText}>Editar nome</Text>
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable 
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              handleRemoveExercise();
            }}
          >
            <MaterialDesignIcons name="delete" size={18} color="#ef4444" />
            <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Remover</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.exerciseInfo}>
        <View style={styles.infoItem}>
          <MaterialDesignIcons name="counter" size={16} color="#eca515ff" />
          <Text style={styles.infoValue}>{completedCount}/{series.length}</Text>
          <Text style={styles.infoLabel}>séries</Text>
        </View>
        {lastWorkoutWeight && (
          <View style={styles.infoItem}>
            <MaterialDesignIcons name="history" size={16} color="#b88aff" />
            <Text style={styles.infoValue}>{lastWorkoutWeight}kg</Text>
            <Text style={styles.infoLabel}>anterior</Text>
          </View>
        )}
      </View>

      {hasEvolution && (
        <View style={styles.evolutionBadge}>
          <MaterialDesignIcons name="trending-up" size={16} color="#4ade80" />
          <Text style={styles.evolutionText}>Você evoluiu! 💪</Text>
        </View>
      )}

      <View style={styles.seriesContainer}>
        <View style={styles.seriesHeader}>
          <Text style={styles.seriesTitle}>Séries</Text>
          <View style={styles.seriesLabels}>
            <Text style={styles.columnLabel}>KG</Text>
            <Text style={styles.columnLabel}>Reps</Text>
          </View>
        </View>

        {series.map((serie) => (
          <View key={serie.number} style={styles.serieRow}>
            <View style={styles.serieNumber}>
              <Text style={styles.serieNumberText}>{serie.number}</Text>
            </View>

            <View style={styles.inputsContainer}>
              <View style={styles.weightInputWrapper}>
                <TextInput
                  style={[
                    styles.weightInput,
                    serie.completed && styles.inputCompleted,
                  ]}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={serie.weight}
                  onChangeText={(value) => handleWeightChange(serie.number, value)}
                  editable={!serie.completed}
                />
                <Text style={styles.unitLabel}>kg</Text>
              </View>

              <View style={styles.repsInputWrapper}>
                <TextInput
                  style={[
                    styles.repsInput,
                    serie.completed && styles.inputCompleted,
                  ]}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={serie.reps}
                  onChangeText={(value) => handleRepsChange(serie.number, value)}
                  editable={!serie.completed}
                />
              </View>
            </View>

            <View style={styles.serieActions}>
              <Pressable
                style={styles.checkButton}
                onPress={() => toggleSerieComplete(serie.number)}
              >
                <MaterialDesignIcons
                  name={serie.completed ? "check-circle" : "circle-outline"}
                  size={28}
                  color={serie.completed ? "#db93e1ff" : "#9ca3af"}
                />
              </Pressable>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeSerie(serie.number)}
              >
                <MaterialDesignIcons name="close" size={18} color="#9c9595ff" />
              </Pressable>
            </View>
          </View>
        ))}

        <Pressable style={styles.addSerieButton} onPress={addExtraSerie}>
          <MaterialDesignIcons name="plus-circle" size={20} color="#8b5fbf" />
          <Text style={styles.addSerieText}>Adicionar série</Text>
        </Pressable>
      </View>

      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Observações (opcional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Ex: Joelho doeu, aumentar peso..."
          placeholderTextColor="#9ca3af"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
        />
      </View>

      {completedCount > 0 && !isCompleting && (
        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <MaterialDesignIcons name="check-bold" size={20} color="#ffffff" />
          <Text style={styles.completeButtonText}>
            Finalizar Exercício
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  exerciseCardMain: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: "rgba(139, 95, 191, 0.2)",
    shadowColor: "#8b5fbf",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  exerciseCardCompleted: {
    backgroundColor: "#2a1a45",
    borderRadius: 18,
    padding: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: "#b875e1ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(139, 95, 191, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperCompleted: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  menuDropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2a1a45",
  },
  menuItemTextDanger: {
    color: "#ef4444",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2a1a45",
  },
  exerciseNameInput: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2a1a45",
    borderBottomWidth: 2,
    borderBottomColor: "#8b5fbf",
    paddingVertical: 2,
  },
  textCompleted: {
    color: "#ffffff",
  },
  textCompletedSecondary: {
    color: "#c5a8e0",
  },
  muscleText: {
    fontSize: 12,
    color: "#9f7dcc",
    fontWeight: "500",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4ade80",
  },
  exerciseInfo: {
    flexDirection: "row",
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(139, 95, 191, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(139, 95, 191, 0.15)",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#cc7320ff",
  },
  infoLabel: {
    fontSize: 11,
    color: "#cc7320ff",
    fontWeight: "500",
  },
  evolutionBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(74, 222, 128, 0.3)",
  },
  evolutionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4ade80",
  },
  seriesContainer: {
    gap: 12,
  },
  seriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  seriesTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2a1a45",
  },
  seriesLabels: {
    flexDirection: "row",
    gap: 24,
    marginRight: 52,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    width: 56,
    textAlign: "center",
  },
  serieRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  serieNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(139, 95, 191, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  serieNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8b5fbf",
  },
  inputsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  weightInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  weightInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2a1a45",
    paddingVertical: 10,
    textAlign: "center",
  },
  repsInputWrapper: {
    width: 56,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    justifyContent: "center",
  },
  repsInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a1a45",
    paddingVertical: 10,
    textAlign: "center",
  },
  inputCompleted: {
    color: "#9ca3af",
  },
  unitLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
  },
  serieActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  checkButton: {
    padding: 2,
  },
  removeButton: {
    padding: 4,
    backgroundColor: "rgba(222, 150, 248, 0.22)",
    borderRadius: 6,
  },
  addSerieButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(139, 95, 191, 0.3)",
    marginTop: 4,
  },
  addSerieText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8b5fbf",
  },
  notesContainer: {
    gap: 8,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  notesInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    fontSize: 14,
    color: "#2a1a45",
    minHeight: 60,
    textAlignVertical: "top",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#8b5fbf",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#6a3fa0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});