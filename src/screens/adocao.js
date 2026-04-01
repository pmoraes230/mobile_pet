import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/adocaostyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TelaAdocao() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const petsFeed = [
    {
      id: 1,
      nome: 'namorada',
      info: 'CACHORRO • VIRA-LATA COM MALTÊS',
      tutor: 'patrick',
      imagem: 'https://img.odcdn.com.br/wp-content/uploads/2021/05/the-riddler.jpg'
    },
    {
      id: 2,
      nome: 'Neymar Jr',
      info: 'CACHORRO • preto',
      tutor: 'calebe',
      imagem: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2023/02/19/1199341604-neymar-lesao-psg-lille.jpg'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <HeaderHome userName="Pedro" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>Adoção Responsável</Text>
            <Text style={styles.subtitle}>Gerencie seus anúncios e encontre novos amigos.</Text>
          </View>

          {/* BOTÃO ANUNCIAR */}
          <TouchableOpacity style={styles.btnAnnounce}>
            <Text style={{color: '#9127E1', fontWeight: 'bold', fontSize: 18}}>+</Text>
            <Text style={styles.btnAnnounceText}>Anunciar pet meu</Text>
          </TouchableOpacity>

          {/* SEUS PETS EM ANÚNCIO */}
          <Text style={styles.sectionLabel}>📢 Seus Pets em Anúncio</Text>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Você não tem nenhum pet anunciado no momento.</Text>
          </View>

          {/* DIVISOR FEED GLOBAL */}
          <View style={styles.feedDivider}>
            <View style={styles.line} />
            <Text style={styles.feedDividerText}>FEED GLOBAL</Text>
            <View style={styles.line} />
          </View>

          <Text style={[styles.sectionLabel, {marginBottom: 20}]}>🔍 Pets esperando por um lar</Text>

          {/* GRID DE PETS PARA ADOÇÃO */}
          <View style={styles.grid}>
            {petsFeed.map((pet) => (
              <View key={pet.id} style={styles.adoptionCard}>
                <Image source={{ uri: pet.imagem }} style={styles.petImg} />
                
                <Text style={styles.petName} numberOfLines={1}>{pet.nome}</Text>
                <Text style={styles.petInfo}>{pet.info}</Text>

                <View style={styles.tutorRow}>
                  <Text style={{fontSize: 10}}>👤</Text>
                  <Text style={styles.tutorText}>Tutor: {pet.tutor}</Text>
                </View>

                <TouchableOpacity style={styles.btnAdotar}>
                  <Text style={styles.btnAdotarText}>Quero Adotar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}