import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";



export const styles = StyleSheet.create({
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
        fontSize: RFValue(32),
        fontWeight: 700,
        color: "#ab5500",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center"
    },
    subTitile: {
        fontSize: RFValue(16),
        fontWeight: 800,
        color: "#333333"
    },
        textInstructions: {
        fontSize: 24,
        fontWeight: 600,
        color: "#FFFFFF",
        textAlign:"center"
    },
    containerInstructions:{
        justifyContent:"center",
        backgroundColor:"#de8328",
        borderRadius:10,
        padding: 16
    },
    containerButton:{
        flexDirection: "row",
        justifyContent: "center",
        width: '100%',
        height: 100,
        marginBottom: 24

    }

})
