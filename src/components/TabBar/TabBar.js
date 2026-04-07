import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './tabBarStyle';
import Sidebar from '../Sidebar/Sidebar';

export default function TabBar({ activeTab = 'home', onTabPress, onLogout }) {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', color: '#F4C542' },
    { id: 'mensagens', label: 'Mensagens', icon: '📋', color: '#999' },
    { id: 'consultas', label: 'Consultas', icon: '➕', color: '#999' },
    { id: 'geral', label: 'Geral', icon: '⚙️', color: '#999' },
  ];

  const handleTabPress = (tabId) => {
    if (tabId === 'home') {
      navigation.navigate('Home');
    } else if (tabId === 'mensagens') {
      navigation.navigate('Mensagens');
    } else if (tabId === 'geral') {
      setShowSidebar(true);
    } else {
      onTabPress && onTabPress(tabId);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text style={[styles.icon, { color: activeTab === tab.id ? tab.color : '#999' }]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, { color: activeTab === tab.id ? tab.color : '#999' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Sidebar 
        visible={showSidebar} 
        onClose={() => setShowSidebar(false)}
        onLogout={onLogout}
      />
    </>
  );
}
