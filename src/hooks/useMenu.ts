import { GestureResponderEvent } from "react-native";
import { useState } from "react";

export function useMenu() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [menuCoords, setMenuCoords] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuCoords({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
      setMenuCoords({ x: null, y: null });
    }
  };

  return {
    menuVisible,
    setMenuVisible,
    menuCoords,
    selectedItem,
    setSelectedItem,
    handleLongPress,
    closeMenu,
  };
}
