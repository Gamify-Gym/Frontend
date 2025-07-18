import { useRouter } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

export default function LoginScreen() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
      }}
    >
      <Text>Login Screen </Text>
      <TouchableNativeFeedback
        onPress={() => {
          useRouter().push("/(tabs)/home");
        }}
      >
        <View>
          <Text>ir para home sem autenticar</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
