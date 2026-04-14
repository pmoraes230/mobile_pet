import { useEffect } from "react";
import { View, Image } from "react-native";
import { styles } from "./styles";
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
                require("../../assets/pet.png")}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}