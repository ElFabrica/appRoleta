import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


export const styles = StyleSheet.create({
    container:{
        flex: 1
    },

    subContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        height: 100,
        marginBottom: 24

    },
    imagem: {
        width: 150,
        height: 100,
        position: "absolute",
        top: 0,
        right: 0

    },
    Title: {
        fontSize: RFValue(36),
        fontWeight: 700,
        color: "#ab5500"
    },
    subTitile: {
        fontSize: RFValue(26),
        fontWeight: 800,
        color: "#de8228"
    },
        textInstructions: {
        fontSize: RFValue(18),
        fontWeight: 600,
        color: "#FFFFFF",
        textAlign:"center"
    },
    containerInstructions:{
        justifyContent:"center",
        backgroundColor:"#de8328",
        borderRadius:10,
        padding: 16
    }

})
