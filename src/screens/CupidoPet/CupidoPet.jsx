import React, { useState, useRef } from 'react';
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
  Dimensions,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PawPrint, RefreshCw, X, Info, MapPin, ChevronDown, Zap } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

const MISSY_IMAGE = require('../../../assets/gatasafada.jpg');

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

export default function TinderPet() {
  const navigation = useNavigation();
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

  const renderModalItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const btnScale = useRef(new Animated.Value(1)).current;
  const [hearts, setHearts] = useState([]);

  const spawnHearts = (count = 8) => {
    Vibration.vibrate(40);
    const newHearts = Array.from({ length: count }).map((_, i) => {
      const id = Date.now() + Math.random() + i;
      const x = new Animated.Value((Math.random() * 60) - 30);
      const y = new Animated.Value(0);
      const opacity = new Animated.Value(1);
      const scale = new Animated.Value(1);
      const delay = Math.random() * 200;
      return { id, x, y, opacity, scale, delay };
    });

    setHearts((prev) => [...prev, ...newHearts]);

    newHearts.forEach((h) => {
      const toY = -80 - Math.random() * 80;
      const dur = 900 + Math.random() * 600;
      Animated.parallel([
        Animated.timing(h.y, { toValue: toY, duration: dur, easing: Easing.out(Easing.cubic), useNativeDriver: true, delay: h.delay }),
        Animated.timing(h.opacity, { toValue: 0, duration: dur, useNativeDriver: true, delay: h.delay }),
        Animated.timing(h.scale, { toValue: 0.9, duration: dur, useNativeDriver: true, delay: h.delay }),
      ]).start(() => {
        setHearts((prev) => prev.filter((x) => x.id !== h.id));
      });
    });
  };

  const onPetch = () => {
    // micro-pop
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 1.12, duration: 110, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    spawnHearts(8);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

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

          {/* FILTROS NO TOPO */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.7}
              onPress={() => setModalEstadoOpen(true)}
            >
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText} numberOfLines={1}>
                {selectedEstado ? selectedEstado.name : 'Estado'}
              </Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, !selectedEstado && { opacity: 0.5 }]}
              activeOpacity={0.7}
              onPress={() => selectedEstado && setModalCidadeOpen(true)}
              disabled={!selectedEstado}
            >
              <MapPin size={14} color="#9127E1" />
              <Text style={styles.filterText} numberOfLines={1}>
                {selectedCidade ? selectedCidade.name : 'Cidade'}
              </Text>
              <ChevronDown size={14} color="#A0A7BA" />
            </TouchableOpacity>
          </View>

          {/* CARD PRINCIPAL */}
          <View style={styles.mainCard}>
            <Image
              source={{ uri: 'https://placekitten.com/500/800' }}
              style={styles.cardImg}
            />
            <View style={styles.infoOverlay}>
              <Text style={styles.cardName}>Niça, <Text style={{ fontWeight: '300' }}>12a</Text></Text>
              <Text style={styles.cardBio} numberOfLines={2}>
                Eu sou um gatinho muito bonito e educado esperando uma parceira para amar.
              </Text>
              <Text style={styles.cardBreed}>GATO • BRANCO MISTO</Text>
            </View>
          </View>

          {/* BOTÕES DE INTERAÇÃO */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.btnSmall}>
              <X size={28} color="#FF7A2F" strokeWidth={3} />
            </TouchableOpacity>

            <View style={{ width: 85, height: 85, justifyContent: 'center', alignItems: 'center' }}>
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <TouchableOpacity style={styles.btnMain} onPress={onPetch} activeOpacity={0.8}>
                  <PawPrint size={40} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                {hearts.map((h) => (
                  <Animated.View
                    key={h.id}
                    style={{
                      position: 'absolute',
                      left: 42,
                      transform: [
                        { translateX: h.x },
                        { translateY: h.y },
                        { scale: h.scale },
                      ],
                      opacity: h.opacity,
                    }}
                  >
                    <Text style={{ fontSize: 18, lineHeight: 18, color: '#FF3B30', textAlign: 'center' }}>❤️</Text>
                  </Animated.View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnSmall}
              onPress={() => navigation.navigate('PetDetail')}
            >
              <Info size={28} color="#4A90E2" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* STATUS DO MEU PET */}
          <View style={styles.activePetWidget}>
            <Image
              source={MISSY_IMAGE}
              style={styles.activePetImg}
            />
            <View style={styles.activePetInfo}>
              <Text style={styles.activePetName}>Missy (Seu pet)</Text>
              <View style={styles.badgeRow}>
                <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>🐱 6 Cheiradas</Text></View>
                <View style={[styles.miniBadge, { backgroundColor: '#FFF4EE' }]}>
                  <Text style={[styles.miniBadgeText, { color: '#FF7A2F' }]}>🐾 1 Petch</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity><RefreshCw size={18} color="#9127E1" /></TouchableOpacity>
          </View>

          {/* AMIGOS RECENTES */}
          <View style={styles.friendsHeader}>
            <Text style={styles.sectionTitle}>Amigos recentes</Text>
            <Zap size={14} color="#FF7A2F" fill="#FF7A2F" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.friendBubble}>
              <View style={styles.haloEffect}>
                <Image source={{ uri: 'https://placekitten.com/100/100' }} style={styles.friendImg} />
              </View>
              <Text style={styles.friendName}>Patrick</Text>
            </View>
            <View style={styles.friendBubble}>
              <View style={[styles.haloEffect, { borderColor: '#E2E8F0' }]}>
                <Image source={{ uri: 'https://placekitten.com/110/110' }} style={styles.friendImg} />
              </View>
              <Text style={styles.friendName}>Luna</Text>
            </View>
          </ScrollView>

        </ScrollView>

        {/* MODAL ESTADO */}
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
                  setSelectedCidade(null);
                  setModalEstadoOpen(false);
                })}
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

        {/* MODAL CIDADE */}
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
        {/* Particle animation removed as requested */}

        <TabBar />
      </View>
    </KeyboardAvoidingView>
  );
}