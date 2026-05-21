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

import api from '../../services/api';

const screenWidth = Dimensions.get('window').width;

export default function TelaDiario() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('consultas');

  const [mood, setMood] = useState('happy');

  const [selectedPet, setSelectedPet] = useState(null);

  const [modalPetOpen, setModalPetOpen] = useState(false);

  const [pets, setPets] = useState([]);

  const [relato, setRelato] = useState('');

  const [registros, setRegistros] = useState([]);

  const [compareMode, setCompareMode] = useState(false);

  const [comparePet, setComparePet] = useState(null);

  const [compareRegistros, setCompareRegistros] = useState([]);

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

  useEffect(() => {
    if (comparePet?.id) {
      loadCompareRegistros(comparePet.id);
    }
  }, [comparePet]);

  async function loadPets() {
    try {
      // 1. Verifique se a chave no Login foi salva exatamente como 'userId' ou '@id'
      // Geralmente usamos um padrão. Se no login você salvou como '@id', mude aqui.
      const tutorId = await AsyncStorage.getItem('userId'); 
      
      // 2. Você PRECISA do token, pois sua rota /pets/tutor/:id é protegida
      const token = await AsyncStorage.getItem('@token');

      if (!tutorId || !token) {
        console.log('Falta TutorId ou Token no Storage');
        return;
      }

      const response = await api.get(`/pets/tutor/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // O log abaixo ajudará você a ver se os dados estão vindo do banco
      console.log('Dados da API:', response.data);

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
      console.log(
        'Erro ao buscar pets:',
        error.response?.data || error.message
      );
    }
  }

  async function loadRegistros(petId) {
  try {
    const token = await AsyncStorage.getItem('@token');
    console.log('📊 Buscando registros para pet:', petId);
    
    const response = await api.get(`/diario/pet/${petId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Resposta bruta do servidor:', response.data);

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

    console.log('📊 Registros formatados:', formatted);
    setRegistros(formatted);

    } catch (error) {
      console.log(
        '❌ Erro ao buscar registros:',
        error.response?.data || error.message
      );
    }
  }

  async function loadCompareRegistros(petId) {
    try {
      const token = await AsyncStorage.getItem('@token');
      console.log('📊 Buscando registros de comparação para pet:', petId);
      
      const response = await api.get(`/diario/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Resposta de comparação:', response.data);

      if (!Array.isArray(response.data)) {
        console.error('❌ Resposta de comparação não é um array!');
        setCompareRegistros([]);
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

      console.log('📊 Registros de comparação formatados:', formatted);
      setCompareRegistros(formatted);

    } catch (error) {
      console.log(
        '❌ Erro ao buscar comparação:',
        error.response?.data || error.message
      );
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
      console.log('📤 Payload sendo enviado:', payload);

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
      console.log(
        'Erro ao salvar:', 
        error.response?.data || error.message
      );

      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Erro ao salvar registro'
      );
    }
  }

  const chartData = useMemo(() => {
    console.log('📈 Gerando dados do gráfico. Registros:', registros);
    
    const base = registros
      .slice(0, 7)
      .reverse();

    console.log('📈 Base para gráfico (últimos 7, invertidos):', base);
    console.log('📈 Tamanho da base:', base.length);

    // Se não há dados, mostra gráfico vazio com placeholders
    const labels = base.length > 0
      ? base.map((item, index) => {
          try {
            const date = new Date(item.data);
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            // Apenas data, sem quebra de linha
            const formatted = `${day}/${month}`;
            console.log('📈 Data formatada:', item.data, '→', formatted);
            return formatted;
          } catch (err) {
            console.error('❌ Erro ao formatar data:', item.data, err);
            return 'N/A';
          }
        })
      : ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']; // Placeholder: Seg-Dom

    const primaryData = base.length > 0
      ? base.map((item) => item.humor)
      : [2, 2, 2, 2, 2, 2, 2]; // Dados vazios mostram linha em neutro (valor 2)

    // Garante no mínimo 2 pontos para LineChart renderizar
    const primaryDataWithMinimum = primaryData.length === 1 
      ? [...primaryData, primaryData[0]]
      : primaryData;

    const compareData = compareRegistros.length > 0
      ? compareRegistros
          .slice(0, 7)
          .reverse()
          .map((item) => item.humor)
      : [2, 2, 2, 2, 2, 2, 2];

    const compareDataWithMinimum = compareData.length === 1
      ? [...compareData, compareData[0]]
      : compareData;

    console.log('📈 Labels:', labels);
    console.log('📈 Primary Data:', primaryDataWithMinimum);
    console.log('📈 Compare Mode:', compareMode, 'Compare Pet:', comparePet?.name);

    return {
      labels,
      datasets: [
        {
          data: primaryDataWithMinimum,
          color: () => '#9333EA',
          strokeWidth: 4,
        },
        ...(compareMode && comparePet
          ? [
              {
                data: compareDataWithMinimum,
                color: () => '#FF7A2F',
                strokeWidth: 3,
              },
            ]
          : []),
      ],
      legend: compareMode && comparePet
        ? [
            selectedPet?.name,
            comparePet?.name,
          ]
        : [],
    };
  }, [
    registros,
    compareRegistros,
    compareMode,
    comparePet,
    selectedPet,
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
              backgroundColor: '#151A24',
              borderRadius: 28,
              padding: 20,
              marginBottom: 22,
              borderWidth: 1,
              borderColor: '#242B3B',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 22,
                    fontWeight: '800',
                  }}
                >
                  Humor emocional
                </Text>

                <Text
                  style={{
                    color: '#8B93A7',
                    marginTop: 4,
                  }}
                >
                  Tendência dos últimos dias
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#9333EA',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: '#C084FC',
                }}
                onPress={() => setModalPetOpen(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: '#FFF',
                    fontWeight: '700',
                    fontSize: 12,
                  }}
                >
                  {selectedPet?.name?.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>

            {registros.length > 0 ? (
              <LineChart
                data={chartData}
                width={screenWidth - 80}
                height={240}
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
                  backgroundGradientFrom: '#151A24',
                  backgroundGradientTo: '#151A24',

                  decimalPlaces: 0,

                  color: () => '#9333EA',

                  labelColor: () => '#8B93A7',

                  propsForDots: {
                    r: '6',
                    strokeWidth: '3',
                    stroke: '#151A24',
                    fill: '#9333EA',
                  },

                  propsForBackgroundLines: {
                    stroke: 'transparent',
                  },
                }}
                style={{
                  borderRadius: 24,
                  marginLeft: -10,
                }}
              />
            ) : (
              <View
                style={{
                  height: 240,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 24,
                }}
              >
                <Text
                  style={{
                    color: '#8B93A7',
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  Nenhum registro de humor ainda
                </Text>
                <Text
                  style={{
                    color: '#5F6B7F',
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
                marginTop: 10,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Frown size={18} color="#FF7A2F" />
                <Text
                  style={{
                    color: '#8B93A7',
                    marginTop: 5,
                    fontSize: 12,
                  }}
                >
                  Triste
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Meh size={18} color="#FFD166" />
                <Text
                  style={{
                    color: '#8B93A7',
                    marginTop: 5,
                    fontSize: 12,
                  }}
                >
                  Neutro
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Smile size={18} color="#52D273" />
                <Text
                  style={{
                    color: '#8B93A7',
                    marginTop: 5,
                    fontSize: 12,
                  }}
                >
                  Feliz
                </Text>
              </View>
            </View>
          </View>

          {/* CARD INPUT */}
          <View style={styles.inputCard}>
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
              style={styles.selectWhite}
              onPress={() =>
                setModalPetOpen(true)
              }
            >
              <Text style={{ color: '#FFF' }}>
                {selectedPet?.name ||
                  'Selecione'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.labelWhite}>
              RELATO DO DIA
            </Text>

            <TextInput
              style={styles.inputWhite}
              placeholder="Como foi o dia dele?"
              placeholderTextColor="#A0A7BA"
              multiline
              value={relato}
              onChangeText={setRelato}
            />

            <TouchableOpacity
              style={styles.btnFull}
              onPress={salvarRegistro}
            >
              <Text style={styles.btnFullText}>
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
                : 'COMPARAR HUMOR'}
            </Text>
          </TouchableOpacity>

          {compareMode && (
            <View style={styles.inputCard}>
              <Text style={styles.labelWhite}>
                ESCOLHA O SEGUNDO PET
              </Text>

              {pets
                .filter(
                  (pet) =>
                    pet.id !==
                    selectedPet?.id
                )
                .map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.selectWhite,
                      {
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor:
                          comparePet?.id ===
                          pet.id
                            ? '#FF7A2F'
                            : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setComparePet(pet)
                    }
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontWeight: '700',
                      }}
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                ))}

              {comparePet && (
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Sparkles
                    size={16}
                    color="#FF7A2F"
                  />

                  <Text
                    style={{
                      color: '#FFF',
                      fontWeight: '700',
                    }}
                  >
                    Comparando com{' '}
                    {comparePet.name}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* HISTÓRICO */}
          <Text style={styles.sectionTitle}>
            Registros recentes
          </Text>

          {registros.length === 0 && (
            <View
              style={{
                backgroundColor: '#151A24',
                padding: 20,
                borderRadius: 20,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#8B93A7',
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
                {
                  borderLeftWidth: 4,
                  borderLeftColor:
                    item.humor === 1
                      ? '#FF7A2F'
                      : item.humor === 2
                      ? '#FFD166'
                      : '#52D273',
                },
              ]}
            >
              {getMoodIcon(item.humor)}

              <View style={styles.historyInfo}>
                <View style={styles.historyHeader}>
                  <Text
                    style={
                      styles.historyName
                    }
                  >
                    {selectedPet?.name}
                  </Text>

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
                    color: '#C7CDDA',
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
                          '#F1E4FF',
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