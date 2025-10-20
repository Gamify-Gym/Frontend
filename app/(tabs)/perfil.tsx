import { Player } from "@/components/general/types";
import Profile from "@/components/perfil/profile";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Alert } from "react-native";

export default function Perfil() {
  const { token, user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(user ? user : null);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {player && <Profile player={player} onSave={() => {}} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF7FF",
  },
});
