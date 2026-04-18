import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import { InputEmail } from "../../components/InputEmail";

export default function LoginApp() {
    return (
        <View style={styles.container}>
            <Image source={
                require("../../assets/pet.png")}
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
