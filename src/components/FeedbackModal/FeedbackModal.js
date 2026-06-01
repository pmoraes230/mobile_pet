import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export default function FeedbackModal({
  visible,
  title,
  message,
  type = 'info',
  buttonText = 'Entendi',
  onClose,
}) {
  const getIconText = () => {
    if (type === 'success') return 'OK';
    if (type === 'error') return '!';
    return 'i';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View
            style={[
              styles.icon,
              type === 'success' && styles.iconSuccess,
              type === 'error' && styles.iconError,
              type === 'warning' && styles.iconWarning,
            ]}
          >
            <Text style={styles.iconText}>{getIconText()}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
