import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Frown, Meh, Smile } from 'lucide-react-native';
import { styles } from './styles';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';

export default function TelaDiario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('consultas');
  const [mood, setMood] = useState('happy');
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

  const registros = [
    { id: 1, pet: 'Missy', data: '12/03 • 17:21', relato: 'se sentiu sozinho', icon: Frown },
    { id: 2, pet: 'Missy', data: '12/03 • 16:46', relato: 'acordou muito feliz', icon: Smile },
    { id: 3, pet: 'Missy', data: '12/03 • 16:39', relato: 'ficou triste sem a comida', icon: Frown },
  ];

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
          {/* GRÁFICO (Tendência Semanal) */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Tendência semanal</Text>
              <View style={styles.petBadge}>
                <Text style={styles.petBadgeText}>
                  {selectedPet ? selectedPet.name.toUpperCase() : 'MISSY'}
                </Text>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#A0A7BA' }}>Área do Gráfico</Text>
            </View>
          </View>

          {/* CARD DE REGISTRO RÁPIDO */}
          <View style={styles.inputCard}>
            <View style={styles.emojiRow}>
              <TouchableOpacity
                style={[styles.emojiBtn, mood === 'sad' && styles.emojiSelected]}
                onPress={() => setMood('sad')}
              >
                <Frown size={30} color={mood === 'sad' ? '#FFF' : '#A0A7BA'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emojiBtn, mood === 'neutral' && styles.emojiSelected]}
                onPress={() => setMood('neutral')}
              >
                <Meh size={30} color={mood === 'neutral' ? '#FFF' : '#A0A7BA'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emojiBtn, mood === 'happy' && styles.emojiSelected]}
                onPress={() => setMood('happy')}
              >
                <Smile size={30} color={mood === 'happy' ? '#FFF' : '#A0A7BA'} />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelWhite}>ESCOLHER PET</Text>
            <TouchableOpacity
              style={styles.selectWhite}
              onPress={() => setModalPetOpen(true)}
            >
              <Text style={{ color: '#FFF' }}>
                {selectedPet ? selectedPet.name : 'Missy'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.labelWhite}>RELATO DO DIA</Text>
            <TextInput
              style={styles.inputWhite}
              placeholder="Como foi o dia dele?"
              placeholderTextColor="#A0A7BA"
              multiline
            />

            <TouchableOpacity style={styles.btnFull}>
              <Text style={styles.btnFullText}>NOVO REGISTRO COMPLETO</Text>
            </TouchableOpacity>
          </View>

          {/* REGISTROS RECENTES */}
          <Text style={styles.sectionTitle}>Registros recentes</Text>
          {registros.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <item.icon size={20} color="#A0A7BA" />
              <View style={styles.historyInfo}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName}>{item.pet}</Text>
                  <Text style={styles.historyDate}>{item.data}</Text>
                </View>
                <Text style={styles.historyText}>{item.relato}</Text>
              </View>
            </View>
          ))}
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