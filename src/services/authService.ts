import api, { storage } from './api';
import type { LoginRequest, LoginResponse, CheckResponse } from '@/components/general/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<string> {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      const { token } = response.data;

      // Salvar token e email
      await storage.setToken(token);
      await storage.setUserEmail(credentials.email);

      return token;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  },

  async logout(): Promise<void> {
    await storage.clear();
  },

  async isAuthenticated(): Promise<boolean> {
    return await storage.isAuthenticated();
  },

  async checkToken(): Promise<boolean> {
    try {
      const response = await api.get<CheckResponse>('/check');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  async getUserEmail(): Promise<string | null> {
    return await storage.getUserEmail();
  },

  /**
   * Obter token atual
   */
  async getToken(): Promise<string | null> {
    return await storage.getToken();
  },
};

export default authService;