import React, { useState } from 'react';
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
  PencilLine, Scale, Venus, Calendar, Syringe,
  Plus, CircleDashed, Sun, CloudSun, Moon, Pill, ClipboardList
} from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';

const MISSY_IMAGE = require('../../../assets/gatasafada.jpg');

export default function TelaDetalhesPet() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Sobre');
  const [activeBottomTab, setActiveBottomTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

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
          
          {/* CARD DO PERFIL */}
          <View style={styles.profileCard}>
            <Image source={MISSY_IMAGE} style={styles.petImg} />
            <View style={styles.nameWrapper}>
              <Text style={styles.petName}>Missy</Text>
              <TouchableOpacity>
                <PencilLine size={20} color="#9127E1" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.petBreed}>preta</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#E8D5F7' }]}>
                <View>
                  <Text style={[styles.statLabel, { color: '#9127E1' }]}>PESO</Text>
                  <Text style={[styles.statValue, { color: '#9127E1' }]}>--- kg</Text>
                </View>
                <Scale size={22} color="#9127E1" />
              </View>
              <View style={[styles.statBox, { backgroundColor: '#C6F0FF' }]}>
                <View>
                  <Text style={[styles.statLabel, { color: '#4A90E2' }]}>SEXO</Text>
                  <Text style={[styles.statValue, { color: '#4A90E2' }]}>Fêmea</Text>
                </View>
                <Venus size={22} color="#4A90E2" />
              </View>
            </View>
          </View>

          {/* CARD PRÓXIMA CONSULTA */}
          <TouchableOpacity activeOpacity={0.9} style={styles.appointmentCard}>
            <View>
              <Text style={styles.appointmentLabel}>Próxima consulta</Text>
              <Text style={styles.appointmentDate}>14 - Abr</Text>
              <Text style={styles.appointmentType}>Consulta Geral</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 20 }}>
              <Calendar size={30} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* SEÇÃO DE DETALHES COM ABAS */}
          <View style={styles.contentCard}>
            <View style={styles.tabRow}>
              {['Sobre', 'Vacinas', 'Medicamentos'].map(tab => (
                <TouchableOpacity 
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                >
                  <Text 
                    style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
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
                  <Text style={styles.label}>Sobre o Missy:</Text>
                  <TextInput 
                    style={[styles.textInput, styles.textArea]} 
                    placeholder="Conte um pouco..." 
                    multiline 
                    placeholderTextColor="#A0A7BA" 
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Personalidade</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <CircleDashed size={16} color="#A0A7BA" />
                    <Text style={{ color: '#A0A7BA', fontStyle: 'italic', fontSize: 13 }}>
                      Nenhuma característica selecionada.
                    </Text>
                  </View>
                </View>
                <View style={styles.rowInputs}>
                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>ESPÉCIE</Text>
                    <TextInput style={styles.textInput} value="Gato" editable={false} />
                  </View>
                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>RAÇA</Text>
                    <TextInput style={styles.textInput} value="preta" />
                  </View>
                </View>
              </View>
            ) : activeTab === 'Vacinas' ? (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={styles.label}>Carteira de vacinação</Text>
                  <TouchableOpacity style={{ backgroundColor: '#9127E1', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Plus size={14} color="#FFF" strokeWidth={3} />
                    <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>NOVO</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.vaccineItem}>
                  <View style={styles.vaccineCircle}>
                    <Syringe size={22} color="#9127E1" />
                  </View>
                  <View style={styles.vaccineInfo}>
                    <Text style={{ fontWeight: 'bold', color: '#0D214F' }}>vacina de raiva</Text>
                    <Text style={{ fontSize: 12, color: '#7E869E' }}>12/03/2026</Text>
                  </View>
                  <View style={styles.nextDoseBox}>
                    <Text style={{ fontSize: 8, color: '#A0A7BA', fontWeight: 'bold' }}>PRÓX. DOSE</Text>
                    <Text style={{ fontSize: 12, color: '#9127E1', fontWeight: 'bold' }}>12/04</Text>
                  </View>
                </View>
              </View>
            ) : (
              /* ABA MEDICAMENTOS */
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={styles.label}>Cronograma</Text>
                  <Pill size={20} color="#9127E1" />
                </View>

                <View style={styles.periodRow}>
                  <Sun size={18} color="#FF7A2F" />
                  <Text style={styles.periodTitle}>Manhã</Text>
                  <Text style={styles.countBadge}>1</Text>
                </View>

                <View style={[styles.medicCard, { borderLeftColor: '#FF7A2F' }]}>
                  <View style={styles.medicHeader}>
                    <Text style={styles.medicTime}>08:00</Text>
                    <View style={styles.petBadgeMedic}>
                      <Text style={{ fontSize: 9, fontWeight: '900', color: '#9127E1' }}>MISSY</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A5568' }}>6769</Text>
                  <View style={styles.instructionBox}>
                    <Text style={{ fontSize: 12, color: '#7E869E' }}>dar quando tiver vontade</Text>
                  </View>
                </View>

                <View style={styles.periodRow}>
                  <CloudSun size={18} color="#4A90E2" />
                  <Text style={styles.periodTitle}>Tarde</Text>
                  <Text style={styles.countBadge}>0</Text>
                </View>

                <View style={styles.periodRow}>
                  <Moon size={18} color="#0D214F" />
                  <Text style={styles.periodTitle}>Noite</Text>
                  <Text style={styles.countBadge}>0</Text>
                </View>

                <View style={styles.treatmentSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                    <ClipboardList size={20} color="#9127E1" />
                    <Text style={styles.label}>Tratamentos em andamento</Text>
                  </View>
                  <View style={styles.treatmentEmpty}>
                    <Text style={{ color: '#A0A7BA', fontSize: 13, textAlign: 'center' }}>
                      Nenhum tratamento ativo encontrado para os próximos dias.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.btnSave} activeOpacity={0.8}>
              <Text style={styles.btnSaveText}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* TAB BAR */}
        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}