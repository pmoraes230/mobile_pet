import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';

export default function RedefinirSenha() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#6B7280" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.title}>Redefinir senha</Text>
        <Text style={styles.subtitle}>
          Digite sua nova senha e confirme para acessar sua conta novamente.
        </Text>

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#A0A7E6"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#A0A7E6"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Confirmar senha</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
