import {
  Pressable,
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Text } from ".";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useEffect, useRef } from "react";
import colors from "./Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type MenuAction = {
  label: string;
  action: () => void;
  icon?: string;
  destructive?: boolean;
};

type EditMenuProps = {
  coords: { x: number | null; y: number | null };
  actions: MenuAction[];
  selectedItem: object | null;
  onClose?: () => void;
};

export default function EditMenu({
  actions,
  coords,
  selectedItem,
  onClose,
}: EditMenuProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const menuWidth = 200;
  const menuHeight = actions.length * 60 + 16;

  let menuX = coords.x || 0;
  let menuY = coords.y || 0;

  if (menuX + menuWidth > SCREEN_WIDTH) {
    menuX = SCREEN_WIDTH - menuWidth - 16;
  }

  if (menuY + menuHeight > SCREEN_HEIGHT) {
    menuY = SCREEN_HEIGHT - menuHeight - 16;
  }

  menuX = Math.max(16, menuX);
  menuY = Math.max(16, menuY);

  return (
    <>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={handleClose} />
      </Animated.View>


      <Animated.View
        style={[
          styles.menuContainer,
          {
            left: menuX,
            top: menuY,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {actions.map((item, index) => (
          <Pressable
            onPress={() => {
              item.action();
              handleClose();
            }}
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              index === 0 && styles.menuItemFirst,
              index === actions.length - 1 && styles.menuItemLast,
            ]}
            android_ripple={{
              color: item.destructive
                ? "rgba(255, 107, 157, 0.2)"
                : "rgba(223, 128, 255, 0.2)",
            }}
          >
            <View style={styles.menuItemContent}>
              {item.icon && (
                <MaterialDesignIcons
                  name={item.icon as any}
                  size={22}
                  color={item.destructive ? "#ff6b9d" : "#df80ff"}
                  style={styles.menuIcon}
                />
              )}
              <Text
                style={[
                  styles.menuText,
                  item.destructive && styles.menuTextDestructive,
                ]}
              >
                {item.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  backdropPressable: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  menuContainer: {
    position: "absolute",
    minWidth: 200,
    backgroundColor: "#2b0b4f",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    zIndex: 1001,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  menuItemFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItemLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuItemPressed: {
    backgroundColor: "rgba(223, 128, 255, 0.15)",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 22,
  },
  menuText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  menuTextDestructive: {
    color: "#ff6b9d",
  },
});
