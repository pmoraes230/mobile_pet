import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
  ActivityIndicator,
  Easing,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  PawPrint,
  X,
  Info,
  MapPin,
  ChevronDown,
  RefreshCw,
  Zap
} from 'lucide-react-native';

import { Audio } from 'expo-av';

import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import api from '../../services/api';
import { getUserInfo } from '../../services/auth';
import { useAppTheme } from '../../theme/ThemeContext';

// SONS DE LIKE (PETCH)
const MIAU_SOUND = require('../../assets/miau.mp3');
const AUAU_SOUND = require('../../assets/auau.mp3'); 

// SONS DE DISLIKE (RECUSAR)
const GATO_ROSNA = require('../../assets/gatorosna.mp3'); // <--- ADICIONADO
const CACHORRO_ROSNA = require('../../assets/cachorrorosna.mp3'); // <--- ADICIONADO

const MISSY_IMAGE = require('../../assets/default-pet.png'); 

const getPetId = (pet) => String(pet?.id || pet?.ID || '');

const ESTADOS_CIDADES = {
  'Acre': ['Rio Branco', 'Cruzeiro do Sul'],
  'Pará': ['Belém', 'Ananindeua', 'Parauapebas', 'Marabá'],
  'São Paulo': ['São Paulo', 'Campinas'],
  'Rio de Janeiro': ['Rio de Janeiro', 'Niterói'],
};

