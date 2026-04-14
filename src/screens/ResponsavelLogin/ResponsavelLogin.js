import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function ResponsavelLogin() {
  const navigation = useNavigation();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/pet.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.titulo}>Bem vindo!</Text>
        <Text style={styles.subtitulo}>Acesse sua conta e gerencie seus pets com facilidade.</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#A0A7E6"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#A0A7E6"
          secureTextEntry
          style={styles.input}
        />

<TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}> 
          <Text style={styles.esqueci}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Ainda não tem uma conta?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Cadastro')}>
            Criar conta
          </Text>
        </Text>
      </View>
    </View>
  );
}

