import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Check, Pill, Star, ChevronLeft, SlidersHorizontal, X } from 'lucide-react-native';
import { styles } from './styles';
import { getUserInfo } from '../../services/auth';

const TUTOR_IMAGE = require('../../assets/user_default.png');

export default function HeaderHome({
  userName = 'Tutor',
  showSearch = true,
  showBackButton = false,
  onBackPress,
  showNotifications = true,
  showGreeting = true,
  userProfileImage = null,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notificationCount] = useState(3);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let mounted = true;

    getUserInfo().then((info) => {
      if (mounted) setUserData(info);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Consulta Confirmada',
      message: 'Sua consulta com o Dr. Silva foi confirmada para amanhã às 14h',
      time: '2h atrás',
      icon: Check,
      color: '#10B981',
    },
    {
      id: 2,
      title: 'Lembrete de Medicação',
      message: 'Hora de dar o remédio para a Missy',
      time: '5h atrás',
      icon: Pill,
      color: '#F59E0B',
    },
    {
      id: 3,
      title: 'Novo Recurso',
      message: 'Confira o novo recurso de Tinder Pet!',
      time: '1d atrás',
      icon: Star,
      color: '#8B5CF6',
    },
  ];

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
                <ChevronLeft size={24} color="#0D214F" strokeWidth={2.5} />
              </TouchableOpacity>
            ) : null}

            {showGreeting && (
              <View style={styles.greetingInfo}>
                <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
                  {showBackButton ? 'Bem-vindo!' : `Olá ${userData?.nome || userName}`}
                </Text>
                <Text style={styles.subGreeting} numberOfLines={1} ellipsizeMode="tail">
                  {showBackButton
                    ? `Olá, ${userData?.nome || userName}`
                    : 'Que você tenha um excelente atendimento!'}
                </Text>
              </View>
            )}
          </View>

          {showNotifications && (
            <View style={styles.rightContainer}>
              <TouchableOpacity
                style={styles.notificationBtn}
                onPress={() => setShowNotifModal(true)}
                accessibilityRole="button"
                accessibilityLabel="Abrir notificações"
                accessibilityHint="Exibe a central de notificações"
              >
                <Bell size={20} color="#333" />
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
            <TextInput
              placeholder="O que deseja procurar"
              placeholderTextColor="#999"
              style={styles.searchInput}
              accessibilityLabel="Campo de busca"
            />
            <TouchableOpacity
              style={styles.filterBtn}
              accessibilityRole="button"
              accessibilityLabel="Filtrar busca"
              accessibilityHint="Abre filtros de pesquisa"
            >
              <SlidersHorizontal size={18} color="#9127E1" strokeWidth={2.2} />
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificações</Text>
              <TouchableOpacity
                onPress={() => setShowNotifModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar notificações"
                accessibilityHint="Fecha a central de notificações"
              >
                <X size={22} color="#7E869E" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationsList}>
              {notifications.map((notif) => (
                <View
                  key={notif.id}
                  style={styles.notificationItem}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel={`${notif.title}. ${notif.message}. ${notif.time}`}
                >
                  <View style={[styles.notifIcon, { backgroundColor: notif.color }]}>
                    <notif.icon size={16} color="white" />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => {
                setShowNotifModal(false);
                setTimeout(() => navigation.navigate('NotificacoesGerais'), 300);
              }}
              accessibilityRole="button"
              accessibilityLabel="Ver todas as notificações"
              accessibilityHint="Abre a lista completa de notificações"
            >
              <Text style={styles.seeAllBtnText}>Ver Todas as Notificações →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
