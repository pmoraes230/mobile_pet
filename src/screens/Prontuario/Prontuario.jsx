import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Folder } from 'lucide-react-native';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

export default function TelaProntuario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalPetOpen, setModalPetOpen] = useState(false);

  const pets = [
    { id: 1, name: 'Missy' },
    { id: 2, name: 'Rex' },
    { id: 3, name: 'Bella' },
    { id: 4, name: 'Max' },
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderModalItem = (item) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedPet(item);
        setModalPetOpen(false);
      }}
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
          {/* TÍTULO E DESCRIÇÃO */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Prontuário eletrônico</Text>
            <Text style={styles.subtitle}>
              Visualize o histórico de atendimento e evolução clínica dos pets.
              Os registros são gerados automaticamente pelo veterinário.
            </Text>
          </View>

          {/* SELETOR DE PETS */}
          <View style={styles.selectorContainer}>
            <Text style={styles.labelPets}>PETS:</Text>
            <TouchableOpacity
              style={styles.petDropdown}
              onPress={() => setModalPetOpen(true)}
            >
              <Text style={styles.petDropdownText}>
                {selectedPet ? selectedPet.name : 'Selecione um pet...'}
              </Text>
              <Text style={{ color: '#9127E1', fontSize: 10 }}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* CARD DE HISTÓRICO */}
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Histórico de Prontuários</Text>

            {/* EMPTY STATE */}
            <View style={styles.emptyStateContainer}>
              <Folder size={40} color="#A0A7BA" />
              <Text style={styles.emptyTitle}>Nenhum registro disponível</Text>
              <Text style={styles.emptySubtitle}>
                Selecione outro pet ou aguarde registros futuros.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* MODAL: SELECIONAR PET */}
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
                data={pets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item)}
                scrollEnabled={true}
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