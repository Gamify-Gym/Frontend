import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text } from "../general";
import Button from "../general/Button";
import colors from "../general/Colors";
import { User, Player } from "../general/types";
import Field from "./field";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface ProfileProps {
  player: Player;
  onSave: (updatedPlayer: Player) => void;
  onCancel?: () => void;
}

export default function Profile({ player, onSave, onCancel }: ProfileProps) {
  const [editedPlayer, setEditedPlayer] = useState<Player>({ ...player });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!editedPlayer.user.username.trim() || !editedPlayer.user.email.trim()) {
      Alert.alert("Erro", "Nome de usuário e email são obrigatórios");
      return;
    }

    if (editedPlayer.user.email && !isValidEmail(editedPlayer.user.email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    // MOCK: Saving disabled in demo mode
    setIsEditing(false);
    Alert.alert(
      "Modo Demo",
      "Salvamento de perfil desabilitado no modo de demonstração."
    );
  };

  const handleCancel = () => {
    setEditedPlayer({ ...player });
    setIsEditing(false);
    onCancel?.();
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
        <TouchableOpacity onPress={toggleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancelar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Avatar & Summary */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialDesignIcons
              name="account"
              size={60}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.profileSummary}>
          <Text style={styles.profileName}>{editedPlayer.user.username}</Text>
          <Text style={styles.profileEmail}>{editedPlayer.user.email}</Text>
          <View style={styles.quickStats}>
            <View style={styles.quickStatBadge}>
              <MaterialDesignIcons
                name="fire"
                size={16}
                color={colors.warning}
              />
              <Text style={styles.quickStatText}>
                {editedPlayer.weeklyStreak} semanas
              </Text>
            </View>
            <View style={styles.quickStatBadge}>
              <MaterialDesignIcons
                name="dumbbell"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.quickStatText}>
                {editedPlayer.currentWeekTrainedDays}/
                {editedPlayer.weeklyTargetDays} dias
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* User Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        <Field
          label="Nome de Usuário"
          value={editedPlayer.user.username}
          onChangeText={(text) =>
            setEditedPlayer({
              ...editedPlayer,
              user: {
                ...editedPlayer.user,
                username: text,
              },
            })
          }
          isEditing={isEditing}
          placeholder="Nome de usuário"
        />

        <Field
          label="Email"
          value={editedPlayer.user.email}
          onChangeText={(text) =>
            setEditedPlayer({
              ...editedPlayer,
              user: {
                ...editedPlayer.user,
                email: text,
              },
            })
          }
          isEditing={isEditing}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Player Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Jogador</Text>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Field
              label="Altura (cm)"
              value={editedPlayer.height?.toString() || ""}
              onChangeText={(text) =>
                setEditedPlayer({
                  ...editedPlayer,
                  height: text ? parseFloat(text) : null,
                })
              }
              isEditing={isEditing}
              placeholder="Altura"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.halfField}>
            <Field
              label="Peso (kg)"
              value={editedPlayer.weight?.toString() || ""}
              onChangeText={(text) =>
                setEditedPlayer({
                  ...editedPlayer,
                  weight: text ? parseFloat(text) : null,
                })
              }
              isEditing={isEditing}
              placeholder="Peso"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Field
          label="Dias de Treino por Semana"
          value={editedPlayer.weeklyTargetDays.toString()}
          onChangeText={(text) =>
            setEditedPlayer({
              ...editedPlayer,
              weeklyTargetDays: text ? parseInt(text) : 2,
            })
          }
          isEditing={isEditing}
          placeholder="Dias por semana"
          keyboardType="numeric"
        />

        {/* Stats Display (Read-only) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{editedPlayer.weeklyStreak}</Text>
            <Text style={styles.statLabel}>Semanas Consecutivas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {editedPlayer.currentWeekTrainedDays}/
              {editedPlayer.weeklyTargetDays}
            </Text>
            <Text style={styles.statLabel}>Dias Esta Semana</Text>
          </View>
        </View>
      </View>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <View style={styles.buttonsContainer}>
          <Button
            label="Cancelar"
            onClick={handleCancel}
            mainContainerStyle={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          <Button
            label="Salvar Alterações"
            onClick={handleSave}
            mainContainerStyle={styles.saveButton}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1031",
  },
  content: {
    width: "100%",
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#df80ff",
    borderRadius: 12,
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  editButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(43, 11, 79, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#df80ff",
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileSummary: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileEmail: {
    fontSize: 14,
    color: "#dfb7ff",
  },
  quickStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },
  quickStatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(43, 11, 79, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.2)",
  },
  quickStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  section: {
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#df80ff",
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(43, 11, 79, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
  },
  disabledInput: {
    backgroundColor: "rgba(27, 16, 49, 0.4)",
    color: "#b8a3c9",
  },
  helperText: {
    fontSize: 12,
    color: "#b8a3c9",
    marginTop: 4,
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: "rgba(223, 128, 255, 0.3)",
    gap: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(43, 11, 79, 0.6)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#df80ff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#dfb7ff",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(43, 11, 79, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
  },
  cancelButtonText: {
    color: "#ffffff",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#df80ff",
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
