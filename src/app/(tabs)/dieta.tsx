import { View, StyleSheet } from "react-native";
import { useDieta } from "@/hooks/useDietas";
import DietaSelector from "@/components/dieta/dietaSelector";
import ParentView from "@/components/general/ParentView";

export default function Dieta() {
  const { dieta } = useDieta();
  return (
    <ParentView>
      <View style={styles.container}>
        <DietaSelector data={dieta} onPress={() => {}} onLongPress={() => {}} />
      </View>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b1031",
    paddingTop: 60,
  },
});
