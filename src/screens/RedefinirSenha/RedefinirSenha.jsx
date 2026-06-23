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
import { ChevronLeft, Eye, EyeOff, KeyRound } from 'lucide-react-native';
import { styles } from './styles';
import { alterarSenhaRecuperacao } from '../../services/recuperacaoSenha';
import { useAppAlert } from '../../components/AppAlert';
import { useAppTheme } from '../../theme/ThemeContext';

export default function RedefinirSenha() {
  const navigation = useNavigation();
  const route = useRoute();
  const alert = useAppAlert();
  const { isDarkMode } = useAppTheme();
  const email = route.params?.email || '';
  const codigo = route.params?.codigo || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !codigo) {
      alert?.showAlert('Código não encontrado', 'Volte e solicite um novo código.');
      navigation.navigate('EsqueciSenha');
      return;
    }

    if (password.length < 8) {
      alert?.showAlert('Senha muito curta', 'A nova senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      alert?.showAlert('Senhas diferentes', 'Confirme a senha exatamente igual a nova senha.');
      return;
    }

    try {
      setLoading(true);
      await alterarSenhaRecuperacao({ email, senha: password, codigo });
      alert?.showAlert('Senha alterada', 'Sua senha foi atualizada com sucesso.', [
        {
          text: 'Entrar',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ]);
    } catch (error) {
      alert?.showAlert(
        'Não foi possível alterar',
        error?.response?.data?.error || error?.response?.data?.message || 'Tente novamente em alguns instantes.'
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

          <Text style={[styles.title, isDarkMode && styles.titleDark]}>Alterar senha</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            Crie uma nova senha para acessar sua conta.
          </Text>

          <Text style={[styles.label, isDarkMode && styles.labelDark]}>NOVA SENHA</Text>
          <View style={[styles.inputWrap, isDarkMode && styles.inputWrapDark]}>
            <TextInput
              placeholder="Digite sua nova senha"
              placeholderTextColor={isDarkMode ? '#D6DEFF' : '#98A1B3'}
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                isDarkMode && styles.inputDark,
                { color: isDarkMode ? '#FFFFFF' : '#172033' },
              ]}
              selectionColor={isDarkMode ? '#C084FC' : '#8B13DB'}
              cursorColor={isDarkMode ? '#C084FC' : '#8B13DB'}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff size={19} color={isDarkMode ? '#FFFFFF' : '#64748B'} />
              ) : (
                <Eye size={19} color={isDarkMode ? '#FFFFFF' : '#64748B'} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, isDarkMode && styles.labelDark]}>CONFIRMAR SENHA</Text>
          <View style={[styles.inputWrap, isDarkMode && styles.inputWrapDark]}>
            <TextInput
              placeholder="Confirme sua nova senha"
              placeholderTextColor={isDarkMode ? '#D6DEFF' : '#98A1B3'}
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.input,
                isDarkMode && styles.inputDark,
                { color: isDarkMode ? '#FFFFFF' : '#172033' },
              ]}
              selectionColor={isDarkMode ? '#C084FC' : '#8B13DB'}
              cursorColor={isDarkMode ? '#C084FC' : '#8B13DB'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
            >
              {showConfirmPassword ? (
                <EyeOff size={19} color={isDarkMode ? '#FFFFFF' : '#64748B'} />
              ) : (
                <Eye size={19} color={isDarkMode ? '#FFFFFF' : '#64748B'} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Alterar senha"
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Alterar senha</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
