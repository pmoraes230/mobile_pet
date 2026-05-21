import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { getAgendaSemanal, criarAgendamento, getAgendaDisponivelDates, getAgendaDisponivelTimes } from '../../services/agendamentoService';

export default function TelaNovoAgendamento() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');

  // Estados para os selects
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVeterinario, setSelectedVeterinario] = useState(null);
  const [selectedServico, setSelectedServico] = useState('Consulta Geral');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [obs, setObs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agendaCarregando, setAgendaCarregando] = useState(true);
  const [agendaErro, setAgendaErro] = useState(null);
  const [agendaDados, setAgendaDados] = useState({ pets: [], veterinarios: [] });

  // Estados para controlar modais
  const [modalPetOpen, setModalPetOpen] = useState(false);
  const [modalVeterOpen, setModalVeterOpen] = useState(false);
  const [modalServicoOpen, setModalServicoOpen] = useState(false);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Dados de fallback
  const pets = [
    { id: 1, name: 'Missy' },
    { id: 2, name: 'Rex' },
    { id: 3, name: 'Bella' },
    { id: 4, name: 'Max' },
    { id: 5, name: 'Luna' },
  ];

  const veterinarios = [
    { id: 1, name: 'Dr. Patrick Nascimento' },
    { id: 2, name: 'Dr. Silva' },
    { id: 3, name: 'Dra. Maria' },
    { id: 4, name: 'Dr. João' },
  ];

  const servicos = [
    { id: 1, name: 'Consulta Geral' },
    { id: 2, name: 'Vacinação' },
    { id: 3, name: 'Check-up' },
    { id: 4, name: 'Retorno' },
  ];

  const petsOpcao = agendaDados.pets.length > 0 ? agendaDados.pets : pets;
  const veterinariosOpcao = agendaDados.veterinarios.length > 0 ? agendaDados.veterinarios : veterinarios;

  const getItemLabel = (item) => item?.name || item?.nome || item?.NOME || item?.descricao || item?.titulo || 'Selecionar';
  const getItemId = (item) => item?.id ?? item?.ID ?? item?.petId ?? item?.ID_PET ?? item?.id_pet ?? item?._id ?? item?.veterinario_id ?? item?.id_veterinario;

  useEffect(() => {
    const carregarAgenda = async () => {
      setAgendaCarregando(true);
      try {
        const dados = await getAgendaSemanal(new Date());
        setAgendaDados(dados);
        setSelectedPet((prev) => prev || (dados.pets?.[0] ?? null));
        const primeiroVet = dados.veterinarios?.[0] ?? null;
        setSelectedVeterinario((prev) => prev || primeiroVet);
        if (primeiroVet) {
          await loadAvailableDates(getItemId(primeiroVet));
        }
      } catch (err) {
        setAgendaErro(err.message || 'Erro ao carregar dados da agenda.');
      } finally {
        setAgendaCarregando(false);
      }
    };

    carregarAgenda();
  }, []);

  const loadAvailableDates = async (vetId) => {
    setLoadingDates(true);
    setAvailableDates([]);
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
    try {
      const datas = await getAgendaDisponivelDates(vetId);
      setAvailableDates(datas.map((item, index) => {
        const rawDate = item.DATA; // "YYYY-MM-DD"
        const dateObj = new Date(rawDate + 'T00:00:00'); // evita fuso horário

        return {
          id: item.ID ?? index,
          date: rawDate,
          dateLabel: dateObj.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
          }),
        };
      }));
    } catch (error) {
      setAgendaErro(error.message || 'Erro ao buscar datas disponíveis.');
    } finally {
      setLoadingDates(false);
    }
  };

  const loadAvailableSlots = async (vetId, dateString) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    try {
      const vagas = await getAgendaDisponivelTimes(vetId, dateString);
      setAvailableSlots(vagas.map((item) => ({
        id: item.ID,
        hora: item.HORA, // já vem "HH:MM" do backend
        raw: item,
      })));
    } catch (error) {
      setAgendaErro(error.message || 'Erro ao buscar horários disponíveis.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleVeterinarioSelect = async (veterinario) => {
    setSelectedVeterinario(veterinario);
    setModalVeterOpen(false);
    const vetId = getItemId(veterinario);
    if (vetId) {
      await loadAvailableDates(vetId);
    }
  };

  const handleDateSelect = async (dateItem) => {
    setSelectedDate(dateItem);
    setSelectedSlot(null);
    const vetId = getItemId(selectedVeterinario);
    if (vetId && dateItem?.date) {
      await loadAvailableSlots(vetId, dateItem.date);
    }
  };

  const handleConfirmarAgendamento = async () => {
    if (!selectedPet || !selectedVeterinario || !selectedServico) {
      Alert.alert('Preencha os campos', 'Selecione pet, veterinário e tipo de serviço.');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      Alert.alert('Selecione data e horário', 'Escolha uma data e um horário disponíveis para continuar.');
      return;
    }

    setIsSubmitting(true);
    setAgendaErro(null);

    try {
      const agendaDisponivelId = getItemId(selectedSlot);
      const petId = getItemId(selectedPet);
      if (agendaDisponivelId == null || petId == null) {
        throw new Error('ID de pet ou de vaga não encontrado.');
      }

      const resultado = await criarAgendamento({
        agendaDisponivelId,
        petId,
        tipo: selectedServico,
        obs,
      });

      Alert.alert('Agendamento criado', resultado.mensagem, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message = error.message || 'Erro ao criar o agendamento.';
      setAgendaErro(message);
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModalItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.modalItemText}>{getItemLabel(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        {/* HEADER */}
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
          {/* TÍTULO */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Novo Agendamento</Text>
            <Text style={styles.modalSubtitle}>Escolha o veterinário, dia e horário</Text>
          </View>

          {/* QUAL PET? */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>QUAL PET?</Text>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => setModalPetOpen(true)}
            >
              <Text style={styles.selectText}>
                {selectedPet ? getItemLabel(selectedPet) : 'Selecione seu pet...'}
              </Text>
              <Text style={{ color: '#A0A7BA' }}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* VETERINÁRIO */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>VETERINÁRIO</Text>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => setModalVeterOpen(true)}
            >
              <Text style={styles.selectText}>
                {selectedVeterinario ? getItemLabel(selectedVeterinario) : 'Escolha o médico...'}
              </Text>
              <Text style={{ color: '#A0A7BA' }}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* TIPO DE SERVIÇO */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>TIPO DE SERVIÇO</Text>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => setModalServicoOpen(true)}
            >
              <Text style={styles.selectText}>{selectedServico}</Text>
              <Text style={{ color: '#A0A7BA' }}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* DATA DISPONÍVEL */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>DATA DA CONSULTA</Text>
            {loadingDates ? (
              <ActivityIndicator style={{ marginTop: 10 }} />
            ) : availableDates.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {availableDates.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleDateSelect(item)}
                    style={[styles.dayCard, selectedDate?.id === item.id && styles.dayCardActive]}
                  >
                    <Text style={[styles.dayLabel, selectedDate?.id === item.id && styles.textWhite]}>
                      {item.dateLabel}
                    </Text>
                    <Text style={[styles.dayNum, selectedDate?.id === item.id && styles.textWhite]}>
                      {item.date?.slice(8, 10)}/{item.date?.slice(5, 7)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ color: '#666', marginTop: 10 }}>
                {selectedVeterinario ? 'Sem datas disponíveis para este veterinário.' : 'Selecione um veterinário para ver as datas.'}
              </Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>HORÁRIO</Text>
            {loadingSlots ? (
              <ActivityIndicator style={{ marginTop: 10 }} />
            ) : availableSlots.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    onPress={() => setSelectedSlot(slot)}
                    style={[styles.dayCard, selectedSlot?.id === slot.id && styles.dayCardActive]}
                  >
                    <Text style={[styles.dayLabel, selectedSlot?.id === slot.id && styles.textWhite]}>
                      {slot.hora || 'Sem horário'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ color: '#666', marginTop: 10 }}>
                {selectedDate ? 'Sem horários disponíveis para esta data.' : 'Selecione uma data para ver horários.'}
              </Text>
            )}
          </View>

          {/* OBSERVAÇÕES */}
          <View style={[styles.inputWrapper, { marginTop: 25 }]}>
            <Text style={styles.label}>OBSERVAÇÕES</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva brevemente..."
              multiline
              placeholderTextColor="#A0A7BA"
              value={obs}
              onChangeText={setObs}
            />
          </View>

          {agendaErro && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#DC143C', fontSize: 13 }}>{agendaErro}</Text>
            </View>
          )}

          {/* BOTÕES DE AÇÃO */}
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()} disabled={isSubmitting}>
              <Text style={styles.btnTextSecondary}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, isSubmitting && { opacity: 0.7 }]}
              onPress={handleConfirmarAgendamento}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnTextPrimary}>Agendar Agora</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* MODAIS */}
        {/* Modal Pet */}
        <Modal
          visible={modalPetOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalPetOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Pet</Text>
              <FlatList
                data={petsOpcao}
                keyExtractor={(item) => (item.id || item._id).toString()}
                renderItem={({ item }) => renderModalItem(item, (selected) => {
                  setSelectedPet(selected);
                  setModalPetOpen(false);
                })}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalPetOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Veterinário */}
        <Modal
          visible={modalVeterOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVeterOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Veterinário</Text>
              <FlatList
                data={veterinariosOpcao}
                keyExtractor={(item) => (item.id || item._id).toString()}
                renderItem={({ item }) => renderModalItem(item, handleVeterinarioSelect)}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVeterOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Serviço */}
        <Modal
          visible={modalServicoOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalServicoOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Serviço</Text>
              <FlatList
                data={servicos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item, (selected) => {
                  setSelectedServico(selected.name);
                  setModalServicoOpen(false);
                })}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalServicoOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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