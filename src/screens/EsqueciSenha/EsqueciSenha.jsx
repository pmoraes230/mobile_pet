import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, KeyRound } from 'lucide-react-native';
import { styles } from './styles';
import { solicitarCodigoRecuperacao } from '../../services/recuperacaoSenha';
import { useAppAlert } from '../../components/AppAlert';
import { useAppTheme } from '../../theme/ThemeContext';

export default function EsqueciSenha() {
  const navigation = useNavigation();
  const route = useRoute();
  const alert = useAppAlert();
  const { isDarkMode } = useAppTheme();
  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      alert?.showAlert('E-mail obrigatório', 'Informe seu e-mail para receber o código.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      alert?.showAlert('E-mail inválido', 'Digite um e-mail válido para continuar.');
      return;
    }

    try {
      setLoading(true);
      await solicitarCodigoRecuperacao(normalizedEmail);
      navigation.navigate('CodigoSenha', { email: normalizedEmail });
    } catch (error) {
      alert?.showAlert(
        'Não foi possível enviar',
        error?.response?.data?.error || error?.response?.data?.message || 'Verifique o e-mail e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.screenContainer, isDarkMode && styles.screenContainerDark]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ChevronLeft size={18} color={isDarkMode ? '#FFFFFF' : '#26344D'} strokeWidth={2.4} />
            <Text style={[styles.backText, isDarkMode && styles.backTextDark]}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <KeyRound size={27} color="#FFF" strokeWidth={2.6} />
          </View>

          <Text style={[styles.title, isDarkMode && styles.titleDark]}>Recuperar senha</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            Informe seu e-mail para receber as instruções.
          </Text>

          <Text style={[styles.label, isDarkMode && styles.labelDark]}>EMAIL</Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor={isDarkMode ? '#D6DEFF' : '#98A1B3'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              isDarkMode && styles.inputDark,
              { color: isDarkMode ? '#FFFFFF' : '#172033' },
            ]}
            selectionColor={isDarkMode ? '#C084FC' : '#8B13DB'}
            cursorColor={isDarkMode ? '#C084FC' : '#8B13DB'}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Continuar recuperação de senha"
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
