import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';
import { useAppTheme } from '../../theme/ThemeContext';

export default function DashboardCard({ icon: Icon, title, description, badge, onPress }) {
  const { isDarkMode } = useAppTheme();
  const iconColor = isDarkMode ? '#E9D5FF' : '#333';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      {badge && <View style={styles.badge} />}
      <View style={styles.iconContainer} accessible={false}>
        <Icon size={32} color={iconColor} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );
}
