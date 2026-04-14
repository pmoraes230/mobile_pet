import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function EsqueciSenha() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>
          Enviamos um código para o seu e-mail. Digite o endereço cadastrado para continuar.
        </Text>

        <TextInput
          placeholder="Digite seu e-mail"
          placeholderTextColor="#A0A7E6"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CodigoSenha')}>
          <Text style={styles.buttonText}>Enviar código</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
