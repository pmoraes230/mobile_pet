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

const getNotificationMeta = (tipo = '') => {
  const normalizedType = String(tipo).toLowerCase();

  if (normalizedType.includes('match')) {
    return { titulo: 'Novo match', icon: Heart, color: '#EC4899' };
  }

  if (normalizedType.includes('adoc')) {
    return { titulo: 'Adocao', icon: HandHeart, color: '#14B8A6' };
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

  return { titulo: 'Notificacao', icon: PawPrint, color: '#536DFE' };
};

const formatNotificationDate = (date) => {
  if (!date) return 'Agora';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Agora';
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeNotification = (item) => {
  const meta = getNotificationMeta(item?.tipo);

  return {
    id: item.id,
    titulo: meta.titulo,
    descricao: item.mensagem || 'VocÃª tem uma nova notificaÃ§Ã£o.',
    data: formatNotificationDate(item.data_criacao),
    lida: Boolean(item.lida),
    icon: meta.icon,
    color: meta.color,
  };
};

const NotificacoesGerais = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const [showAll, setShowAll] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificacoes({ limit: showAll ? 60 : 20 });
      setNotificacoes(data.notificacoes.map(normalizeNotification).map((item) => ({ ...item, lida: true })));
      setUnreadCount(0);

      if (data.unreadCount > 0) {
        await marcarTodasNotificacoesComoLidas();
      }
    } catch (error) {
      console.log('Erro ao carregar notificaÃ§Ãµes:', error?.response?.data || error?.message);
      setNotificacoes([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [showAll]);

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
                <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
                  Todas as NotificaÃ§Ãµes
                </Text>
                <Text style={[styles.sectionSubtitle, isDarkMode && styles.sectionSubtitleDark]}>
                  {unreadCount > 0 ? `${unreadCount} nÃ£o lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator color="#9127E1" />
                <Text style={[styles.noNotificacoes, isDarkMode && styles.noNotificacoesDark]}>
                  Carregando notificaÃ§Ãµes...
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
                            style={[styles.notificacaoTitulo, isDarkMode && styles.notificacaoTituloDark]}
                            numberOfLines={1}
                          >
                            {item.titulo}
                          </Text>
                          {!item.lida ? <View style={styles.unreadDot} /> : null}
                        </View>
                        <Text style={[styles.notificacaoDescricao, isDarkMode && styles.notificacaoDescricaoDark]}>
                          {item.descricao}
                        </Text>
                        <Text style={[styles.notificacaoData, isDarkMode && styles.notificacaoDataDark]}>
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
                    <Text style={styles.toggleButtonText}>{showAll ? 'Mostrar menos' : 'Ver tudo'}</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <View style={[styles.emptyCard, isDarkMode && styles.emptyCardDark]}>
                <Bell size={26} color={isDarkMode ? '#A78BFA' : '#9127E1'} />
                <Text style={[styles.noNotificacoes, isDarkMode && styles.noNotificacoesDark]}>
                  Nenhuma notificaÃ§Ã£o disponÃ­vel.
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


