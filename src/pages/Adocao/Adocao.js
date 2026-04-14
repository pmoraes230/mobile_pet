import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Megaphone, User, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';

export default function TelaAdocao() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [busca, setBusca] = useState('');

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
        <HeaderHome userName="Rayan" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>Adoção Responsável</Text>
            <Text style={styles.subtitle}>Gerencie seus anúncios e encontre novos amigos.</Text>
          </View>

          {/* BOTÃO ANUNCIAR */}
          <TouchableOpacity 
            style={styles.btnAnnounce}
            onPress={() => navigation.navigate('anunciarpet')} 
          >
            <Text style={{color: '#9127E1', fontWeight: 'bold', fontSize: 18}}>+</Text>
            <Text style={styles.btnAnnounceText}>Anunciar pet meu</Text>
          </TouchableOpacity>

          {/* SEUS PETS EM ANÚNCIO */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Megaphone size={16} color="#0D214F" />
            <Text style={styles.sectionLabel}> Seus Pets em Anúncio</Text>
          </View>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Você não tem nenhum pet anunciado no momento.</Text>
          </View>

          {/* DIVISOR FEED GLOBAL */}
          <View style={styles.feedDivider}>
            <View style={styles.line} />
            <Text style={styles.feedDividerText}>FEED GLOBAL</Text>
            <View style={styles.line} />
          </View>

          {/* ÁREA DE FILTROS E BUSCA DO FEED */}
          <View style={styles.searchSection}>
            
            {/* Campo de Pesquisa */}
            <View style={styles.searchInputWrapper}>
              <Search size={18} color="#A0A7BA" />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar por nome ou raça..."
                placeholderTextColor="#A0A7BA"
                value={busca}
                onChangeText={setBusca}
              />
            </View>

            {/* Filtros de Estado e Cidade */}
            <View style={styles.filterRow}>
              <TouchableOpacity style={styles.filterBox}>
                <Text style={styles.filterText}>Estado</Text>
                <ChevronDown size={14} color="#A0A7BA" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterBox}>
                <Text style={styles.filterText}>Cidade</Text>
                <ChevronDown size={14} color="#A0A7BA" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Megaphone size={16} color="#0D214F" />
            <Text style={styles.sectionLabel}> Pets esperando por um lar</Text>
          </View>

          {/* GRID DE PETS PARA ADOÇÃO */}
          <View style={styles.grid}>
            {petsFeed.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onPress={() => {}}
                actionLabel="Quero Adotar"
                onActionPress={() => {}}
              />
            ))}
          </View>

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}