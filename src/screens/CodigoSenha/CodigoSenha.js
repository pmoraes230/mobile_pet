import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';

export default function CodigoSenha() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');

  const digits = code.split('');

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#6B7280" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.title}>Insira o código</Text>
        <Text style={styles.subtitle}>
          Enviamos um código de segurança para o seu e-mail. Digite-o para continuar.
        </Text>

        <View style={styles.codeRow}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.codeBox}>
              <Text style={styles.codeText}>{digits[index] ?? ''}</Text>
            </View>
          ))}
        </View>

        <TextInput
          value={code}
          onChangeText={(value) => setCode(value.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={5}
          style={styles.hiddenInput}
          autoFocus
        />

        <TouchableOpacity onPress={() => navigation.navigate('RedefinirSenha')} style={styles.button}>
          <Text style={styles.buttonText}>Confirmar código</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.resendText}>Reenviar código</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
