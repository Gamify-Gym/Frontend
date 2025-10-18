import { Player } from "@/components/general/types";
import Profile from "@/components/perfil/profile";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

export default function Perfil() {
  const [player, setPlayer] = useState<Player>();
  const { token } = useAuth();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token?.replace(/"/g, "")}` },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar usuário");

        const data = await response.json();
        console.log(data);
        setPlayer(data);
      } catch (error) {
        Alert.alert("Erro!", error as string);
      }
    };
    getUser();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      {player && <Profile player={player} onSave={() => {}} />}
      <Text>Hello</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
