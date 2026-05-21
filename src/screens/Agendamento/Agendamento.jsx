import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ChevronLeft, ChevronRight, CalendarX, Clock, User, AlertCircle } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { getAgendaSemanal } from '../../services/agendamentoService';

export default function TelaAgendamento() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(4);
  const [viewMode, setViewMode] = useState('week');
  const [appointmentView, setAppointmentView] = useState('proximas'); // 'proximas' ou 'historico'
  
  // Estados para dados da API
  const [agenda, setAgenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dataAtual, setDataAtual] = useState(new Date());
  
  // Buscar agenda ao carregar a tela e quando ela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      buscarAgenda();
    }, [dataAtual])
  );

  const buscarAgenda = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await getAgendaSemanal(dataAtual);
      setAgenda(dados);
    } catch (erro) {
      setErro(erro.message);
      console.error('Erro ao buscar agenda:', erro);
    } finally {
      setCarregando(false);
    }
  };

  // Gerar dias da semana a partir do dataAtual
  const gerarDiasSemana = () => {
    const dias = [];
    const hoje = new Date(dataAtual);
    
    // Encontrar o domingo da semana
    const primeiro = hoje.getDate() - hoje.getDay();
    const domingo = new Date(hoje.setDate(primeiro));
    
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 0; i < 7; i++) {
      const data = new Date(domingo);
      data.setDate(data.getDate() + i);
      
      dias.push({
        id: i,
        label: nomes[i],
        num: data.getDate().toString().padStart(2, '0'),
        data: data,
        temAgendamento: false
      });
    }
    
    return dias;
  };

  // Gerar dias do mês
  const gerarDiasMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    
    const primeiro = new Date(ano, mes, 1);
    const ultimo = new Date(ano, mes + 1, 0);
    const diasVazios = primeiro.getDay();
    const diasMes = ultimo.getDate();
    
    const dias = [];
    
    // Dias vazios no início
    for (let i = 0; i < diasVazios; i++) {
      dias.push({ id: `vazio-${i}`, vazio: true });
    }
    
    // Dias do mês
    for (let i = 1; i <= diasMes; i++) {
      dias.push({
        id: `dia-${i}`,
        num: i.toString(),
        data: new Date(ano, mes, i),
        vazio: false
      });
    }
    
    return { dias, diasVazios };
  };

  // Filtrar consultas para a data selecionada
  const buscarConsultasData = (data) => {
    if (!agenda?.consultas) return [];
    
    return agenda.consultas.filter(consulta => {
      const dataConsulta = new Date(consulta.data);
      return dataConsulta.toDateString() === data.toDateString();
    });
  };

  // Filtrar consultas futuras (próximas)
  const obterConsultasProximas = () => {
    if (!agenda?.consultas) return [];
    const agora = new Date();
    return agenda.consultas
      .filter(consulta => new Date(consulta.data) >= agora)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
  };

  // Filtrar consultas passadas (histórico)
  const obterHistoricoConsultas = () => {
    if (!agenda?.consultas) return [];
    const agora = new Date();
    return agenda.consultas
      .filter(consulta => new Date(consulta.data) < agora)
      .sort((a, b) => new Date(b.data) - new Date(a.data)); // Mais recentes primeiro
  };

  const diasSemana = gerarDiasSemana();
  const { dias: diasMes, diasVazios } = gerarDiasMes();
  const diasMesComAppt = diasMes.map((day) => ({
    ...day,
    hasAppointment: !day.vazio && buscarConsultasData(day.data).length > 0,
  }));
  const emptyDays = Array(diasVazios).fill(null);
  const dataAtualSelecionada = diasSemana[selectedDay]?.data || dataAtual;
  const consultasAtual = buscarConsultasData(dataAtualSelecionada);

  const mesAtualTexto = dataAtual.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.safeArea}>

        <HeaderHome 
          userName="Rayan" 
          showSearch={false}
          showGreeting={false}
          showBackButton={true}
          onBackPress={() => navigation.goBack()} 
        />

        {carregando ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
              Carregando agenda...
            </Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            <View style={styles.headerPage}>
              <Text style={styles.titlePage}>Agendamentos</Text>
              <Text style={styles.subtitlePage}>Próximos compromissos e histórico</Text>
            </View>

            {erro && (
              <View style={{ 
                backgroundColor: '#FFE5E5', 
                borderRadius: 8, 
                padding: 12, 
                marginHorizontal: 16,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <AlertCircle size={20} color="#DC143C" />
                <Text style={{ marginLeft: 8, color: '#DC143C', flex: 1, fontSize: 13 }}>
                  {erro}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.btnNovoAgendamento}
              onPress={() => navigation.navigate('novoagendamento')} 
            >
              <Plus size={20} color="#FFF" strokeWidth={3} />
              <Text style={styles.btnTextNovo}>Novo Agendamento</Text>
            </TouchableOpacity>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
                onPress={() => setViewMode('week')}
              >
                <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>
                  Semana
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
                onPress={() => setViewMode('month')}
              >
                <Text style={[styles.toggleText, viewMode === 'month' && styles.toggleTextActive]}>
                  Mês
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarCard}>
              <View style={styles.monthRow}>
                <Text style={styles.monthTitle}>
                  {mesAtualTexto.charAt(0).toUpperCase() + mesAtualTexto.slice(1)}
                </Text>
                <View style={styles.arrows}>
                  <TouchableOpacity
                    onPress={() => {
                      const novadata = new Date(dataAtual);
                      novadata.setMonth(novadata.getMonth() - 1);
                      setDataAtual(novadata);
                    }}
                  >
                    <ChevronLeft size={22} color="#A0A7BA" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const novadata = new Date(dataAtual);
                      novadata.setMonth(novadata.getMonth() + 1);
                      setDataAtual(novadata);
                    }}
                  >
                    <ChevronRight size={22} color="#A0A7BA" />
                  </TouchableOpacity>
                </View>
              </View>

              {viewMode === 'week' ? (
                <View style={styles.daysGrid}>
                  {diasSemana.map((item) => (
                    <TouchableOpacity 
                      key={item.id}
                      onPress={() => setSelectedDay(item.id)}
                      style={[
                        styles.dayBox, 
                        selectedDay === item.id && styles.dayBoxActive
                      ]}
                    >
                      <Text style={[styles.dayLabel, selectedDay === item.id && styles.textWhite]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.dayNum, selectedDay === item.id && styles.textWhite]}>
                        {item.num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.monthGrid}>
                  <View style={styles.weekDaysHeader}>
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <Text key={day} style={styles.weekDayHeader}>{day}</Text>
                    ))}
                  </View>

                  <View style={styles.monthDaysGrid}>
                    {emptyDays.map((_, index) => (
                      <View key={`empty-${index}`} style={styles.emptyDayBox} />
                    ))}
                    {diasMesComAppt.map((day) => (
                      <TouchableOpacity 
                        key={day.id}
                        style={[
                          styles.monthDayBox,
                          day.hasAppointment && styles.dayWithAppointment
                        ]}
                      >
                        <Text style={[
                          styles.monthDayNum,
                          day.hasAppointment && styles.dayNumWithAppointment
                        ]}>
                          {day.num}
                        </Text>
                        {day.hasAppointment && <View style={styles.appointmentDot} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Toggle entre Próximas e Histórico */}
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <View style={{ 
                flexDirection: 'row', 
                backgroundColor: '#F0F0F0', 
                borderRadius: 8,
                padding: 4
              }}>
                <TouchableOpacity
                  style={[
                    { 
                      flex: 1, 
                      paddingVertical: 10, 
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      alignItems: 'center'
                    },
                    appointmentView === 'proximas' && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setAppointmentView('proximas')}
                >
                  <Text style={[
                    { fontSize: 14, fontWeight: '600', color: '#666' },
                    appointmentView === 'proximas' && { color: '#FFF' }
                  ]}>
                    Próximas
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    { 
                      flex: 1, 
                      paddingVertical: 10, 
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      alignItems: 'center'
                    },
                    appointmentView === 'historico' && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setAppointmentView('historico')}
                >
                  <Text style={[
                    { fontSize: 14, fontWeight: '600', color: '#666' },
                    appointmentView === 'historico' && { color: '#FFF' }
                  ]}>
                    Histórico
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Seção de Próximas Consultas */}
            {appointmentView === 'proximas' && (
              <>
                <Text style={styles.sectionTitle}>
                  Próximas Consultas
                </Text>

                {obterConsultasProximas().length > 0 ? (
                  <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                    {obterConsultasProximas().map((consulta, index) => {
                      const dataConsulta = new Date(consulta.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      });
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 10,
                            borderLeftWidth: 4,
                            borderLeftColor: '#007AFF'
                          }}
                        >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 4 }}>
                                {consulta.tipo || 'Consulta'}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <User size={14} color="#666" />
                                <Text style={{ fontSize: 12, color: '#666', marginLeft: 6 }}>
                                  {consulta.veterinario || 'Veterinário não informado'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Clock size={14} color="#666" />
                                <Text style={{ fontSize: 12, color: '#666', marginLeft: 6 }}>
                                  {consulta.hora || 'Horário não informado'}
                                </Text>
                              </View>
                              <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                                {dataConsulta}
                              </Text>
                            </View>
                            <View style={{
                              backgroundColor: '#E8F4FF',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 4
                            }}>
                              <Text style={{ fontSize: 11, color: '#007AFF', fontWeight: '600' }}>
                                {consulta.status || 'Agendada'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
                    <Text style={styles.emptyText}>
                      Nenhuma consulta próxima agendada.
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Seção de Histórico */}
            {appointmentView === 'historico' && (
              <>
                <Text style={styles.sectionTitle}>
                  Histórico de Consultas
                </Text>

                {obterHistoricoConsultas().length > 0 ? (
                  <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                    {obterHistoricoConsultas().map((consulta, index) => {
                      const dataConsulta = new Date(consulta.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      });
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 10,
                            borderLeftWidth: 4,
                            borderLeftColor: '#8B8B8B',
                            opacity: 0.8
                          }}
                        >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                                {consulta.tipo || 'Consulta'}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <User size={14} color="#666" />
                                <Text style={{ fontSize: 12, color: '#666', marginLeft: 6 }}>
                                  {consulta.veterinario || 'Veterinário não informado'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Clock size={14} color="#666" />
                                <Text style={{ fontSize: 12, color: '#666', marginLeft: 6 }}>
                                  {consulta.hora || 'Horário não informado'}
                                </Text>
                              </View>
                              <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                                {dataConsulta}
                              </Text>
                            </View>
                            <View style={{
                              backgroundColor: '#E8E8E8',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 4
                            }}>
                              <Text style={{ fontSize: 11, color: '#666', fontWeight: '600' }}>
                                {consulta.status || 'Realizada'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
                    <Text style={styles.emptyText}>
                      Nenhuma consulta anterior registrada.
                    </Text>
                  </View>
                )}
              </>
            )}


          </ScrollView>
        )}

        <TabBar onLogout={() => navigation.navigate('Login')} />
      </View>
    </KeyboardAvoidingView>
  );
}