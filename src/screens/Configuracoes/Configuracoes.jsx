import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
import { useLanguage } from '../../i18n/LanguageContext';

export default function Configuracoes() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [lembretesVacinas, setLembretesVacinas] = useState(true);
  const [dicasSemanais, setDicasSemanais] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { isDarkMode, setThemeMode } = useAppTheme();
  const { language, setLanguage, t } = useLanguage();

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
        console.log('Erro ao carregar preferências de notificação:', error?.response?.data || error?.message);
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
      console.log('Erro ao salvar preferências de notificação:', error?.response?.data || error?.message);
      Alert.alert(t('Erro'), t('Não foi possível salvar as preferências de notificação.'));
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
      Alert.alert(t('Em breve'), t('A área de consultas ainda não foi implementada.'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
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
          <Text style={[styles.pageTitle, isDarkMode && styles.pageTitleDark]}>{t('Configurações da Conta')}</Text>
          <Text style={[styles.pageSubtitle, isDarkMode && styles.pageSubtitleDark]}>
            {t('Ajuste seu app do jeito que você prefere.')}
          </Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark]}>{t('Aparência')}</Text>
            <Text style={[styles.cardDescription, isDarkMode && styles.cardDescriptionDark]}>
              {t('Ative o modo escuro quando quiser. O app continua claro por padrão.')}
            </Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>{t('Modo escuro')}</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                    thumbColor={isDarkMode ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={[styles.optionHint, isDarkMode && styles.optionHintDark]}>
                  {t('Essa escolha fica salva para as próximas vezes.')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark]}>{t('Idioma')}</Text>
            <Text style={[styles.cardDescription, isDarkMode && styles.cardDescriptionDark]}>{t('Escolha o idioma da plataforma.')}</Text>
            <View style={styles.languageRow}>
              <TouchableOpacity
                style={[styles.languageButton, isDarkMode && styles.languageButtonDark, language === 'pt' && styles.languageButtonActive]}
                onPress={() => setLanguage('pt')}
              >
                <Text style={[styles.languageButtonText, language === 'pt' && styles.languageButtonTextActive]}>
                  PT
                </Text>
                <Text style={[styles.languageButtonLabel, isDarkMode && styles.languageButtonLabelDark, language === 'pt' && styles.languageButtonTextActive]}>
                  {t('Português (Brasil)')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageButton, isDarkMode && styles.languageButtonDark, language === 'en' && styles.languageButtonActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>
                  EN
                </Text>
                <Text style={[styles.languageButtonLabel, isDarkMode && styles.languageButtonLabelDark, language === 'en' && styles.languageButtonTextActive]}>
                  {t('Inglês')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark, isDarkMode && { color: '#F8FAFC' }]}>
              {t('Notificações')}
            </Text>
            <Text style={[styles.cardDescription, isDarkMode && styles.cardDescriptionDark]}>{t('Gerencie alertas e lembretes.')}</Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark, isDarkMode && { color: '#F8FAFC' }]}>
                    {t('Notificações no celular')}
                  </Text>
                  <Switch
                    value={pushEnabled}
                    disabled={savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ pushEnabled: value })}
                    thumbColor={pushEnabled ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={[styles.optionHint, isDarkMode && styles.optionHintDark]}>
                  {t('Receba avisos do app direto na aba de notificações do celular.')}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>{t('Lembretes de vacinas')}</Text>
                  <Switch
                    value={lembretesVacinas}
                    disabled={!pushEnabled || savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ vaccineRemindersEnabled: value })}
                    thumbColor={lembretesVacinas ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={[styles.optionHint, isDarkMode && styles.optionHintDark]}>
                  {t('Receba lembretes para as vacinas do seu pet.')}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>{t('Dicas semanais de cuidados')}</Text>
                  <Switch
                    value={dicasSemanais}
                    disabled={!pushEnabled || savingNotifications}
                    onValueChange={(value) => saveNotificationPreferences({ weeklyTipsEnabled: value })}
                    thumbColor={dicasSemanais ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={[styles.optionHint, isDarkMode && styles.optionHintDark]}>
                  {t('Receba dicas para cuidar melhor do seu pet.')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark]}>{t('Privacidade')}</Text>
            <Text style={[styles.cardDescription, isDarkMode && styles.cardDescriptionDark]}>{t('Controle quem vê seus dados.')}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EsqueciSenha', userEmail ? { email: userEmail } : undefined)}
              accessibilityRole="button"
              accessibilityLabel={t('Redefinir minha senha')}
            >
              <Text style={styles.actionButtonText}>{t('Redefinir minha senha')}</Text>
            </TouchableOpacity>
            <Text style={[styles.comingSoon, isDarkMode && styles.comingSoonDark]}>{t('Autenticação em 2 fatores em breve')}</Text>
          </View>

          <View style={[styles.card, styles.dangerCard]}>
            <Text style={[styles.cardTitle, styles.dangerTitle]}>{t('Desativar conta')}</Text>
            <Text style={[styles.cardDescription, styles.dangerDescription]}>
              {t('Ao desativar sua conta, você perderá acesso permanente a todos os seus pets, registros e histórico. Essa ação é irreversível.')}
            </Text>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
              <Text style={styles.actionButtonText}>{t('DESATIVAR MINHA CONTA')}</Text>
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

