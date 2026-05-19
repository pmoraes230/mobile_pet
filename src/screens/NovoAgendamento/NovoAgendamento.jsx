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
import { getAgendaSemanal, criarAgendamento } from '../../services/agendamentoService';

export default function TelaNovoAgendamento() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(2); // Quarta-feira
  const [activeTab, setActiveTab] = useState('home');

  // Estados para os selects
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVeterinario, setSelectedVeterinario] = useState(null);
  const [selectedServico, setSelectedServico] = useState('Consulta Geral');
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

  const dias = [
    { id: 0, label: 'SEG', num: '30' },
    { id: 1, label: 'TER', num: '31' },
    { id: 2, label: 'QUA', num: '1' },
    { id: 3, label: 'QUI', num: '2' },
    { id: 4, label: 'SEX', num: '3' },
    { id: 5, label: 'SÁB', num: '4' },
  ];

  const petsOpcao = agendaDados.pets.length > 0 ? agendaDados.pets : pets;
  const veterinariosOpcao = agendaDados.veterinarios.length > 0 ? agendaDados.veterinarios : veterinarios;

  useEffect(() => {
    const carregarAgenda = async () => {
      setAgendaCarregando(true);
      try {
        const dados = await getAgendaSemanal(new Date());
        setAgendaDados(dados);
        setSelectedPet((prev) => prev || (dados.pets?.[0] ?? null));
        setSelectedVeterinario((prev) => prev || (dados.veterinarios?.[0] ?? null));
      } catch (error) {
        setAgendaErro(error.message || 'Erro ao carregar agenda.');
      } finally {
        setAgendaCarregando(false);
      }
    };

    carregarAgenda();
  }, []);

  const handleConfirmarAgendamento = async () => {
    if (!selectedPet || !selectedVeterinario || !selectedServico) {
      Alert.alert('Preencha os campos', 'Selecione pet, veterinário e tipo de serviço.');
      return;
    }

    setIsSubmitting(true);
    setAgendaErro(null);

    try {
      const diaSelecionado = dias.find((item) => item.id === selectedDay);
      const agendaDisponivelId = diaSelecionado?.id ?? selectedDay;
      const petId = selectedPet.id || selectedPet.petId || selectedPet._id;

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
      <Text style={styles.modalItemText}>{item.name}</Text>
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
                {selectedPet ? selectedPet.name : 'Selecione seu pet...'}
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
                {selectedVeterinario ? selectedVeterinario.name : 'Escolha o médico...'}
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

          {/* CALENDÁRIO HORIZONTAL */}
          <View style={styles.calendarSection}>
            <Text style={styles.label}>DATA DA CONSULTA (MARÇO 2026)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {dias.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedDay(item.id)}
                  style={[styles.dayCard, selectedDay === item.id && styles.dayCardActive]}
                >
                  <Text style={[styles.dayLabel, selectedDay === item.id && styles.textWhite]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.dayNum, selectedDay === item.id && styles.textWhite]}>
                    {item.num}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                renderItem={({ item }) => renderModalItem(item, (selected) => {
                  setSelectedVeterinario(selected);
                  setModalVeterOpen(false);
                })}
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