import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { useAppTheme } from '../../theme/ThemeContext';
import { getUserInfo } from '../../services/auth';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../../services/notificacoes';

export default function Configuracoes() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [lembretesVacinas, setLembretesVacinas] = useState(true);
  const [dicasSemanais, setDicasSemanais] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { isDarkMode, setThemeMode } = useAppTheme();

  useEffect(() => {
    let mounted = true;

    getUserInfo().then((info) => {
      if (mounted) {
        setUserEmail(info?.email || '');
      }
    });

    getNotificationPreferences()
      .then((preferences) => {
        if (mounted) {
          setPushEnabled(preferences.pushEnabled);
          setLembretesVacinas(preferences.vaccineRemindersEnabled);
          setDicasSemanais(preferences.weeklyTipsEnabled);
        }
      })
      .catch((error) => {
        console.log('Erro ao carregar preferencias de notificacao:', error?.response?.data || error?.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveNotificationPreferences = async (nextPreferences) => {
    if (savingNotifications) return;

    setSavingNotifications(true);

    try {
      const savedPreferences = await updateNotificationPreferences({
        pushEnabled,
        vaccineRemindersEnabled: lembretesVacinas,
        weeklyTipsEnabled: dicasSemanais,
        ...nextPreferences,
      });

      setPushEnabled(savedPreferences.pushEnabled);
      setLembretesVacinas(savedPreferences.vaccineRemindersEnabled);
      setDicasSemanais(savedPreferences.weeklyTipsEnabled);
    } catch (error) {
      console.log('Erro ao salvar preferencias de notificacao:', error?.response?.data || error?.message);
      alert('Nao foi possivel salvar as preferencias de notificacao.');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'mensagens') {
      navigation.navigate('Mensagens');
    }
    if (tabId === 'consultas') {
      alert('Ir para Consultas (nao implementado)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <HeaderHome
          userName="Rayan"
          showSearch={false}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          showGreeting={true}
          showNotifications={false}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>Configuracoes da Conta</Text>
          <Text style={styles.pageSubtitle}>
            Ajuste seu app do jeito que voce prefere.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Aparencia</Text>
            <Text style={styles.cardDescription}>
              Ative o modo escuro quando quiser. O app continua claro por padrao.
            </Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Modo escuro</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                    thumbColor={isDarkMode ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>
                  Essa escolha fica salva para as proximas vezes.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Idioma</Text>
            <Text style={styles.cardDescription}>Escolha o idioma da plataforma.</Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Portugues (Brasil)</Text>
              <View style={styles.badgeValue}>
                <Text style={styles.badgeText}>Selecionado</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notificacoes</Text>
            <Text style={styles.cardDescription}>Gerencie alertas e lembretes.</Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Notificacoes no celular</Text>
                  <Switch
                    value={pushEnabled}
                    disabled={savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ pushEnabled: value })}
                    thumbColor={pushEnabled ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>
                  Receba avisos do app direto na aba de notificacoes do celular.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Lembretes de vacinas</Text>
                  <Switch
                    value={lembretesVacinas}
                    disabled={!pushEnabled || savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ vaccineRemindersEnabled: value })}
                    thumbColor={lembretesVacinas ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>
                  Receba lembretes para as vacinas do seu pet.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Dicas semanais de cuidados</Text>
                  <Switch
                    value={dicasSemanais}
                    disabled={!pushEnabled || savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ weeklyTipsEnabled: value })}
                    thumbColor={dicasSemanais ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>
                  Receba dicas para cuidar melhor do seu pet.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Privacidade</Text>
            <Text style={styles.cardDescription}>Controle quem ve seus dados.</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EsqueciSenha', userEmail ? { email: userEmail } : undefined)}
              accessibilityRole="button"
              accessibilityLabel="Redefinir minha senha"
            >
              <Text style={styles.actionButtonText}>Redefinir minha senha</Text>
            </TouchableOpacity>
            <Text style={styles.comingSoon}>Autenticacao 2 Fatores em breve</Text>
          </View>

          <View style={[styles.card, styles.dangerCard]}>
            <Text style={[styles.cardTitle, styles.dangerTitle]}>Desativar conta</Text>
            <Text style={[styles.cardDescription, styles.dangerDescription]}>
              Ao desativar sua conta, voce perdera acesso permanente a todos os seus pets, registros e historico. Essa acao e irreversivel.
            </Text>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
              <Text style={styles.actionButtonText}>DESATIVAR MINHA CONTA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onLogout={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

