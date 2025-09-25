import { Modal, StyleSheet, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Button from "../general/Button";
import { Text } from "../general";

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

          <Button title={submitTitle} onPress={onSubmit} />
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
    backgroundColor: "blue",
    gap: 10,
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
    color: "white",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
  },
});
