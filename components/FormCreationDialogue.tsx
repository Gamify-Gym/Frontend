import { Modal, StyleSheet, TextInput, View } from "react-native";

type Options = {
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormCreationDialogue({
  onSubmit,
  options,
  title,
}: {
  onSubmit: () => Promise<void>;
  options: Options[];
  title: string;
}) {
  return (
    <Modal transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          {options.map((option, id) => (
            <TextInput
              value={option.value}
              onChangeText={option.onChange}
              placeholder={option.placeholder}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "75%",
    padding: 20,
    height: 500,
    borderRadius: 16,
    backgroundColor: "blue",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
  },
});
