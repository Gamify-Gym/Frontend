import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ParentView = (props: any) => {
  const { style, children, ...others } = props;
  const translateX = useSharedValue(300);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useFocusEffect(
    useCallback(() => {
      translateX.value = 300;
      opacity.value = 0;

      requestAnimationFrame(() => {
        translateX.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(1, { duration: 350 });
      });
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1031" }}>
      <Animated.View
        {...others}
        style={[{ flex: 1, opacity: 0 }, animatedStyle, style]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default ParentView;
