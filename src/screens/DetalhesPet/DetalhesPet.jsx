import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  PencilLine,
  Scale,
  Venus,
  Calendar,
  Plus,
  Pill
} from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { updatePet } from '../../services/updatePet';
import api from '../../services/api';
// IMPORTADO O FORMATADOR DE DATA
import { formateDate } from '../../utils/formatters';
import { useAppTheme } from '../../theme/ThemeContext';

const DETAILS_THEME = {
  light: {
    surface: '#FFFFFF',
    surfaceAlt: '#F5F5F5',
    field: '#F9FAFB',
    text: '#0D214F',
    subtitle: '#666',
    muted: '#A0A7BA',
    border: '#E2E8F0',
    purple: '#9127E1',
    purpleSoft: '#E8D5F7',
    orange: '#FF7A2F',
    blue: '#4A90E2',
    blueSoft: '#C6F0FF',
  },
  dark: {
    surface: '#17182B',
    surfaceAlt: '#202238',
    field: '#202238',
    text: '#F5F7FF',
    subtitle: '#AEB6CC',
    muted: '#8E98B5',
    border: '#2A2D45',
    purple: '#B77CFF',
    purpleSoft: '#2A1D42',
    orange: '#FDBA74',
    blue: '#93C5FD',
    blueSoft: '#16233B',
  },
};

