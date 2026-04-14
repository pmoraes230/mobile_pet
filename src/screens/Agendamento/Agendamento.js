import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, ChevronLeft, ChevronRight, CalendarX } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

export default function TelaAgendamento() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(4); // Sexta, dia 10
  const [viewMode, setViewMode] = useState('week'); // 'week' ou 'month'

  const diasSemana = [
    { id: 0, label: 'SEG', num: '6' },
    { id: 1, label: 'TER', num: '7' },
    { id: 2, label: 'QUA', num: '8' },
    { id: 3, label: 'QUI', num: '9' },
    { id: 4, label: 'SEX', num: '10' },
    { id: 5, label: 'SÁB', num: '11' },
    { id: 6, label: 'DOM', num: '12' },
  ];

  // Dados para o mês (simulado)
  const diasMes = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    num: (i + 1).toString(),
    isCurrentMonth: true,
    hasAppointment: i === 9 || i === 15 || i === 22, // Dias com agendamentos
  }));

  // Dias vazios do início do mês (para alinhar com os dias da semana)
  const emptyDays = Array(5).fill(null); // Supondo que o mês começa numa segunda

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER AJUSTADO PARA NÃO PARECER A TELA INICIAL */}
      <HeaderHome 
        userName="Rayan" 
        showSearch={false}      // DESATIVA A BUSCA
        showGreeting={false}    // DESATIVA O "BOA TARDE"
        showBackButton={true}   // ATIVA O BOTÃO VOLTAR
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TÍTULO DA PÁGINA COM ESPAÇAMENTO CORRETO */}
        <View style={styles.headerPage}>
          <Text style={styles.titlePage}>Agendamentos</Text>
          <Text style={styles.subtitlePage}>Próximos compromissos e histórico</Text>
        </View>

        {/* BOTÃO NOVO AGENDAMENTO */}
        <TouchableOpacity 
          style={styles.btnNovoAgendamento}
          onPress={() => navigation.navigate('novoagendamento')} 
        >
          <Plus size={20} color="#FFF" strokeWidth={3} />
          <Text style={styles.btnTextNovo}>Novo Agendamento</Text>
        </TouchableOpacity>

        {/* TOGGLE SEMANA/MÊS */}
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

        {/* CARD DE CALENDÁRIO */}
        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>Março 2026</Text>
            <View style={styles.arrows}>
              <TouchableOpacity>
                <ChevronLeft size={22} color="#A0A7BA" />
              </TouchableOpacity>
              <TouchableOpacity>
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
              {/* Dias da semana headers */}
              <View style={styles.weekDaysHeader}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <Text key={day} style={styles.weekDayHeader}>{day}</Text>
                ))}
              </View>
              
              {/* Dias do mês */}
              <View style={styles.monthDaysGrid}>
                {emptyDays.map((_, index) => (
                  <View key={`empty-${index}`} style={styles.emptyDayBox} />
                ))}
                {diasMes.map((day) => (
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

        <Text style={styles.sectionTitle}>
          {viewMode === 'week' ? 'Esta semana' : 'Este mês'}
        </Text>

        <View style={styles.emptyContainer}>
          <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
          <Text style={styles.emptyText}>
            Nenhum agendamento para {viewMode === 'week' ? 'esta semana' : 'este mês'}.
          </Text>
        </View>

      </ScrollView>

      <TabBar onLogout={() => navigation.navigate('Login')} />
    </SafeAreaView>
  );
}