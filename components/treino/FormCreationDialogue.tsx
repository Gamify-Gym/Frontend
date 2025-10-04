import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text } from "../general";
import colors from "../general/Colors";

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
    <Modal transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>{title}</Text>

          {options.map((option, id) =>
            option.type === "select" ? (
              <Picker
                key={id}
                selectedValue={option.value}
                onValueChange={(val) => option.onChange(val)}
                style={styles.input}
              >
                <Picker.Item label={option.placeholder} value="" />
                {option.options.map((opt, i) => (
                  <Picker.Item key={i} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            ) : (
              <TextInput
                key={id}
                value={option.value}
                onChangeText={(e) => option.onChange(e)}
                placeholder={option.placeholder}
                style={styles.input}
              />
            )
          )}

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
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
              <Text style={styles.submitButtonText}>{submitTitle}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "75%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    gap: 10,
    elevation: 5,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textPrimary,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
