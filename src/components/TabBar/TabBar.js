import React, { useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import Sidebar from '../Sidebar/Sidebar';
import { Home, PawPrint, CalendarDays, MessageCircle, LayoutGrid } from 'lucide-react-native';

export default function TabBar({ onLogout, activeTab, onTabPress }) {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [showSidebar, setShowSidebar] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const activeColor = '#9127E1';
  const inactiveColor = '#A0A7BA';

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
    } else if (currentRouteKey !== tabId.toLowerCase()) {
      navigation.navigate(tabId);
    }

    if (typeof onTabPress === 'function') {
      onTabPress(tabId);
    }
  };

  const currentRouteKey = String(route.name || '').toLowerCase();
  const activeKey = currentRouteKey || String(activeTab || '').toLowerCase();

  useEffect(() => {
    const showKeyboard = () => {
      setKeyboardVisible(true);
    };
    const hideKeyboard = () => {
      setKeyboardVisible(false);
    };

    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', showKeyboard),
      Keyboard.addListener('keyboardDidShow', showKeyboard),
      Keyboard.addListener('keyboardWillHide', hideKeyboard),
      Keyboard.addListener('keyboardDidHide', hideKeyboard),
      Keyboard.addListener('keyboardWillChangeFrame', showKeyboard),
      Keyboard.addListener('keyboardDidChangeFrame', showKeyboard),
    ];

    const focusInterval = setInterval(() => {
      const focusedInput = TextInput.State?.currentlyFocusedInput?.();
      setKeyboardVisible(Boolean(focusedInput));
    }, 250);

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
      clearInterval(focusInterval);
    };
  }, []);

  if (keyboardVisible) {
    return null;
  }

  return (
    <>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {tabs.map((tab) => {
          const isActive = activeKey === tab.id.toLowerCase();

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              hitSlop={8}
            >
              <tab.icon
                size={22}
                color={isActive ? activeColor : inactiveColor}
                strokeWidth={isActive ? 3 : 2}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '900' : '700' },
                ]}
              >
                {tab.label}
              </Text>
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
