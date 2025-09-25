import { useEffect } from "react";
import { BackHandler, Modal, StyleSheet, TextInput, View } from "react-native";
import { Text } from ".";

type Options = {
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormCreationDialogue({
  onSubmit,
  options,
  title,
  onClose,
}: {
  onSubmit: () => Promise<void>;
  options?: Options[];
  title: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const back = () => {
      onClose();
      console.log("Backed");
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", back);
    return () => backHandler.remove();
  }, [onClose]);
  return (
    <Modal transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <Text style={{ color: "red" }}>{title}</Text>
          {options?.map((option, id) => (
            <TextInput
              id={id.toString()}
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
