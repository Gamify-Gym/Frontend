import { Text } from "@/components";
import Button from "@/components/Button";
import colors from "@/components/Colors";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

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
  createAccountContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  createAccountText: {
    fontSize: 14,
    color: "#555",
  },
  createAccountTextLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  error: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleCreateAccount = () => {
    const router = useRouter();
    router.navigate("/createUser");
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior="padding"
      keyboardVerticalOffset={-40}
    >
      <Text style={styles.title}>Bem vindo de volta</Text>

      <View style={styles.textInputContainer}>
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
      </View>

      <Button
        title={isLoading ? "Carregando..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
        large={true}
        icon="check"
      />

      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccountText}>
          Ainda não possui uma conta?
        </Text>
        <TouchableOpacity onPress={handleCreateAccount}>
          <Text style={styles.createAccountTextLink}>Crie sua conta!</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}
