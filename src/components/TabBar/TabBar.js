import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './tabBarStyle';

export default function TabBar({ activeTab = 'home', onTabPress }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', color: '#F4C542' },
    { id: 'mensagens', label: 'Mensagens', icon: '📋', color: '#999' },
    { id: 'consultas', label: 'Consultas', icon: '➕', color: '#999' },
    { id: 'configuracoes', label: 'Configurações', icon: '👥', color: '#999' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress && onTabPress(tab.id)}
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
  );
}
