import { Pressable, StyleSheet, View, ViewStyle, Animated } from "react-native";
import { Text } from ".";
import colors from "./Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { useRef } from "react";

interface ButtonType {
  width?: number;
  height?: number;
  label: string;
  onClick: () => Promise<void> | void;
  onLongClick?: () => Promise<void> | void;
  icon?: string;
  iconProps?: { size: number; color?: string };
  textStyle?: TextStyle;
  mainContainerStyle?: ViewStyle;
  animated?: boolean;
  animationConfig?: {
    scale?: number;
    duration?: number;
  };
  disabled?: boolean;
}

export default function Button({
  width,
  height,
  label,
  onClick,
  onLongClick,
  icon,
  iconProps,
  textStyle,
  mainContainerStyle,
  animated = true,
  animationConfig,
  disabled,
}: ButtonType) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: animationConfig?.scale ?? 0.95,
        speed: animationConfig?.duration ?? 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: animationConfig?.duration ?? 100,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        disabled={disabled}
        onPress={onClick}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={onLongClick ? onLongClick : () => {}}
        style={[
          style.mainContainer,
          mainContainerStyle,
          width ? { width } : undefined,
          height ? { height } : undefined,
        ]}
      >
        <View style={style.content}>
          <View style={style.iconContainer}>
            {icon && (
              <MaterialCommunityIcons
                name={icon as any}
                size={iconProps?.size ?? 24}
                color={iconProps?.color ?? colors.lightGray}
              />
            )}
          </View>
          <View style={style.textContainer}>
            <Text style={[style.text, textStyle]}>{label}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.primary,
    padding: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {},
  textContainer: {},
  text: { color: colors.lightGray },
});
