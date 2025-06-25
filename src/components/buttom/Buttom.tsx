import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import {styles} from "./style"

type Props =TouchableOpacityProps & {
        title: string
        size?: number
}

export function Button({title,size = 18, ...rest}: Props) {

    return(
        <TouchableOpacity style={styles.container} {...rest} activeOpacity={0.8} >
            <Text style={[styles.title, {fontSize:size}]}>{title}</Text>
        </TouchableOpacity>
    )
    
}