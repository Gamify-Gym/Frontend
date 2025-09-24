import { useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from ".";

type Option = {
  label: string;
  action: (event: GestureResponderEvent) => void;
  icon?: string;
};

type Props = {
  label: string;
  color?: string;
  colorText?: string;
  icon?: string;
  options?: Option[];
};

export default function FAB({ label, color, colorText, icon, options }: Props) {
  const [expanded, setExpanded] = useState(false);

  const backgroundColor = color ?? "#EADDFF";
  const textColor = colorText ?? "#4F378A";
  const showIcon = icon ?? null;

  const animatedValues = useRef<Animated.Value[]>([]).current;

  if (animatedValues.length !== (options?.length ?? 0)) {
    animatedValues.length = 0;
    options?.forEach(() => animatedValues.push(new Animated.Value(0)));
  }

  useEffect(() => {
    if (expanded) {
      Animated.stagger(
        80,
        animatedValues.map((val) =>
          Animated.timing(val, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      Animated.parallel(
        animatedValues.map((val) =>
          Animated.timing(val, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [expanded]);

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <View style={style.container}>
      {options?.map((opt, idx) => {
        const opacity = animatedValues[idx];
        const translateY = opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(idx + 1) * 60],
        });

        return (
          <Animated.View
            key={idx}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              opacity,
              transform: [{ translateY }],
            }}
          >
            <Pressable
              style={[style.option, { backgroundColor }]}
              onPress={(e) => {
                opt.action(e);
                setExpanded(false);
              }}
            >
              {opt.icon && (
                <MaterialIcons name={opt.icon} size={22} color={textColor} />
              )}
              <Text style={[style.buttonText, { color: textColor }]}>
                {opt.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}

      <Pressable onPress={toggle} style={[style.button, { backgroundColor }]}>
        {expanded ? (
          <MaterialIcons name="close" size={28} color={textColor} />
        ) : (
          <MaterialIcons name={showIcon} size={28} color={textColor} />
        )}
        <Text style={[style.buttonText, { color: textColor }]}>
          {expanded ? "Fechar" : label}
        </Text>
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    right: 25,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  button: {
    zIndex: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
    gap: 6,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    gap: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
