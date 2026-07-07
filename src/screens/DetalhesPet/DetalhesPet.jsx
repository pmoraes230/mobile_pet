import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import {
  PencilLine,
  Scale,
  Venus,
  Calendar,
  Plus,
  Pill,
  Camera,
  ChevronDown
} from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { updatePet } from '../../services/updatePet';
import api from '../../services/api';
import { uploadPetPhoto } from '../../services/uploadImages';
import { getAgendaTutor } from '../../services/agendamentoService';
import { formateDate } from '../../utils/formatters';
import { useAppTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

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
    overlay: 'rgba(13, 33, 79, 0.35)',
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
    overlay: 'rgba(5, 7, 18, 0.76)',
  },
};

const getPetId = (pet) => pet?.id || pet?.ID || pet?.ID_PET || pet?.petId || pet?.pet_id;

const getConsultaPetId = (consulta) =>
  consulta?.petId ||
  consulta?.pet_id ||
  consulta?.ID_PET ||
  consulta?.id_pet ||
  consulta?.pet?.id ||
  consulta?.pet?.ID;

const getConsultaDataHora = (consulta) => {
  const data =
    consulta?.data_consulta ||
    consulta?.data ||
    consulta?.DATA_CONSULTA ||
    consulta?.dataAgendamento ||
    consulta?.DATA_AGENDAMENTO;

  if (!data) return null;

  const dataHora = new Date(data);
  const hora = consulta?.horario_consulta || consulta?.hora || consulta?.HORARIO_CONSULTA;

  if (hora && typeof hora === 'string') {
    const [horas, minutos] = hora.split(':');
    dataHora.setHours(Number(horas) || 0, Number(minutos) || 0, 0, 0);
  }

  return Number.isNaN(dataHora.getTime()) ? null : dataHora;
};

const formatDateInput = (value = '') => {
  const digits = String(value).replace(/\D/g, '').slice(0, 8);
  const parts = [];

  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));

  return parts.join('/');
};

const parseBrDateToIso = (value = '') => {
  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getDate() !== Number(day) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getFullYear() !== Number(year)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
};

