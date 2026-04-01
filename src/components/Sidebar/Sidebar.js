import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './sidebarStyle';

export default function Sidebar({ visible, onClose, onLogout }) {
  const menuItems = [
    { id: 1, label: 'Meu Perfil', icon: '👤', color: '#4A90E2' },
    { id: 2, label: 'Configurações', icon: '⚙️', color: '#7E869E' },
    { id: 3, label: 'Sair', icon: '🚪', color: '#EF4444', isLogout: true },
  ];

  const handlePress = (item) => {
    if (item.isLogout) {
      onLogout();
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
                <Text style={[styles.menuIcon, { color: item.color }]}>
                  {item.icon}
                </Text>
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
