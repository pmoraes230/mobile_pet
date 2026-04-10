import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PawPrint, RefreshCw, X, Info, MapPin, ChevronDown, Zap } from 'lucide-react-native';
import { styles } from '../style/cupidopetstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TinderPet() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <HeaderHome 
          userName="Pedro" 
          showSearch={false} 
          showBackButton={true} 
          showGreeting={false} 
          onBackPress={() => navigation.goBack()} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 1. FILTROS NO TOPO */}
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText} numberOfLines={1}>Estado</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText} numberOfLines={1}>Cidade</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>
          </View>

          {/* 2. CARD DA FOTO (MAIOR AGORA) */}
          <View style={styles.mainCard}>
            <Image 
              source={{ uri: 'https://placekitten.com/500/800' }} 
              style={styles.cardImg} 
            />
            <View style={styles.infoOverlay}>
              <Text style={styles.cardName}>Niça, <Text style={{fontWeight: '300'}}>12a</Text></Text>
              <Text style={styles.cardBio} numberOfLines={2}>
                Eu sou um gatinho muito bonito e educado esperando uma parceira para amar.
              </Text>
              <Text style={styles.cardBreed}>GATO • BRANCO MISTO</Text>
            </View>
          </View>

          {/* 3. BOTÕES DE INTERAÇÃO */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.btnSmall}>
              <X size={28} color="#A0A7BA" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMain}>
               <PawPrint size={40} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnSmall}
              onPress={() => navigation.navigate('detalhespet')}
            >
              <Info size={28} color="#4A90E2" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* 4. STATUS DO MEU PET */}
          <View style={styles.activePetWidget}>
            <Image 
              source={{ uri: 'https://placekitten.com/150/150' }} 
              style={styles.activePetImg} 
            />
            <View style={styles.activePetInfo}>
              <Text style={styles.activePetName}>Missy (Seu pet)</Text>
              <View style={styles.badgeRow}>
                <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>👃 6 Cheiradas</Text></View>
                <View style={[styles.miniBadge, {backgroundColor: '#FFF4EE'}]}><Text style={[styles.miniBadgeText, {color: '#FF7A2F'}]}>🐾 1 Petch</Text></View>
              </View>
            </View>
            <TouchableOpacity><RefreshCw size={18} color="#9127E1" /></TouchableOpacity>
          </View>

          {/* 5. AMIGOS RECENTES */}
          <View style={styles.friendsHeader}>
             <Text style={styles.sectionTitle}>Amigos recentes</Text>
             <Zap size={14} color="#FF7A2F" fill="#FF7A2F" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.friendBubble}>
              <View style={styles.haloEffect}>
                <Image source={{ uri: 'https://placekitten.com/100/100' }} style={styles.friendImg} />
              </View>
              <Text style={styles.friendName}>Patrick</Text>
            </View>
            <View style={styles.friendBubble}>
              <View style={[styles.haloEffect, {borderColor: '#E2E8F0'}]}>
                <Image source={{ uri: 'https://placekitten.com/110/110' }} style={styles.friendImg} />
              </View>
              <Text style={styles.friendName}>Luna</Text>
            </View>
          </ScrollView>

        </ScrollView>

        <TabBar />
      </View>
    </SafeAreaView>
  );
}