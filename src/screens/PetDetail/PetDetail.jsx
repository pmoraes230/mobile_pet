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
import { Share2, Heart } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native/icons';
import { styles } from './styles';
import TabBar from '../../components/TabBar';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTOR_DEFAULT = require('../../assets/user_default.png');

export default function PetDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState(null);

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
      id: rawData.id || rawData.ID_PET,
      name: rawData.nome || rawData.NOME || 'Pet',
      especie: rawData.especie || rawData.ESPECIE || 'Não informado',
      breed: rawData.raca || rawData.RACA || 'Não informado',
      age: String(rawData.idade || rawData.IDADE || '0'),
      weight: rawData.peso || rawData.PESO || '-- kg',
      castrated: castrated,
      description: rawData.descricao || rawData.DESCRICAO || rawData.biografiaAdocao || 'O tutor ainda não escreveu uma descrição detalhada para este pet.',
      personality: rawData.personalidade || rawData.PERSONALIDADE || 'Nenhuma característica informada.',
      tutor: 'Carregando...',
      tutorImage: TUTOR_DEFAULT,
      image: getImageUri(rawData.imagem || rawData.IMAGEM),
      genero: genero
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

        // Normaliza os dados recebidos
        let normalized = normalizePetData(incomingPet);
        setPetData(normalized);

        // Se temos o ID do tutor, busca os dados dele
        const tutorId = incomingPet.idTutor || incomingPet.ID_TUTOR;
        if (tutorId) {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem('@token');
            
            const response = await api.get(`/tutors/${tutorId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (response.data) {       
              // Atualiza os dados do tutor
              normalized.tutor = response.data.nome || response.data.NOME || 'Tutor';
              normalized.tutorImage = response.data.imagem || response.data.IMAGEM 
                ? { uri: (response.data.imagem || response.data.IMAGEM).startsWith('http') 
                    ? (response.data.imagem || response.data.IMAGEM)
                    : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${response.data.imagem || response.data.IMAGEM}`
                  }
                : TUTOR_DEFAULT;
              
              setPetData(normalized);
            }
          } catch (error) {
            throw new Error("Erro ao carregar dados do tutor: " + (error.response?.data?.error || error.message));
            // Continua com os dados que já temos
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        throw new Error("Erro ao carregar detalhes do pet: " + error.message);
        setLoading(false);
      }
    };

    loadPetDetails();
  }, [route.params]);

  // Usa petData normalizado ou valores padrão
  const pet = petData || {
    name: 'Niça',
    breed: 'Branco',
    age: '11',
    weight: '-- kg',
    castrated: 'Não',
    description: 'O tutor ainda não escreveu uma descrição detalhada para este pet.',
    personality: 'Nenhuma característica informada.',
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
    Alert.alert('Contato', 'Enviando mensagem para entrar em contato com o tutor...');
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Compartilhando perfil do ' + pet.name);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        
        {/* HEADER PERSONALIZADO */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#333" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{pet.name}</Text>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#FF6B9D' : '#CCC'} 
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
              <Text style={{ marginTop: 10, color: '#666' }}>Carregando informações...</Text>
            </View>
          ) : (
          <>
          {/* PET IMAGE */}
          <View style={styles.imageContainer}>
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
          <View style={styles.petHeaderSection}>
            <Text style={styles.petName}>{pet.name}</Text>
            <View style={styles.petBreedBadge}>
              <Text style={styles.petBreedText}>{pet.breed}</Text>
            </View>
          </View>

          {/* TUTOR RESPONSÁVEL */}
          <View style={styles.tutorCard}>
            <Text style={styles.tutorLabel}>TUTOR RESPONSÁVEL</Text>
            <View style={styles.tutorContent}>
              <Image 
                source={pet.tutorImage} 
                style={styles.tutorImage} 
              />
              <View style={styles.tutorInfo}>
                <Text style={styles.tutorName}>{pet.tutor}</Text>
              </View>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleContact}
              >
                <Text style={styles.messageButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PET INFO CARDS */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>IDADE</Text>
              <Text style={styles.infoValue}>{pet.age} anos</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>PESO</Text>
              <Text style={styles.infoValue}>{pet.weight}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>CASTRADO</Text>
              <Text style={styles.infoValue}>{pet.castrated}</Text>
            </View>
          </View>

          {/* CONHEÇA O PET */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBorder} />
              <Text style={styles.sectionTitle}>Conheça o {pet.name}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {pet.description}
            </Text>
          </View>

          {/* PERSONALIDADE */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emojiIcon}>✨</Text>
              <Text style={styles.sectionTitle}>Personalidade</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {pet.personality}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={18} color="#A0A7BA" />
              <Text style={styles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Heart size={18} color="white" />
              <Text style={styles.contactButtonText}>Quero entrar em contato</Text>
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