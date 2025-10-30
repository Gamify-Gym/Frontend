import {
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View as RNView,
} from "react-native";
import { useDieta } from "@/hooks/useDietas";
import DietaSelector from "@/components/dieta/dietaSelector";
import DietaSelected from "@/components/dieta/dietaSelected";
import ParentView from "@/components/general/ParentView";
import type { Alimento, DietaWithMealsType } from "@/components/general/types";
import { useState } from "react";
import EditMenu from "@/components/general/ContextMenu";
import { useMenu } from "@/hooks/useMenu";
import { LinearGradient } from "expo-linear-gradient";
import FAB from "@/components/general/FAB";
import { LoadingSpinner, DietasSkeletonList } from "@/components/loading/LoadingComponents";
import { Text } from "@/components/general";
import AddAlimentoModal from "@/components/dieta/AddAlimentoModal";
import InputModal from "@/components/dieta/InputModal";

export default function Dieta() {
  const {
    dieta: dietasComRefeicoes,
    isLoading,
    error,
    handleRerun,
    createDieta,
    addFood,
    deleteFood,
  } = useDieta();

  const [selectedDieta, setSelectedDieta] = useState<DietaWithMealsType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [selectedMealForAdd, setSelectedMealForAdd] = useState<{
    mealId: string;
    mealName: string;
  } | null>(null);

  const {
    menuVisible,
    menuCoords,
    selectedItem,
    setSelectedItem,
    handleLongPress,
    closeMenu,
  } = useMenu();

  const handleDietaChange = (dieta: DietaWithMealsType) => {
    setSelectedDieta(null);
    setTimeout(() => setSelectedDieta(dieta), 0);
  };

  const handleItemLongPress = (
    item: Alimento,
    event: GestureResponderEvent
  ) => {
    setSelectedItem(item);
    handleLongPress(event);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    handleRerun();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleAddDieta = () => {
    console.log('🔵 Abrindo modal de criar dieta');
    setInputModalVisible(true);
  };

  const handleCreateDieta = async (nomeDieta: string) => {
    console.log('🔵 Tentando criar dieta:', nomeDieta);
    
    try {
      const result = await createDieta(nomeDieta);
      
      console.log('🟢 Resultado:', result);
      
      if (result.success && result.dieta) {
        Alert.alert("Sucesso!", "Dieta criada com sucesso!");
        setSelectedDieta(result.dieta);
      } else {
        console.error('🔴 Erro ao criar:', result.error);
        Alert.alert("Erro", result.error || "Erro ao criar dieta");
      }
    } catch (err: any) {
      console.error('🔴 Exceção ao criar dieta:', err);
      Alert.alert("Erro", err.message || "Erro ao criar dieta");
    }
  };

  const handleAddAlimento = () => {
    if (!selectedDieta) {
      Alert.alert(
        "Atenção",
        "Selecione uma dieta primeiro para adicionar alimentos."
      );
      return;
    }

    // acaba tcc pelamordedeus
    Alert.alert(
      "Escolha a Refeição",
      "Em qual refeição deseja adicionar o alimento?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Café da manhã", 
          onPress: () => {
            const meal = selectedDieta.meals.find(m => m.name === "Café da manhã");
            if (meal) {
              setSelectedMealForAdd({ mealId: meal.id, mealName: meal.name });
              setModalVisible(true);
            }
          }
        },
        { 
          text: "Almoço", 
          onPress: () => {
            const meal = selectedDieta.meals.find(m => m.name === "Almoço");
            if (meal) {
              setSelectedMealForAdd({ mealId: meal.id, mealName: meal.name });
              setModalVisible(true);
            }
          }
        },
        { 
          text: "Lanche", 
          onPress: () => {
            const meal = selectedDieta.meals.find(m => m.name === "Lanche");
            if (meal) {
              setSelectedMealForAdd({ mealId: meal.id, mealName: meal.name });
              setModalVisible(true);
            }
          }
        },
        { 
          text: "Janta", 
          onPress: () => {
            const meal = selectedDieta.meals.find(m => m.name === "Janta");
            if (meal) {
              setSelectedMealForAdd({ mealId: meal.id, mealName: meal.name });
              setModalVisible(true);
            }
          }
        },
        { 
          text: "Outros", 
          onPress: () => {
            const meal = selectedDieta.meals.find(m => m.name === "Outros");
            if (meal) {
              setSelectedMealForAdd({ mealId: meal.id, mealName: meal.name });
              setModalVisible(true);
            }
          }
        },
      ]
    );
  };

  const handleModalAdd = async (
    dietaId: number,
    mealId: string,
    alimentoData: any
  ) => {
    await addFood(dietaId, mealId, alimentoData);
  };

  const handleDeleteFood = async () => {
    if (!selectedItem || !selectedDieta) return;

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente apagar ${selectedItem.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            // Encontrar em qual meal está o alimento
            const meal = selectedDieta.meals.find(m =>
              m.alimentos.some(a => a.id === selectedItem.id)
            );

            if (meal) {
              const result = await deleteFood(
                selectedItem.id,
                selectedDieta.id,
                meal.id
              );

              if (result.success) {
                Alert.alert("Sucesso!", "Alimento removido!");
              } else {
                Alert.alert("Erro", result.error || "Erro ao deletar alimento");
              }
            }
            closeMenu();
          },
        },
      ]
    );
  };

  const MENU_ACTIONS = [
    {
      label: "Editar",
      icon: "pencil",
      action: () => {
        closeMenu();
        Alert.alert(
          "Editar",
          "Funcionalidade em desenvolvimento!"
        );
      },
    },
    {
      label: "Apagar",
      icon: "delete",
      destructive: true,
      action: handleDeleteFood,
    },
  ];

  const FAB_OPTIONS = [
    {
      label: "Dieta",
      action: handleAddDieta,
      icon: "add" as const,
    },
    {
      label: "Alimento",
      action: handleAddAlimento,
      icon: "add" as const,
    },
  ];

  if (isLoading && !isRefreshing) {
    return (
      <ParentView>
        <LinearGradient
          colors={["#1a0f2e", "#2d1654", "#3d1f5c", "#2d1654"]}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.gradient}
        >
          <RNView style={styles.loadingContainer}>
            <DietasSkeletonList count={2} />
          </RNView>
        </LinearGradient>
      </ParentView>
    );
  }

  // batata e bao demais
  if (error && !isRefreshing) {
    return (
      <ParentView>
        <LinearGradient
          colors={["#1a0f2e", "#2d1654", "#3d1f5c", "#2d1654"]}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.gradient}
        >
          <RNView style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro: {error}</Text>
            <Pressable style={styles.retryButton} onPress={handleRerun}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </Pressable>
          </RNView>
        </LinearGradient>
      </ParentView>
    );
  }

  return (
    <ParentView>
      <LinearGradient
        colors={["#1a0f2e", "#2d1654", "#3d1f5c", "#2d1654"]}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradient}
      >
        <Pressable style={styles.container} onPress={closeMenu}>
          {menuVisible && (
            (EditMenu as any)({
              selectedItem: selectedItem,
              actions: MENU_ACTIONS,
              coords: menuCoords,
              onClose: closeMenu,
            })
          )}

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#b88aff"
                colors={["#b88aff"]}
              />
            }
          >
            <DietaSelector
              data={dietasComRefeicoes}
              onPress={handleDietaChange}
              onLongPress={(item: DietaWithMealsType, event: GestureResponderEvent) =>
                handleItemLongPress(item as any, event)
              }
            />

            <DietaSelected
              dieta={selectedDieta}
              onLongPress={(item, event) => handleItemLongPress(item, event)}
              onAddFood={(mealId: string, mealName: string) => {
                setSelectedMealForAdd({ mealId, mealName });
                setModalVisible(true);
              }}
            />
          </ScrollView>

          <FAB icon="add" options={FAB_OPTIONS} />

          {selectedDieta && selectedMealForAdd && (
            <AddAlimentoModal
              visible={modalVisible}
              dietaId={selectedDieta.id}
              mealId={selectedMealForAdd.mealId}
              mealName={selectedMealForAdd.mealName}
              onClose={() => {
                setModalVisible(false);
                setSelectedMealForAdd(null);
              }}
              onAdd={handleModalAdd}
            />
          )}
        
          <InputModal
            visible={inputModalVisible}
            title="Nova Dieta"
            placeholder="Digite o nome da dieta..."
            onClose={() => setInputModalVisible(false)}
            onSubmit={handleCreateDieta}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b9d",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#b88aff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});