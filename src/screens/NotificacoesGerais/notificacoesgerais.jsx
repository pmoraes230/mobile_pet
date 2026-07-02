import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Bell, CalendarCheck, HandHeart, Heart, PawPrint, Pill, Syringe } from 'lucide-react-native';
import { styles } from './style';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';
import {
  getNotificacoes,
  marcarTodasNotificacoesComoLidas,
} from '../../services/notificacoes';
import { useAppTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

const getNotificationMeta = (tipo = '') => {
  const normalizedType = String(tipo).toLowerCase();

  if (normalizedType.includes('match')) {
    return { titulo: 'Novo match', icon: Heart, color: '#EC4899' };
  }

  if (normalizedType.includes('adoc')) {
    return { titulo: 'Adoção', icon: HandHeart, color: '#14B8A6' };
  }

  if (normalizedType.includes('vacina')) {
    return { titulo: 'Vacina', icon: Syringe, color: '#0EA5E9' };
  }

  if (normalizedType.includes('medic')) {
    return { titulo: 'Medicamento', icon: Pill, color: '#F59E0B' };
  }

  if (normalizedType.includes('consulta') || normalizedType.includes('agenda')) {
    return { titulo: 'Agendamento', icon: CalendarCheck, color: '#10B981' };
  }

  return { titulo: 'Notificação', icon: PawPrint, color: '#536DFE' };
};

const formatNotificationDate = (date, language = 'pt') => {
  if (!date) return language === 'en' ? 'Now' : 'Agora';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return language === 'en' ? 'Now' : 'Agora';
  }

  return parsedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const translateNotificationMessage = (message, t, language) => {
  const fallback = t('Você tem uma nova notificação.');
  if (!message) return fallback;

  const exact = t(message);
  if (language !== 'en' || exact !== message) return exact;

  return String(message)
    .replace(/\b[Vv]ocê\b/g, 'You')
    .replace(/\b[Ss]eu\b/g, 'Your')
    .replace(/\b[Ss]ua\b/g, 'Your')
    .replace(/\b[Ss]eus\b/g, 'Your')
    .replace(/\b[Ss]uas\b/g, 'Your')
    .replace(/\b[Tt]em\b/g, 'have')
    .replace(/\b[Nn]ova\b/g, 'new')
    .replace(/\b[Nn]ovo\b/g, 'new')
    .replace(/\b[Nn]otificação\b/g, 'notification')
    .replace(/\b[Cc]onsulta\b/g, 'appointment')
    .replace(/\b[Aa]gendamento\b/g, 'appointment')
    .replace(/\b[Aa]gendada\b/g, 'scheduled')
    .replace(/\b[Aa]gendado\b/g, 'scheduled')
    .replace(/\b[Cc]onfirmada\b/g, 'confirmed')
    .replace(/\b[Cc]onfirmado\b/g, 'confirmed')
    .replace(/\b[Cc]ancelada\b/g, 'canceled')
    .replace(/\b[Cc]ancelado\b/g, 'canceled')
    .replace(/\b[Pp]endente\b/g, 'pending')
    .replace(/\b[Vv]acina\b/g, 'vaccine')
    .replace(/\b[Vv]acinação\b/g, 'vaccination')
    .replace(/\b[Mm]edicamento\b/g, 'medication')
    .replace(/\b[Aa]doção\b/g, 'adoption')
    .replace(/\b[Ii]nteresse\b/g, 'interest')
    .replace(/\b[Hh]oje\b/g, 'today')
    .replace(/\b[Aa]manhã\b/g, 'tomorrow')
    .replace(/\b[Pp]ara\b/g, 'for')
    .replace(/\b[Dd]o\b/g, 'of')
    .replace(/\b[Dd]a\b/g, 'of')
    .replace(/\b[Dd]e\b/g, 'of');
};

const normalizeNotification = (item, t, language) => {
  const meta = getNotificationMeta(item?.tipo);

  return {
    id: item.id,
    titulo: t(meta.titulo),
    descricao: translateNotificationMessage(item.mensagem, t, language),
    data: formatNotificationDate(item.data_criacao, language),
    lida: Boolean(item.lida),
    icon: meta.icon,
    color: meta.color,
  };
};

const NotificacoesGerais = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const { t, language } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificacoes({ limit: showAll ? 60 : 20 });
      setNotificacoes(data.notificacoes.map((item) => normalizeNotification(item, t, language)).map((item) => ({ ...item, lida: true })));
      setUnreadCount(0);

      if (data.unreadCount > 0) {
        await marcarTodasNotificacoesComoLidas();
      }
    } catch (error) {
      console.log('Erro ao carregar notificações:', error?.response?.data || error?.message);
      setNotificacoes([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [showAll, t, language]);

  useFocusEffect(
    useCallback(() => {
      loadNotificacoes();
    }, [loadNotificacoes])
  );

  const itemsToShow = showAll ? notificacoes : notificacoes.slice(0, 8);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <HeaderHome
          showSearch={false}
          showGreeting={false}
          showBackButton={true}
          showNotifications={false}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.notificacoesArea}>
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark, isDarkMode && { color: '#F8FAFC' }]}>
                  {t('Todas as Notificações')}
                </Text>
                <Text style={[styles.sectionSubtitle, isDarkMode && styles.sectionSubtitleDark]}>
                  {unreadCount > 0
                    ? t('{{count}} não lida{{plural}}', { count: unreadCount, plural: unreadCount > 1 ? 's' : '' })
                    : t('Tudo em dia')}
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator color="#9127E1" />
                <Text style={[styles.noNotificacoes, isDarkMode && styles.noNotificacoesDark]}>
                  {t('Carregando notificações...')}
                </Text>
              </View>
            ) : itemsToShow.length > 0 ? (
              <>
                {itemsToShow.map((item) => {
                  const Icon = item.icon;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.notificacaoItem,
                        isDarkMode && styles.notificacaoItemDark,
                        !item.lida && styles.notificacaoItemUnread,
                        isDarkMode && !item.lida && styles.notificacaoItemUnreadDark,
                      ]}
                      activeOpacity={0.78}
                      accessibilityLabel={`${item.titulo}. ${item.descricao}. ${item.data}`}
                    >
                      <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                        <Icon size={18} color="#FFF" />
                      </View>

                      <View style={styles.notificacaoContent}>
                        <View style={styles.notificacaoRow}>
                          <Text
                            style={[
                              styles.notificacaoTitulo,
                              isDarkMode && styles.notificacaoTituloDark,
                              isDarkMode && { color: '#FFFFFF' },
                            ]}
                            numberOfLines={1}
                          >
                            {item.titulo}
                          </Text>
                          {!item.lida ? <View style={styles.unreadDot} /> : null}
                        </View>
                        <Text
                          style={[
                            styles.notificacaoDescricao,
                            isDarkMode && styles.notificacaoDescricaoDark,
                            isDarkMode && { color: '#E8ECF7' },
                          ]}
                        >
                          {item.descricao}
                        </Text>
                        <Text
                          style={[
                            styles.notificacaoData,
                            isDarkMode && styles.notificacaoDataDark,
                            isDarkMode && { color: '#CBD5E1' },
                          ]}
                        >
                          {item.data}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {notificacoes.length > 8 ? (
                  <TouchableOpacity
                    style={[styles.toggleButton, isDarkMode && styles.toggleButtonDark]}
                    onPress={() => setShowAll((prev) => !prev)}
                  >
                    <Text style={[styles.toggleButtonText, isDarkMode && { color: '#D8B4FE' }]}>
                      {showAll ? t('Mostrar menos') : t('Ver tudo')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <View style={[styles.emptyCard, isDarkMode && styles.emptyCardDark]}>
                <Bell size={26} color={isDarkMode ? '#A78BFA' : '#9127E1'} />
                <Text style={[styles.noNotificacoes, isDarkMode && styles.noNotificacoesDark]}>
                  {t('Nenhuma notificação disponível.')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TabBar />
      </View>
    </KeyboardAvoidingView>
  );
};

export default NotificacoesGerais;


