import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './sidebarStyle';
import { User, Settings, LogOut } from 'lucide-react-native';

export default function Sidebar({ visible, onClose, onLogout }) {
  const navigation = useNavigation();

  const menuItems = [
    { id: 1, label: 'Meu Perfil', icon: User, color: '#4A90E2', route: 'Configuracoes' },
    { id: 2, label: 'Configurações', icon: Settings, color: '#7E869E', route: 'Configuracoes' },
    { id: 3, label: 'Sair', icon: LogOut, color: '#EF4444', isLogout: true },
  ];

  const handlePress = (item) => {
    if (item.isLogout) {
      onLogout();
    } else if (item.route) {
      navigation.navigate(item.route);
    }

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Toca pra fechar */}
        <TouchableOpacity 
          style={styles.clickArea} 
          onPress={onClose}
        />

        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  item.isLogout && styles.menuItemLogout,
                ]}
                onPress={() => handlePress(item)}
              >
                <item.icon size={20} color={item.color} />
                <Text style={[styles.menuLabel, item.isLogout && styles.menuLabelLogout]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Versão 1.0.0</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
