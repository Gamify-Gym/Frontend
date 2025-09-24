import ExerciseSelected from "@/components/WorkoutSelected";
import { fakeTreinoData } from "@/components/fakeData";
import TreinoSelector, {
  Exercise,
  TreinoType,
} from "@/components/WorkoutSelector";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useAuth } from "@/context/authContext";
import EditMenu from "@/components/editMenu";
import FAB from "@/components/FAB";

export default function Treino() {
  const [selectedTreino, setSelectedTreino] = useState<TreinoType | null>(null);
  const [treino, setTreino] = useState<[TreinoType] | []>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [creationMenuVisible, setCreationMenuVisible] =
    useState<boolean>(false);
  const [menuCoords, setMenuCoords] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [selectedItem, setSelectedItem] = useState<
    Exercise | TreinoType | null
  >(null);
  const { token } = useAuth();

  const handleTreinoChange = (treino: TreinoType) => {
    setSelectedTreino(null);
    setTimeout(() => setSelectedTreino(treino), 0);
  };
  const handleLongPress = (
    item: Exercise | TreinoType,
    event: GestureResponderEvent
  ) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuCoords({ x: pageX, y: pageY });
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
      setSelectedItem(null);
      setMenuCoords({ x: null, y: null });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/training/workout`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        if (!res.ok) {
          console.error("Request failed", res.status);
          const errorText = await res.text();
          setTreino([]);
          throw new Error(errorText);
        }
        const json = await res.json();
        console.log(json);
        setTreino(json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCreateWorkout = async () => {};

  return (
    <Pressable style={styles.container} onPress={() => closeMenu()}>
      {menuVisible && (
        <EditMenu
          selectedItem={selectedItem}
          actions={[
            {
              label: "Hell",
              action: () => console.log("hello " + selectedItem?.name),
            },
            {
              label: "Menu",
              action: () => console.log("menu " + selectedItem?.name),
            },
            {
              label: "Test",
              action: () => console.log("test " + selectedItem?.name),
            },
          ]}
          // Ignore esse erro, não tem problema
          coords={{ x: menuCoords.x - 15, y: menuCoords.y - 100 }}
        />
      )}
      {creationMenuVisible && (
        <div style={{ width: 100, height: 100, backgroundColor: "black" }} />
      )}
      <TreinoSelector
        treinoData={treino}
        onPress={handleTreinoChange}
        onLongPress={(e, event) => handleLongPress(e, event)}
      ></TreinoSelector>

      <ScrollView
        style={styles.exerciseScroll}
        contentContainerStyle={{ paddingBottom: 23 }}
        showsVerticalScrollIndicator={false}
      >
        <ExerciseSelected
          treino={selectedTreino}
          onLongPress={(e, event) => handleLongPress(e, event)}
        />
        <FAB label="Novo treino" onClick={handleCreateWorkout} />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "#ffffffff",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffffff",
    marginTop: 6,
    textShadowColor: "#ffffffff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  exerciseScroll: {
    width: "100%",
  },
});
