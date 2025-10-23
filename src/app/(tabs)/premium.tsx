import { View, StyleSheet } from "react-native";
import ParentView from "@/components/general/ParentView";

export default function Premium() {
  return (
    <ParentView>
      <View style={styles.container}>
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
  },
});
