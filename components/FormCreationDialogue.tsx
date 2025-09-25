import { useEffect } from "react";
import { BackHandler, Modal, StyleSheet, TextInput, View } from "react-native";
import { Text } from ".";
import Button from "./Button";

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
  submitTitle
}: {
  onSubmit: () => Promise<void>;
  options: Options[];
  title: string;
  onClose: () => void;
  submitTitle:string
}) {
  return (
    <Modal transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <Text style={{ color: "red" }}>{title}</Text>
          {options.map((option, id) => (
            <TextInput
              key={id}
              value={option.value}
              onChangeText={(e)=>option.onChange(e)}
              placeholder={option.placeholder}
            />
          ))}
          <Button title={submitTitle} onPress={onSubmit}/>
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
