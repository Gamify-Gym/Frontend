import { Player } from "@/components/general/types";
import Profile from "@/components/perfil/profile";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import ParentView from "@/components/general/ParentView";

export default function Perfil() {
  const { user } = useAuth();
  const [player] = useState<Player | null>(user ? user : null);

  return (
    <ParentView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {player && <Profile player={player} onSave={() => {}} />}
      </KeyboardAvoidingView>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1031",
  },
});
