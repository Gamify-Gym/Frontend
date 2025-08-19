import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  email: string;
};

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: UserType | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: () => Promise<string>;
  error: string | null;
  connected: boolean;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  createUser: async () => "não implementado",
  error: null,
  connected: true,
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnection] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenStore = await SecureStore.getItemAsync("token");
        const userStore = await SecureStore.getItemAsync("user");

        if (tokenStore) {
          const response = await fetch(
            `${process.env.EXPO_BACKEND_URL}/check`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenStore}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Sessão inválida ou expirada");
            } else {
              throw new Error("Erro ao verificar o token");
            }
          }

          setToken(tokenStore);
          setLogged(true);
          if (userStore) {
            setUser(JSON.parse(userStore));
          }
        }
      } catch (error: any) {
        setError("Falha ao validar o token, você está conectado a internet?");
        setToken(null);
        setLogged(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Email e Senha são obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const credentials = btoa(`${email}:${password}`);
      const response = await fetch(`${process.env.EXPO_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email ou senha inválidos");
        } else if (response.status >= 500) {
          throw new Error("Erro no servidor, tente novamente mais tarde");
        } else {
          throw new Error("Erro ao fazer login");
        }
      }
      const resToken = await response.text();
      setToken(resToken);
      await SecureStore.setItemAsync("token", resToken);
      const newUser = { email };
      setUser(newUser);
      await SecureStore.setItemAsync("user", JSON.stringify(newUser));
      setLogged(true);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setToken(null);
      setUser(null);
      setLogged(false);
    } catch (error: any) {
      setError("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    return "Não implementado";
  };
  const clearError = () => {
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        isLoading,
        user,
        token,
        login,
        logout,
        createUser,
        error,
        connected,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
