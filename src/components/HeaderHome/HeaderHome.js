import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Bell, Check, Pill, Star } from 'lucide-react-native';

const TUTOR_IMAGE = require('../../assets/rayan_lindo.webp');

export default function HeaderHome({ 
  userName = 'Rayan', 
  showSearch = true,
  showBackButton = false,
  onBackPress,
  showNotifications = true,
  showGreeting = true,
  userProfileImage = null
}) {
  const navigation = useNavigation();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notificationCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'Consulta Confirmada',
      message: 'Sua consulta com o Dr. Silva foi confirmada para amanhã às 14h',
      time: '2h atrás',
      icon: Check,
      color: '#10B981'
    },
    {
      id: 2,
      title: 'Lembrete de Medicação',
      message: 'Hora de dar o remédio para a Missy',
      time: '5h atrás',
      icon: Pill,
      color: '#F59E0B'
    },
    {
      id: 3,
      title: 'Novo Recurso',
      message: 'Confira o novo recurso de Tinder Pet!',
      time: '1d atrás',
      icon: Star,
      color: '#8B5CF6'
    },
  ];

  return (
    <>
      <View style={styles.container}>
        {/* GREETING SECTION */}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingLeft}>
            {showBackButton ? (
              <TouchableOpacity 
                style={styles.backBtn}
                onPress={onBackPress}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            ) : null}
            {showGreeting && (
              <View>
                <Text style={styles.greeting}>
                  {showBackButton ? 'Bem-vindo!' : `Olá ${userName}`}
                </Text>
                <Text style={styles.subGreeting}>
                  {showBackButton ? `Olá, ${userName}` : 'Que você tenha um excelente atendimento!'}
                </Text>
              </View>
            )}
          </View>
          {showNotifications && (
            <View style={styles.rightContainer}>
              <TouchableOpacity 
                style={styles.notificationBtn}
                onPress={() => setShowNotifModal(true)}
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
              >
                <Image 
                  source={userProfileImage ? { uri: userProfileImage } : TUTOR_IMAGE} 
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SEARCH BAR */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="O que deseja procurar"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterIcon}>⊕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* MODAL DE NOTIFICAÇÕES */}
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
              <TouchableOpacity onPress={() => setShowNotifModal(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationsList}>
              {notifications.map((notif) => (
                <TouchableOpacity key={notif.id} style={styles.notificationItem}>
                  <View style={[styles.notifIcon, { backgroundColor: notif.color }]}>
                    <notif.icon size={16} color="white" />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => {
                setShowNotifModal(false);
                setTimeout(() => navigation.navigate('NotificacoesGerais'), 300);
              }}
            >
              <Text style={styles.seeAllBtnText}>Ver Todas as Notificações →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

