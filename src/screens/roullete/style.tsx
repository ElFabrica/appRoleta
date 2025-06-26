import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    Container: {
        width: '100%',
        gap: 30,
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        flex:1
    },
    imagem: {
        width: 150,
        height: 100,
        position: "absolute",
        top: 0,
        right: 0
    },
    Title: {
        fontSize: RFValue(30),
        fontWeight: 700,
        color: "#ab5500",
        textAlign:"center"
    },
    subContainer:{
        justifyContent:"center",
        borderRadius:10,
        padding: 16,
        alignItems:"center"
    }
})