import { 
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/responsavelloginstyle';

export default function ResponsavelLogin() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* BOTÃO VOLTAR
      <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>←</Text>
      </TouchableOpacity> */}

      {/* LOGO */}
      <Image
        source={require('../assets/pet.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>BEM VINDO!</Text>

      <Text style={styles.subtitulo}>
        Insira o e-mail e a senha cadastrados.
      </Text>

      {/* INPUT EMAIL */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
      />

      {/* INPUT SENHA */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
      />

      {/* ESQUECI SENHA */}
      <TouchableOpacity>
        <Text style={styles.esqueci}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* BOTÃO ENTRAR */}
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>



      {/* CRIAR CONTA */}
      <Text style={styles.footer}>
        Ainda Não tem uma conta ? <Text 
          style={{ color: '#F4C542' }}
          onPress={() => navigation.navigate('Cadastro')}
        >Criar Conta</Text>
      </Text>

    </View>
  );
}

