import { StyleSheet } from "react-native";


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
        fontSize: 44,
        fontWeight: 700,
        color: "#ab5500",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center"
    },
    subTitile: {
        fontSize: 30,
        fontWeight: 800,
        color: "#de8228"
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
