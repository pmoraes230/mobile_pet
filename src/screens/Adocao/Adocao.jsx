import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Search, Megaphone, ChevronDown } from 'lucide-react-native';

import api from '../../services/api';
import { getUserInfo } from '../../services/auth';
import { updatePet } from '../../services/updatePet';

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
  const [modalSelecionarPetOpen, setModalSelecionarPetOpen] = useState(false);

  const [petsFeed, setPetsFeed] = useState([]);
  const [meusPets, setMeusPets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [announcingPetId, setAnnouncingPetId] = useState(null);
  const [removingPetId, setRemovingPetId] = useState(null);

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

      const userInfo = await getUserInfo();

      if (!userInfo?.id) {
        throw new Error('Usuario nao autenticado.');
      }

      const [
        adoptionResponse,
        petsResponse
      ] = await Promise.all([
        api.get('/pets/adocao'),

        api.get(`/pets/tutor/${userInfo.id}`)
      ]);

      const adoptionPets =
        adoptionResponse.data || [];

      const myPets =
        petsResponse.data || [];

      setPetsFeed(adoptionPets);
      setMeusPets(myPets);

    } catch (error) {


      Alert.alert(
        'Erro',
        'Não foi possível carregar os pets.'
      );

    } finally {

      setLoading(false);
    }
  }

  const getPetId = (pet) =>
    pet?.id || pet?.ID || pet?.ID_PET || pet?.petId || pet?.id_pet;

  const isPetInAdoption = (pet) =>
    pet?.emAdocao === true ||
    pet?.EM_ADOCAO === true ||
    pet?.em_adocao === true;

  const petsAnunciados = meusPets.filter(isPetInAdoption);
  const petsDisponiveisParaAnuncio = meusPets.filter((pet) => !isPetInAdoption(pet));

  const getPetUpdatePayload = (pet) => ({
    DESCRICAO: pet.descricao || pet.DESCRICAO || '',
    PERSONALIDADE: pet.personalidade || pet.PERSONALIDADE || '',
    ESPECIE: pet.especie || pet.ESPECIE || '',
    RACA: pet.raca || pet.RACA || '',
    PESO: pet.peso || pet.PESO || '0',
    SEXO: pet.sexo || pet.SEXO || '',
  });

  const updatePetAdoptionStatus = async (pet, value) => {
    const petId = getPetId(pet);

    try {
      await updatePet(petId, {
        ...getPetUpdatePayload(pet),
        emAdocao: value,
      });
    } catch (firstError) {
      await updatePet(petId, {
        ...getPetUpdatePayload(pet),
        EM_ADOCAO: value,
      });
    }
  };

  const handleOpenPetSelection = () => {
    if (meusPets.length === 0) {
      Alert.alert(
        'Nenhum pet cadastrado',
        'Cadastre um pet antes de anuncia-lo para adocao.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cadastrar pet', onPress: () => navigation.navigate('anunciarpet') }
        ]
      );
      return;
    }

    setModalSelecionarPetOpen(true);
  };

  const handleAnnouncePet = (pet) => {
    const petId = getPetId(pet);

    if (!petId) {
      Alert.alert('Erro', 'Nao foi possivel identificar este pet.');
      return;
    }

    Alert.alert(
      'Adicionar para adocao',
      `Deseja anunciar ${pet.nome || pet.NOME || 'este pet'} para adocao?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Anunciar',
          onPress: async () => {
            try {
              setAnnouncingPetId(petId);
              await updatePetAdoptionStatus(pet, true);
              setModalSelecionarPetOpen(false);
              await loadData();
              Alert.alert('Sucesso', 'Pet adicionado para adocao.');
            } catch (error) {
              Alert.alert(
                'Erro',
                error.message || 'Nao foi possivel adicionar o pet para adocao.'
              );
            } finally {
              setAnnouncingPetId(null);
            }
          }
        }
      ]
    );
  };

  const handleRemovePetFromAdoption = (pet) => {
    const petId = getPetId(pet);

    if (!petId) {
      Alert.alert('Erro', 'Nao foi possivel identificar este pet.');
      return;
    }

    Alert.alert(
      'Tirar da adocao',
      `Deseja remover ${pet.nome || pet.NOME || 'este pet'} dos anuncios de adocao?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingPetId(petId);
              await updatePetAdoptionStatus(pet, false);
              await loadData();
              Alert.alert('Sucesso', 'Pet removido dos anuncios de adocao.');
            } catch (error) {
              Alert.alert(
                'Erro',
                error.message || 'Nao foi possivel remover o pet da adocao.'
              );
            } finally {
              setRemovingPetId(null);
            }
          }
        }
      ]
    );
  };

  const handleInterest = async (petId) => {

    try {

      await api.post(
        '/pets/adocao/interesse', // Removido o /api duplicado
        {
          ID_PET: petId,
          MENSAGEM_CONTATO:
            'Tenho interesse em adotar este pet.'
        }
      );

      Alert.alert(
        'Sucesso',
        'Interesse enviado com sucesso!'
      );

    } catch (error) {

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
            onPress={handleOpenPetSelection}
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
            petsAnunciados.length === 0 ? (

              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  Você não tem nenhum pet anunciado no momento.
                </Text>
              </View>

            ) : (

              <View style={styles.grid}>
                {petsAnunciados.map((pet) => (

                  <PetCard
                    key={getPetId(pet)}
                    pet={{
                      id: getPetId(pet),
                      nome: pet.nome || pet.NOME,
                      info: `${pet.especie || pet.ESPECIE} • ${pet.raca || pet.RACA}`,
                      tutor: 'Tutor',
                      imagem: getImageUri(pet.imagem || pet.IMAGEM)
                    }}
                    onPress={() => {}}
                    actionLabel={removingPetId === getPetId(pet) ? 'Removendo...' : 'Tirar da adocao'}
                    onActionPress={() => handleRemovePetFromAdoption(pet)}
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
                      navigation.navigate('PetDetail', { petData: pet })
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

        <Modal
          visible={modalSelecionarPetOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalSelecionarPetOpen(false)}
        >

          <View style={styles.modalOverlay}>

            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>
                Selecione um pet
              </Text>

              {petsDisponiveisParaAnuncio.length === 0 ? (

                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>
                    Todos os seus pets ja estao anunciados para adocao.
                  </Text>
                </View>

              ) : (

                <FlatList
                  data={petsDisponiveisParaAnuncio}
                  keyExtractor={(item, index) => String(getPetId(item) || index)}
                  renderItem={({ item }) => {
                    const petId = getPetId(item);
                    const isAnnouncing = announcingPetId === petId;

                    return (
                      <TouchableOpacity
                        style={styles.petModalItem}
                        onPress={() => handleAnnouncePet(item)}
                        disabled={isAnnouncing}
                      >
                        <Image
                          source={{ uri: getImageUri(item.imagem || item.IMAGEM) }}
                          style={styles.petModalImage}
                        />

                        <View style={styles.petModalInfo}>
                          <Text style={styles.petModalName}>
                            {item.nome || item.NOME}
                          </Text>

                          <Text style={styles.petModalDetails}>
                            {item.especie || item.ESPECIE || 'Pet'} - {item.raca || item.RACA || 'Sem raca'}
                          </Text>
                        </View>

                        {isAnnouncing ? (
                          <ActivityIndicator size="small" color="#9127E1" />
                        ) : (
                          <Text style={styles.petModalAction}>
                            Adicionar
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  scrollEnabled={true}
                />
              )}

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalSelecionarPetOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>
                  Cancelar
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
