import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Megaphone, User, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';

const ESTADOS_CIDADES = {
  'Acre': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
  'Alagoas': ['Maceió', 'Rio Largo', 'Arapiraca', 'Delmiro Gouveia'],
  'Amapá': ['Macapá', 'Santana', 'Oiapoque'],
  'Amazonas': ['Manaus', 'Parintins', 'Itacoatiara', 'Coari'],
  'Bahia': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Jequié', 'Ilhéus'],
  'Ceará': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú'],
  'Distrito Federal': ['Brasília'],
  'Espírito Santo': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Aracruz'],
  'Goiás': ['Goiânia', 'Anápolis', 'Rio Verde', 'Aparecida de Goiânia'],
  'Maranhão': ['São Luís', 'Imperatriz', 'Caxias', 'Timon'],
  'Mato Grosso': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
  'Mato Grosso do Sul': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
  'Minas Gerais': ['Belo Horizonte', 'Uberlândia', 'Betim', 'Montes Claros', 'Juiz de Fora'],
  'Pará': ['Belém', 'Ananindeua', 'Parauapebas', 'Marabá'],
  'Paraíba': ['João Pessoa', 'Campina Grande', 'Patos', 'Santa Rita'],
  'Paraná': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  'Pernambuco': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  'Piauí': ['Teresina', 'Parnaíba', 'Picos', 'Floriano'],
  'Rio de Janeiro': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Itaboraí'],
  'Rio Grande do Norte': ['Natal', 'Mossoró', 'Parnamirim', 'Assu'],
  'Rio Grande do Sul': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria', 'Canoas'],
  'Rondônia': ['Porto Velho', 'Ariquemes', 'Cacoal'],
  'Roraima': ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  'Santa Catarina': ['Florianópolis', 'Blumenau', 'Joinville', 'Chapecó', 'Taió'],
  'São Paulo': ['São Paulo', 'Campinas', 'Santos', 'Sorocaba', 'Ribeirão Preto', 'Piracicaba'],
  'Sergipe': ['Aracaju', 'Lagarto', 'Itabaiana', 'Estância'],
  'Tocantins': ['Palmas', 'Araguaína', 'Gurupi']
};

export default function TelaAdocao() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [busca, setBusca] = useState('');
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCidade, setSelectedCidade] = useState(null);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [modalCidadeOpen, setModalCidadeOpen] = useState(false);

  const estados = Object.keys(ESTADOS_CIDADES).map((name, idx) => ({
    id: idx + 1,
    name
  }));

  const cidades = selectedEstado
    ? ESTADOS_CIDADES[selectedEstado.name].map((name, idx) => ({
        id: idx + 1,
        name
      }))
    : [];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderModalItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

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
              <TouchableOpacity
                style={styles.filterBox}
                onPress={() => setModalEstadoOpen(true)}
              >
                <Text style={styles.filterText}>
                  {selectedEstado ? selectedEstado.name : 'Estado'}
                </Text>
                <ChevronDown size={14} color="#A0A7BA" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterBox}
                onPress={() => setModalCidadeOpen(true)}
              >
                <Text style={styles.filterText}>
                  {selectedCidade ? selectedCidade.name : 'Cidade'}
                </Text>
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
                cardStyle={styles.smallCard}
              />
            ))}
          </View>

        </ScrollView>

        {/* MODAL: SELECIONAR ESTADO */}
        <Modal
          visible={modalEstadoOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalEstadoOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Estado</Text>
              <FlatList
                data={estados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item, (selected) => {
                  setSelectedEstado(selected);
                  setModalEstadoOpen(false);
                })}
                scrollEnabled={true}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalEstadoOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL: SELECIONAR CIDADE */}
        <Modal
          visible={modalCidadeOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalCidadeOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione uma Cidade</Text>
              <FlatList
                data={cidades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item, (selected) => {
                  setSelectedCidade(selected);
                  setModalCidadeOpen(false);
                })}
                scrollEnabled={true}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalCidadeOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}