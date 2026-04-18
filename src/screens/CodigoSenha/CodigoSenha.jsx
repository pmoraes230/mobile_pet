import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';

export default function CodigoSenha() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');

  const digits = code.split('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color="#6B7280" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text style={styles.title}>Insira o código</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de segurança para o seu e-mail. Digite-o para continuar.
          </Text>

          {/* Caixas de Código */}
          <View style={styles.codeRow}>
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.codeBox}>
                <Text style={styles.codeText}>{digits[index] ?? ''}</Text>
              </View>
            ))}
          </View>

          {/* Input oculto para digitação */}
          <TextInput
            value={code}
            onChangeText={(value) => setCode(value.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={5}
            style={styles.hiddenInput}
            autoFocus
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('RedefinirSenha')}
          >
            <Text style={styles.buttonText}>Confirmar código</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.resendText}>Reenviar código</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}