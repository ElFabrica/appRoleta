import { StyleSheet } from "react-native";


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
        fontSize: 44,
        fontWeight: 700,
        color: "#ab5500",
        textAlign:"center"
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
    subContainer:{
        justifyContent:"center",
        borderRadius:10,
        padding: 16,
        alignItems:"center"
    }

})
