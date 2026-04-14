import { View, TextInput, Text } from "react-native";
import { styles } from "./styles";
import { styles } from "./styles";
import { useState } from "react";

export function InputEmail({ value, onChangeText, error }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Email"

                // Critical props for Email:
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
            />
        </View>
    )
}

export default InputEmail;
