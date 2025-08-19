import { useRouter } from "expo-router";
import {
  Text,
  TouchableNativeFeedback,
  View,
  TextInput,
  Button,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

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
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
      }}
    >
      <View>
        {error && (
          <Text style={{ color: "red" }} onPress={clearError}>
            {error}
          </Text>
        )}
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={isLoading ? "Loading..." : "Login"}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>
      <Text>Login Screen </Text>
    </View>
  );
}
