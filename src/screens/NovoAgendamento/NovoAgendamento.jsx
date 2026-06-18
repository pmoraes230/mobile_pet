import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, Text, TextInput,
  Modal, FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { useAppTheme } from '../../theme/ThemeContext';
import {
  getAgendaSemanal, criarAgendamento,
  getAgendaDisponivelDates, getAgendaDisponivelTimes,
} from '../../services/agendamentoService';

const NOVO_AGENDAMENTO_THEME = {
  light: {
    background: '#f9fafb',
    surface: '#fff',
    surfaceAlt: '#f3f4f6',
    text: '#111827',
    subtitle: '#6b7280',
    muted: '#9ca3af',
    border: '#e5e7eb',
    softBorder: '#f3f4f6',
    accent: '#9333ea',
    accentText: '#9333ea',
    fieldText: '#374151',
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
    accentText: '#D8B4FE',
    fieldText: '#F5F7FF',
  },
};

function useNovoAgendamentoTheme() {
  const { isDarkMode } = useAppTheme();
  return isDarkMode ? NOVO_AGENDAMENTO_THEME.dark : NOVO_AGENDAMENTO_THEME.light;
}

// --- helpers ------------------------------------------------------------------
const getItemLabel = (item) =>
  item?.name || item?.nome || item?.NOME || item?.descricao || item?.titulo || 'Selecionar';

const getItemId = (item) =>
  item?.id ?? item?.ID ?? item?.petId ?? item?.ID_PET ?? item?.id_pet ??
  item?._id ?? item?.veterinario_id ?? item?.id_veterinario;

// --- select field -------------------------------------------------------------
function SelectField({ label, value, placeholder, onPress, isStep = false }) {
  const p = useNovoAgendamentoTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
        textTransform: 'uppercase', marginBottom: 8,
        color: isStep ? p.accentText : p.muted,
      }}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: p.surfaceAlt, borderRadius: 16,
          paddingVertical: 16, paddingHorizontal: 16,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          borderWidth: 1, borderColor: p.border,
        }}
      >
        <Text style={{ fontWeight: '700', color: value ? p.fieldText : p.muted, fontSize: 14 }}>
          {value || placeholder}
        </Text>
        <Text style={{ color: p.muted, fontSize: 12 }}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- chips de dia -------------------------------------------------------------
function ChipsDias({ datas, selectedDate, onSelect, loading }) {
  const p = useNovoAgendamentoTheme();

  if (loading) {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
          textTransform: 'uppercase', marginBottom: 8, color: p.accentText,
        }}>
          Escolha o Dia
        </Text>
        <ActivityIndicator color={p.accent} style={{ marginTop: 8 }} />
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
        textTransform: 'uppercase', marginBottom: 8, color: p.accentText,
      }}>
        Escolha o Dia
      </Text>

      {datas.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {datas.map((item) => {
            const ativo = selectedDate?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelect(item)}
                style={{
                  width: '30%', paddingVertical: 12, paddingHorizontal: 4,
                  borderRadius: 14, borderWidth: 2, alignItems: 'center',
                  backgroundColor: ativo ? '#9333ea' : p.surface,
                  borderColor: ativo ? '#9333ea' : p.border,
                }}
              >
                <Text style={{
                  fontSize: 11, fontWeight: '900', textTransform: 'uppercase',
                  letterSpacing: 0.5, color: ativo ? '#fff' : p.fieldText,
                }}>
                  {item.dateLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={{
          backgroundColor: p.surfaceAlt,
          padding: 20,
          borderRadius: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: p.border,
        }}>
          <Text style={{ color: p.subtitle, fontWeight: '600', textAlign: 'center' }}>
            Nenhuma data disponível para este veterinário no momento.
          </Text>
          <Text style={{ color: p.muted, fontSize: 13, marginTop: 4, textAlign: 'center' }}>
            Tente selecionar outro veterinário.
          </Text>
        </View>
      )}
    </View>
  );
}

