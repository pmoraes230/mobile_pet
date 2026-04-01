import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/cupidopetstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TinderPet() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <HeaderHome userName="Pedro" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />
        
        {/* SCROLL CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* TOP: PET ATIVO */}
          <View style={styles.activePetHeader}>
            <Image 
              source={{ uri: 'https://placekitten.com/100/100' }} 
              style={styles.activePetImg} 
            />
            <View style={styles.activePetInfo}>
              <Text style={styles.activePetName}>Missy</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statBadge}>👃 6 Cheiradas</Text>
                <Text style={styles.statBadge}>🐾 1 Petch</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.btnTrocar}>
              <Text style={{fontSize: 10, fontWeight: 'bold', color: '#0D214F'}}>🔄 Trocar</Text>
            </TouchableOpacity>
          </View>

          {/* AMIGOS RECENTES (Scroll Horizontal) */}
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>AMIGOS RECENTES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* Exemplo de um amigo */}
              <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 8, borderRadius: 15, marginRight: 10}}>
                <Image source={{ uri: 'https://placekitten.com/50/50' }} style={{width: 35, height: 35, borderRadius: 8}} />
                <View style={{marginLeft: 8}}>
                  <Text style={{fontSize: 12, fontWeight: 'bold'}}>mini patrick</Text>
                  <Text style={{fontSize: 8, color: '#FF7A2F', fontWeight: 'bold'}}>DEU CHEIRADA!</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* CARD PRINCIPAL (NIÇA) */}
          <View style={styles.mainCard}>
            <Image 
              source={{ uri: 'https://placekitten.com/400/600' }} 
              style={styles.cardImg} 
            />
            <View style={styles.infoOverlay}>
              <Text style={styles.cardName}>Niça <Text style={styles.cardAge}>12a</Text></Text>
              <Text style={styles.cardBreed}>BRANCO</Text>
            </View>
          </View>

          {/* BOTÕES DE AÇÃO */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.btnCircle}>
              <Text style={styles.iconX}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMain}>
               <Text style={{fontSize: 35}}>🐾</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCircle}>
              <Text style={styles.iconI}>i</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}