
import { StyleSheet } from "react-native";
import { scaleHeight } from "../../platformUtils";

export const styles = StyleSheet.create({
    scrollViewContainerStyle: {
        paddingBottom: scaleHeight(16)
    },
    refillIcon: {
        borderRadius: 100,
        overflow: 'hidden',
        height: 100,
        width: 100,
        position: 'absolute',
        alignSelf: 'center',
        top: -50, zIndex: 2
    },
    mainView: {
        height: 500,
        width: "80%",
    },
    modalImg: {
        height: "100%",
        width: '100%'
    }
});
