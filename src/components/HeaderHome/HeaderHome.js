import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  CalendarCheck,
  ChevronLeft,
  HandHeart,
  Heart,
  PawPrint,
  Pill,
  SlidersHorizontal,
  Syringe,
  X,
} from 'lucide-react-native';
import { styles } from './styles';
import { getUserInfo } from '../../services/auth';
import {
  getNotificacoes,
  marcarTodasNotificacoesComoLidas,
} from '../../services/notificacoes';
import { registerForPushNotificationsAsync } from '../../services/pushNotifications';
import { useAppTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

const TUTOR_IMAGE = require('../../assets/user_default.png');

export default function HeaderHome({
  userName = 'Tutor',
  showSearch = true,
  showBackButton = false,
  onBackPress,
  showNotifications = true,
  showGreeting = true,
  userProfileImage = null,
  onSearch,
  searchValue = '',
  searchPlaceholder = 'O que deseja procurar',
  onFilterPress,
  filterActive = false,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppTheme();
  const { language, t } = useLanguage();
  const headerIconColor = isDarkMode ? '#F5F7FF' : '#0D214F';
  const notificationIconColor = isDarkMode ? '#E9D5FF' : '#333';
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [userData, setUserData] = useState(null);

  const getNotificationMeta = (tipo = '') => {
    const normalizedType = String(tipo).toLowerCase();

    if (normalizedType.includes('match')) {
      return { title: t('Novo match'), icon: Heart, color: '#EC4899' };
    }

    if (normalizedType.includes('adoc')) {
      return { title: t('Adoção'), icon: HandHeart, color: '#14B8A6' };
    }

    if (normalizedType.includes('vacina')) {
      return { title: t('Vacina'), icon: Syringe, color: '#0EA5E9' };
    }

    if (normalizedType.includes('medic')) {
      return { title: t('Medicamento'), icon: Pill, color: '#F59E0B' };
    }

    if (normalizedType.includes('consulta') || normalizedType.includes('agenda')) {
      return { title: t('Agendamento'), icon: CalendarCheck, color: '#10B981' };
    }

    return { title: t('Notificação'), icon: PawPrint, color: '#536DFE' };
  };

  const translateNotificationMessage = (message) => {
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

  const formatNotificationDate = (date) => {
    if (!date) return t('Agora');

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return t('Agora');
    }

    return parsedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const normalizeNotification = (item) => {
    const meta = getNotificationMeta(item?.tipo);

    return {
      id: item.id,
      title: meta.title,
      message: translateNotificationMessage(item.mensagem),
      time: formatNotificationDate(item.data_criacao),
      read: Boolean(item.lida),
      icon: meta.icon,
      color: meta.color,
    };
  };

  const loadNotifications = useCallback(async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) {
        setLoadingNotifications(true);
      }

      const data = await getNotificacoes({ limit: 5 });
      const normalizedNotifications = data.notificacoes.map(normalizeNotification);

      setNotifications(normalizedNotifications);
      setNotificationCount(data.unreadCount);
      return {
        ...data,
        notifications: normalizedNotifications,
      };
    } catch (error) {
      console.log('Erro ao carregar notificações:', error?.response?.data || error?.message);
    } finally {
      setLoadingNotifications(false);
    }
  }, [language, t]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      getUserInfo().then((info) => {
        if (mounted) {
          setUserData(info);
        }
      });

      return () => {
        mounted = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (showNotifications) {
        loadNotifications();
        registerForPushNotificationsAsync();
      }
    }, [loadNotifications, showNotifications])
  );

  const openNotifications = async () => {
    setShowNotifModal(true);

    try {
      const data = await loadNotifications({ showLoading: true });

      if (data?.unreadCount > 0) {
        setNotifications((current) => current.map((item) => ({ ...item, read: true })));
        setNotificationCount(0);
        await marcarTodasNotificacoesComoLidas();
      }
    } catch (error) {
      console.log('Erro ao abrir notificações:', error?.response?.data || error?.message);
      loadNotifications();
    }
  };
  return (
    <>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <View style={[styles.greetingContainer, !showSearch && styles.greetingContainerNoSearch]}>
          <View style={styles.greetingLeft}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                accessibilityHint="Retorna para a tela anterior"
              >
                <ChevronLeft size={24} color={headerIconColor} strokeWidth={2.5} />
              </TouchableOpacity>
            ) : null}

            {showGreeting && (
              <View style={styles.greetingInfo}>
                <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
                  {showBackButton ? t('Bem-vindo!') : `${t('Olá')} ${userData?.nome || userName}`}
                </Text>
                <Text style={styles.subGreeting} numberOfLines={1} ellipsizeMode="tail">
                  {showBackButton
                    ? `${t('Olá')}, ${userData?.nome || userName}`
                    : t('Que você tenha um excelente atendimento!')}
                </Text>
              </View>
            )}
          </View>

          {showNotifications && (
            <View style={styles.rightContainer}>
              <TouchableOpacity
                style={styles.notificationBtn}
                onPress={openNotifications}
                accessibilityRole="button"
                accessibilityLabel="Abrir notificações"
                accessibilityHint="Exibe a central de notificações"
              >
                <Bell size={20} color={notificationIconColor} />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileBtn}
                onPress={() => navigation.navigate('Perfil')}
                accessibilityRole="button"
                accessibilityLabel="Abrir perfil"
                accessibilityHint="Vai para a tela de perfil"
              >
                <Image
                  source={
                    userData?.imagem
                      ? { uri: userData.imagem }
                      : userProfileImage
                        ? { uri: userProfileImage }
                        : TUTOR_IMAGE
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchField}>
              <TextInput
                placeholder={searchPlaceholder}
                placeholderTextColor="#999"
                style={styles.searchInput}
                accessibilityLabel="Campo de busca"
                value={searchValue}
                returnKeyType="search"
                blurOnSubmit
                onChangeText={(text) => {
                  if (onSearch) {
                    onSearch(text);
                  }
                }}
              />

              {searchValue ? (
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => onSearch?.('')}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                >
                  <X size={16} color="#7E869E" strokeWidth={2.5} />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
              onPress={onFilterPress}
              accessibilityRole="button"
              accessibilityLabel="Filtrar busca"
              accessibilityHint="Abre filtros de pesquisa"
            >
              <SlidersHorizontal size={18} color={filterActive ? '#FFF' : '#9127E1'} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showNotifModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={[styles.modalHeader, isDarkMode && styles.modalHeaderDark]}>
                <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark, isDarkMode && { color: '#F8FAFC' }]}>
                  {t('Notificações')}
                </Text>
              <View style={styles.modalActions}>

                <TouchableOpacity
                  onPress={() => setShowNotifModal(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar notificações"
                  accessibilityHint="Fecha a central de notificações"
                >
                  <X size={22} color={isDarkMode ? '#AEB6CC' : '#7E869E'} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.notificationsList}>
              {loadingNotifications ? (
                <View style={styles.notificationEmpty}>
                  <ActivityIndicator color="#9127E1" />
                  <Text style={[styles.notificationEmptyText, isDarkMode && styles.notificationEmptyTextDark]}>{t('Carregando notificações...')}</Text>
                </View>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    style={[
                      styles.notificationItem,
                      isDarkMode && styles.notificationItemDark,
                      !notif.read && styles.notificationItemUnread,
                      isDarkMode && !notif.read && styles.notificationItemUnreadDark,
                    ]}
                    activeOpacity={0.75}
                    accessibilityLabel={`${notif.title}. ${notif.message}. ${notif.time}`}
                  >
                    <View style={[styles.notifIcon, { backgroundColor: notif.color }]}>
                      <notif.icon size={16} color="white" />
                    </View>
                    <View style={styles.notifContent}>
                      <View style={styles.notifTitleRow}>
                        <Text
                          style={[
                            styles.notifTitle,
                            isDarkMode && styles.notifTitleDark,
                            isDarkMode && { color: '#FFFFFF' },
                          ]}
                        >
                          {notif.title}
                        </Text>
                        {!notif.read ? <View style={styles.unreadDot} /> : null}
                      </View>
                      <Text
                        style={[
                          styles.notifMessage,
                          isDarkMode && styles.notifMessageDark,
                          isDarkMode && { color: '#E8ECF7' },
                        ]}
                      >
                        {notif.message}
                      </Text>
                      <Text
                        style={[
                          styles.notifTime,
                          isDarkMode && styles.notifTimeDark,
                          isDarkMode && { color: '#CBD5E1' },
                        ]}
                      >
                        {notif.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.notificationEmpty}>
                  <Text style={[styles.notificationEmptyText, isDarkMode && styles.notificationEmptyTextDark]}>{t('Nenhuma notificação por enquanto.')}</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.seeAllBtn, isDarkMode && styles.seeAllBtnDark]}
              onPress={() => {
                setShowNotifModal(false);
                setTimeout(() => navigation.navigate('NotificacoesGerais'), 300);
              }}
              accessibilityRole="button"
              accessibilityLabel="Ver todas as notificações"
              accessibilityHint="Abre a lista completa de notificações"
            >
              <Text style={[styles.seeAllBtnText, isDarkMode && styles.seeAllBtnTextDark]}>{t('Ver Todas as Notificações →')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
