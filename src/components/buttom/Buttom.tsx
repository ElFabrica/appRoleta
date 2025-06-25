import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import {styles} from "./style"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

type Props =TouchableOpacityProps & {
        title: string
        size?: number
}

export function Button({title,size = 16, ...rest}: Props) {

    return(
        <TouchableOpacity style={styles.container} {...rest} activeOpacity={0.8} >
            <Text style={[styles.title, {fontSize:RFValue(size)}]}>{title}</Text>
        </TouchableOpacity>
    )
    
}