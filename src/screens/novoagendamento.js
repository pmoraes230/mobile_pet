import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  SafeAreaView, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/novoagendamentostyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TelaNovoAgendamento() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(2); // Quarta-feira
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const dias = [
    { id: 0, label: 'SEG', num: '30' },
    { id: 1, label: 'TER', num: '31' },
    { id: 2, label: 'QUA', num: '1' },
    { id: 3, label: 'QUI', num: '2' },
    { id: 4, label: 'SEX', num: '3' },
    { id: 5, label: 'SÁB', num: '4' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <HeaderHome userName="Pedro" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TÍTULO DO MODAL */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Novo Agendamento</Text>
          <Text style={styles.modalSubtitle}>Escolha o veterinário, dia e horário</Text>
        </View>

        {/* CAMPO: QUAL PET? */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>QUAL PET?</Text>
          <TouchableOpacity style={styles.selectField}>
            <Text style={styles.selectText}>Selecione seu pet...</Text>
            <Text style={{color: '#A0A7BA'}}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* CAMPO: VETERINÁRIO */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>VETERINÁRIO</Text>
          <TouchableOpacity style={styles.selectField}>
            <Text style={styles.selectText}>Escolha o médico...</Text>
            <Text style={{color: '#A0A7BA'}}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* CAMPO: TIPO DE SERVIÇO */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>TIPO DE SERVIÇO</Text>
          <TouchableOpacity style={styles.selectField}>
            <Text style={styles.selectText}>Consulta Geral</Text>
            <Text style={{color: '#A0A7BA'}}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* CALENDÁRIO HORIZONTAL (IGUAL DASHBOARD WEB) */}
        <View style={styles.calendarSection}>
          <Text style={styles.label}>DATA DA CONSULTA (MARÇO 2026)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
            {dias.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => setSelectedDay(item.id)}
                style={[styles.dayCard, selectedDay === item.id && styles.dayCardActive]}
              >
                <Text style={[styles.dayLabel, selectedDay === item.id && styles.textWhite]}>{item.label}</Text>
                <Text style={[styles.dayNum, selectedDay === item.id && styles.textWhite]}>{item.num}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CAMPO: OBSERVAÇÕES */}
        <View style={[styles.inputWrapper, {marginTop: 25}]}>
          <Text style={styles.label}>OBSERVAÇÕES</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Descreva brevemente..."
            multiline
            placeholderTextColor="#A0A7BA"
          />
        </View>

        {/* BOTÕES DE AÇÃO IGUAL AO MODAL */}
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
            <Text style={styles.btnTextSecondary}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnTextPrimary}>Agendar Agora</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
    </SafeAreaView>
  );
}