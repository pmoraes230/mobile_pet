import { View, Text, StyleSheet, Image } from "react-native";
import { InputEmail } from "../components/inputs/inputEmail";

export default function LoginApp() {
    return (
        <View style={styles.container}>
            <Image source={
                require("../assets/pet.png")}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.text}>Login</Text>
            <InputEmail
                value=""
                onChangeText={() => {}}
                error={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#573F94",
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    image: {
        width: 200,
        height: 200,
    },
})
