import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './tabBarStyle';
import Sidebar from '../Sidebar/Sidebar';
import { Home, Clipboard, Plus, Settings } from 'lucide-react-native';

export default function TabBar({ activeTab = 'home', onTabPress, onLogout }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showSidebar, setShowSidebar] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, color: '#F4C542' },
    { id: 'mensagens', label: 'Mensagens', icon: Clipboard, color: '#999' },
    { id: 'consultas', label: 'Consultas', icon: Plus, color: '#999' },
    { id: 'geral', label: 'Geral', icon: Settings, color: '#999' },
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
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 5) }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
          >
            <tab.icon size={24} color={activeTab === tab.id ? tab.color : '#999'} />
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
