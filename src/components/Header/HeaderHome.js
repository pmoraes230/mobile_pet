import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './headerHomeStyle';

export default function HeaderHome({ userName = 'Pedro' }) {
  return (
    <View style={styles.container}>
      {/* GREETING */}
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.greeting}>Olá {userName}</Text>
          <Text style={styles.subGreeting}>Que você tenha um excelente atendimento!</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="O que deseja procurar"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⊕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
