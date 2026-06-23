import React, { useRef, useState } from 'react';
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
import { ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';
import {
  solicitarCodigoRecuperacao,
  verificarCodigoRecuperacao,
} from '../../services/recuperacaoSenha';
import { useAppAlert } from '../../components/AppAlert';
import { useAppTheme } from '../../theme/ThemeContext';

export default function CodigoSenha() {
  const navigation = useNavigation();
  const route = useRoute();
  const alert = useAppAlert();
  const { isDarkMode } = useAppTheme();
  const hiddenInputRef = useRef(null);
  const email = route.params?.email || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const digits = code.split('');

  const handleChangeCode = (value) => {
    setCode(value.replace(/[^0-9]/g, '').slice(0, 5));
  };

  const handleSubmit = async () => {
    if (!email) {
      alert?.showAlert('E-mail não encontrado', 'Volte e informe o e-mail novamente.');
      navigation.goBack();
      return;
    }

    if (code.length !== 5) {
      alert?.showAlert('Código incompleto', 'Digite os 5 números enviados para o seu e-mail.');
      return;
    }

    try {
      setLoading(true);
      await verificarCodigoRecuperacao({ email, codigo: code });
      navigation.navigate('RedefinirSenha', { email, codigo: code });
    } catch (error) {
      alert?.showAlert(
        'Código inválido',
        error?.response?.data?.error || error?.response?.data?.message || 'Confira o código e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;

    try {
      setResending(true);
      await solicitarCodigoRecuperacao(email);
      alert?.showAlert('Código enviado', 'Enviamos um novo código para o seu e-mail.');
    } catch (error) {
      alert?.showAlert(
        'Não foi possível reenviar',
        error?.response?.data?.error || error?.response?.data?.message || 'Tente novamente em alguns instantes.'
      );
    } finally {
      setResending(false);
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

          <Text style={[styles.title, isDarkMode && styles.titleDark]}>Insira o código</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            Se houver uma conta para este e-mail, enviamos um código para continuar.
          </Text>

          <TouchableOpacity
            style={styles.codeRow}
            activeOpacity={1}
            onPress={() => hiddenInputRef.current?.focus()}
            accessibilityRole="button"
            accessibilityLabel="Digitar código de verificação"
          >
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.codeBox,
                  isDarkMode && styles.codeBoxDark,
                  digits[index] && styles.codeBoxFilled,
                  isDarkMode && digits[index] && styles.codeBoxFilledDark,
                ]}
              >
                <Text style={[styles.codeText, isDarkMode && styles.codeTextDark]}>
                  {digits[index] ?? ''}
                </Text>
              </View>
            ))}
          </TouchableOpacity>

          <TextInput
            ref={hiddenInputRef}
            value={code}
            onChangeText={handleChangeCode}
            keyboardType="number-pad"
            maxLength={5}
            style={styles.hiddenInput}
            autoFocus
            textContentType="oneTimeCode"
          />

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={resending}
            accessibilityRole="button"
            accessibilityLabel="Solicitar novo código"
          >
            <Text style={[styles.resendText, isDarkMode && styles.resendTextDark]}>
              {resending ? 'Enviando...' : 'Solicitar novo código'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Enviar código"
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar</Text>}
          </TouchableOpacity>

          <Text style={[styles.footerText, isDarkMode && styles.footerTextDark]}>
            Caso não encontre o e-mail na caixa de entrada, verifique a pasta de spam.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