export default function TelaDetalhesPet({ route }) {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const { t } = useLanguage();
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
  const [sexoModalVisible, setSexoModalVisible] = useState(false);
  const [petImageUri, setPetImageUri] = useState(null);
  const [uploadingPetPhoto, setUploadingPetPhoto] = useState(false);

  const [vacinas, setVacinas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [proximaConsulta, setProximaConsulta] = useState(null);
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineApplicationDate, setVaccineApplicationDate] = useState('');
  const [vaccineNextDoseDate, setVaccineNextDoseDate] = useState('');
  const [savingVaccine, setSavingVaccine] = useState(false);

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
      console.log('Erro ao carregar vacinas');
    }
  };

  const carregarMedicamentos = async () => {
    try {
      const response = await api.get(`/medicamentos/pet/${pet.id || pet.ID}`);
      setMedicamentos(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar medicamentos');
    }
  };

  const carregarProximaConsulta = async () => {
    try {
      const petId = getPetId(pet);
      const agenda = await getAgendaTutor();
      const agora = new Date();

      const proxima = (agenda.consultas || [])
        .map((consulta) => ({ consulta, dataHora: getConsultaDataHora(consulta) }))
        .filter(({ consulta, dataHora }) => (
          dataHora &&
          dataHora >= agora &&
          String(getConsultaPetId(consulta)) === String(petId)
        ))
        .sort((a, b) => a.dataHora - b.dataHora)[0]?.consulta || null;

      setProximaConsulta(proxima);
    } catch (error) {
      console.log('Sem consultas agendadas');
      setProximaConsulta(null);
    }
  };

  const resetVaccineForm = () => {
    setVaccineName('');
    setVaccineApplicationDate('');
    setVaccineNextDoseDate('');
  };

  const closeVaccineModal = () => {
    if (savingVaccine) return;
    setVaccineModalVisible(false);
    resetVaccineForm();
  };

  const handleSaveVaccine = async () => {
    const petId = getPetId(pet);
    const applicationDate = parseBrDateToIso(vaccineApplicationDate);
    const nextDoseDate = parseBrDateToIso(vaccineNextDoseDate);

    if (!vaccineName.trim()) {
      Alert.alert(t('Atenção'), t('Informe o nome da vacina.'));
      return;
    }

    if (!applicationDate || !nextDoseDate) {
      Alert.alert(t('Atenção'), t('Informe as datas no formato dd/mm/aaaa.'));
      return;
    }

    if (!petId) {
      Alert.alert(t('Erro'), t('Não foi possível identificar este pet.'));
      return;
    }

    try {
      setSavingVaccine(true);
      const response = await api.post('/vacinas', {
        NOME: vaccineName.trim(),
        DATA_APLICACAO: applicationDate,
        PROXIMA_DOSE: nextDoseDate,
        ID_PET: petId,
      });

      setVacinas((current) => [response.data, ...current]);
      setVaccineModalVisible(false);
      resetVaccineForm();
      Alert.alert(t('Sucesso'), t('Vacina cadastrada com sucesso.'));
    } catch (error) {
      Alert.alert(
        t('Erro'),
        error.response?.data?.error ||
          error.response?.data?.message ||
          t('Não foi possível cadastrar a vacina.')
      );
    } finally {
      setSavingVaccine(false);
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

  const handleSelectSexo = (option) => {
    setSexo(option);
    setSexoModalVisible(false);
  };

  const resolvePetImageUri = (value) => {
    if (!value) return null;
    return value.startsWith('http') || value.startsWith('file:') || value.startsWith('content:') || value.startsWith('data:')
      ? value
      : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${value}`;
  };

  const rawImage = petImageUri || pet.imagem || pet.IMAGEM;
  const imageUri = resolvePetImageUri(rawImage);
  const proximaConsultaData = getConsultaDataHora(proximaConsulta);
  const proximaConsultaTipo =
    proximaConsulta?.tipo_de_consulta ||
    proximaConsulta?.tipo ||
    proximaConsulta?.TIPO_DE_CONSULTA ||
    proximaConsulta?.TIPO ||
    'Consulta';

  const handlePickPetImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert('Permita acesso à galeria para alterar a foto do pet.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const uri = result.assets[0].uri;
      const petId = pet.id || pet.ID;

      setUploadingPetPhoto(true);
      setPetImageUri(uri);
      const response = await uploadPetPhoto(petId, uri);
      const nextImage = response?.imagem || response?.IMAGEM || response?.urls?.[0] || uri;
      setPetImageUri(resolvePetImageUri(nextImage) || uri);
      pet.imagem = nextImage;
      pet.IMAGEM = nextImage;
      alert('Foto do pet atualizada!');
    } catch (error) {
      console.error(error);
      alert(error?.message || 'Não foi possível alterar a foto do pet.');
    } finally {
      setUploadingPetPhoto(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            <TouchableOpacity
              style={styles.petImageWrapper}
              activeOpacity={0.9}
              onPress={handlePickPetImage}
              disabled={uploadingPetPhoto}
              accessibilityRole="button"
              accessibilityLabel="Alterar foto do pet"
            >
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require('../../assets/default-pet.png')
                }
                style={styles.petImg}
              />
              <View style={styles.petCameraBadge}>
                {uploadingPetPhoto ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Camera size={17} color="#fff" />
                )}
              </View>
            </TouchableOpacity>

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
                  <TouchableOpacity
                    style={styles.sexSelectButton}
                    onPress={() => setSexoModalVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.sexSelectText, { color: p.blue }]} numberOfLines={1}>
                      {sexo ? t(sexo) : t('Selecione')}
                    </Text>
                    <ChevronDown size={16} color={p.blue} />
                  </TouchableOpacity>
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
                    {proximaConsultaData?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) || '--'}
                  </Text>
                  <Text style={styles.appointmentType}>{proximaConsultaTipo}</Text>
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
                  <Text style={[styles.label, { color: p.text }]}>{t('Carteira de vacinação')}</Text>

                  <TouchableOpacity
                    onPress={() => setVaccineModalVisible(true)}
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
                      {t('NOVO')}
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
                      {t('Nenhuma vacina cadastrada.')}
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
                        {t('Aplicação')}: {formateDate(vacina.dataAplicacao || vacina.DATA_APLICACAO)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: p.subtitle,
                        }}
                      >
                        {t('Próxima Dose')}: {formateDate(vacina.proximaDose || vacina.PROXIMA_DOSE)}
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
                        🕒 Frequência: {med.frequencia || med.FREQUENCIA}
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

        <Modal
          visible={sexoModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSexoModalVisible(false)}
        >
          <View style={[styles.sexModalOverlay, { backgroundColor: p.overlay || 'rgba(5, 7, 18, 0.52)' }]}>
            <View style={[styles.sexModalSheet, { backgroundColor: p.surface, borderColor: p.border }]}>
              <Text style={[styles.sexModalTitle, { color: p.text }]}>{t('Selecione o Sexo')}</Text>

              {['Macho', 'Fêmea'].map((option) => {
                const selected = sexo === option;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.sexModalOption,
                      {
                        backgroundColor: selected ? p.blueSoft : p.field,
                        borderColor: selected ? p.blue : p.border,
                      },
                    ]}
                    onPress={() => handleSelectSexo(option)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.sexModalOptionText, { color: selected ? p.blue : p.text }]}>
                      {t(option)}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.sexModalCancel, { backgroundColor: p.surfaceAlt }]}
                onPress={() => setSexoModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={[styles.sexModalCancelText, { color: p.text }]}>{t('Cancelar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={vaccineModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeVaccineModal}
        >
          <KeyboardAvoidingView
            style={[styles.vaccineModalOverlay, { backgroundColor: p.overlay || 'rgba(5, 7, 18, 0.52)' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={[styles.vaccineModalCard, { backgroundColor: p.surface, borderColor: p.border }]}>
              <View style={[styles.vaccineModalIcon, { backgroundColor: p.purpleSoft }]}>
                <Text style={styles.vaccineModalEmoji}>💉</Text>
              </View>

              <Text style={[styles.vaccineModalTitle, { color: p.text }]}>{t('Novo Registro')}</Text>
              <Text style={[styles.vaccineModalSubtitle, { color: p.muted }]}>
                {t('Insira os dados da vacinação abaixo.')}
              </Text>

              <TextInput
                value={vaccineName}
                onChangeText={setVaccineName}
                placeholder={t('Nome da Vacina')}
                placeholderTextColor={p.muted}
                style={[styles.vaccineModalInput, { backgroundColor: p.field, color: p.text, borderColor: p.border }]}
              />

              <View style={[styles.vaccineDateInputWrapper, { backgroundColor: p.field, borderColor: p.border }]}>
                <TextInput
                  value={vaccineApplicationDate}
                  onChangeText={(value) => setVaccineApplicationDate(formatDateInput(value))}
                  placeholder={t('dd/mm/aaaa')}
                  placeholderTextColor={p.text}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={[styles.vaccineDateInput, { color: p.text }]}
                />
                <Calendar size={18} color={p.text} />
              </View>

              <View style={[styles.vaccineDateInputWrapper, { backgroundColor: p.field, borderColor: p.border }]}>
                <TextInput
                  value={vaccineNextDoseDate}
                  onChangeText={(value) => setVaccineNextDoseDate(formatDateInput(value))}
                  placeholder={t('dd/mm/aaaa')}
                  placeholderTextColor={p.text}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={[styles.vaccineDateInput, { color: p.text }]}
                />
                <Calendar size={18} color={p.text} />
              </View>

              <View style={styles.vaccineModalActions}>
                <TouchableOpacity
                  style={[styles.vaccineCancelButton, { backgroundColor: p.surfaceAlt }]}
                  onPress={closeVaccineModal}
                  disabled={savingVaccine}
                >
                  <Text style={[styles.vaccineCancelText, { color: p.text }]}>{t('CANCELAR')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.vaccineSaveButton, savingVaccine && styles.vaccineSaveButtonDisabled]}
                  onPress={handleSaveVaccine}
                  disabled={savingVaccine}
                >
                  {savingVaccine ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.vaccineSaveText}>{t('SALVAR REGISTRO')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}
