import { Text } from "react-native";
// @ts-ignore
const CustomText = (props) => {
  return (
    <Text {...props} style={[{ fontFamily: "Roboto-Mono" }, props.style]}>
      {props.children}
    </Text>
  );
};

export default CustomText;
