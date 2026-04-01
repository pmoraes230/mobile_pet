import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/prontuariostyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function TelaProntuario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState('Selecione um pet...');

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <HeaderHome userName="Pedro" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E DESCRIÇÃO */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Prontuário eletrônico</Text>
            <Text style={styles.subtitle}>
              Visualize o histórico de atendimento e evolução clínica dos pets. 
              Os registros são gerados automaticamente pelo veterinário.
            </Text>
          </View>

          {/* SELETOR DE PETS ESTILO WEB */}
          <View style={styles.selectorContainer}>
            <Text style={styles.labelPets}>PETS:</Text>
            <TouchableOpacity style={styles.petDropdown}>
              <Text style={styles.petDropdownText}>{selectedPet}</Text>
              <Text style={{color: '#9127E1', fontSize: 10}}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* CARD DE HISTÓRICO */}
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Histórico de Prontuários</Text>

            {/* ESTADO VAZIO (EMPTY STATE) IGUAL AO PRINT */}
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyIcon}>📁</Text> 
              <Text style={styles.emptyTitle}>Nenhum registro disponível</Text>
              <Text style={styles.emptySubtitle}>
                Selecione outro pet ou aguarde registros futuros.
              </Text>
            </View>
          </View>

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}