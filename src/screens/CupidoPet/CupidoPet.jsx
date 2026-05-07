import React, { useState, useRef, useEffect } from 'react';
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

import { useNavigation } from '@react-navigation/native';
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

// SONS DE LIKE (PETCH)
const MIAU_SOUND = require('../../assets/miau.mp3');
const AUAU_SOUND = require('../../assets/auau.mp3'); 

// SONS DE DISLIKE (RECUSAR)
const GATO_ROSNA = require('../../assets/gatorosna.mp3'); // <--- ADICIONADO
const CACHORRO_ROSNA = require('../../assets/cachorrorosna.mp3'); // <--- ADICIONADO

const MISSY_IMAGE = require('../../assets/default-pet.png'); 

const ESTADOS_CIDADES = {
  'Acre': ['Rio Branco', 'Cruzeiro do Sul'],
  'Pará': ['Belém', 'Ananindeua', 'Parauapebas', 'Marabá'],
  'São Paulo': ['São Paulo', 'Campinas'],
  'Rio de Janeiro': ['Rio de Janeiro', 'Niterói'],
};

export default function TinderPet() {
  const navigation = useNavigation();

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

  // 1. Carregar tutor e pets dele ao iniciar
  useEffect(() => {
    async function init() {
      try {
        const userInfo = await getUserInfo();
        if (!userInfo) return;
        setUser(userInfo);

        const response = await api.get(`/pets/tutor/${userInfo.id}`);
        if (response.data?.length > 0) {
          setMeusPets(response.data);
          setPetLogado(response.data[0]); 
        }
      } catch (error) {
        console.log('Erro ao carregar pets do tutor:', error.message);
      }
    }
    init();
  }, []);

  // 2. Sempre que o Pet Logado mudar, recarrega Feed e Matches
  useEffect(() => {
    if (petLogado?.id) {
      carregarFeed();
      carregarMatchesReais();
    }
  }, [petLogado]);

  async function carregarMatchesReais() {
    try {
      const response = await api.get(`/cupido/matches/${petLogado.id}`);
      setAmigosRecentes(response.data || []);
    } catch (error) {
      console.log('Erro ao buscar matches:', error.message);
    }
  }

  async function carregarFeed() {
    try {
      setLoading(true);
      const response = await api.get('/cupido/feed', { 
        params: { pet_id: petLogado.id } 
      });
      const lista = response.data?.candidatos || [];
      setCandidatos(lista);
      setIndex(0);
      setPetAtual(lista[0] || null);
    } catch (error) {
      console.log('Erro ao carregar feed:', error.message);
      setPetAtual(null);
    } finally {
      setLoading(false);
    }
  }

  // --- INTERAÇÕES DE SOM ---

  async function playLikeSound() {
    try {
      const especie = petLogado?.ESPECIE?.toLowerCase() || '';
      const somParaTocar = (especie === 'cachorro' || especie === 'cão' || especie === 'cao') 
        ? AUAU_SOUND 
        : MIAU_SOUND;

      const { sound: obj } = await Audio.Sound.createAsync(somParaTocar, { shouldPlay: true });
      setSound(obj);
      obj.setOnPlaybackStatusUpdate(async (s) => { if (s.didJustFinish) await obj.unloadAsync(); });
    } catch (e) { console.log(e); }
  }

  async function playDislikeSound() {
    try {
      const especie = petLogado?.ESPECIE?.toLowerCase() || '';
      const somParaTocar = (especie === 'cachorro' || especie === 'cão' || especie === 'cao') 
        ? CACHORRO_ROSNA 
        : GATO_ROSNA;

      const { sound: obj } = await Audio.Sound.createAsync(somParaTocar, { shouldPlay: true });
      setSound(obj);
      obj.setOnPlaybackStatusUpdate(async (s) => { if (s.didJustFinish) await obj.unloadAsync(); });
    } catch (e) { console.log(e); }
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
      await api.post('/cupido/swipe', { meuPetId: petLogado.id, alvoId: petAtual.id, acao: 'dislike' });
    } catch (e) { console.log(e.message); }
  };

  const onPetch = async () => {
    if (!petAtual || !petLogado) return;
    
    playLikeSound(); 
    spawnHearts();

    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.85, duration: 60, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    const alvoId = petAtual.id;
    setTimeout(proximoCard, 500); 

    try {
      const response = await api.post('/cupido/swipe', { 
        meuPetId: petLogado.id, 
        alvoId: alvoId, 
        acao: 'like' 
      });
      if (response.data.match) carregarMatchesReais();
    } catch (e) { 
      console.log("Erro ao dar like:", e.message); 
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        
        <HeaderHome 
          userName={user?.nome || 'Usuário'} 
          showSearch={false} 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setModalEstadoOpen(true)}>
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText}>{selectedEstado?.name || 'Estado'}</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterButton, !selectedEstado && { opacity: 0.5 }]} 
              disabled={!selectedEstado} 
              onPress={() => setModalCidadeOpen(true)}
            >
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText}>{selectedCidade?.name || 'Cidade'}</Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>
          </View>

          {/* 2. CARD PRINCIPAL DINÂMICO */}
          {loading && !petAtual ? (
            <ActivityIndicator size="large" color="#9127E1" style={{ marginTop: 100 }} />
          ) : petAtual ? (
            <>
              <View style={styles.mainCard}>
                <Image source={{ uri: getImageUri(petAtual.IMAGEM) }} style={styles.cardImg} />
                <View style={styles.infoOverlay}>
                  <Text style={styles.cardName}>
                    {petAtual.NOME}, <Text style={{ fontWeight: '300' }}>{petAtual.IDADE || '?'}a</Text>
                  </Text>
                  <Text style={styles.cardBio} numberOfLines={2}>
                    {petAtual.DESCRICAO || 'Olá! Vamos ser amigos?'}
                  </Text>
                  <Text style={styles.cardBreed}>
                    {getPetEmoji(petAtual.ESPECIE)} {(petAtual.ESPECIE || 'PET').toUpperCase()} • {(petAtual.RACA || 'SRD').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.btnSmall} onPress={onDislike}>
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

                <TouchableOpacity style={styles.btnSmall} onPress={() => navigation.navigate('PetDetail', { pet: petAtual })}>
                  <Info size={28} color="#4A90E2" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>Nenhum pet encontrado.</Text>
          )}

          {/* 4. SEU PET WIDGET */}
          <View style={styles.activePetWidget}>
            <Image source={petLogado?.IMAGEM ? { uri: getImageUri(petLogado.IMAGEM) } : MISSY_IMAGE} style={styles.activePetImg} />
            <View style={styles.activePetInfo}>
              <Text style={styles.activePetName}>{petLogado?.NOME || 'Seu Pet'} (Você)</Text>
              <View style={styles.badgeRow}>
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>{getPetEmoji(petLogado?.ESPECIE)} {petLogado?.ESPECIE || 'Pet'}</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: '#FFF4EE' }]}>
                  <Text style={[styles.miniBadgeText, { color: '#FF7A2F' }]}>🐾 No Tinder</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setModalTrocarPetOpen(true)}>
              <RefreshCw size={18} color="#9127E1" />
            </TouchableOpacity>
          </View>

          {/* 5. AMIGOS RECENTES */}
          <View style={styles.friendsHeader}>
            <Text style={styles.sectionTitle}>Amigos recentes</Text>
            <Zap size={14} color="#FF7A2F" fill="#FF7A2F" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {amigosRecentes.length > 0 ? (
              amigosRecentes.map((amigo) => (
                <View key={amigo.id} style={styles.friendBubble}>
                  <TouchableOpacity style={styles.haloEffect} onPress={() => navigation.navigate('Chat', { amigo })}>
                    <Image source={{ uri: getImageUri(amigo.IMAGEM) }} style={styles.friendImg} />
                  </TouchableOpacity>
                  <Text style={styles.friendName}>{amigo.NOME}</Text>
                </View>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: '#AAA', fontSize: 12 }}>Nenhum amigo recente.</Text>
            )}
          </ScrollView>
        </ScrollView>

        {/* MODAL TROCAR PET */}
        <Modal visible={modalTrocarPetOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seus Pets</Text>
              <FlatList
                data={meusPets}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.modalItem, petLogado?.id === item.id && { backgroundColor: '#F0E6FF' }]} 
                    onPress={() => { setPetLogado(item); setModalTrocarPetOpen(false); }}
                  >
                    <Image source={{ uri: getImageUri(item.IMAGEM) }} style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}} />
                    <Text style={styles.modalItemText}>{item.NOME}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalTrocarPetOpen(false)}>
                <Text style={styles.modalCloseBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAIS ESTADO/CIDADE */}
        <Modal visible={modalEstadoOpen} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Estado</Text>
              <FlatList
                data={Object.keys(ESTADOS_CIDADES).map((n, i) => ({ id: i, name: n }))}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedEstado(item); setSelectedCidade(null); setModalEstadoOpen(false); }}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={modalCidadeOpen} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione uma Cidade</Text>
              <FlatList
                data={selectedEstado ? ESTADOS_CIDADES[selectedEstado.name].map((n, i) => ({ id: i, name: n })) : []}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedCidade(item); setModalCidadeOpen(false); }}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
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