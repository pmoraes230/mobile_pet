import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { styles } from './styles';

export default function ConversationCard({ avatar, name, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={styles.actionBadge}>
        <Text style={styles.actionText}>CHAT</Text>
      </View>
    </TouchableOpacity>
  );
}