// --- chips de horário ---------------------------------------------------------
function ChipsHorarios({ slots, selectedSlot, onSelect, loading }) {
  const p = useNovoAgendamentoTheme();

  if (loading) {
    return <ActivityIndicator color={p.accent} style={{ marginTop: 8, marginBottom: 16 }} />;
  }
  if (!slots.length) {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
          textTransform: 'uppercase', marginBottom: 8, color: p.accentText,
        }}>
          Horários Disponíveis
        </Text>
        <View style={{
          backgroundColor: p.surfaceAlt,
          padding: 20,
          borderRadius: 16,
          alignItems: 'center',
        }}>
          <Text style={{ color: p.subtitle, textAlign: 'center' }}>
            Nenhum horário disponível para esta data.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
        textTransform: 'uppercase', marginBottom: 8, color: p.accentText,
      }}>
        Horários Disponíveis
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {slots.map((slot) => {
          const ativo = selectedSlot?.id === slot.id;
          return (
            <TouchableOpacity
              key={slot.id}
              onPress={() => onSelect(slot)}
              style={{
                width: '22%', paddingVertical: 10, alignItems: 'center',
                borderRadius: 12, borderWidth: 2,
                backgroundColor: ativo ? '#9333ea' : p.surface,
                borderColor: ativo ? '#9333ea' : p.border,
                shadowColor: ativo ? '#9333ea' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: ativo ? 0.3 : 0,
                shadowRadius: 6, elevation: ativo ? 4 : 0,
                transform: ativo ? [{ translateY: -2 }] : [],
              }}
            >
              <Text style={{
                fontSize: 12, fontWeight: '900',
                color: ativo ? '#fff' : p.fieldText,
              }}>
                {slot.hora}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// --- modal de seleção ---------------------------------------------------------
function ModalSelecao({ visible, titulo, dados, onSelect, onClose }) {
  const p = useNovoAgendamentoTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{
          backgroundColor: p.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
          maxHeight: '60%', paddingBottom: 24, borderWidth: 1, borderColor: p.border,
        }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            padding: 24, borderBottomWidth: 1, borderBottomColor: p.border,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: p.text }}>{titulo}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={{ backgroundColor: p.surfaceAlt, borderRadius: 20, padding: 6 }}
            >
              <X size={18} color={p.subtitle} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={dados}
            keyExtractor={(item) => String(getItemId(item) ?? item.name)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                style={{
                  paddingVertical: 14, paddingHorizontal: 24,
                  borderBottomWidth: 1, borderBottomColor: p.border,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: p.fieldText }}>
                  {getItemLabel(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

// --- tela principal -----------------------------------------------------------
export default function TelaNovoAgendamento() {
  const navigation = useNavigation();
  const p = useNovoAgendamentoTheme();

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

  const [modalPetOpen, setModalPetOpen] = useState(false);
  const [modalVeterOpen, setModalVeterOpen] = useState(false);
  const [modalServicoOpen, setModalServicoOpen] = useState(false);

  // fallbacks
  const petsOpcao = agendaDados.pets.length > 0 ? agendaDados.pets : [
    { id: 1, name: 'Missy' }, { id: 2, name: 'Rex' },
    { id: 3, name: 'Bella' }, { id: 4, name: 'Max' }, { id: 5, name: 'Luna' },
  ];
  const veterinariosOpcao = agendaDados.veterinarios.length > 0 ? agendaDados.veterinarios : [
    { id: 1, name: 'Dr. Patrick Nascimento' }, { id: 2, name: 'Dr. Silva' },
    { id: 3, name: 'Dra. Maria' }, { id: 4, name: 'Dr. João' },
  ];
  const servicosOpcao = [
    { id: 1, name: 'Consulta Geral' }, { id: 2, name: 'Vacinação' },
    { id: 3, name: 'Check-up' }, { id: 4, name: 'Retorno' },
  ];

  useEffect(() => {
    (async () => {
      setAgendaCarregando(true);
      try {
        const dados = await getAgendaSemanal(new Date());
        setAgendaDados(dados);
        setSelectedPet((prev) => prev || dados.pets?.[0] || null);
        const primeiroVet = dados.veterinarios?.[0] || null;
        setSelectedVeterinario((prev) => prev || primeiroVet);
        if (primeiroVet) await loadAvailableDates(getItemId(primeiroVet));
      } catch (err) {
        setAgendaErro(err.message || 'Erro ao carregar dados.');
      } finally {
        setAgendaCarregando(false);
      }
    })();
  }, []);

  const loadAvailableDates = async (vetId) => {
    setLoadingDates(true);
    setAvailableDates([]);
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
      const datas = await getAgendaDisponivelDates(vetId);

      const formatted = datas.map((item, i) => {
        const rawDate = item.DATA; // Deve ser "2026-05-26"

        // Correção: Garante formato YYYY-MM-DD
        const dateObj = new Date(rawDate);
        const formattedDate = dateObj.toISOString().split('T')[0]; // "2026-05-26"

        return {
          id: item.ID ?? `date-${i}`,
          date: formattedDate,                    // <- Formato limpo
          dateLabel: dateObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          }),
        };
      });

      setAvailableDates(formatted);
    } catch (e) {
      console.error(e);
      setAgendaErro('Erro ao buscar datas disponíveis.');
    } finally {
      setLoadingDates(false);
    }
  };

  const loadAvailableSlots = async (vetId, dateString) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
      // ?? CORRECAO: Garante que a data seja enviada como string YYYY-MM-DD pura
      let cleanDate = dateString;

      if (dateString instanceof Date) {
        cleanDate = dateString.toISOString().split('T')[0];
      } else if (typeof dateString === 'string' && dateString.includes('T')) {
        cleanDate = dateString.split('T')[0];
      }

      const vagas = await getAgendaDisponivelTimes(vetId, cleanDate);

      setAvailableSlots(vagas.map((item) => ({
        id: item.ID,
        hora: item.HORA,
        raw: item
      })));
    } catch (e) {
      console.error("Erro ao buscar horários:", e);
      setAgendaErro('Erro ao buscar horários.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleVeterinarioSelect = async (vet) => {
    setSelectedVeterinario(vet);
    setModalVeterOpen(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableSlots([]);

    const vetId = getItemId(vet);
    if (vetId) await loadAvailableDates(vetId);
  };

  const handleDateSelect = async (dateItem) => {
    setSelectedDate(dateItem);
    setSelectedSlot(null);

    const vetId = getItemId(selectedVeterinario);

    if (vetId && dateItem?.date) {
      await loadAvailableSlots(vetId, dateItem.date);   // Passa a string limpa
    }
  };

  const handleConfirmar = async () => {
    if (!selectedPet || !selectedVeterinario || !selectedServico) {
      Alert.alert('Preencha os campos', 'Selecione pet, veterinário e tipo de serviço.');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      Alert.alert('Selecione data e horário', 'Escolha uma data e um horário disponíveis.');
      return;
    }
    setIsSubmitting(true);
    setAgendaErro(null);
    try {
      const agendaDisponivelId = getItemId(selectedSlot);
      const petId = getItemId(selectedPet);
      if (agendaDisponivelId == null || petId == null)
        throw new Error('ID de pet ou vaga não encontrado.');
      const resultado = await criarAgendamento({ agendaDisponivelId, petId, tipo: selectedServico, obs });
      Alert.alert('Agendamento criado', resultado.mensagem, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = e.message || 'Erro ao criar agendamento.';
      setAgendaErro(msg);
      Alert.alert('Erro', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, backgroundColor: p.background }}>

        <HeaderHome
          userName="Rayan"
          showSearch={false}
          showBackButton={true}
          showGreeting={false}
          onBackPress={() => navigation.goBack()}
        />

        {agendaCarregando ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#9333ea" />
            <Text style={{ marginTop: 12, color: p.subtitle, fontSize: 14 }}>Carregando...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: p.text, letterSpacing: -0.5 }}>
                Novo Agendamento
              </Text>
              <Text style={{ color: p.subtitle, fontWeight: '500', fontSize: 14, marginTop: 4 }}>
                Escolha o veterinário, dia e horário
              </Text>
            </View>

            {/* 1. Pet */}
            <SelectField
              label="Qual Pet?"
              value={selectedPet ? getItemLabel(selectedPet) : null}
              placeholder="Selecione seu pet..."
              onPress={() => setModalPetOpen(true)}
            />

            {/* 2. Veterinário */}
            <SelectField
              label="Veterinário"
              value={selectedVeterinario ? getItemLabel(selectedVeterinario) : null}
              placeholder="Escolha o médico..."
              onPress={() => setModalVeterOpen(true)}
            />

            {/* 3. Chips de Dias - Só aparece se ainda não escolheu data */}
            {selectedVeterinario && !selectedDate && (
              <ChipsDias
                datas={availableDates}
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                loading={loadingDates}
              />
            )}

            {/* Data Selecionada */}
            {selectedDate && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
                  textTransform: 'uppercase', marginBottom: 8, color: p.accentText,
                }}>
                  Data Selecionada
                </Text>
                <View style={{
                  backgroundColor: '#9333ea',
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                    {selectedDate.dateLabel}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedDate(null)}>
                    <Text style={{ color: '#ddd', fontSize: 13, fontWeight: '600' }}>Trocar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 4. Horários - Só aparece após escolher a data */}
            {(selectedDate || loadingSlots) && (
              <ChipsHorarios
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                loading={loadingSlots}
              />
            )}

            {/* 5. Tipo de Serviço */}
            <SelectField
              label="Tipo de Serviço"
              value={selectedServico}
              placeholder="Selecione o serviço..."
              onPress={() => setModalServicoOpen(true)}
            />

            {/* 6. Observações */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
                textTransform: 'uppercase', marginBottom: 8, color: p.muted,
              }}>
                Observações
              </Text>
              <TextInput
                style={{
                  backgroundColor: p.surfaceAlt, borderRadius: 16,
                  paddingVertical: 14, paddingHorizontal: 16,
                  fontWeight: '700', color: p.fieldText, fontSize: 14,
                  minHeight: 90, textAlignVertical: 'top',
                  borderWidth: 1, borderColor: p.border,
                }}
                placeholder="Descreva brevemente..."
                placeholderTextColor={p.muted}
                multiline
                value={obs}
                onChangeText={setObs}
              />
            </View>

            {agendaErro && (
              <Text style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{agendaErro}</Text>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={isSubmitting}
                style={{
                  flex: 1, paddingVertical: 16, borderRadius: 16,
                  backgroundColor: p.surfaceAlt, alignItems: 'center',
                  borderWidth: 1, borderColor: p.border,
                }}
              >
                <Text style={{ fontWeight: '900', color: p.subtitle, fontSize: 14 }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmar}
                disabled={isSubmitting}
                style={{
                  flex: 1, paddingVertical: 16, borderRadius: 16,
                  backgroundColor: '#9333ea', alignItems: 'center',
                  opacity: isSubmitting ? 0.7 : 1,
                  shadowColor: '#9333ea', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ fontWeight: '900', color: '#fff', fontSize: 14 }}>Agendar Agora</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Modais */}
        <ModalSelecao
          visible={modalPetOpen}
          titulo="Selecione um Pet"
          dados={petsOpcao}
          onSelect={(item) => { setSelectedPet(item); setModalPetOpen(false); }}
          onClose={() => setModalPetOpen(false)}
        />
        <ModalSelecao
          visible={modalVeterOpen}
          titulo="Selecione um Veterinário"
          dados={veterinariosOpcao}
          onSelect={handleVeterinarioSelect}
          onClose={() => setModalVeterOpen(false)}
        />
        <ModalSelecao
          visible={modalServicoOpen}
          titulo="Selecione um Serviço"
          dados={servicosOpcao}
          onSelect={(item) => { setSelectedServico(item.name); setModalServicoOpen(false); }}
          onClose={() => setModalServicoOpen(false)}
        />

        <TabBar onLogout={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} />
      </View>
    </KeyboardAvoidingView>
  );
}





