import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { User, Settings, LogOut } from 'lucide-react-native';

import { logout } from '../../services/auth';

export default function Sidebar({ visible, onClose }) {
  const navigation = useNavigation();
  
  // Estados do Modal Customizado
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const menuItems = [
    { id: 1, label: 'Meu Perfil', icon: User, color: '#4A90E2', route: 'Perfil' },
    { id: 2, label: 'Configurações', icon: Settings, color: '#7E869E', route: 'Configuracoes' },
    { id: 3, label: 'Sair', icon: LogOut, color: '#EF4444', isLogout: true },
  ];

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setConfirmModalVisible(false);
      onClose();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error(error);
      setConfirmModalVisible(false);
    }
  };

  const handlePress = (item) => {
    if (item.isLogout) {
      setConfirmModalVisible(true);   // Abre o pop-up de confirmação
    } else if (item.route) {
      navigation.navigate(item.route);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.clickArea} onPress={onClose} />

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

      {/* ==================== POP-UP CUSTOMIZADO DE CONFIRMAÇÃO ==================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LogOut size={48} color="#EF4444" style={{ marginBottom: 16 }} />
            
            <Text style={styles.modalTitle}>Deseja realmente sair?</Text>
            <Text style={styles.modalMessage}>
              Você precisará fazer login novamente para acessar o app.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
