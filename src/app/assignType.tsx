import { Text } from "@/components/general";
import Button from "@/components/general/Button";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function AssignTypePage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { token, setUser } = useAuth();
  const router = useRouter();

  const navigate = () => {
    router.replace("/(tabs)/home");
  };

  const handlePress = async () => {
    if (weight === "" || height === "") return;
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/type`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weight: Number(weight),
            height: Number(height),
          }),
        }
      );

      if (!response.ok) throw new Error(`Erro ao completar perfil`);

      setUser(await response.json());
      navigate();
    } catch (error: any) {
      setError(error.message || "Erro ao completar perfil");
    }
  };

  return (
    <KeyboardAvoidingView
      style={style.mainContainer}
      behavior="padding"
      keyboardVerticalOffset={-40}
    >
      <Text style={style.title}>Complete seu perfil</Text>
      <Text style={style.subtitle}>
        Precisamos de algumas informações para personalizar sua experiência
      </Text>

      <View style={style.inputContainer}>
        <Text style={style.label}>Peso (KG)</Text>
        <TextInput
          style={style.input}
          placeholder="Insira seu peso"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Altura (CM)</Text>
        <TextInput
          style={style.input}
          placeholder="Insira sua altura"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <Button
        label="Confirmar"
        onClick={handlePress}
        disabled={!weight || !height}
        width={300}
        height={55}
      />

      {error && <Text style={style.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1b1031",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#b8a3c9",
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ffffff",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    color: "#ffffff",
  },
  error: {
    color: "#ff6b9d",
    fontSize: 18,
  },
});
