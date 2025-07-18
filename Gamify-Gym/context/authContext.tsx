import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  //Propriedades do usuário aqui
  email: string;
  password: string;
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
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  createUser: async () => {
    return "não implementado";
  },

  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          //Aqui fazer checagem com backend
          setToken(token);
          setLogged(true);
          setUser({ email: "mock@email.com", password: "passwordMock" });
        }
      } catch (error) {
        console.log(error);
        //tratar erro de algum jeito aqui
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) return;
    try {
      setLoading(true);
      setToken("token");
      //erro ignorável, já que a esse ponto o token nunca será null
      await SecureStore.setItemAsync("token", token);
      setUser({ email: email, password: password });
    } catch (error: any) {
      console.error("Erro ao fazer Login!", error);
      setError(error.message || "Erro ao fazer Login!");
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setToken(null);
      setUser(null);
      setLogged(false);
    } catch (error: any) {
      setError("Erro ao sair!");
      console.error("Erro ao sair!", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    return "Não implementado";
  };

  return (
    /*login,logout,createUser são funções mock, não funcionama atualmente*/
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

//Output do deepseek em exemplo de flow de login
/*

import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View>
      {error && (
        <Text style={{ color: 'red' }} onPress={clearError}>
          {error}
        </Text>
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={isLoading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}
*/
