import React, { useCallback, useState, useEffect } from 'react';
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

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Search, Megaphone, ChevronDown } from 'lucide-react-native';

import api from '../../services/api';
import { updatePet } from '../../services/updatePet';
import { getPetsByTutor } from '../../services/pet';
import { getUserInfo } from '../../services/auth';

import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('home');
  const [busca, setBusca] = useState('');
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCidade, setSelectedCidade] = useState(null);

  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [modalCidadeOpen, setModalCidadeOpen] = useState(false);
  const [modalSelecionarPetOpen, setModalSelecionarPetOpen] = useState(false);

  const [petsFeed, setPetsFeed] = useState([]);
  const [meusPets, setMeusPets] = useState([]);
  const [currentTutor, setCurrentTutor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [announcingPetId, setAnnouncingPetId] = useState(null);
  const [removingPetId, setRemovingPetId] = useState(null);

  // Função para tratar imagem do S3 (Mantendo o padrão do seu projeto)
  const getImageUri = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    return img.startsWith('http') ? img : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${img}`;
  };

  const firstValue = (...values) =>
    values.find((value) => value !== undefined && value !== null && value !== '');

  const firstPrimitiveValue = (...values) =>
    values.find((value) => (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (typeof value === 'string' || typeof value === 'number')
    ));

  const isValidTutorName = (value) => {
    if (typeof value !== 'string') return false;
    const normalized = value.trim().toLowerCase();
    return Boolean(normalized) && ![
      'tutor',
      'owner',
      'responsável',
      'responsavel',
      'tutor não informado',
      'tutor nao informado',
      'não informado',
      'nao informado',
      'not informed',
      'sem informação',
      'sem informacao',
    ].includes(normalized);
  };

  const collectTutorNameCandidates = (value, visited = new Set(), inOwnerContext = false) => {
    if (!value || visited.has(value)) return [];

    if (typeof value === 'string') {
      return inOwnerContext ? [value] : [];
    }

    if (Array.isArray(value)) {
      visited.add(value);
      return value.flatMap((item) => collectTutorNameCandidates(item, visited, inOwnerContext));
    }

    if (typeof value !== 'object') return [];

    visited.add(value);
    const candidates = [];

    Object.entries(value).forEach(([key, childValue]) => {
      const normalizedKey = String(key).toLowerCase();
      const isOwnerContainer = [
        'tutor', 'responsavel', 'owner', 'dono', 'tutor_responsavel', 'tutorresponsavel',
        'dados', 'data', 'usuario', 'profile', 'result', 'user', 'info'
      ].includes(normalizedKey);
      const isNameLikeKey = [
        'nome', 'name', 'fullname', 'full_name', 'nome_tutor', 'nomecompleto',
        'nome_completo', 'tutor_nome', 'nomeresponsavel', 'responsavelnome',
        'ownername', 'owner_name', 'dononome', 'nomedono', 'tutorname', 'tutor_name'
      ].includes(normalizedKey);
      const nextContext = inOwnerContext || isOwnerContainer;

      if (isNameLikeKey && nextContext) {
        candidates.push(...collectTutorNameCandidates(childValue, visited, true));
      } else if (isOwnerContainer || inOwnerContext) {
        candidates.push(...collectTutorNameCandidates(childValue, visited, nextContext));
      }
    });

    return candidates;
  };

  const getTutorIdFromPet = (pet) =>
    firstPrimitiveValue(
      pet?.tutor?.id,
      pet?.tutor?.ID,
      pet?.id_tutor?.id,
      pet?.id_tutor?.ID,
      pet?.ID_TUTOR?.id,
      pet?.ID_TUTOR?.ID,
      pet?.tutor_responsavel?.id,
      pet?.tutor_responsavel?.ID,
      pet?.tutorResponsavel?.id,
      pet?.tutorResponsavel?.ID,
      pet?.responsavel?.id,
      pet?.responsavel?.ID,
      pet?.ID_TUTOR,
      pet?.id_tutor,
      pet?.tutorId,
      pet?.TutorId,
      pet?.tutorID,
      pet?.tutor_id,
      pet?.idTutor,
      pet?.IDTutor,
      pet?.TUTOR_ID,
      pet?.ID_TUTOR_ID,
      pet?.ID_TUTOR_id,
      pet?.tutorId_id,
      pet?.tutor_id_id,
      pet?.ownerId,
      pet?.owner_id,
      pet?.ID_OWNER
    );

  const getTutorNameFromPet = (pet) =>
    [
      pet?.nome_tutor,
      pet?.NOME_TUTOR,
      pet?.tutorNome,
      pet?.nomeTutor,
      pet?.ownerName,
      pet?.owner_name,
      pet?.nomeDono,
      pet?.donoNome,
      pet?.nomeResponsavel,
      pet?.responsavelNome,
      pet?.TUTOR_NOME,
      pet?.TUTOR_NOME_TUTOR,
      pet?.responsavel_nome_tutor,
      pet?.tutor?.nome_tutor,
      pet?.tutor?.NOME_TUTOR,
      pet?.tutor?.nome,
      pet?.tutor?.NOME,
      pet?.tutor?.name,
      pet?.tutorNomeExibido,
      pet?.tutor_nome_exibido,
      pet?.tutorNameExibido,
      pet?.tutor?.tutorNomeExibido,
      pet?.tutor_responsavel?.nome,
      pet?.tutor_responsavel?.NOME,
      pet?.tutor_responsavel?.name,
      pet?.tutor_responsavel?.nome_tutor,
      pet?.tutor_responsavel?.NOME_TUTOR,
      pet?.tutorResponsavel?.nome,
      pet?.tutorResponsavel?.NOME,
      pet?.tutorResponsavel?.name,
      pet?.tutorResponsavel?.nome_tutor,
      pet?.tutorResponsavel?.NOME_TUTOR,
      pet?.tutor?.nomeCompleto,
      pet?.tutor?.NOME_COMPLETO,
      pet?.tutor?.usuario?.nome,
      pet?.tutor?.usuario?.nome_tutor,
      pet?.tutor?.dados?.nome,
      pet?.tutor?.dados?.nome_tutor,
      pet?.tutor?.data?.nome,
      pet?.tutor?.data?.nome_tutor,
      pet?.id_tutor?.nome_tutor,
      pet?.id_tutor?.NOME_TUTOR,
      pet?.id_tutor?.nome,
      pet?.id_tutor?.nomeCompleto,
      pet?.ID_TUTOR?.nome_tutor,
      pet?.ID_TUTOR?.NOME_TUTOR,
      pet?.ID_TUTOR?.nome,
      pet?.ID_TUTOR?.nomeCompleto,
      pet?.responsavel?.nome,
      pet?.responsavel?.NOME,
      pet?.responsavel?.name,
      pet?.responsavel?.nome_tutor,
      pet?.responsavel?.NOME_TUTOR,
      pet?.responsavel?.nomeTutor,
      pet?.owner?.nome,
      pet?.owner?.NOME,
      pet?.owner?.name,
      pet?.owner?.nome_tutor,
      pet?.owner?.NOME_TUTOR,
      pet?.owner?.nomeTutor,
      pet?.dono?.nome,
      pet?.dono?.NOME,
      pet?.dono?.name,
      pet?.dono?.nome_tutor,
      pet?.dono?.NOME_TUTOR,
      pet?.dono?.nomeTutor,
      typeof pet?.tutor === 'string' ? pet.tutor : undefined,
      typeof pet?.owner === 'string' ? pet.owner : undefined,
      typeof pet?.dono === 'string' ? pet.dono : undefined,
      typeof pet?.responsavel === 'string' ? pet.responsavel : undefined,
      ...collectTutorNameCandidates(pet).filter(isValidTutorName)
    ].find(isValidTutorName);

  const fetchTutorById = async (tutorId) => {
    if (!tutorId) return null;

    const routes = [`/tutors/${tutorId}`, `/tutores/${tutorId}`, `/tutor/${tutorId}`];

    for (const route of routes) {
      try {
        const response = await api.get(route);
        const data = response.data;
        const tutor = Array.isArray(data)
          ? data[0]
          : data?.tutor ||
            data?.data?.tutor ||
            data?.data?.usuario ||
            data?.data?.profile ||
            data?.data?.result ||
            data?.data ||
            data?.usuario ||
            data?.profile ||
            data?.result ||
            data?.user ||
            data;
        if (tutor) return tutor;
      } catch (error) {
        // tenta a proxima rota
      }
    }

    return null;
  };

  const enrichPetsWithTutor = async (pets, fallbackTutor = null) => {
    const list = Array.isArray(pets) ? pets : [];
    const cache = {};

    return Promise.all(list.map(async (pet) => {
      const existingName = getTutorNameFromPet(pet)
        || pet?.tutorNomeExibido
        || pet?.tutor_nome_exibido
        || pet?.tutorNameExibido
        || pet?.tutor?.tutorNomeExibido
        || pet?.tutor?.nome_tutor
        || pet?.tutor?.nome
        || pet?.tutor?.name;
      if (existingName) return pet;

      const tutorId = getTutorIdFromPet(pet);

      if (fallbackTutor?.id && tutorId && String(fallbackTutor.id) === String(tutorId)) {
        return {
          ...pet,
          tutor: {
            ...(typeof pet.tutor === 'object' && pet.tutor !== null ? pet.tutor : {}),
            id: fallbackTutor.id,
            nome_tutor: fallbackTutor.nome,
            imagem_perfil_tutor: fallbackTutor.imagem,
          },
          nome_tutor: fallbackTutor.nome,
        };
      }

      if (!tutorId) return pet;

      if (!cache[String(tutorId)]) {
        cache[String(tutorId)] = fetchTutorById(tutorId);
      }

      const tutor = await cache[String(tutorId)];
      const tutorName =
        tutor?.nome_tutor ||
        tutor?.NOME_TUTOR ||
        tutor?.nomeTutor ||
        tutor?.nome ||
        tutor?.NOME ||
        tutor?.name ||
        tutor?.nomeCompleto ||
        tutor?.NOME_COMPLETO ||
        tutor?.usuario?.nome_tutor ||
        tutor?.usuario?.nome ||
        tutor?.profile?.nome ||
        tutor?.data?.nome ||
        tutor?.dados?.nome;

      if (!tutorName) return pet;

      return {
        ...pet,
        tutor: {
          ...(typeof pet.tutor === 'object' && pet.tutor !== null ? pet.tutor : {}),
          ...tutor,
          nome_tutor: tutorName,
        },
        nome_tutor: tutorName,
      };
    }));
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {

    setLoading(true);
    const userInfo = await getUserInfo().catch(() => null);
    setCurrentTutor(userInfo);

    try {
      const myPets = await getPetsByTutor();
      const normalizedMyPets = await enrichPetsWithTutor(Array.isArray(myPets) ? myPets : [], userInfo);
      setMeusPets(normalizedMyPets);
    } catch (error) {
      setMeusPets([]);
    }

    try {
      const adoptionResponse = await api.get('/pets/adocao');
      const adoptionPets =
        adoptionResponse.data?.pets ||
        adoptionResponse.data?.data ||
        adoptionResponse.data ||
        [];

      const enrichedPets = await enrichPetsWithTutor(Array.isArray(adoptionPets) ? adoptionPets : [], userInfo);
      setPetsFeed(enrichedPets);
    } catch (error) {
      setPetsFeed([]);
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
        t('Nenhum pet cadastrado'),
        t('Cadastre um pet antes de anunciá-lo para adoção.'),
        [
          { text: t('Cancelar'), style: 'cancel' },
          { text: t('Cadastrar pet'), onPress: () => navigation.navigate('anunciarpet') }
        ]
      );
      return;
    }

    setModalSelecionarPetOpen(true);
  };

  const handleAnnouncePet = (pet) => {
    const petId = getPetId(pet);

    if (!petId) {
      Alert.alert(t('Erro'), t('Não foi possível identificar este pet.'));
      return;
    }

    Alert.alert(
      t('Adicionar para adoção'),
      t('Deseja anunciar {{name}} para adoção?', { name: pet.nome || pet.NOME || t('este pet') }),
      [
        { text: t('Cancelar'), style: 'cancel' },
        {
          text: t('Anunciar'),
          onPress: async () => {
            try {
              setAnnouncingPetId(petId);
              await updatePetAdoptionStatus(pet, true);
              setModalSelecionarPetOpen(false);
              await loadData();
              Alert.alert(t('Sucesso'), t('Pet adicionado para adoção.'));
            } catch (error) {
              Alert.alert(
                t('Erro'),
                error.message || t('Não foi possível adicionar o pet para adoção.')
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
      Alert.alert(t('Erro'), t('Não foi possível identificar este pet.'));
      return;
    }

    Alert.alert(
      t('Tirar da adoção'),
      t('Deseja remover {{name}} dos anúncios de adoção?', { name: pet.nome || pet.NOME || t('este pet') }),
      [
        { text: t('Cancelar'), style: 'cancel' },
        {
          text: t('Remover'),
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingPetId(petId);
              await updatePetAdoptionStatus(pet, false);
              await loadData();
              Alert.alert(t('Sucesso'), t('Pet removido dos anúncios de adoção.'));
            } catch (error) {
              Alert.alert(
                t('Erro'),
                error.message || t('Não foi possível remover o pet da adoção.')
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
        '/pets/adocao/interesse', 
        {
          ID_PET: petId,
          MENSAGEM_CONTATO:
            t('Tenho interesse em adotar este pet.')
        }
      );

      Alert.alert(
        t('Sucesso'),
        t('Interesse enviado com sucesso!')
      );

    } catch (error) {

      Alert.alert(
        t('Erro'),
        t('Não foi possível enviar interesse.')
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              {t('Adoção Responsável')}
            </Text>

            <Text style={styles.subtitle}>
              {t('Gerencie seus anúncios e encontre novos amigos.')}
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
              {t('Anunciar pet meu')}
            </Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Megaphone size={16} color="#0D214F" />

            <Text style={styles.sectionLabel}>
              {' '}{t('Seus Pets em Anúncio')}
            </Text>
          </View>

          {
            petsAnunciados.length === 0 ? (

              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  {t('Você não tem nenhum pet anunciado no momento.')}
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
                      tutor: getTutorNameFromPet(pet) || currentTutor?.nome || '',
                      imagem: getImageUri(pet.imagem || pet.IMAGEM)
                    }}
                    onPress={() => navigation.navigate('PetDetail', { petData: pet })}
                    actionLabel={removingPetId === getPetId(pet) ? t('Removendo...') : t('Tirar da adoção')}
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
              {t('FEED GLOBAL')}
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.searchSection}>

            <View style={styles.searchInputWrapper}>
              <Search size={18} color="#A0A7BA" />

              <TextInput
                style={styles.searchInput}
                placeholder={t('Pesquisar por nome ou raça...')}
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
                  : t('Estado')}
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
                  : t('Cidade')}
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
              {' '}{t('Pets esperando por um lar')}
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
                    key={getPetId(pet)}
                    pet={{
                      id: getPetId(pet),
                      nome: pet.nome || pet.NOME,
                      info: `${pet.especie || pet.ESPECIE} • ${pet.raca || pet.RACA}`,
                      tutor: getTutorNameFromPet(pet) || '',
                      imagem: getImageUri(pet.imagem || pet.IMAGEM)
                    }}
                    onPress={() => navigation.navigate('PetDetail', { petData: pet })}
                    actionLabel={t('Adotar')}
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
                {t('Selecione um Estado')}
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
                  {t('Fechar')}
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
                {t('Selecione uma Cidade')}
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
                  {t('Fechar')}
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
                {t('Selecione um pet')}
              </Text>

              {petsDisponiveisParaAnuncio.length === 0 ? (

                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>
                    {t('Todos os seus pets já estão anunciados para adoção.')}
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
                            {t(item.especie || item.ESPECIE || 'Pet')} - {t(item.raca || item.RACA || 'Sem raça')}
                          </Text>
                        </View>

                        {isAnnouncing ? (
                          <ActivityIndicator size="small" color="#9127E1" />
                        ) : (
                          <Text style={styles.petModalAction}>
                            {t('Adicionar')}
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
                  {t('Cancelar')}
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
