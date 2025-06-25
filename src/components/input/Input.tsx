import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import {styles} from "./styles"
import { StyleSheet } from "react-native";

type Props = TextInputProps & {
        place: string
}

export function Input({place, ...rest}: Props) {
      const [isFocused, setIsFocused] = useState(false);

    return(
            <View style={styles.wrapper}>
        <TextInput style={[
            styles.input,
            isFocused && 
            styles.inputFocused
            ]}
        placeholder={place} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)} 
           {...rest}
           >
         
        </TextInput>
        </View>
    )
    
}