export default function TelaDetalhesPet({ route }) {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const p = isDarkMode ? DETAILS_THEME.dark : DETAILS_THEME.light;
  const { pet } = route.params;

  const [activeTab, setActiveTab] = useState('Sobre');

  const [nome, setNome] = useState(pet.nome || pet.NOME || '');
  const [descricao, setDescricao] = useState(pet.descricao || pet.DESCRICAO || '');
  const [personalidade, setPersonalidade] = useState(pet.personalidade || pet.PERSONALIDADE || '');
  const [especie, setEspecie] = useState(pet.especie || pet.ESPECIE || '');
  const [raca, setRaca] = useState(pet.raca || pet.RACA || '');
  const [peso, setPeso] = useState(pet.peso || pet.PESO ? String(pet.peso || pet.PESO) : '');
  const [sexo, setSexo] = useState(pet.sexo || pet.SEXO || '');

  const [vacinas, setVacinas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [proximaConsulta, setProximaConsulta] = useState(null);

  useEffect(() => {
    carregarVacinas();
    carregarMedicamentos();
    carregarProximaConsulta();
  }, []);

  const carregarVacinas = async () => {
    try {
      const response = await api.get(`/vacinas/pet/${pet.id || pet.ID}`);
      setVacinas(response.data || []);
    } catch (error) {
      throw new Error('Erro ao carregar vacinas: ' + error.message);
    }
  };

  const carregarMedicamentos = async () => {
    try {
      const response = await api.get(`/medicamentos/pet/${pet.id || pet.ID}`);
      setMedicamentos(response.data || []);
    } catch (error) {
      throw new Error('Erro ao carregar medicamentos: ' + error.message);
    }
  };

  const carregarProximaConsulta = async () => {
    try {
      const response = await api.get(`/agendamentos/proximo/${pet.id || pet.ID}`);
      if (response.data) {
        setProximaConsulta(response.data);
      }
    } catch (error) {
      console.log('Sem consultas agendadas');
      setProximaConsulta(null);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleSavePet = async () => {
    try {
      await updatePet(pet.id || pet.ID, {
        NOME: nome,
        nome,
        DESCRICAO: descricao,
        PERSONALIDADE: personalidade,
        ESPECIE: especie,
        RACA: raca,
        PESO: peso,
        SEXO: sexo,
      });

      alert('Pet atualizado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  const rawImage = pet.imagem || pet.IMAGEM;
  const imageUri = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${rawImage}`
    : null;

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
          <View style={[styles.profileCard, { backgroundColor: p.surface, borderWidth: isDarkMode ? 1 : 0, borderColor: p.border }]}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../../assets/default-pet.png')
              }
              style={styles.petImg}
            />

            <View style={styles.nameWrapper}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do pet"
                placeholderTextColor={p.muted}
                style={[styles.petName, { color: p.text, textAlign: 'center', paddingVertical: 0, maxWidth: '86%' }]}
              />
              <TouchableOpacity activeOpacity={0.7}>
                <PencilLine size={20} color={p.purple} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.petBreed, { color: p.muted }]}>{raca}</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: p.purpleSoft, borderWidth: isDarkMode ? 1 : 0, borderColor: p.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: p.purple }]}>
                    PESO
                  </Text>
                  <TextInput
                    value={peso}
                    onChangeText={setPeso}
                    placeholder="Peso"
                    placeholderTextColor={p.muted}
                    keyboardType="numeric"
                    style={[styles.statValue, { color: p.purple }]}
                  />
                </View>
                <Scale size={22} color={p.purple} />
              </View>

              <View style={[styles.statBox, { backgroundColor: p.blueSoft, borderWidth: isDarkMode ? 1 : 0, borderColor: p.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: p.blue }]}>
                    SEXO
                  </Text>
                  <TextInput
                    value={sexo}
                    onChangeText={setSexo}
                    placeholder="Macho/Fêmea"
                    placeholderTextColor={p.muted}
                    style={[styles.statValue, { color: p.blue }]}
                  />
                </View>
                <Venus size={22} color={p.blue} />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            style={styles.appointmentCard}
            onPress={() => navigation.navigate('Agendamento', { petId: pet.id || pet.ID })}
          >
            <View>
              <Text style={styles.appointmentLabel}>Próxima consulta</Text>
              {proximaConsulta ? (
                <>
                  <Text style={styles.appointmentDate}>
                    {new Date(proximaConsulta.dataAgendamento || proximaConsulta.DATA_AGENDAMENTO).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </Text>
                  <Text style={styles.appointmentType}>{proximaConsulta.tipo || proximaConsulta.TIPO || 'Consulta'}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.appointmentDate}>--</Text>
                  <Text style={styles.appointmentType}>Clique para agendar</Text>
                </>
              )}
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 12,
                borderRadius: 20,
              }}
            >
              <Calendar size={30} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={[styles.contentCard, { backgroundColor: p.surface, borderWidth: isDarkMode ? 1 : 0, borderColor: p.border }]}>
            <View style={[styles.tabRow, { backgroundColor: p.surfaceAlt }]}>
              {['Sobre', 'Vacinas', 'Medicamentos'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabBtn,
                    activeTab === tab && styles.tabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'Sobre' ? (
              <View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: p.text }]}>Sobre o {nome || 'pet'}:</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea, { backgroundColor: p.field, borderColor: p.border, color: p.text }]}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    placeholderTextColor={p.muted}
                    placeholder="Escreva uma descrição sobre seu pet..."
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: p.text }]}>Personalidade</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: p.field, borderColor: p.border, color: p.text }]}
                    value={personalidade}
                    onChangeText={setPersonalidade}
                    placeholderTextColor={p.muted}
                    placeholder="Ex: brincalhão, calmo, carinhoso..."
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>ESPÉCIE</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: p.field, borderColor: p.border, color: p.text }]}
                      value={especie}
                      onChangeText={setEspecie}
                      placeholderTextColor={p.muted}
                      placeholder="Ex: Gato"
                    />
                  </View>

                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>RAÇA</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: p.field, borderColor: p.border, color: p.text }]}
                      value={raca}
                      onChangeText={setRaca}
                      placeholderTextColor={p.muted}
                      placeholder="Ex: Siamês"
                    />
                  </View>
                </View>
              </View>
            ) : activeTab === 'Vacinas' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.label}>Carteira de vacinação</Text>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#9127E1',
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Plus size={14} color="#FFF" strokeWidth={3} />
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}
                    >
                      NOVO
                    </Text>
                  </TouchableOpacity>
                </View>

                {vacinas.length === 0 ? (
                  <View
                    style={{
                      backgroundColor: p.surfaceAlt,
                      padding: 20,
                      borderRadius: 15,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: p.border,
                    }}
                  >
                    <Text style={{ color: p.muted, fontSize: 14 }}>
                      Nenhuma vacina cadastrada.
                    </Text>
                  </View>
                ) : (
                  vacinas.map((vacina, index) => (
                    <View
                      key={vacina.id || vacina.ID}
                      style={{
                        backgroundColor: p.surface,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: index !== vacinas.length - 1 ? 12 : 0,
                        borderLeftWidth: 4,
                        borderLeftColor: p.purple,
                        borderWidth: 1,
                        borderColor: p.border,
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: p.text,
                          marginBottom: 8,
                        }}
                      >
                        {vacina.nome || vacina.NOME}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: p.subtitle,
                          marginBottom: 4,
                        }}
                      >
                        📅 Aplicação: {formateDate(vacina.dataAplicacao || vacina.DATA_APLICACAO)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: p.subtitle,
                        }}
                      >
                        ⏰ Próxima Dose: {formateDate(vacina.proximaDose || vacina.PROXIMA_DOSE)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.label}>Cronograma</Text>
                  <Pill size={20} color="#9127E1" />
                </View>

                {medicamentos.length === 0 ? (
                  <View
                    style={{
                      backgroundColor: p.surfaceAlt,
                      padding: 20,
                      borderRadius: 15,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: p.border,
                    }}
                  >
                    <Text
                      style={{
                        color: p.muted,
                        fontSize: 14,
                        textAlign: 'center',
                      }}
                    >
                      Nenhum medicamento cadastrado.
                    </Text>
                  </View>
                ) : (
                  medicamentos.map((med, index) => (
                    <View
                      key={med.id || med.ID}
                      style={{
                        backgroundColor: p.surface,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: index !== medicamentos.length - 1 ? 12 : 0,
                        borderLeftWidth: 4,
                        borderLeftColor: p.orange,
                        borderWidth: 1,
                        borderColor: p.border,
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: p.text,
                          marginBottom: 8,
                        }}
                      >
                        {med.nome || med.NOME}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: p.subtitle,
                          marginBottom: 4,
                        }}
                      >
                        💊 Dosagem: {med.dosagem || med.DOSAGEM}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: p.subtitle,
                        }}
                      >
                        ⏱️ Frequência: {med.frequencia || med.FREQUENCIA}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.btnSave}
              activeOpacity={0.8}
              onPress={handleSavePet}
            >
              <Text style={styles.btnSaveText}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}
