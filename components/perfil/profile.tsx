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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    backgroundColor: colors.white,
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    minWidth: "90%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
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
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderOnWhite,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
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
  },
});
