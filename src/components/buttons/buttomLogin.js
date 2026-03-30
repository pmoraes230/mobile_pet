import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const buttonLogin = ({ onPress, title  }) => {
    return (
        <TouchableOpacity onPress={{ onPress }} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#573F94",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
    }
})