import { useState, useEffect, useCallback } from 'react';
import dietaService from '../services/dietaService';
import type { 
  DietaType, 
  AlimentoDto, 
  Alimento,
  DietaWithMealsType,
  MealType
} from '@/components/general/types';

// ============================================
// HOOK DE DIETAS - VERSÃO REAL COM ADAPTER
// ============================================

export function useDieta() {
  const [dieta, setDieta] = useState<DietaWithMealsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rerun, setRerun] = useState<boolean>(false);

 
  const apiDietaToMeals = (apiDieta: DietaType): DietaWithMealsType => {
    const emptyMeals: MealType[] = [
      { id: `breakfast-${apiDieta.id}`, name: "Café da manhã", time: "07:00", alimentos: [] },
      { id: `lunch-${apiDieta.id}`, name: "Almoço", time: "12:00", alimentos: [] },
      { id: `snack-${apiDieta.id}`, name: "Lanche", time: "16:00", alimentos: [] },
      { id: `dinner-${apiDieta.id}`, name: "Janta", time: "19:30", alimentos: [] },
      { id: `other-${apiDieta.id}`, name: "Outros", alimentos: [] },
    ];

    emptyMeals[4].alimentos = apiDieta.alimentos || [];

    return {
      id: apiDieta.id,
      name: apiDieta.name,
      description: undefined, 
      dailyCalorieGoal: undefined, 
      dailyProteinGoal: undefined, 
      dailyCarbGoal: undefined, 
      dailyFatGoal: undefined,  
      waterGoal: undefined, 
      meals: emptyMeals,
    };
  };

  // Buscar dietas da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiDietas = await dietaService.getAll();
        const dietasComMeals = apiDietas.map(apiDietaToMeals);
        
        setDieta(dietasComMeals);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao buscar dietas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rerun]);

  const handleRerun = useCallback(() => {
    setRerun(prev => !prev);
  }, []);

  const createDieta = async (nomeDieta: string): Promise<{ 
    success: boolean; 
    dieta?: DietaWithMealsType; 
    error?: string 
  }> => {
    try {
      console.log('🔵 useDieta.createDieta chamado com:', nomeDieta);
      
      const novaDieta = await dietaService.create(nomeDieta);
      console.log('🟢 useDieta.createDieta recebeu:', novaDieta);
      
      const dietaComMeals = apiDietaToMeals(novaDieta);
      
      // Optimistic update
      setDieta(prev => [...prev, dietaComMeals]);
      
      return { success: true, dieta: dietaComMeals };
    } catch (err: any) {
      console.error('🔴 useDieta.createDieta erro:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const addFood = async (
    dietaId: number,
    mealId: string,
    alimentoData: Omit<AlimentoDto, 'idDieta'>
  ) => {
    try {
      const fullAlimentoData: AlimentoDto = {
        ...alimentoData,
        idDieta: dietaId,
      };

      const novoAlimento = await dietaService.addFood(fullAlimentoData);
      
      setDieta(prev =>
        prev.map(d =>
          d.id === dietaId
            ? {
                ...d,
                meals: d.meals.map(meal =>
                  meal.id === mealId
                    ? { ...meal, alimentos: [...meal.alimentos, novoAlimento] }
                    : meal
                ),
              }
            : d
        )
      );
      
      return { success: true, alimento: novoAlimento };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Deletar alimento
  const deleteFood = async (alimentoId: number, dietaId: number, mealId: string) => {
    try {
      setDieta(prev =>
        prev.map(d =>
          d.id === dietaId
            ? {
                ...d,
                meals: d.meals.map(meal =>
                  meal.id === mealId
                    ? {
                        ...meal,
                        alimentos: meal.alimentos.filter(a => a.id !== alimentoId),
                      }
                    : meal
                ),
              }
            : d
        )
      );

      await dietaService.deleteFood(alimentoId);
      
      return { success: true };
    } catch (err: any) {
      handleRerun();
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    dieta,
    setDieta,
    isLoading,
    error,
    handleRerun,
    createDieta,
    addFood,
    deleteFood,
  };
}