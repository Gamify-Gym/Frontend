import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const animateIn = () => {
        if (!isActive) return;

        setIsVisible(true);
        translateX.value = 300;
        opacity.value = 0;

        requestAnimationFrame(() => {
          if (!isActive) return;
          translateX.value = withTiming(0, { duration: 200 });
          opacity.value = withTiming(1, { duration: 550 });
        });
      };

      animateIn();

      return () => {
        isActive = false;
        translateX.value = 300;
        opacity.value = 0;
        setIsVisible(false);
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1031" }}>
      <Animated.View
        {...others}
        style={[
          { flex: 1 },
          animatedStyle,
          style,
          !isVisible && { opacity: 0 },
        ]}
        pointerEvents={isVisible ? "auto" : "none"}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default ParentView;
