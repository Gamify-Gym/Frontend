import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useEffect,
  useState
} from "react";

type UserType = {
  //Propriedades do usuário aqui
};
type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: UserType | null;
  token: string | null;

  login: (/*Aqui adicionar o necessário para login. EX: email e senha*/) => Promise<void>;
  logout: () => Promise<void>;
  createUser: () => Promise<void>;

  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  createUser: async () => {},

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

  return (
    /*login,logout,createUser no value depois que existir*/
    <AuthContext.Provider value={{ isLogged, isLoading, user, token, error }}>
      {children}
    </AuthContext.Provider>
  );
};
