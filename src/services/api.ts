import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8080";
console.log("🔥 URL DA API:", API_BASE_URL);
console.log("🔥 VARIÁVEL DE AMBIENTE:", process.env.EXPO_PUBLIC_BACKEND_URL);

const TOKEN_KEY = "token";
const USER_EMAIL_KEY = "@gamify_gym:email";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    console.log("🔑 Token encontrado:", token ? "SIM ✅" : "NÃO ❌");
    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Body:", config.data);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("🔴 Erro no interceptor request:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    console.log("📦 Response Data:", response.data);
    return response;
  },
  async (error) => {
    console.error("🔴 Erro na response:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync("user");
      console.log("🔐 Token inválido - storage limpo");
    }

    return Promise.reject(error);
  }
);

export const storage = {
  async setToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log("💾 Token salvo no SecureStore");
  },

  async getToken(): Promise<string | null> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log("🔍 Buscando token:", token ? "Encontrado" : "Não encontrado");
    return token;
  },

  async setUserEmail(email: string) {
    await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
  },

  async getUserEmail(): Promise<string | null> {
    return await SecureStore.getItemAsync(USER_EMAIL_KEY);
  },

  async clear() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
    console.log("🗑️ Storage limpo");
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return !!token;
  },
};

export default api;
