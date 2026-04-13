import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Frown, Meh, Smile } from 'lucide-react-native';
import { styles } from '../style/diariostyle';
import TabBar from '../components/TabBar/TabBar';
import HeaderHome from '../components/Header/HeaderHome';

export default function TelaDiario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('consultas');
  const [mood, setMood] = useState('happy');

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const registros = [
    { id: 1, pet: 'Missy', data: '12/03 • 17:21', relato: 'se sentiu sozinho', icon: Frown },
    { id: 2, pet: 'Missy', data: '12/03 • 16:46', relato: 'acordou muito feliz', icon: Smile },
    { id: 3, pet: 'Missy', data: '12/03 • 16:39', relato: 'ficou triste sem a comida', icon: Frown },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <HeaderHome userName="Rayan" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* GRÁFICO (Tendência Semanal) */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Tendência semanal</Text>
            <View style={styles.petBadge}>
              <Text style={styles.petBadgeText}>MISSY</Text>
            </View>
          </View>
          {/* Aqui você usaria uma lib como react-native-chart-kit, deixei o espaço */}
          <View style={styles.chartPlaceholder}>
            <Text style={{color: '#A0A7BA'}}>Área do Gráfico</Text>
          </View>
        </View>

        {/* CARD DE REGISTRO RÁPIDO (ROXO) */}
        <View style={styles.inputCard}>
          <View style={styles.emojiRow}>
            <TouchableOpacity 
              style={[styles.emojiBtn, mood === 'sad' && styles.emojiSelected]} 
              onPress={() => setMood('sad')}
            >
              <Frown size={30} color={mood === 'sad' ? '#FFF' : '#A0A7BA'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.emojiBtn, mood === 'neutral' && styles.emojiSelected]} 
              onPress={() => setMood('neutral')}
            >
              <Meh size={30} color={mood === 'neutral' ? '#FFF' : '#A0A7BA'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.emojiBtn, mood === 'happy' && styles.emojiSelected]} 
              onPress={() => setMood('happy')}
            >
              <Smile size={30} color={mood === 'happy' ? '#FFF' : '#A0A7BA'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.labelWhite}>ESCOLHER PET</Text>
          <TouchableOpacity style={styles.selectWhite}>
            <Text style={{color: '#FFF'}}>Missy</Text>
          </TouchableOpacity>

          <Text style={styles.labelWhite}>RELATO DO DIA</Text>
          <TextInput 
            style={styles.inputWhite}
            placeholder="Como foi o dia dele?"
            placeholderTextColor="#A0A7BA"
            multiline
          />

          <TouchableOpacity style={styles.btnFull}>
            <Text style={styles.btnFullText}>NOVO REGISTRO COMPLETO</Text>
          </TouchableOpacity>
        </View>

        {/* REGISTROS RECENTES */}
        <Text style={styles.sectionTitle}>Registros recentes</Text>
        {registros.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <item.icon size={20} color="#A0A7BA" />
            <View style={styles.historyInfo}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyName}>{item.pet}</Text>
                <Text style={styles.historyDate}>{item.data}</Text>
              </View>
              <Text style={styles.historyText}>{item.relato}</Text>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* TAB BAR */}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
    </SafeAreaView>
  );
}