import {
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text } from ".";
import colors from "./Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type ButtonProps = {
  onPress: () => void;
  title: string;
  large?: boolean;
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  outline?: boolean;
  loading?: boolean;
};

function Button({
  onPress,
  title,
  large,
  icon,
  disabled,
  style,
  textStyle,
  outline,
  loading,
}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: outline
        ? "transparent"
        : disabled
        ? colors.gray
        : colors.primary,
      width: large ? 325 : "auto",
      minWidth: large ? 325 : 120,
      height: large ? 56 : 48,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: large ? 24 : 16,
      borderWidth: outline ? 2 : 0,
      borderColor: outline ? colors.primary : "transparent",
      opacity: disabled ? 0.6 : 1,
    },
    pressed: {
      backgroundColor: outline
        ? colors.primary + "20"
        : disabled
        ? colors.gray
        : colors.primaryDark,
      transform: [{ scale: 0.98 }],
    },
    title: {
      fontSize: large ? 18 : 16,
      color: outline ? colors.primary : colors.white,
      fontWeight: "600",
      includeFontPadding: false,
    },
    disabledTitle: {
      color: outline ? colors.gray : colors.white,
    },
    loadingContainer: {
      position: "absolute",
      right: 16,
    },
  });
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      android_ripple={{
        color: outline ? colors.primary + "40" : colors.white + "40",
        borderless: false,
        radius: 16,
      }}
    >
      {icon && !loading && (
        <MaterialDesignIcons
          // @ts-ignore
          name={icon}
          color={outline ? colors.primary : colors.white}
          size={large ? 20 : 16}
        />
      )}

      {loading ? (
        <MaterialDesignIcons
          name="loading"
          color={outline ? colors.primary : colors.white}
          size={large ? 20 : 16}
          style={{ transform: [{ rotate: "0deg" }] }}
        />
      ) : (
        <Text
          style={[styles.title, disabled && styles.disabledTitle, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export default Button;
