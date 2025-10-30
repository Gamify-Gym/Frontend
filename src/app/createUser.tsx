import { Text } from "@/components/general";
import colors from "@/components/general/Colors";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface RegisterResponse {
  message?: string;
}

export default function CreateUserScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (): Promise<void> => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      const response: Response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email: email,
            password: password,
          }),
        }
      );

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.message || "Erro ao criar usuário");
        setIsLoading(false);
        return;
      }
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      router.navigate("/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = (): void => {
    router.navigate("/login");
  };

  return (
    <LinearGradient
      colors={['#2d1654', '#3b1f53ff', '#2d0e47ff']}
      style={styles.mainContainer}
    >
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-40}
      >
        <View style={styles.loginBox}>
          <Text style={styles.title}>Crie sua{'\n'}conta</Text>

          <View style={styles.textInputContainer}>
            <View>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                placeholder="Seu nome"
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="seu@email.com"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
              />
            </View>
            <View>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                placeholder="Sua senha"
                style={styles.textInput}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            <View>
              <TextInput
                placeholder="Confirme sua senha"
                style={styles.textInput}
                value={confirmPassword}
                secureTextEntry
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Carregando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>
              Já possui uma conta?{' '}
              <Text style={styles.createAccountTextLink} onPress={handleGoToLogin}>
                Faça login!
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 11,
  },

  loginBox: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 8,
  },

  title: {
    fontWeight: "800",
    color: "#ffffff",
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 44,
    textShadowColor: 'rgba(202, 167, 215, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  textInputContainer: {
    gap: 20,
    marginBottom: 45,
  },

  label: {
    fontSize: 22,
    color: "#ffffff",
    marginBottom: 9,
    fontWeight: "700",
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  textInput: {
    fontSize: 19,
    height: 57,
    borderColor: "rgba(188, 107, 217, 0.6)",
    borderWidth: 1.4,
    borderRadius: 14,
    paddingHorizontal: 18,
    color: "#ffffff",
    backgroundColor: "rgba(31, 16, 56, 0.7)",
    shadowColor: "#bc6bd9",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    
  },

  loginButton: {
    backgroundColor: '#a06ab4',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: "#040105ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },

  createAccountContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  createAccountText: {
    fontSize: 16,
    color: "#ffffffff",
    textAlign: 'center',
    fontWeight: "500",
  },

  createAccountTextLink: {
    fontSize: 19,
    color: "#ffa8c5ff",
    fontWeight: "800",
    textShadowColor: 'rgba(146, 11, 92, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});