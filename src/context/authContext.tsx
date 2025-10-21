import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "@/components/general/types";
import { useRouter } from "expo-router";

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: Player | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: () => Promise<string>;
  error: string | null;
  connected: boolean;
  clearError: () => void;
  setUser: (player: Player) => any;
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
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUserLocal] = useState<Player | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnection] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenStore = await SecureStore.getItemAsync("token");
        const userStore = await SecureStore.getItemAsync("user");

        if (tokenStore) {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/check`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenStore.replace(/"/g, "")}`,
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
        setError(error.message);
        setToken(null);
        setLogged(false);
        setUserLocal(null);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const navigate = () => {
    router.replace("/assignType");
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Email e Senha são obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email ou senha inválidos");
        } else if (response.status >= 500) {
          throw new Error("Erro no servidor, tente novamente mais tarde");
        } else {
          throw new Error("Erro ao fazer login");
        }
      }
      const resToken = await response.json();

      setToken(JSON.stringify(resToken.token).replace(/"/g, ``));
      await SecureStore.setItemAsync(
        "token",
        JSON.stringify(resToken.token).replace(/"/g, ``)
      );

      const userCharacteristics = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${resToken.token.replace(/"/g, ``)}`,
          },
        }
      );

      if (!userCharacteristics.ok) {
        if (userCharacteristics.status === 404) {
          console.log("No chara");
          navigate();
          setLogged(true);
          return;
        } else {
          throw new Error("Erro ao pegar características do usuário");
        }
      }

      const chara: Player = await userCharacteristics.json();
      setUser(chara);

      await SecureStore.setItemAsync("user", JSON.stringify(chara));
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
      setUserLocal(null);
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
    setError(null);
  };

  const setUser = async (user: Player) => {
    setUserLocal(user);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
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
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
