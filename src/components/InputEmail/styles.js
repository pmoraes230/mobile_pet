import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
});
