import api from './api';
import type { DietaType, AlimentoDto, Alimento } from '@/components/general/types';



export const dietaService = {

  async getAll(): Promise<DietaType[]> {
    try {
      const response = await api.get<DietaType[]>('/diet/plan');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Erro ao buscar dietas'
      );
    }
  },

  async create(nomeDieta: string): Promise<DietaType> {
    try {
      const response = await api.post<DietaType>('/diet/plan', nomeDieta, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Erro ao criar dieta'
      );
    }
  },

  async addFood(alimentoData: AlimentoDto): Promise<Alimento> {
    try {
      const response = await api.post<Alimento>('/diet/food', alimentoData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para adicionar alimento nesta dieta');
      }
      throw new Error(
        error.response?.data?.error || 'Erro ao adicionar alimento'
      );
    }
  },

  async deleteFood(idAlimento: number): Promise<void> {
    try {
      await api.delete('/diet/food', {
        params: { idAlimento },
      });
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para deletar este alimento');
      }
      if (error.response?.status === 404) {
        throw new Error('Alimento não encontrado');
      }
      throw new Error(
        error.response?.data?.error || 'Erro ao deletar alimento'
      );
    }
  },

  calculateTotals(dieta: DietaType) {
    return dieta.alimentos.reduce(
      (acc, alimento) => ({
        calories: acc.calories + alimento.calories,
        proteins: acc.proteins + alimento.proteins,
        carbs: acc.carbs + alimento.carbs,
        fats: acc.fats + alimento.fats,
        fibers: acc.fibers + alimento.fibers,
        sodium: acc.sodium + alimento.sodium,
      }),
      {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        fibers: 0,
        sodium: 0,
      }
    );
  },
};

export default dietaService;