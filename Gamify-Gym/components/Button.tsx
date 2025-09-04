import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from ".";
import colors from "./Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type ButtonProps = {
  onPress: () => void;
  title: string;
  large?: boolean;
  icon?: string;
  disabled?: boolean;
};

function Button({ onPress, title, large, icon, disabled }: ButtonProps) {
  const style = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      width: large ? 325 : 50,
      height: 50,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    title: {
      fontSize: large ? 20 : 50,
      color: colors.white,
      fontWeight: "normal",
    },
  });
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
      <View style={style.button}>
        {icon && (
          <MaterialDesignIcons
            // @ts-ignore
            name={icon}
            color={colors.white}
            size={large ? 25 : 15}
          />
        )}
        <Text style={style.title}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Button;
