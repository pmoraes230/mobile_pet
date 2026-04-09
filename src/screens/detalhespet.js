import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  PencilLine, 
  Scale, 
  Venus, 
  Calendar, 
  Syringe, 
  Plus,
  CircleDashed
} from 'lucide-react-native';

// COMPONENTES
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';
import { styles } from '../style/detalhespetstyle';

export default function TelaDetalhesPet() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Sobre');
  const [activeBottomTab, setActiveBottomTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER - Seguindo o padrão de espaçamento do seu exemplo */}
      <HeaderHome 
        userName="Pedro" 
        showSearch={false} 
        showBackButton={true} 
        showGreeting={false} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CARD DO PERFIL - FOTO E NOME */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://placekitten.com/500/500' }} 
            style={styles.petImg} 
          />
          <View style={styles.nameWrapper}>
            <Text style={styles.petName}>Missy</Text>
            <TouchableOpacity>
              <PencilLine size={20} color="#9127E1" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.petBreed}>preta</Text>

          {/* PESO E SEXO */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: '#E8D5F7' }]}>
              <View>
                <Text style={[styles.statLabel, { color: '#9127E1' }]}>PESO</Text>
                <Text style={[styles.statValue, { color: '#9127E1' }]}>--- kg</Text>
              </View>
              <Scale size={22} color="#9127E1" strokeWidth={2.5} />
            </View>
            
            <View style={[styles.statBox, { backgroundColor: '#C6F0FF' }]}>
              <View>
                <Text style={[styles.statLabel, { color: '#4A90E2' }]}>SEXO</Text>
                <Text style={[styles.statValue, { color: '#4A90E2' }]}>Fêmea</Text>
              </View>
              <Venus size={22} color="#4A90E2" strokeWidth={2.5} />
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

        {/* SEÇÃO DE DETALHES COM ABAS INTERNAS */}
        <View style={styles.contentCard}>
          <View style={styles.tabRow}>
            {['Sobre', 'Saúde'].map(tab => (
              <TouchableOpacity 
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Sobre' ? (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sobre o Missy:</Text>
                <TextInput 
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Conte um pouco sobre o seu pet..."
                  multiline
                  placeholderTextColor="#A0A7BA"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Personalidade</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <CircleDashed size={16} color="#A0A7BA" />
                  <Text style={{color: '#A0A7BA', fontStyle: 'italic', fontSize: 13}}>Nenhuma característica selecionada.</Text>
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
          ) : (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <Text style={styles.label}>Carteira de vacinação</Text>
                <TouchableOpacity style={{ backgroundColor: '#9127E1', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Plus size={14} color="#FFF" strokeWidth={3} />
                  <Text style={{color: '#FFF', fontSize: 11, fontWeight: 'bold'}}>NOVO</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.vaccineItem}>
                <View style={styles.vaccineCircle}>
                  <Syringe size={22} color="#9127E1" />
                </View>
                <View style={styles.vaccineInfo}>
                  <Text style={styles.vaccineName}>vacina de raiva</Text>
                  <Text style={{fontSize: 12, color: '#7E869E'}}>12/03/2026</Text>
                </View>
                <View style={styles.nextDoseBox}>
                   <Text style={{fontSize: 8, color: '#A0A7BA', fontWeight: 'bold'}}>PRÓX. DOSE</Text>
                   <Text style={{fontSize: 12, color: '#9127E1', fontWeight: 'bold'}}>12/04</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.btnSave}>
            <Text style={styles.btnSaveText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* TABBAR FIXA NA BASE */}
      <TabBar activeTab={activeBottomTab} onTabPress={setActiveBottomTab} onLogout={handleLogout} />
      
    </SafeAreaView>
  );
}