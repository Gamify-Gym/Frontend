import { MaterialIcons } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

type Props = {
  label: string;
  onClick: (event: GestureResponderEvent) => void;
  color?: string;
  colorText?: string;
  icon?: string;
};

export default function FAB({ onClick, label, color, colorText, icon }: Props) {
  const backgroundColor = color ?? "#EADDFF";
  const textColor = colorText ?? "#4F378A";
  const showIcon = icon ?? null;
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[style.button, { backgroundColor: backgroundColor }]}
    >
      {/* Ignore esse erro,já que quando showIcon == null ele simplesmente não vai ser renderizado, e quando tiver um valor real ele vai aparecer */}
      {icon && <MaterialIcons name={showIcon} size={30} color={textColor} />}
      <Text style={[style.buttonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  buttonText: {
    fontSize: 30,
    fontWeight: "normal",
  },
  button: {
    zIndex: 999,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    position: "absolute",
    bottom: 25,
    right: 25,
    gap: 5,
    elevation:3
  },
});
