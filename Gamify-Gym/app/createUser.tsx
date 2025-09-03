import { Text } from "@/components";
import Button from "@/components/Button";
import colors from "@/components/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RegisterResponse {
  message?: string;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 36,
    textAlign: "center",
    marginBottom: 40,
  },
  textInput: {
    fontSize: 16,
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: colors.primary,
    backgroundColor: "#f9f9f9",
  },
  textInputContainer: {
    gap: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#555",
  },
  loginTextLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default function CreateUserScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleRegister = async (): Promise<void> => {
    if (password !== confirmPassword) {
      Alert.alert("Erro as senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      const response: Response = await fetch("user/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    email,
  }),
});


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
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior="padding"
      keyboardVerticalOffset={-40}
    >
      <Text style={styles.title}>Crie sua conta</Text>

      <View style={styles.textInputContainer}>
        <View>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            placeholder="Insira seu nome"
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#aaa"
          />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Insira seu email"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Insira sua senha"
            style={styles.textInput}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>
        <View>
          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            placeholder="Confirme sua senha"
            style={styles.textInput}
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>
      </View>

      <Button
        title={isLoading ? "Carregando..." : "Cadastrar"}
        onPress={handleRegister}
        disabled={isLoading}
        large={true}
        icon="check"
      />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={handleGoToLogin}>
          <Text style={styles.loginTextLink}>Faça login!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
