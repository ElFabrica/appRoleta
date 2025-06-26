import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    container :{
        backgroundColor: "#A06101",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 30,
        paddingRight: 30,
        height:60
        
    },
    title: {
        color:"#FFFFFF",
        fontSize: RFValue(16),
        fontWeight: 600
    }
})