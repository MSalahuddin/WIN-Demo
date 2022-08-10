import { StyleSheet } from "react-native";
import { color } from "../../styles";

export const styles =  StyleSheet.create({
    shadedeTextStyle: {
      textShadowColor: color.black,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    }
  })