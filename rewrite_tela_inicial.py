from pathlib import Path
path = Path(r"c:\mobile pet patrick\mobile_pet\src\pages\TelaInicial\TelaInicial.js")
text = '''import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { Calendar, Clipboard, BookOpen, PawPrint, Heart, Dog } from 'lucide-react-native';
import HeaderHome from '../../components/HeaderHome';
import DashboardCard from '../../components/DashboardCard';
import TabBar from '../../components/TabBar';

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
      icon: Calendar,
      color: '#E8D5F7',
    },
    {
      id: 2,
      title: 'Prontuário',
      description: 'Acesse o prontuário de seus pets.',
      icon: Clipboard,
      color: '#E8D5F7',
    },
    {
      id: 3,
      title: 'Diário emocional',
      description: 'Registre o diário.',
      icon: BookOpen,
      color: '#E8D5F7',
    },
    {
      id: 4,
      title: 'Meus pets',
      description: 'Acesse seus pets.',
      icon: PawPrint,
      color: '#E8D5F7',
    },
    {
      id: 5,
      title: 'cupidopet',
      description: 'Faça o seu pet encontrar um novo parceiro.',
      icon: Heart,
      color: '#E8D5F7',
      badge: true,
    },
    {
      id: 6,
      title: 'Adoção',
      description: 'Adote um pet e dê uma nova chance.',
      icon: Dog,
      color: '#E8D5F7',
    },
  ];

  const navigate = useNavigation();

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'mensagens') {
      navigate.navigate('Mensagens');
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
          {/* PRÓXIMO COMPROMISSO CARD */}
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>Próximo Compromisso</Text>
            <Text style={styles.appointmentMain}>Sem agendamentos</Text>
            <Text style={styles.appointmentSubtitle}>Tudo tranquilo por enquanto.</Text>
          </View>

          <View style={styles.gridContainer}>
            {cards.map((card) => (
              <DashboardCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                badge={card.badge}
                onPress={() => handleCardPress(card.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
'''
path.write_text(text, encoding='utf-8')
print('rewrote file')
