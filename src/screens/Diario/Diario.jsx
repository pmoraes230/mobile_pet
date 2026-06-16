import React, { useState, useEffect, useMemo } from 'react';
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
  Dimensions,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import { useNavigation } from '@react-navigation/native';

import {
  Frown,
  Meh,
  Smile,
  HeartHandshake,
  Sparkles,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';

import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';
import { useAppTheme } from '../../theme/ThemeContext';

import api from '../../services/api';

const screenWidth = Dimensions.get('window').width;

const DIARIO_THEME = {
  light: {
    surface: '#FFFFFF',
    surfaceAlt: '#F9F6FF',
    surfaceSoft: '#F5F5F5',
    text: '#1A1A2E',
    subtitle: '#8B93A7',
    muted: '#888',
    border: '#E8DFF5',
    accent: '#9333EA',
    accentSoft: '#F3F0FF',
    accentMuted: '#B380D6',
    orangeSoft: '#FFF4E6',
    orangeMuted: '#FFA366',
    historyMood: '#C7CDDA',
    selectedPet: '#F1E4FF',
    inputPanel: '#9127E1',
    inputPanelBorder: '#9127E1',
    inputField: '#FFFFFF',
    inputFieldText: '#333',
    inputFieldBorder: 'rgba(255,255,255,0)',
    inputButton: '#FFFFFF',
    inputButtonText: '#7C3AED',
  },
  dark: {
    surface: '#17182B',
    surfaceAlt: '#211936',
    surfaceSoft: '#202238',
    text: '#F5F7FF',
    subtitle: '#AEB6CC',
    muted: '#8E98B5',
    border: '#4B3471',
    accent: '#B77CFF',
    accentSoft: '#2A1D42',
    accentMuted: '#D8B4FE',
    orangeSoft: '#352313',
    orangeMuted: '#FDBA74',
    historyMood: '#AEB6CC',
    selectedPet: '#2A1D42',
    inputPanel: '#4C1D95',
    inputPanelBorder: '#7C3AED',
    inputField: '#2A1D42',
    inputFieldText: '#F5F7FF',
    inputFieldBorder: '#68429B',
    inputButton: '#E9D5FF',
    inputButtonText: '#4C1D95',
  },
};

export default function TelaDiario() {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const p = isDarkMode ? DIARIO_THEME.dark : DIARIO_THEME.light;

  const [activeTab, setActiveTab] = useState('consultas');

  const [mood, setMood] = useState('happy');

  const [selectedPet, setSelectedPet] = useState(null);

  const [modalPetOpen, setModalPetOpen] = useState(false);

  const [pets, setPets] = useState([]);

  const [relato, setRelato] = useState('');

  const [registros, setRegistros] = useState([]);

  const [compareMode, setCompareMode] = useState(false);

  const [comparePeriod, setComparePeriod] = useState('lastWeek');

  const humorMap = {
    sad: 1,
    neutral: 2,
    happy: 3,
  };

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (selectedPet?.id) {
      loadRegistros(selectedPet.id);
    }
  }, [selectedPet]);

  async function loadPets() {
    try {
      // 1. Verifique se a chave no Login foi salva exatamente como 'userId' ou '@id'
      // Geralmente usamos um padrão. Se no login você salvou como '@id', mude aqui.
      const tutorId = await AsyncStorage.getItem('userId'); 
      
      // 2. Você PRECISA do token, pois sua rota /pets/tutor/:id é protegida
      const token = await AsyncStorage.getItem('@token');

      if (!tutorId || !token) {
        return;
      }

      const response = await api.get(`/pets/tutor/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const formattedPets = response.data.map((pet) => ({
        id: pet.id || pet.ID,
        name: pet.nome || pet.NOME,
        imagem: pet.imagem || pet.IMAGEM,
      }));

      setPets(formattedPets);

      if (formattedPets.length > 0) {
        setSelectedPet(formattedPets[0]);
      }

    } catch (error) {
      throw new Error('Erro ao carregar pets: ' + error.message);
    }
  }

  async function loadRegistros(petId) {
  try {
    const token = await AsyncStorage.getItem('@token');
    
    const response = await api.get(`/diario/pet/${petId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      console.error('❌ Resposta não é um array!');
      setRegistros([]);
      return;
    }

    const formatted = response.data.map((item) => ({
      id: item.id || item.ID,
      humor: Number(item.humor || item.HUMOR),
      relato: item.relato || item.RELATO,
      data:
        item.dataRegistro ||
        item.DATA_REGISTRO ||
        item.createdAt,
    }));

    setRegistros(formatted);

    } catch (error) {
      throw new Error('Erro ao carregar registros: ' + error.message);
    }
  }

  async function salvarRegistro() {
    try {
      if (!selectedPet) {
        Alert.alert('Erro', 'Selecione um pet');
        return;
      }

      if (!relato.trim()) {
        Alert.alert('Erro', 'Digite um relato');
        return;
      }

      // 1. Pega o token do armazenamento
      const token = await AsyncStorage.getItem('@token');

      // Debug: log dos dados que serão enviados
      const payload = {
        humor: humorMap[mood],
        relato: relato,
        idPet: selectedPet.id,
      };

      // 2. Envia o POST com o cabeçalho de autorização
      await api.post('/diario', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // 3. Limpa o campo e atualiza a lista
      setRelato('');
      await loadRegistros(selectedPet.id);

      Alert.alert('Sucesso', 'Registro salvo!');

    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Erro ao salvar registro'
      );
    }
  }

  const chartData = useMemo(() => {
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twentyOneDaysAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

    // Registros dos últimos 7 dias
    const currentWeekRegistros = registros
      .filter(item => {
        const itemDate = new Date(item.data);
        return itemDate >= sevenDaysAgo;
      })
      .slice(0, 7)
      .reverse();

    // Registros de 14-21 dias atrás (semana anterior)
    const previousWeekRegistros = registros
      .filter(item => {
        const itemDate = new Date(item.data);
        return itemDate >= fourteenDaysAgo && itemDate < sevenDaysAgo;
      })
      .slice(0, 7)
      .reverse();

    // Labels para os gráficos
    const labels = currentWeekRegistros.length > 0
      ? currentWeekRegistros.map((item) => {
          try {
            const date = new Date(item.data);
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            return `${day}/${month}`;
          } catch (err) {
            console.error('❌ Erro ao formatar data:', item.data, err);
            return 'N/A';
          }
        })
      : ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

    // Dados da semana atual
    const currentWeekData = currentWeekRegistros.length > 0
      ? currentWeekRegistros.map((item) => item.humor)
      : [2, 2, 2, 2, 2, 2, 2];

    const currentWeekDataWithMinimum = currentWeekData.length === 1 
      ? [...currentWeekData, currentWeekData[0]]
      : currentWeekData;

    // Dados da semana anterior
    const previousWeekData = previousWeekRegistros.length > 0
      ? previousWeekRegistros.map((item) => item.humor)
      : [2, 2, 2, 2, 2, 2, 2];

    const previousWeekDataWithMinimum = previousWeekData.length === 1
      ? [...previousWeekData, previousWeekData[0]]
      : previousWeekData;

    return {
      labels,
      datasets: [
        {
          data: currentWeekDataWithMinimum,
          color: () => p.accent,
          strokeWidth: 4,
        },
        ...(compareMode
          ? [
              {
                data: previousWeekDataWithMinimum,
                color: () => '#FF7A2F',
                strokeWidth: 3,
              },
            ]
          : []),
      ],
      legend: compareMode
        ? [
            'Esta semana',
            'Semana passada',
          ]
        : [],
    };
  }, [
    registros,
    compareMode,
    p.accent,
  ]);

  function getMoodLabel(humor) {
    if (humor === 1) return 'Triste';
    if (humor === 2) return 'Neutro';
    return 'Feliz';
  }

  function getMoodIcon(humor) {
    if (humor === 1) {
      return <Frown size={20} color="#FF7A2F" />;
    }

    if (humor === 2) {
      return <Meh size={20} color="#FFD166" />;
    }

    return <Smile size={20} color="#52D273" />;
  }

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
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

          {/* HERO DO GRÁFICO */}
          <View
            style={{
              backgroundColor: p.surface,
              borderRadius: 32,
              padding: 24,
              marginBottom: 24,
              borderWidth: 2,
              borderColor: p.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 28,
              }}
            >
              <View>
                <Text
                  style={{
                    color: p.text,
                    fontSize: 24,
                    fontWeight: '900',
                    letterSpacing: 0.5,
                  }}
                >
                  Humor emocional
                </Text>

                <Text
                  style={{
                    color: p.accent,
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  Tendência dos últimos dias
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#9333EA',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 0,
                  shadowColor: '#9333EA',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={() => setModalPetOpen(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: '#FFF',
                    fontWeight: '800',
                    fontSize: 12,
                    letterSpacing: 0.5,
                  }}
                >
                  {selectedPet?.name?.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>

            {registros.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 12,
                    paddingHorizontal: 8,
                  }}
                >
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#FF7A2F', fontSize: 18, marginBottom: 4 }}>😢</Text>
                    <Text style={{ color: p.subtitle, fontSize: 10 }}>1 = Triste</Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#FFD166', fontSize: 18, marginBottom: 4 }}>😐</Text>
                    <Text style={{ color: p.subtitle, fontSize: 10 }}>2 = Neutro</Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#52D273', fontSize: 18, marginBottom: 4 }}>😊</Text>
                    <Text style={{ color: p.subtitle, fontSize: 10 }}>3 = Feliz</Text>
                  </View>
                </View>

                <View
                  style={{
                    marginVertical: 16,
                    paddingVertical: 16,
                    borderRadius: 24,
                    backgroundColor: p.surfaceAlt,
                    borderWidth: 1,
                    borderColor: p.border,
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <LineChart
                    data={chartData}
                    width={screenWidth - 72}
                    height={280}
                    withShadow={false}
                    withOuterLines={false}
                    withInnerLines={false}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    fromZero
                    yAxisInterval={1}
                    bezier
                    segments={3}
                    chartConfig={{
                      backgroundGradientFrom: 'transparent',
                      backgroundGradientTo: 'transparent',

                      decimalPlaces: 0,

                      color: () => p.accent,

                      labelColor: () => p.accentMuted,

                      propsForDots: {
                        r: '6',
                        strokeWidth: '3',
                        stroke: isDarkMode ? '#17182B' : '#FFFFFF',
                        fill: p.accent,
                      },

                      propsForBackgroundLines: {
                        stroke: 'transparent',
                      },
                    }}
                    style={{
                      borderRadius: 24,
                      marginLeft: 0,
                    }}
                  />
                </View>
              </>
            ) : (
              <View
                style={{
                  height: 240,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 24,
                  marginVertical: 16,
                  backgroundColor: p.surfaceAlt,
                  borderWidth: 1,
                  borderColor: p.border,
                }}
              >
                <Text
                  style={{
                    color: p.accent,
                    fontSize: 16,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  Nenhum registro de humor ainda
                </Text>
                <Text
                  style={{
                    color: p.muted,
                    fontSize: 12,
                    marginTop: 8,
                    textAlign: 'center',
                  }}
                >
                  Comece a registrar o humor do {selectedPet?.name}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
                paddingTop: 20,
                borderTopWidth: 1,
                borderTopColor: p.border,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#FFE4E8',
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Frown size={24} color="#FF7A2F" />
                </View>
                <Text
                  style={{
                    color: p.text,
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  Triste
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: p.orangeSoft,
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Meh size={24} color="#FFD166" />
                </View>
                <Text
                  style={{
                    color: p.text,
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  Neutro
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#E3F5EA',
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Smile size={24} color="#52D273" />
                </View>
                <Text
                  style={{
                    color: p.text,
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  Feliz
                </Text>
              </View>
            </View>
          </View>

          {/* CARD INPUT */}
          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: p.inputPanel,
                borderWidth: isDarkMode ? 1 : 0,
                borderColor: p.inputPanelBorder,
              },
            ]}
          >
            <View style={styles.emojiRow}>
              <TouchableOpacity
                style={[
                  styles.emojiBtn,
                  mood === 'sad' &&
                    styles.emojiSelected,
                ]}
                onPress={() => setMood('sad')}
              >
                <Frown
                  size={30}
                  color={
                    mood === 'sad'
                      ? '#FFF'
                      : '#A0A7BA'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.emojiBtn,
                  mood === 'neutral' &&
                    styles.emojiSelected,
                ]}
                onPress={() =>
                  setMood('neutral')
                }
              >
                <Meh
                  size={30}
                  color={
                    mood === 'neutral'
                      ? '#FFF'
                      : '#A0A7BA'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.emojiBtn,
                  mood === 'happy' &&
                    styles.emojiSelected,
                ]}
                onPress={() => setMood('happy')}
              >
                <Smile
                  size={30}
                  color={
                    mood === 'happy'
                      ? '#FFF'
                      : '#A0A7BA'
                  }
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelWhite}>
              ESCOLHER PET
            </Text>

            <TouchableOpacity
              style={[
                styles.selectWhite,
                {
                  backgroundColor: p.inputField,
                  borderWidth: isDarkMode ? 1 : 0,
                  borderColor: p.inputFieldBorder,
                },
              ]}
              onPress={() =>
                setModalPetOpen(true)
              }
            >
              <Text style={{ color: p.inputFieldText, fontWeight: '700' }}>
                {selectedPet?.name ||
                  'Selecione'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.labelWhite}>
              RELATO DO DIA
            </Text>

            <TextInput
              style={[
                styles.inputWhite,
                {
                  backgroundColor: p.inputField,
                  color: p.inputFieldText,
                  borderWidth: isDarkMode ? 1 : 0,
                  borderColor: p.inputFieldBorder,
                },
              ]}
              placeholder="Como foi o dia dele?"
              placeholderTextColor="#A0A7BA"
              multiline
              value={relato}
              onChangeText={setRelato}
            />

            <TouchableOpacity
              style={[styles.btnFull, { backgroundColor: p.inputButton }]}
              onPress={salvarRegistro}
            >
              <Text style={[styles.btnFullText, { color: p.inputButtonText }]}>
                SALVAR REGISTRO
              </Text>
            </TouchableOpacity>
          </View>

          {/* COMPARAÇÃO */}
          <TouchableOpacity
            style={{
              backgroundColor: compareMode
                ? '#FF7A2F'
                : '#9127E1',
              padding: 16,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
              marginBottom: 18,
            }}
            onPress={() =>
              setCompareMode(!compareMode)
            }
          >
            <HeartHandshake
              size={18}
              color="#FFF"
            />

            <Text
              style={{
                color: '#FFF',
                fontWeight: '800',
              }}
            >
              {compareMode
                ? 'SAIR DA COMPARAÇÃO'
                : 'COMPARAR PERÍODOS'}
            </Text>
          </TouchableOpacity>

          {compareMode && (
            <View
              style={{
                backgroundColor: p.surface,
                padding: 16,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: p.border,
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  color: p.accent,
                  fontSize: 14,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                📊 Comparando Períodos
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: p.accentSoft,
                    padding: 10,
                    borderRadius: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: p.accent,
                  }}
                >
                  <Text
                    style={{
                      color: p.accent,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    ESTA SEMANA
                  </Text>
                  <Text
                    style={{
                      color: p.accentMuted,
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    Últimos 7 dias
                  </Text>
                </View>
                
                <View
                  style={{
                    flex: 1,
                    backgroundColor: p.orangeSoft,
                    padding: 10,
                    borderRadius: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: '#FF7A2F',
                  }}
                >
                  <Text
                    style={{
                      color: '#FF7A2F',
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    SEMANA PASSADA
                  </Text>
                  <Text
                    style={{
                      color: p.orangeMuted,
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    7-14 dias atrás
                  </Text>
                </View>
              </View>
              
              <Text
                style={{
                  color: p.subtitle,
                  fontSize: 11,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                😢 = Triste | 😐 = Neutro | 😊 = Feliz
              </Text>
            </View>
          )}

          {/* HISTÓRICO */}
          <Text style={styles.sectionTitle}>
            Registros recentes
          </Text>

          {registros.length === 0 && (
            <View
              style={{
                backgroundColor: p.surfaceSoft,
                padding: 20,
                borderRadius: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: p.border,
              }}
            >
              <Text
                style={{
                  color: p.muted,
                }}
              >
                Nenhum registro ainda.
              </Text>
            </View>
          )}

          {registros.map((item) => (
            <View
              key={item.id}
              style={[
                styles.historyCard,
              ]}
            >
              <View style={styles.historyInfo}>
                <View style={styles.historyHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {getMoodIcon(item.humor)}
                    <Text
                      style={
                        styles.historyName
                      }
                    >
                      {selectedPet?.name}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.historyDate
                    }
                  >
                    {new Date(
                      item.data
                    ).toLocaleDateString(
                      'pt-BR'
                    )}
                  </Text>
                </View>

                <Text
                  style={{
                    color: p.historyMood,
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  {getMoodLabel(
                    item.humor
                  )}
                </Text>

                <Text
                  style={
                    styles.historyText
                  }
                >
                  {item.relato}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* MODAL PET */}
        <Modal
          visible={modalPetOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() =>
            setModalPetOpen(false)
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Selecione um Pet
              </Text>

              <FlatList
                data={pets}
                keyExtractor={(item) =>
                  item.id.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedPet?.id ===
                        item.id && {
                        backgroundColor:
                          p.selectedPet,
                      },
                    ]}
                    onPress={() => {
                      setSelectedPet(item);
                      setModalPetOpen(false);
                    }}
                  >
                    <Text
                      style={
                        styles.modalItemText
                      }
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={
                  styles.modalCloseBtn
                }
                onPress={() =>
                  setModalPetOpen(false)
                }
              >
                <Text
                  style={
                    styles.modalCloseBtnText
                  }
                >
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
