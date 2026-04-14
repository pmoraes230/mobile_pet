import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import { styles } from "./styles";

export default function ButtonLogin({ onPress, title }) {
    return (
        <TouchableOpacity onPress={{ onPress }} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}
