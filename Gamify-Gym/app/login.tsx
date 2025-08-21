import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import colors from "@/components/Colors";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "flex-end",
  },
  loginContainer: {
    height: "65%",
    backgroundColor: colors.secondary,
    borderTopRightRadius: 200,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 80,
  },
  textInput: {
    fontSize: 20,
    height: 70,
    overflow: "visible",
    borderColor: colors.primary,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 12,
    color: colors.primary,
  },
  textInputContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    height: "auto",
    paddingLeft: 30,
    paddingRight: 30,
    width: "100%",
    gap: 30,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "normal",
    color: colors.primary,
    fontSize: 50,
  },
  error: {
    fontWeight: "normal",
    fontSize: 25,
    color: "red",
  },
  errorContainer: {
    backgroundColor: "#ee80767a",
    padding: 10,
    borderRadius: 12,
    borderColor: "red",
    borderWidth: 0.8,
    borderStyle: "solid",
  },
  floatingTitle: {
    backgroundColor: colors.primary,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    position: "absolute",
    top: -20,
    zIndex: 9,
    left: 10,
  },
  floatingTitleText: {
    fontSize: 20,
    color: colors.white,
  },
  createAccountContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  createAccountText: {
    fontSize: 16,
  },
  createAccountTextLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  };
  const clearError = async () => {
    return;
  };
  const handleCreateAccount = async () => {
    const router = useRouter();
    router.navigate("/createUser");
  };
  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior="padding"
      keyboardVerticalOffset={-40}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.textInputContainer}>
          <View>
            <View style={styles.floatingTitle}>
              <Text style={styles.floatingTitleText}>Email</Text>
            </View>
            <TextInput
              placeholder="Insira seu email"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor={colors.primary}
              keyboardType="email-address"
            />
          </View>
          <View>
            <View style={styles.floatingTitle}>
              <Text style={styles.floatingTitleText}>Senha</Text>
            </View>
            <TextInput
              placeholder="Insira sua senha"
              style={styles.textInput}
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholderTextColor={colors.primary}
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

        {error && (
          <Pressable
            style={{ position: "absolute", bottom: 20 }}
            onPress={clearError}
          >
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
