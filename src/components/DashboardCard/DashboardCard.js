import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';

export default function DashboardCard({ icon: Icon, title, description, badge, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      {badge && <View style={styles.badge} />}
      <View style={styles.iconContainer}>
        <Icon size={24} color="#333" />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );
}
