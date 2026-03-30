import { View, TextInput, Text, StyleSheet } from "react-native";
import { useState } from "react";

export const InputEmail = ({ value, onChangeText, error }) => {
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

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 15,
        backgroundColor: "#ffffff",
        borderRadius: 16,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#333",
    },
    inputFocused: {
        borderColor: "#FFCB00",
        borderWidth: 2,
        borderRadius: 16,
    },
    inputError: {
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 16,
    },
})