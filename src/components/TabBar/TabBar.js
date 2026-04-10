import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './tabBarStyle';
import Sidebar from '../Sidebar/Sidebar';

// Ícones Lucide
import { 
  Home, 
  PawPrint, 
  CalendarDays, 
  MessageCircle, 
  LayoutGrid 
} from 'lucide-react-native';

export default function TabBar({ onLogout }) {
  const navigation = useNavigation();
  const route = useRoute(); // Hook para saber em qual tela estamos
  const insets = useSafeAreaInsets();
  const [showSidebar, setShowSidebar] = useState(false);

  const activeColor = '#9127E1'; // Roxo
  const inactiveColor = '#A0A7BA'; // Cinza

  // O ID aqui deve ser EXATAMENTE o nome da rota no seu App.js
  const tabs = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'MeusPets', label: 'Pets', icon: PawPrint },
    { id: 'Agendamento', label: 'Agenda', icon: CalendarDays },
    { id: 'Mensagens', label: 'Chat', icon: MessageCircle },
    { id: 'geral', label: 'Menu', icon: LayoutGrid },
  ];

  const handleTabPress = (tabId) => {
    if (tabId === 'geral') {
      setShowSidebar(true);
    } else {
      navigation.navigate(tabId);
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {tabs.map((tab) => {
          // COMPARAÇÃO: Se o nome da rota atual for igual ao ID da tab
          const isActive = route.name === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.6}
            >
              <tab.icon 
                size={22} 
                color={isActive ? activeColor : inactiveColor} 
                strokeWidth={isActive ? 3 : 2} // Ícone fica mais "gordinho" quando ativo
              />
              <Text style={[
                styles.label, 
                { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '900' : '700' }
              ]}>
                {tab.label}
              </Text>
              
              {/* Pontinho indicador embaixo da aba ativa (estilo moderno) */}
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <Sidebar 
        visible={showSidebar} 
        onClose={() => setShowSidebar(false)}
        onLogout={onLogout}
      />
    </>
  );
}