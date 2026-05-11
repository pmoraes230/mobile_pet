import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Search, Megaphone, ChevronDown } from 'lucide-react-native';

import api from '../../services/api';

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

  const [petsFeed, setPetsFeed] = useState([]);
  const [meusPets, setMeusPets] = useState([]);

  const [loading, setLoading] = useState(true);

  // Função para tratar imagem do S3 (Mantendo o padrão do seu projeto)
  const getImageUri = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    return img.startsWith('http') ? img : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${img}`;
  };

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      setLoading(true);

      const token =
        await AsyncStorage.getItem('@token');

      const [
        adoptionResponse,
        petsResponse
      ] = await Promise.all([
        api.get('/pets/adocao', { // Removido o /api duplicado
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),

        api.get('/pets', { // Removido o /api duplicado
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      const adoptionPets =
        adoptionResponse.data || [];

      const myPets =
        (petsResponse.data || []).filter(
          pet => pet.emAdocao === true || pet.EM_ADOCAO === true
        );

      setPetsFeed(adoptionPets);
      console.log('PETS FEED:', adoptionPets.length);
      setMeusPets(myPets);

    } catch (error) {

      console.log('ERRO ADOÇÃO:', error?.response?.data || error);

      Alert.alert(
        'Erro',
        'Não foi possível carregar os pets.'
      );

    } finally {

      setLoading(false);
    }
  }

  const handleInterest = async (petId) => {

    try {

      const token =
        await AsyncStorage.getItem('@token');

      await api.post(
        '/pets/adocao/interesse', // Removido o /api duplicado
        {
          ID_PET: petId,
          MENSAGEM_CONTATO:
            'Tenho interesse em adotar este pet.'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert(
        'Sucesso',
        'Interesse enviado com sucesso!'
      );

    } catch (error) {

      console.log(error?.response?.data);

      Alert.alert(
        'Erro',
        'Não foi possível enviar interesse.'
      );
    }
  };

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
      <Text style={styles.modalItemText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const filteredPets = petsFeed.filter((pet) => {

    const texto = busca.toLowerCase();

    return (
      (pet?.nome || pet?.NOME || '')
        .toLowerCase()
        .includes(texto) ||

      (pet?.raca || pet?.RACA || '')
        .toLowerCase()
        .includes(texto)
    );
  });

  return (

  <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={styles.safeArea}>

        <HeaderHome
          userName="Rayan"
          showSearch={false}
          showBackButton={true}
          showGreeting={false}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.headerSection}>
            <Text style={styles.title}>
              Adoção Responsável
            </Text>

            <Text style={styles.subtitle}>
              Gerencie seus anúncios e encontre novos amigos.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnAnnounce}
            onPress={() => navigation.navigate('anunciarpet')}
          >
            <Text style={{
              color: '#9127E1',
              fontWeight: 'bold',
              fontSize: 18
            }}>
              +
            </Text>

            <Text style={styles.btnAnnounceText}>
              Anunciar pet meu
            </Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Megaphone size={16} color="#0D214F" />

            <Text style={styles.sectionLabel}>
              {' '}Seus Pets em Anúncio
            </Text>
          </View>

          {
            meusPets.length === 0 ? (

              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  Você não tem nenhum pet anunciado no momento.
                </Text>
              </View>

            ) : (

              <View style={styles.grid}>
                {meusPets.map((pet) => (

                  <PetCard
                    key={pet.id || pet.ID_PET}
                    pet={{
                      id: pet.id || pet.ID_PET,
                      nome: pet.nome || pet.NOME,
                      info: `${pet.especie || pet.ESPECIE} • ${pet.raca || pet.RACA}`,
                      tutor: 'Tutor',
                      imagem: getImageUri(pet.imagem || pet.IMAGEM)
                    }}
                    onPress={() => {}}
                    actionLabel="Em anúncio"
                    onActionPress={() => {}}
                    cardStyle={styles.smallCard}
                  />
                ))}
              </View>
            )
          }

          <View style={styles.feedDivider}>
            <View style={styles.line} />
            <Text style={styles.feedDividerText}>
              FEED GLOBAL
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.searchSection}>

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

            <View style={styles.filterRow}>

              <TouchableOpacity
                style={styles.filterBox}
                onPress={() => setModalEstadoOpen(true)}
              >
                <Text style={styles.filterText}>
                  {selectedEstado
                    ? selectedEstado.name
                    : 'Estado'}
                </Text>

                <ChevronDown
                  size={14}
                  color="#A0A7BA"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterBox}
                onPress={() => setModalCidadeOpen(true)}
              >
                <Text style={styles.filterText}>
                  {selectedCidade
                    ? selectedCidade.name
                    : 'Cidade'}
                </Text>

                <ChevronDown
                  size={14}
                  color="#A0A7BA"
                />
              </TouchableOpacity>

            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Megaphone size={16} color="#0D214F" />

            <Text style={styles.sectionLabel}>
              {' '}Pets esperando por um lar
            </Text>
          </View>

          {
            loading ? (

              <ActivityIndicator
                size="large"
                color="#9127E1"
              />

            ) : (

              <View style={styles.grid}>

                {filteredPets.map((pet, index) => (

                  <PetCard
                    key={pet.id || pet.ID_PET || index}
                    pet={{
                      id: pet.id || pet.ID_PET,
                      nome: pet.nome || pet.NOME,
                      info: `${pet.especie || pet.ESPECIE} • ${pet.raca || pet.RACA}`,
                      tutor: 'Tutor',
                      imagem: getImageUri(pet.imagem || pet.IMAGEM)
                    }}
                    onPress={() => {}}
                    actionLabel="Quero Adotar"
                    onActionPress={() =>
                    handleInterest(pet.id || pet.ID_PET)
                    }
                    
                    cardStyle={styles.smallCard}
                  />
                ))}

              </View>
            )
          }

        </ScrollView>

        <Modal
          visible={modalEstadoOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalEstadoOpen(false)}
        >

          <View style={styles.modalOverlay}>

            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>
                Selecione um Estado
              </Text>

              <FlatList
                data={estados}
                keyExtractor={(item) =>
                  item.id.toString()
                }
                renderItem={({ item }) =>
                  renderModalItem(item, (selected) => {

                    setSelectedEstado(selected);

                    setModalEstadoOpen(false);
                  })
                }
                scrollEnabled={true}
              />

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() =>
                  setModalEstadoOpen(false)
                }
              >
                <Text style={styles.modalCloseBtnText}>
                  Fechar
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        <Modal
          visible={modalCidadeOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() =>
            setModalCidadeOpen(false)
          }
        >

          <View style={styles.modalOverlay}>

            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>
                Selecione uma Cidade
              </Text>

              <FlatList
                data={cidades}
                keyExtractor={(item) =>
                  item.id.toString()
                }
                renderItem={({ item }) =>
                  renderModalItem(item, (selected) => {

                    setSelectedCidade(selected);

                    setModalCidadeOpen(false);
                  })
                }
                scrollEnabled={true}
              />

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() =>
                  setModalCidadeOpen(false)
                }
              >
                <Text style={styles.modalCloseBtnText}>
                  Fechar
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        <TabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onLogout={handleLogout}
        />

      </View>
    </KeyboardAvoidingView>
  );
}