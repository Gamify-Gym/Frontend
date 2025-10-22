import { Text } from "@/components/general";
import colors from "@/components/general/Colors";
import Button from "@/components/general/Button";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleCreateAccount = () => {
    router.navigate("/createUser");
  };

  return (
    <LinearGradient
      colors={["#1b1031", "#341256ff", colors.brightPurple]}
      style={styles.mainContainer}
    >
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-40}
      >
        <View style={styles.loginBox}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>

          <View style={styles.textInputContainer}>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="email@exemple.com"
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
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Carregando..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>
              Ainda não possui uma conta?{" "}
              <Text
                style={styles.createAccountTextLink}
                onPress={handleCreateAccount}
              >
                Cadastre-se!
              </Text>
            </Text>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 11,
  },

  loginBox: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 8,
  },

  title: {
    fontWeight: "800",
    color: "#ffffff",
    fontSize: 50,
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 44,
    textShadowColor: "rgba(202, 167, 215, 0.8)",
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
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  textInput: {
    fontSize: 19,
    height: 57,
    borderColor: "rgba(188, 107, 217, 0.6)",
    borderWidth: 1.4,
    borderRadius: 10,
    paddingHorizontal: 18,
    color: "#ffffff",
    backgroundColor: "rgba(31, 16, 56, 0.7)",
    shadowColor: "#bc6bd9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },

  loginButton: {
    backgroundColor: "#a06ab4",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#040105ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
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
    textAlign: "center",
    fontWeight: "500",
  },

  createAccountTextLink: {
    fontSize: 19,
    color: "#ffa8c5ff",
    fontWeight: "800",
    textShadowColor: "rgba(146, 11, 92, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },

  error: {
    fontSize: 13,
    color: "#ff6b9d",
    textAlign: "center",
    marginTop: 16,
  },
});
