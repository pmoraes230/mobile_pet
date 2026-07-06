import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Share2, Heart, MessageCircle } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native/icons';
import { styles } from './styles';
import TabBar from '../../components/TabBar';
import api from '../../services/api';
import { useAppTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

const TUTOR_DEFAULT = require('../../assets/user_default.png');

const PET_DETAIL_THEME = {
  light: {
    background: '#f5f5f5',
    surface: '#FFF',
    surfaceAlt: '#F8F9FA',
    text: '#333',
    subtitle: '#666',
    muted: '#999',
    border: '#E8E8E8',
    softBorder: '#F0F0F0',
    accent: '#A855F7',
    accentSoft: '#F3E8FF',
    tutorSurface: '#F5F0FF',
    tutorBorder: '#E8D5F7',
  },
  dark: {
    background: '#0F1020',
    surface: '#17182B',
    surfaceAlt: '#202238',
    text: '#F5F7FF',
    subtitle: '#AEB6CC',
    muted: '#8E98B5',
    border: '#2A2D45',
    softBorder: '#30334F',
    accent: '#B77CFF',
    accentSoft: '#2A1D42',
    tutorSurface: '#211936',
    tutorBorder: '#4B3471',
  },
};

const parsePetDate = (value) => {
  if (!value) return null;

  const text = String(value);
  const brDateMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brDateMatch) {
    const [, day, month, year] = brDateMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatAgeFromDate = (value, language = 'pt') => {
  const birthDate = parsePetDate(value);
  if (!birthDate) return null;

  const today = new Date();
  let totalMonths =
    (today.getFullYear() - birthDate.getFullYear()) * 12 +
    (today.getMonth() - birthDate.getMonth());

  if (today.getDate() < birthDate.getDate()) {
    totalMonths -= 1;
  }

  if (totalMonths < 0) return null;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (language === 'en') {
    if (years === 0) {
      return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
    }

    if (months === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }

    return `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (years === 0) {
    return `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
};

const formatWeight = (value) => {
  if (value === null || value === undefined || value === '') return '-- kg';
  const text = String(value);
  return text.toLowerCase().includes('kg') ? text : `${text} kg`;
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

const getPetIdFromData = (rawData = {}) =>
  firstPrimitiveValue(
    rawData.id,
    rawData.ID,
    rawData.ID_PET,
    rawData.petId,
    rawData.pet_id,
    rawData.id_pet
  );

const getTutorIdFromPet = (rawData = {}) =>
  firstPrimitiveValue(
    rawData.tutor?.id,
    rawData.tutor?.ID,
    rawData.tutor?.id_tutor,
    rawData.tutor?.ID_TUTOR,
    rawData.TUTOR?.id,
    rawData.TUTOR?.ID,
    rawData.id_tutor?.id,
    rawData.id_tutor?.ID,
    rawData.id_tutor?.id_tutor,
    rawData.ID_TUTOR?.id,
    rawData.ID_TUTOR?.ID,
    rawData.tutor_responsavel?.id,
    rawData.tutor_responsavel?.ID,
    rawData.tutorResponsavel?.id,
    rawData.tutorResponsavel?.ID,
    rawData.responsavel?.id,
    rawData.responsavel?.ID,
    rawData.idTutor,
    rawData.ID_TUTOR,
    rawData.id_tutor,
    rawData.id_tutor_id,
    rawData.ID_TUTOR_ID,
    rawData.tutor_id_id,
    rawData.tutor_uuid,
    rawData.TUTOR_UUID,
    rawData.tutorId,
    rawData.TUTOR_ID,
    rawData.tutor_id,
    rawData.IDTUTOR,
    rawData.idResponsavel,
    rawData.ID_RESPONSAVEL,
    rawData.responsavelId,
    rawData.responsavel_id,
    rawData.ownerId,
    rawData.owner_id,
    rawData.ID_OWNER,
    rawData.tutor_id,
    rawData.tutorId
  );

const getTutorNameFromPet = (rawData = {}) =>
  [
    rawData.nomeTutor,
    rawData.NOME_TUTOR,
    rawData.nome_tutor,
    rawData.NOME_TUTOR,
    rawData.tutor_nome_tutor,
    rawData.TUTOR_NOME_TUTOR,
    rawData.responsavel_nome_tutor,
    rawData.tutorName,
    rawData.ownerName,
    rawData.owner_name,
    rawData.donoNome,
    rawData.nomeDono,
    rawData.tutorNome,
    rawData.TUTOR_NOME,
    rawData.tutor_nome,
    rawData.nomeResponsavel,
    rawData.NOME_RESPONSAVEL,
    rawData.responsavelNome,
    rawData.tutor?.nome,
    rawData.tutor?.NOME,
    rawData.tutor?.name,
    rawData.tutorNomeExibido,
    rawData.tutor_nome_exibido,
    rawData.tutorNameExibido,
    rawData.tutor?.tutorNomeExibido,
    rawData.tutor_responsavel?.nome,
    rawData.tutor_responsavel?.NOME,
    rawData.tutor_responsavel?.name,
    rawData.tutor_responsavel?.nome_tutor,
    rawData.tutor_responsavel?.NOME_TUTOR,
    rawData.tutorResponsavel?.nome,
    rawData.tutorResponsavel?.NOME,
    rawData.tutorResponsavel?.name,
    rawData.tutorResponsavel?.nome_tutor,
    rawData.tutorResponsavel?.NOME_TUTOR,
    rawData.tutor?.nomeTutor,
    rawData.tutor?.nome_tutor,
    rawData.tutor?.NOME_TUTOR,
    rawData.tutor?.nomeCompleto,
    rawData.tutor?.NOME_COMPLETO,
    rawData.tutor?.usuario?.nome,
    rawData.tutor?.usuario?.nome_tutor,
    rawData.tutor?.dados?.nome,
    rawData.tutor?.dados?.nome_tutor,
    rawData.tutor?.data?.nome,
    rawData.tutor?.data?.nome_tutor,
    rawData.tutor?.profile?.nome,
    rawData.tutor?.profile?.nome_tutor,
    rawData.TUTOR?.nome,
    rawData.TUTOR?.NOME,
    rawData.TUTOR?.nome_tutor,
    rawData.TUTOR?.nomeCompleto,
    rawData.id_tutor?.nome,
    rawData.id_tutor?.NOME,
    rawData.id_tutor?.name,
    rawData.id_tutor?.nomeTutor,
    rawData.id_tutor?.nome_tutor,
    rawData.id_tutor?.NOME_TUTOR,
    rawData.id_tutor?.nomeCompleto,
    rawData.ID_TUTOR?.nome,
    rawData.ID_TUTOR?.NOME,
    rawData.ID_TUTOR?.name,
    rawData.ID_TUTOR?.nomeTutor,
    rawData.ID_TUTOR?.nome_tutor,
    rawData.ID_TUTOR?.NOME_TUTOR,
    rawData.ID_TUTOR?.nomeCompleto,
    rawData.responsavel?.nome,
    rawData.responsavel?.NOME,
    rawData.responsavel?.name,
    rawData.responsavel?.nome_tutor,
    rawData.responsavel?.NOME_TUTOR,
    rawData.responsavel?.nomeTutor,
    rawData.owner?.nome,
    rawData.owner?.NOME,
    rawData.owner?.name,
    rawData.owner?.nome_tutor,
    rawData.owner?.NOME_TUTOR,
    rawData.owner?.nomeTutor,
    rawData.dono?.nome,
    rawData.dono?.NOME,
    rawData.dono?.name,
    rawData.dono?.nome_tutor,
    rawData.dono?.NOME_TUTOR,
    rawData.dono?.nomeTutor,
    typeof rawData.tutor === 'string' ? rawData.tutor : undefined,
    typeof rawData.owner === 'string' ? rawData.owner : undefined,
    typeof rawData.dono === 'string' ? rawData.dono : undefined,
    typeof rawData.responsavel === 'string' ? rawData.responsavel : undefined,
    ...collectTutorNameCandidates(rawData).filter(isValidTutorName)
  ].find(isValidTutorName);

const getTutorImageFromPet = (rawData = {}) =>
  firstValue(
    rawData.imagemTutor,
    rawData.IMAGEM_TUTOR,
    rawData.tutorImagem,
    rawData.TUTOR_IMAGEM,
    rawData.imagem_tutor,
    rawData.fotoTutor,
    rawData.FOTO_TUTOR,
    rawData.imagem_perfil_tutor,
    rawData.IMAGEM_PERFIL_TUTOR,
    rawData.tutor?.imagem,
    rawData.tutor?.IMAGEM,
    rawData.tutor?.imagem_perfil_tutor,
    rawData.tutor?.IMAGEM_PERFIL_TUTOR,
    rawData.TUTOR?.imagem,
    rawData.TUTOR?.IMAGEM,
    rawData.TUTOR?.imagem_perfil_tutor,
    rawData.id_tutor?.imagem,
    rawData.id_tutor?.IMAGEM,
    rawData.id_tutor?.imagem_perfil_tutor,
    rawData.id_tutor?.IMAGEM_PERFIL_TUTOR,
    rawData.ID_TUTOR?.imagem,
    rawData.ID_TUTOR?.IMAGEM,
    rawData.ID_TUTOR?.imagem_perfil_tutor,
    rawData.ID_TUTOR?.IMAGEM_PERFIL_TUTOR,
    rawData.responsavel?.imagem,
    rawData.responsavel?.IMAGEM
  );

const unwrapTutorResponse = (data) =>
  Array.isArray(data)
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

const fetchTutorById = async (tutorId) => {
  if (!tutorId) return null;

  const routes = [
    `/tutors/${tutorId}`,
    `/tutores/${tutorId}`,
    `/tutor/${tutorId}`,
  ];

  for (const route of routes) {
    try {
      const response = await api.get(route);
      const tutorData = unwrapTutorResponse(response.data);
      if (tutorData) return tutorData;
    } catch (error) {
      // Tenta a proxima variacao de rota.
    }
  }

  return null;
};

const unwrapPetList = (data) => {
  const list = data?.pets || data?.data?.pets || data?.data || data?.results || data;
  return Array.isArray(list) ? list : [];
};

const findPetInPublicFeeds = async (petId) => {
  if (!petId) return null;

  const routes = [
    '/pets/adocao',
    '/pets/adocao?includeTutor=true',
  ];

  for (const route of routes) {
    try {
      const response = await api.get(route);
      const pet = unwrapPetList(response.data).find((item) => String(getPetIdFromData(item)) === String(petId));
      if (pet) return pet;
    } catch (error) {
      // Continua tentando outros formatos de feed.
    }
  }

  return null;
};

const formatTutorImage = (image) => {
  if (!image || typeof image !== 'string') return TUTOR_DEFAULT;
  return {
    uri: image.startsWith('http')
      ? image
      : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${image}`,
  };
};

export default function PetDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useAppTheme();
  const { t, language } = useLanguage();
  const p = isDarkMode ? PET_DETAIL_THEME.dark : PET_DETAIL_THEME.light;
  const showAdoptAction = route.params?.showAdoptAction === true;
  const [activeTab, setActiveTab] = useState('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adopting, setAdopting] = useState(false);
  const [petData, setPetData] = useState(null);
  const [sourcePetData, setSourcePetData] = useState(null);
  const [vaccines, setVaccines] = useState([]);

  // Normaliza dados do pet para formato padrão
  const normalizePetData = (rawData) => {
    if (!rawData) return null;

    const getImageUri = (img) => {
      if (!img) return 'https://via.placeholder.com/300';
      return img.startsWith('http') ? img : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${img}`;
    };

    // Mapa de gênero/sexo para emojis
    const sexoMap = {
      'macho': '♂',
      'fêmea': '♀',
      'masculino': '♂',
      'feminino': '♀',
      'm': '♂',
      'f': '♀'
    };

    const sexo = (rawData.sexo || rawData.SEXO || '♂').toLowerCase();
    const genero = sexoMap[sexo] || '♂';

    const tutorName = getTutorNameFromPet(rawData)
      || rawData?.tutorNomeExibido
      || rawData?.tutor_nome_exibido
      || rawData?.tutorNameExibido
      || rawData?.tutor?.tutorNomeExibido
      || rawData?.tutor?.nome_tutor
      || rawData?.tutor?.nome
      || rawData?.tutor?.name
      || rawData?.tutor?.NOME_TUTOR
      || rawData?.tutor?.NOME;
    const tutorImage = getTutorImageFromPet(rawData);

    // Trata castrado (pode vir como string ou boolean)
    let castrated = 'Não';
    const castradoValue = rawData.castrado || rawData.CASTRADO;
    if (castradoValue) {
      if (typeof castradoValue === 'boolean') {
        castrated = castradoValue ? 'Sim' : 'Não';
      } else if (typeof castradoValue === 'string') {
        castrated = castradoValue.toLowerCase().includes('sim') ? 'Sim' : 'Não';
      }
    }

    const normalized = {
      id: rawData.id || rawData.ID || rawData.ID_PET,
      name: rawData.nome || rawData.NOME || 'Pet',
      especie: rawData.especie || rawData.ESPECIE || 'Não informado',
      breed: rawData.raca || rawData.RACA || 'Não informado',
      age: formatAgeFromDate(rawData.dataNascimento || rawData.DATA_NASCIMENTO || rawData.data_nascimento || rawData.NASCIMENTO, language) ||
        (rawData.idade || rawData.IDADE
          ? `${rawData.idade || rawData.IDADE} ${language === 'en' ? (Number(rawData.idade || rawData.IDADE) === 1 ? 'year' : 'years') : (Number(rawData.idade || rawData.IDADE) === 1 ? 'ano' : 'anos')}`
          : t('Não informado')),
      birthDate: parsePetDate(rawData.dataNascimento || rawData.DATA_NASCIMENTO || rawData.data_nascimento || rawData.NASCIMENTO)?.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR') || t('Não informada'),
      weight: formatWeight(rawData.peso || rawData.PESO),
      castrated: castrated,
      sexo: rawData.sexo || rawData.SEXO || 'Não informado',
      description: rawData.descricao || rawData.DESCRICAO || rawData.biografiaAdocao || t('O tutor ainda não escreveu uma descrição detalhada para este pet.'),
      personality: rawData.personalidade || rawData.PERSONALIDADE || t('Nenhuma característica informada.'),
      tutor: typeof tutorName === 'string' ? tutorName : '',
      tutorImage: formatTutorImage(tutorImage),
      image: getImageUri(rawData.imagem || rawData.IMAGEM),
      genero: genero,
      vaccines: rawData.vacinas || rawData.VACINAS || [],
    };

    return normalized;
  };

  // Carrega dados completos do pet da API
  useEffect(() => {
    const loadPetDetails = async () => {
      try {
        const params = route.params || {};
        const incomingPet = params.petData || params.pet;

        if (!incomingPet) {
          return;
        }

        setSourcePetData(incomingPet);

        // Normaliza os dados recebidos
        let normalized = normalizePetData(incomingPet);
        setPetData(normalized);
        setVaccines(Array.isArray(normalized.vaccines) ? normalized.vaccines : []);

        if (normalized.id) {
          try {
            const response = await api.get(`/vacinas/pet/${normalized.id}`);
            setVaccines(Array.isArray(response.data) ? response.data : []);
          } catch (error) {
            setVaccines(Array.isArray(normalized.vaccines) ? normalized.vaccines : []);
          }
        }

        // Se o feed veio resumido, tenta buscar o pet completo para achar tutor.
        let petWithTutor = incomingPet;
        let tutorId = getTutorIdFromPet(petWithTutor);

        if (!tutorId && normalized.id) {
          try {
            const petResponse = await api.get(`/pets/${normalized.id}`);
            const fullPetData = petResponse.data?.pet || petResponse.data?.data || petResponse.data || {};
            petWithTutor = { ...incomingPet, ...fullPetData };
            setSourcePetData(petWithTutor);
            tutorId = getTutorIdFromPet(petWithTutor);
            normalized = {
              ...normalizePetData(petWithTutor),
              vaccines: normalized.vaccines,
            };
            setPetData(normalized);
          } catch (error) {
            tutorId = null;
          }
        }

        if ((!tutorId || getTutorNameFromPet(petWithTutor) === undefined) && normalized.id) {
          const publicFeedPet = await findPetInPublicFeeds(normalized.id);

          if (publicFeedPet) {
            petWithTutor = { ...petWithTutor, ...publicFeedPet };
            setSourcePetData(petWithTutor);
            tutorId = getTutorIdFromPet(petWithTutor) || tutorId;
            normalized = {
              ...normalizePetData(petWithTutor),
              vaccines: normalized.vaccines,
            };
            setPetData(normalized);
          }
        }

        // Se temos o ID do tutor, busca os dados dele
        if (tutorId) {
          try {
            setLoading(true);
            const tutorData = await fetchTutorById(tutorId);

            if (tutorData) {
              // Atualiza os dados do tutor
              normalized.tutor =
                tutorData.nome_tutor ||
                tutorData.NOME_TUTOR ||
                tutorData.nomeTutor ||
                tutorData.nome ||
                tutorData.NOME ||
                tutorData.name ||
                tutorData.nomeCompleto ||
                tutorData.NOME_COMPLETO ||
                tutorData.usuario?.nome_tutor ||
                tutorData.usuario?.nome ||
                tutorData.profile?.nome ||
                tutorData.data?.nome ||
                tutorData.dados?.nome ||
                normalized.tutor ||
                '';
              normalized.tutorImage = formatTutorImage(
                tutorData.imagem ||
                tutorData.IMAGEM ||
                tutorData.imagem_perfil_tutor ||
                tutorData.IMAGEM_PERFIL_TUTOR ||
                tutorData.imagemPerfil ||
                tutorData.foto ||
                tutorData.FOTO
              );
              
              setPetData(normalized);
            }
          } catch (error) {
            setPetData({
              ...normalized,
              tutor: normalized.tutor || '',
            });
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    loadPetDetails();
  }, [route.params, language]);

  // Usa petData normalizado ou valores padrão
  const pet = petData || {
    name: 'Niça',
    breed: 'Branco',
    age: language === 'en' ? '11 years' : '11 anos',
    birthDate: t('Não informada'),
    weight: '-- kg',
    sexo: 'Macho',
    castrated: 'Não',
    description: t('O tutor ainda não escreveu uma descrição detalhada para este pet.'),
    personality: t('Nenhuma característica informada.'),
    tutor: 'Rayan Rodrigues',
    tutorImage: TUTOR_DEFAULT,
    image: 'https://placekitten.com/400/600',
    genero: '♂'
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleContact = () => {
    Alert.alert(t('Contato'), t('Enviando mensagem para entrar em contato com o tutor...'));
  };

  const handleAdopt = async () => {
    if (adopting) return;

    try {
      setAdopting(true);
      const petId = pet.id || sourcePetData?.id || sourcePetData?.ID || sourcePetData?.ID_PET;

      if (!petId) {
        Alert.alert(t('Erro'), t('Não foi possível identificar este pet.'));
        return;
      }

      const response = await api.post(`/pets/${petId}/adopt`);
      const adoptedPet = response.data?.pet || response.data?.data || response.data || {};

      Alert.alert(
        t('Adoção concluída'),
        t('{{name}} agora está em Meus pets.', { name: adoptedPet.nome || adoptedPet.NOME || pet.name }),
        [{ text: 'OK', onPress: () => navigation.navigate('MeusPets') }]
      );
    } catch (error) {
      Alert.alert(
        t('Erro'),
        error.response?.data?.error ||
          error.response?.data?.message ||
          t('Não foi possível concluir a adoção.')
      );
    } finally {
      setAdopting(false);
    }
  };

  const handleShare = () => {
    Alert.alert(t('Compartilhar'), t('Compartilhando perfil do {{name}}', { name: pet.name }));
  };

  const vaccineNames = vaccines
    .map((vaccine) => vaccine.nome || vaccine.NOME || vaccine.name || vaccine.descricao || vaccine.DESCRICAO)
    .filter(Boolean);
  const vaccineSummary = vaccineNames.length > 0
    ? vaccineNames.join(', ')
    : t('Nenhuma vacina informada');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: p.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: p.background }]}>
        
        {/* HEADER PERSONALIZADO */}
        <View style={[styles.header, { backgroundColor: p.surface, borderBottomColor: p.softBorder }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={p.text} />
            <Text style={[styles.backText, { color: p.muted }]}>{t('Voltar')}</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: p.text }]}>{pet.name}</Text>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#FF6B9D' : p.muted} 
              fill={isFavorite ? '#FF6B9D' : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* SCROLL CONTENT */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#9127E1" />
              <Text style={{ marginTop: 10, color: p.subtitle }}>{t('Carregando informações...')}</Text>
            </View>
          ) : (
          <>
          {/* PET IMAGE */}
          <View style={[styles.imageContainer, { backgroundColor: p.surface }]}>
            <Image 
              source={{ uri: pet.image }} 
              style={styles.petImage} 
            />
            {/* GENDER BADGE */}
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>{pet.genero}</Text>
            </View>
          </View>

          {/* PET NAME AND BREED */}
          <View style={[styles.petHeaderSection, { backgroundColor: p.surface, borderBottomColor: p.softBorder }]}>
            <Text style={[styles.petName, { color: p.text }]}>{pet.name}</Text>
            <View style={[styles.petBreedBadge, { backgroundColor: p.accentSoft }]}>
              <Text style={[styles.petBreedText, { color: p.accent }]}>{t(pet.breed)}</Text>
            </View>
          </View>

          {/* TUTOR RESPONSÁVEL */}
          <View style={[styles.tutorCard, { backgroundColor: p.tutorSurface, borderColor: p.tutorBorder }]}>
            <Text style={[styles.tutorLabel, { color: p.muted }]}>{t('TUTOR RESPONSÁVEL')}</Text>
            <View style={styles.tutorContent}>
              <Image 
                source={pet.tutorImage} 
                style={styles.tutorImage} 
              />
              <View style={styles.tutorInfo}>
                <Text style={[styles.tutorName, { color: p.text }]}>{pet.tutor}</Text>
              </View>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleContact}
              >
                <MessageCircle size={22} color="#FFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* PET INFO CARDS */}
          <View style={[styles.infoCardsContainer, { backgroundColor: p.surface }]}>
            <View style={[styles.infoCard, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
              <Text style={[styles.infoLabel, { color: p.muted }]}>{t('IDADE')}</Text>
              <Text style={[styles.infoValue, { color: p.text }]}>{pet.age}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
              <Text style={[styles.infoLabel, { color: p.muted }]}>{t('PESO')}</Text>
              <Text style={[styles.infoValue, { color: p.text }]}>{pet.weight}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
              <Text style={[styles.infoLabel, { color: p.muted }]}>{t('CASTRADO')}</Text>
              <Text style={[styles.infoValue, { color: p.text }]}>{t(pet.castrated)}</Text>
            </View>
          </View>

          {/* SAUDE E CUIDADOS */}
          <View style={[styles.section, { backgroundColor: p.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emojiIcon}>+</Text>
              <Text style={[styles.sectionTitle, { color: p.text }]}>{t('Saúde e cuidados')}</Text>
            </View>

            <View style={styles.healthGrid}>
              <View style={[styles.healthItem, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
                <Text style={[styles.healthLabel, { color: p.muted }]}>{t('Nascimento')}</Text>
                <Text style={[styles.healthValue, { color: p.text }]}>{pet.birthDate}</Text>
              </View>
              <View style={[styles.healthItem, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
                <Text style={[styles.healthLabel, { color: p.muted }]}>{t('Sexo')}</Text>
                <Text style={[styles.healthValue, { color: p.text }]}>{t(pet.sexo)}</Text>
              </View>
              <View style={[styles.healthItem, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
                <Text style={[styles.healthLabel, { color: p.muted }]}>{t('Espécie')}</Text>
                <Text style={[styles.healthValue, { color: p.text }]}>{t(pet.especie)}</Text>
              </View>
              <View style={[styles.healthItem, { backgroundColor: p.surfaceAlt, borderColor: p.border }]}>
                <Text style={[styles.healthLabel, { color: p.muted }]}>{t('Vacinas')}</Text>
                <Text style={[styles.healthValue, { color: p.text }]}>{vaccineSummary}</Text>
              </View>
            </View>
          </View>

          {/* CONHEÇA O PET */}
          <View style={[styles.section, { backgroundColor: p.surface }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionBorder, { backgroundColor: p.accent }]} />
              <Text style={[styles.sectionTitle, { color: p.text }]}>{t('Conheça o {{name}}', { name: pet.name })}</Text>
            </View>
            <Text style={[styles.sectionDescription, { color: p.subtitle }]}>
              {pet.description}
            </Text>
          </View>

          {/* PERSONALIDADE */}
          <View style={[styles.section, { backgroundColor: p.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emojiIcon}>✨</Text>
              <Text style={[styles.sectionTitle, { color: p.text }]}>{t('Personalidade')}</Text>
            </View>
            <Text style={[styles.sectionDescription, { color: p.subtitle }]}>
              {pet.personality}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: p.surface, borderColor: p.border }]}
              onPress={handleShare}
            >
              <Share2 size={18} color={p.muted} />
              <Text style={[styles.shareButtonText, { color: p.muted }]}>{t('Compartilhar')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.contactButton, showAdoptAction && adopting && styles.contactButtonDisabled]}
              onPress={showAdoptAction ? handleAdopt : handleContact}
              disabled={showAdoptAction && adopting}
            >
              {showAdoptAction && adopting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : showAdoptAction ? (
                <Heart size={18} color="white" />
              ) : (
                <MessageCircle size={18} color="white" />
              )}
              <Text style={styles.contactButtonText}>
                {showAdoptAction
                  ? (adopting ? t('Adotando...') : t('Adotar'))
                  : t('Quero entrar em contato')}
              </Text>
            </TouchableOpacity>
          </View>
          </>
          )}

        </ScrollView>

        {/* TAB BAR */}
        <TabBar 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
          onLogout={handleLogout} 
        />
      </View>
    </KeyboardAvoidingView>
  );
}
