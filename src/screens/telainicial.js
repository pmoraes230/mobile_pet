import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from '../style/telainicialstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TelaInicial() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleCardPress = (cardId) => {
    switch(cardId) {
      case 1:
        navigation.navigate('Agendamento');
        break;
      case 2:
        navigation.navigate('Prontuario');
        break;
      case 3:
        navigation.navigate('Diario');
        break;
      case 4:
        navigation.navigate('MeusPets');
        break;
      case 5:
        navigation.navigate('Cupidopet');
        break;
      case 6:
        navigation.navigate('Adocao');
        break;
      default:
        break;
    }
  };

  const cards = [
    {
      id: 1,
      title: 'Agendamento',
      description: 'Acesse o Agendamento de Consultas.',
      icon: '📅',
      color: '#E8D5F7',
    },
    {
      id: 2,
      title: 'Prontuário',
      description: 'Acesse o prontuário de seus pets.',
      icon: '📋',
      color: '#E8D5F7',
    },
    {
      id: 3,
      title: 'Diário emocional',
      description: 'Registre o diário.',
      icon: '📓',
      color: '#E8D5F7',
    },
    {
      id: 4,
      title: 'Meus pets',
      description: 'Acesse seus pets.',
      icon: '🐾',
      color: '#E8D5F7',
    },
    {
      id: 5,
      title: 'cupidopet',
      description: 'Faça o seu pet encontrar um novo parceiro.',
      icon: '💜',
      color: '#E8D5F7',
      badge: true,
    },
    {
      id: 6,
      title: 'Adoção',
      description: 'Adote um pet e dê uma nova chance.',
      icon: '🐶',
      color: '#E8D5F7',
    },
  ];

  const navigation = useNavigation();

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'mensagens') {
      navigation.navigate('Mensagens');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <HeaderHome userName="Pedro" />

        {/* SCROLL CARDS */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.gridContainer}>
            {cards.map((card) => (
              <TouchableOpacity 
                key={card.id} 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleCardPress(card.id)}
              >
                {card.badge && <View style={styles.badge} />}
                
                <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                  <Text style={styles.cardIcon}>{card.icon}</Text>
                </View>
                
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
