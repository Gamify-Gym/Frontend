import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
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

    onSave(editedPlayer);
    setIsEditing(false);
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
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
                {editedPlayer.currentWeekTrainedDays}/{editedPlayer.weeklyTargetDays} dias
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
            title="Cancelar"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            outline
          />
          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileSummary: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  quickStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  disabledInput: {
    backgroundColor: colors.lightGray,
    color: colors.textDisabled,
  },
  helperText: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: colors.secondary,
    gap: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
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
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
});
