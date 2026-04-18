import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';

export default function App() {
  const router = useRouter(); // 👈 ADICIONADO

  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/pet.png')} // 👈 AJUSTADO CAMINHO
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>
        Coração em Patas
      </Text>

      <TouchableOpacity 
        style={styles.botaoResp}
        onPress={() => router.push('/responsavellogin')} // 👈 ALTERADO
      >
        <Text style={styles.textoBotao}>Sou Responsável</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

