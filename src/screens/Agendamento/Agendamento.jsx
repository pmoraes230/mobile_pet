import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ChevronLeft, ChevronRight, CalendarX, Clock, User, AlertCircle } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { getAgendaTutor } from '../../services/agendamentoService';

export default function TelaAgendamento() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(4);
  const [viewMode, setViewMode] = useState('week');
  const [appointmentView, setAppointmentView] = useState('proximas');
  
  const [agenda, setAgenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dataAtual, setDataAtual] = useState(new Date());
  
  useFocusEffect(
    React.useCallback(() => {
      buscarAgenda();
    }, [dataAtual])
  );

  const buscarAgenda = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await getAgendaTutor(dataAtual);
      setAgenda(dados);
    } catch (erro) {
      setErro(erro.message);
      console.error('Erro ao buscar agenda:', erro);
    } finally {
      setCarregando(false);
    }
  };

  // Converte data UTC do backend para "YYYY-MM-DD" sem deslocar pelo fuso
  // Ex: "2026-03-09T00:00:00.000Z" → "2026-03-09" (e não "2026-03-08" em UTC-3)
  const toUTCDateString = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return null;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Converte data local do calendário (gerada pelo JS no fuso local) para "YYYY-MM-DD"
  const toLocalDateString = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const gerarDiasSemana = () => {
    const dias = [];
    const hoje = new Date(dataAtual);
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
      });
    }
    return dias;
  };

  const gerarDiasMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiro = new Date(ano, mes, 1);
    const ultimo = new Date(ano, mes + 1, 0);
    const diasVazios = primeiro.getDay();
    const diasMes = ultimo.getDate();
    const dias = [];
    
    for (let i = 0; i < diasVazios; i++) {
      dias.push({ id: `vazio-${i}`, vazio: true });
    }
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

  const parseConsultaData = (value) => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value) ? null : value;
    const asDate = new Date(value);
    if (!isNaN(asDate)) return asDate;

    const ddmmyyyy = value.match(/^([0-3]\d)-([0-1]\d)-(\d{4})(?:[T\s]([0-2]\d):([0-5]\d)(?::([0-5]\d))?)?$/);
    if (ddmmyyyy) {
      const [, day, month, year, hour = '00', minute = '00', second = '00'] = ddmmyyyy;
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }

    const dmySlash = value.match(/^([0-3]\d)\/([0-1]\d)\/(\d{4})(?:[T\s]([0-2]\d):([0-5]\d)(?::([0-5]\d))?)?$/);
    if (dmySlash) {
      const [, day, month, year, hour = '00', minute = '00', second = '00'] = dmySlash;
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }

    return null;
  };

  const getConsultaDate = (consulta) => {
    return (
      parseConsultaData(consulta.data) ||
      parseConsultaData(consulta.DATA) ||
      parseConsultaData(consulta.data_agendada) ||
      parseConsultaData(consulta.DATA_AGENDADA) ||
      null
    );
  };

  // "YYYY-MM-DD" de hoje no fuso local
  const hojeLocalString = () => toLocalDateString(new Date());

  // Compara data da consulta (UTC do backend) com data do calendário (local)
  const buscarConsultasData = (calendarDate) => {
    if (!agenda?.consultas) return [];
    const calStr = toLocalDateString(calendarDate); // dia do calendário em local
    return agenda.consultas.filter(consulta => {
      const d = getConsultaDate(consulta);
      return toUTCDateString(d) === calStr; // data da consulta em UTC (sem fuso)
    });
  };

  const obterConsultasProximas = () => {
    if (!agenda?.consultas) return [];
    const hoje = hojeLocalString();
    return agenda.consultas
      .filter(consulta => {
        const d = getConsultaDate(consulta);
        return toUTCDateString(d) >= hoje;
      })
      .sort((a, b) => getConsultaDate(a) - getConsultaDate(b));
  };

  const obterHistoricoConsultas = () => {
    if (!agenda?.consultas) return [];
    const hoje = hojeLocalString();
    return agenda.consultas
      .filter(consulta => {
        const d = getConsultaDate(consulta);
        return toUTCDateString(d) < hoje;
      })
      .sort((a, b) => getConsultaDate(b) - getConsultaDate(a));
  };

  const diasSemana = gerarDiasSemana();
  const { dias: diasMes, diasVazios } = gerarDiasMes();
  const diasMesComAppt = diasMes.map((day) => ({
    ...day,
    hasAppointment: !day.vazio && buscarConsultasData(day.data).length > 0,
  }));
  const emptyDays = Array(diasVazios).fill(null);

  const mesAtualTexto = dataAtual.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const renderConsultaCard = (consulta, index, isProxima) => {
    const d = getConsultaDate(consulta);
    // Formata usando UTC para não deslocar o dia
    const dataConsulta = d
      ? new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
          .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
      : 'Data não informada';

    return (
      <View
        key={consulta.id || index}
        style={{
          backgroundColor: '#F8F9FA',
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
          borderLeftWidth: 4,
          borderLeftColor: isProxima ? '#007AFF' : '#8B8B8B',
          opacity: isProxima ? 1 : 0.8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: isProxima ? '#000' : '#333', marginBottom: 4 }}>
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
            backgroundColor: isProxima ? '#E8F4FF' : '#E8E8E8',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4
          }}>
            <Text style={{ fontSize: 11, color: isProxima ? '#007AFF' : '#666', fontWeight: '600' }}>
              {consulta.status || (isProxima ? 'Agendada' : 'Realizada')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
                      style={[styles.dayBox, selectedDay === item.id && styles.dayBoxActive]}
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
                        style={[styles.monthDayBox, day.hasAppointment && styles.dayWithAppointment]}
                      >
                        <Text style={[styles.monthDayNum, day.hasAppointment && styles.dayNumWithAppointment]}>
                          {day.num}
                        </Text>
                        {day.hasAppointment && <View style={styles.appointmentDot} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Toggle Próximas / Histórico */}
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 8, padding: 4 }}>
                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
                    appointmentView === 'proximas' && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setAppointmentView('proximas')}
                >
                  <Text style={[
                    { fontSize: 14, fontWeight: '600', color: '#666' },
                    appointmentView === 'proximas' && { color: '#FFF' }
                  ]}>
                    Próximas ({obterConsultasProximas().length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
                    appointmentView === 'historico' && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setAppointmentView('historico')}
                >
                  <Text style={[
                    { fontSize: 14, fontWeight: '600', color: '#666' },
                    appointmentView === 'historico' && { color: '#FFF' }
                  ]}>
                    Histórico ({obterHistoricoConsultas().length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Próximas Consultas */}
            {appointmentView === 'proximas' && (
              <>
                <Text style={styles.sectionTitle}>Próximas Consultas</Text>
                {obterConsultasProximas().length > 0 ? (
                  <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                    {obterConsultasProximas().map((consulta, index) =>
                      renderConsultaCard(consulta, index, true)
                    )}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
                    <Text style={styles.emptyText}>Nenhuma consulta próxima agendada.</Text>
                  </View>
                )}
              </>
            )}

            {/* Histórico */}
            {appointmentView === 'historico' && (
              <>
                <Text style={styles.sectionTitle}>Histórico de Consultas</Text>
                {obterHistoricoConsultas().length > 0 ? (
                  <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                    {obterHistoricoConsultas().map((consulta, index) =>
                      renderConsultaCard(consulta, index, false)
                    )}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
                    <Text style={styles.emptyText}>Nenhuma consulta anterior registrada.</Text>
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