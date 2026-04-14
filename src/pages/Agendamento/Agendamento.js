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

  const dias = [
    { id: 0, label: 'SEG', num: '6' },
    { id: 1, label: 'TER', num: '7' },
    { id: 2, label: 'QUA', num: '8' },
    { id: 3, label: 'QUI', num: '9' },
    { id: 4, label: 'SEX', num: '10' },
    { id: 5, label: 'SÁB', num: '11' },
    { id: 6, label: 'DOM', num: '12' },
  ];

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

        {/* CARD DE CALENDÁRIO */}
        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>Março 2026</Text>
            <View style={styles.arrows}>
              <ChevronLeft size={22} color="#A0A7BA" />
              <ChevronRight size={22} color="#A0A7BA" />
            </View>
          </View>

          <View style={styles.daysGrid}>
            {dias.map((item) => (
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
        </View>

        <Text style={styles.sectionTitle}>Esta semana</Text>

        <View style={styles.emptyContainer}>
          <CalendarX size={45} color="#CBD5E0" strokeWidth={1.5} />
          <Text style={styles.emptyText}>
            Nenhum agendamento para esta semana.
          </Text>
        </View>

      </ScrollView>

      <TabBar onLogout={() => navigation.navigate('Login')} />
    </SafeAreaView>
  );
}