export default function TinderPet() {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const theme = isDarkMode
    ? {
        background: '#0F1020',
        surface: '#17182B',
        surfaceAlt: '#202238',
        border: '#30334F',
        text: '#F5F7FF',
        muted: '#AEB6CC',
        overlay: 'rgba(5, 7, 18, 0.78)',
        accent: '#B77CFF',
        accentSoft: '#2A1D42',
        orangeSoft: '#3A2419',
      }
    : {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        surfaceAlt: '#F8F9FA',
        border: '#F0F0F5',
        text: '#0D214F',
        muted: '#7E869E',
        overlay: 'rgba(13, 33, 79, 0.7)',
        accent: '#7055C8',
        accentSoft: '#F1EDFF',
        orangeSoft: '#FFF4EE',
      };

  // Estados de Modais
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [modalCidadeOpen, setModalCidadeOpen] = useState(false);
  const [modalTrocarPetOpen, setModalTrocarPetOpen] = useState(false); 

  // Estados de Dados do Banco
  const [user, setUser] = useState(null);
  const [meusPets, setMeusPets] = useState([]); 
  const [petLogado, setPetLogado] = useState(null); 
  const [petAtual, setPetAtual] = useState(null);
  const [amigosRecentes, setAmigosRecentes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [candidatos, setCandidatos] = useState([]);
  const [index, setIndex] = useState(0);

  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCidade, setSelectedCidade] = useState(null);

  // Animações e Som
  const [sound, setSound] = useState(null);
  const btnScale = useRef(new Animated.Value(1)).current;
  const [hearts, setHearts] = useState([]);

  const carregarMeusPets = useCallback(async (currentUser = user) => {
    if (!currentUser?.id) return;

    const response = await api.get(`/pets/tutor/${currentUser.id}`);
    const petsDisponiveis = Array.isArray(response.data) ? response.data : [];

    setMeusPets(petsDisponiveis);

    if (petsDisponiveis.length === 0) {
      setPetAtual(null);
      setCandidatos([]);
      setAmigosRecentes([]);
    }

    setPetLogado((currentPet) => {
      if (currentPet && petsDisponiveis.some((pet) => getPetId(pet) === getPetId(currentPet))) {
        return currentPet;
      }

      return petsDisponiveis[0] || null;
    });
  }, [user]);

  // 1. Carregar tutor e pets dele ao iniciar
  useEffect(() => {
    async function init() {
      try {
        const userInfo = await getUserInfo();
        if (!userInfo) return;
        setUser(userInfo);
        await carregarMeusPets(userInfo);
      } catch (error) {
        throw new Error('Erro ao carregar dados iniciais: ' + error.message)
      }
    }
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarMeusPets();
    }, [carregarMeusPets])
  );

  // 2. Sempre que o Pet Logado mudar, recarrega Feed e Matches
  useEffect(() => {
    if (petLogado?.id || petLogado?.ID) {
      carregarFeed();
      carregarMatchesReais();
    }
  }, [petLogado]);

  async function carregarMatchesReais() {
    try {
      const response = await api.get(`/cupido/matches/${petLogado?.id || petLogado?.ID}`);
      setAmigosRecentes(response.data || []);
    } catch (error) {
      throw new Error('Erro ao carregar amigos recentes: ' + error.message);
    }
  }

  async function carregarFeed() {
    try {
      setLoading(true);
      const response = await api.get('/cupido/feed', { 
        params: { pet_id: petLogado?.id || petLogado?.ID } 
      });
      const lista = response.data?.candidatos || [];
      setCandidatos(lista);
      setIndex(0);
      setPetAtual(lista[0] || null);
    } catch (error) {
      throw new Error('Erro ao carregar feed: ' + error.message);
      setPetAtual(null);
    } finally {
      setLoading(false);
    }
  }

  // --- INTERAÇÕES DE SOM ---

  async function playLikeSound() {
    try {
      const especie = (petLogado?.especie || petLogado?.ESPECIE || '').toLowerCase();
      const somParaTocar = (especie === 'cachorro' || especie === 'cão' || especie === 'cao') 
        ? AUAU_SOUND 
        : MIAU_SOUND;

      const { sound: obj } = await Audio.Sound.createAsync(somParaTocar, { shouldPlay: true });
      setSound(obj);
      obj.setOnPlaybackStatusUpdate(async (s) => { if (s.didJustFinish) await obj.unloadAsync(); });
    } catch (e) { throw new Error('Erro ao reproduzir som de like: ' + e.message); }
  }

  async function playDislikeSound() {
    try {
      const especie = (petLogado?.especie || petLogado?.ESPECIE || '').toLowerCase();
      const somParaTocar = (especie === 'cachorro' || especie === 'cão' || especie === 'cao') 
        ? CACHORRO_ROSNA 
        : GATO_ROSNA;

      const { sound: obj } = await Audio.Sound.createAsync(somParaTocar, { shouldPlay: true });
      setSound(obj);
      obj.setOnPlaybackStatusUpdate(async (s) => { if (s.didJustFinish) await obj.unloadAsync(); });
    } catch (e) { throw new Error('Erro ao reproduzir som de dislike: ' + e.message); }
  }

  const spawnHearts = (count = 10) => {
    Vibration.vibrate(Platform.OS === 'ios' ? 10 : 40);
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x: new Animated.Value(0), y: new Animated.Value(0),
      opacity: new Animated.Value(1), scale: new Animated.Value(0),
      targetX: Math.random() * 120 - 60, delay: i * 40,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    newHearts.forEach((h) => {
      Animated.parallel([
        Animated.timing(h.y, { toValue: -150, duration: 1000, useNativeDriver: true, delay: h.delay }),
        Animated.timing(h.x, { toValue: h.targetX, duration: 1000, useNativeDriver: true, delay: h.delay }),
        Animated.sequence([
          Animated.timing(h.scale, { toValue: 1.2, duration: 200, useNativeDriver: true, delay: h.delay }),
          Animated.timing(h.opacity, { toValue: 0, duration: 800, useNativeDriver: true, delay: h.delay + 200 }),
        ]),
      ]).start(() => {
        setHearts((p) => p.filter((x) => x.id !== h.id));
      });
    });
  };

  const proximoCard = () => {
    const next = index + 1;
    if (next < candidatos.length) {
      setIndex(next);
      setPetAtual(candidatos[next]);
    } else {
      carregarFeed();
    }
  };

  const onDislike = async () => {
    if (!petAtual) return;
    playDislikeSound(); // <--- TOCA O ROSNADO DINÂMICO
    proximoCard();
    try {
      await api.post('/cupido/swipe', { 
        meuPetId: petLogado?.id || petLogado?.ID, 
        alvoId: petAtual?.id || petAtual?.ID, 
        acao: 'dislike' 
      });
    } catch (e) { throw new Error('Erro ao dar dislike: ' + e.message); }
  };

  const onPetch = async () => {
    if (!petAtual || !petLogado) return;
    
    playLikeSound(); 
    spawnHearts();

    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.85, duration: 60, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    const alvoId = petAtual?.id || petAtual?.ID;
    setTimeout(proximoCard, 500); 

    try {
      const response = await api.post('/cupido/swipe', { 
        meuPetId: petLogado?.id || petLogado?.ID, 
        alvoId: alvoId, 
        acao: 'like' 
      });
      if (response.data.match) carregarMatchesReais();
    } catch (e) { 
      throw new Error('Erro ao dar like: ' + e.message); 
    }
  };

  const getImageUri = (img) => {
    if (!img) return 'https://placekitten.com/500/800';
    return img.startsWith('http') ? img : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${img}`;
  };

  const getPetEmoji = (esp) => {
    const e = esp?.toLowerCase() || '';
    return (e === 'cachorro' || e === 'cão' || e === 'cao') ? '🐶' : '🐱';
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        <HeaderHome 
          userName={user?.nome || 'Usuário'} 
          showSearch={false} 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => setModalEstadoOpen(true)}>
              <MapPin size={14} color={theme.accent} />
              <Text style={[styles.filterText, { color: theme.muted }]}>{selectedEstado?.name || 'Estado'}</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }, !selectedEstado && { opacity: 0.5 }]} 
              disabled={!selectedEstado} 
              onPress={() => setModalCidadeOpen(true)}
            >
              <MapPin size={14} color={theme.accent} />
              <Text style={[styles.filterText, { color: theme.muted }]}>{selectedCidade?.name || 'Cidade'}</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>
          </View>

          {/* 2. CARD PRINCIPAL DINÂMICO */}
          {loading && !petAtual ? (
            <ActivityIndicator size="large" color="#9127E1" style={{ marginTop: 100 }} />
          ) : petAtual ? (
            <>
              <View style={styles.mainCard}>
                <Image source={{ uri: getImageUri(petAtual?.imagem || petAtual?.IMAGEM) }} style={styles.cardImg} />
                <View style={styles.infoOverlay}>
                  <Text style={styles.cardName}>
                    {petAtual?.nome || petAtual?.NOME}, <Text style={{ fontWeight: '300' }}>{petAtual?.idade || petAtual?.IDADE || '?'}a</Text>
                  </Text>
                  <Text style={styles.cardBio} numberOfLines={2}>
                    {petAtual?.descricao || petAtual?.DESCRICAO || 'Olá! Vamos ser amigos?'}
                  </Text>
                  <Text style={styles.cardBreed}>
                    {getPetEmoji(petAtual?.especie || petAtual?.ESPECIE)} {(petAtual?.especie || petAtual?.ESPECIE || 'PET').toUpperCase()} • {(petAtual?.raca || petAtual?.RACA || 'SRD').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.btnSmall, { backgroundColor: theme.surface }]} onPress={onDislike}>
                  <X size={28} color="#FF7A2F" strokeWidth={3} />
                </TouchableOpacity>

                <View style={{ width: 85, height: 85, justifyContent: 'center', alignItems: 'center' }}>
                  <Animated.View style={{ transform: [{ scale: btnScale }], zIndex: 2 }}>
                    <TouchableOpacity style={styles.btnMain} onPress={onPetch}>
                      <PawPrint size={40} color="#FFF" />
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <View style={{ position: 'absolute', pointerEvents: 'none' }}>
                    {hearts.map(h => (
                      <Animated.Text key={h.id} style={{
                        position: 'absolute', fontSize: 24,
                        transform: [{ translateX: h.x }, { translateY: h.y }, { scale: h.scale }],
                        opacity: h.opacity
                      }}>❤️</Animated.Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={[styles.btnSmall, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('PetDetail', { pet: petAtual })}>
                  <Info size={28} color="#4A90E2" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>Nenhum pet encontrado.</Text>
          )}

          {/* 4. SEU PET WIDGET */}
          <View style={[styles.activePetWidget, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Image source={(petLogado?.imagem || petLogado?.IMAGEM) ? { uri: getImageUri(petLogado?.imagem || petLogado?.IMAGEM) } : MISSY_IMAGE} style={styles.activePetImg} />
            <View style={styles.activePetInfo}>
              <Text style={[styles.activePetName, { color: theme.text }]}>{petLogado?.nome || petLogado?.NOME || 'Seu Pet'} (Você)</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.miniBadge, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.miniBadgeText, { color: theme.accent }]}>{getPetEmoji(petLogado?.especie || petLogado?.ESPECIE)} {petLogado?.especie || petLogado?.ESPECIE || 'Pet'}</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: theme.orangeSoft }]}>
                  <Text style={[styles.miniBadgeText, { color: '#FF7A2F' }]}>🐾 No Tinder</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setModalTrocarPetOpen(true)}>
              <RefreshCw size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {/* 5. AMIGOS RECENTES */}
          <View style={styles.friendsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Amigos recentes</Text>
            <Zap size={14} color="#FF7A2F" fill="#FF7A2F" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {amigosRecentes.length > 0 ? (
              amigosRecentes.map((amigo) => (
                <View key={amigo.id || amigo.ID} style={styles.friendBubble}>
                  <TouchableOpacity style={styles.haloEffect} onPress={() => navigation.navigate('Chat', { amigo })}>
                    <Image source={{ uri: getImageUri(amigo.imagem || amigo.IMAGEM) }} style={styles.friendImg} />
                  </TouchableOpacity>
                  <Text style={[styles.friendName, { color: theme.text }]}>{amigo.nome || amigo.NOME}</Text>
                </View>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: '#AAA', fontSize: 12 }}>Nenhum amigo recente.</Text>
            )}
          </ScrollView>
        </ScrollView>

        {/* MODAL TROCAR PET */}
        <Modal visible={modalTrocarPetOpen} transparent animationType="slide">
          <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Seus Pets</Text>
              <FlatList
                data={meusPets}
                keyExtractor={item => (item.id || item.ID).toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.modalItem,
                      { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
                      (petLogado?.id === item.id || petLogado?.ID === item.ID) && {
                        backgroundColor: theme.accentSoft,
                        borderColor: theme.accent,
                      },
                    ]} 
                    onPress={() => { setPetLogado(item); setModalTrocarPetOpen(false); }}
                  >
                    <Image source={{ uri: getImageUri(item.imagem || item.IMAGEM) }} style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}} />
                    <Text style={[styles.modalItemText, { color: theme.text }]}>{item.nome || item.NOME}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: theme.surfaceAlt }]} onPress={() => setModalTrocarPetOpen(false)}>
                <Text style={[styles.modalCloseBtnText, { color: theme.muted }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAIS ESTADO/CIDADE (Mantidos conforme original) */}
        <Modal visible={modalEstadoOpen} transparent animationType="fade">
          <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Selecione um Estado</Text>
              <FlatList
                data={Object.keys(ESTADOS_CIDADES).map((n, i) => ({ id: i, name: n }))}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.modalItem, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]} onPress={() => { setSelectedEstado(item); setSelectedCidade(null); setModalEstadoOpen(false); }}>
                    <Text style={[styles.modalItemText, { color: theme.text }]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={modalCidadeOpen} transparent animationType="fade">
          <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Selecione uma Cidade</Text>
              <FlatList
                data={selectedEstado ? ESTADOS_CIDADES[selectedEstado.name].map((n, i) => ({ id: i, name: n })) : []}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.modalItem, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]} onPress={() => { setSelectedCidade(item); setModalCidadeOpen(false); }}>
                    <Text style={[styles.modalItemText, { color: theme.text }]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <TabBar />
      </View>
    </KeyboardAvoidingView>
  );
}
