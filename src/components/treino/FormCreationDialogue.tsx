import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text } from "../general";
import colors from "../general/Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type InputOption = {
  type?: "input";
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

type SelectOption = {
  type: "select";
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  options: { label: string; value: string }[];
};

type Options = InputOption | SelectOption;

export default function FormCreationDialogue({
  onSubmit,
  options,
  title,
  onClose,
  submitTitle,
}: {
  onSubmit: () => Promise<void>;
  options: Options[];
  title: string;
  onClose: () => void;
  submitTitle: string;
}) {
  return (
    <Modal transparent={true} onRequestClose={onClose} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <MaterialDesignIcons
              name={title.includes("Treino") ? "dumbbell" : "weight-lifter"}
              size={28}
              color={colors.primary}
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.formContainer}>
            {options.map((option, id) =>
              option.type === "select" ? (
                <View key={id} style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <MaterialDesignIcons name="menu-down" size={20} color={colors.textSecondary} />
                  </View>
                  <Picker
                    selectedValue={option.value}
                    onValueChange={(val) => option.onChange(val)}
                    style={styles.picker}
                  >
                    <Picker.Item label={option.placeholder} value="" />
                    {option.options.map((opt, i) => (
                      <Picker.Item key={i} label={opt.label} value={opt.value} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <View key={id} style={styles.inputWrapper}>
                  <TextInput
                    value={option.value}
                    onChangeText={(e) => option.onChange(e)}
                    placeholder={option.placeholder}
                    placeholderTextColor={colors.textDisabled}
                    style={styles.input}
                  />
                </View>
              )
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <MaterialDesignIcons name="close" size={18} color={colors.textSecondary} />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onSubmit}
            >
              <MaterialDesignIcons name="check" size={18} color={colors.white} />
              <Text style={styles.submitButtonText}>{submitTitle}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(27, 16, 49, 0.85)",
  },
  mainContainer: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  formContainer: {
    gap: 14,
    marginBottom: 24,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIconContainer: {
    position: "absolute",
    right: 12,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.borderOnWhite,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  picker: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderOnWhite,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderOnWhite,
  },
  submitButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
