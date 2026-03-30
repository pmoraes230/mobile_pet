import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashApp() {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace("Login");
        }, 3000);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={
                require("../assets/pet.png")}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#573F94",
    },
    image: {
        width: 180,
        height: 180,
    },
});