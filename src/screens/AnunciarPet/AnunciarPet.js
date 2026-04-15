import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

export default function AnunciarPet() {
  const navigation = useNavigation();
  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedSexo, setSelectedSexo] = useState(null);
  const [modalEspecieOpen, setModalEspecieOpen] = useState(false);
  const [modalSexoOpen, setModalSexoOpen] = useState(false);

  const especies = [
    { id: 1, name: 'Cachorro' },
    { id: 2, name: 'Gato' },
    { id: 3, name: 'Coelho' },
    { id: 4, name: 'Hamster' },
    { id: 5, name: 'Pássaro' },
  ];

  const sexos = [
    { id: 1, name: 'Macho' },
    { id: 2, name: 'Fêmea' },
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderModalItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderHome
        userName="Rayan"
        showSearch={false}
        showBackButton={true}
        showGreeting={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Adicionar Pet</Text>
          <Text style={styles.subtitle}>Complete as informações para cadastrar seu pet.</Text>
        </View>

        {/* UPLOAD DE FOTO */}
        <Text style={styles.label}>FOTO DO PET</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Camera size={30} color="#A0A7BA" />
          <Text style={styles.uploadText}>Clique para enviar uma foto</Text>
        </TouchableOpacity>

        {/* NOME DO PET */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NOME DO PET</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Ex: Paçoca"
            placeholderTextColor="#CBD5E0"
          />
        </View>

        {/* ESPÉCIE E RAÇA */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}}>
          <View style={[styles.inputGroup, {flex: 1}]}>
            <Text style={styles.label}>ESPÉCIE</Text>
            <TouchableOpacity
              style={[styles.inputField, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}
              onPress={() => setModalEspecieOpen(true)}
            >
              <Text style={{color: '#4A5568'}}>
                {selectedEspecie ? selectedEspecie.name : 'Cachorro'}
              </Text>
              <ChevronDown size={16} color="#A0A7BA" />
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, {flex: 1}]}>
            <Text style={styles.label}>RAÇA</Text>
            <TextInput style={styles.inputField} placeholder="Ex: Vira-lata" placeholderTextColor="#CBD5E0" />
          </View>
        </View>

        {/* DATA DE NASCIMENTO E SEXO */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}}>
          <View style={[styles.inputGroup, {flex: 1}]}>
            <Text style={styles.label}>DATA DE NASCIMENTO</Text>
            <TextInput
              style={styles.inputField}
              placeholder="dd/mm/aaaa"
              placeholderTextColor="#CBD5E0"
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.inputGroup, {flex: 1}]}>
            <Text style={styles.label}>SEXO</Text>
            <TouchableOpacity
              style={[styles.inputField, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}
              onPress={() => setModalSexoOpen(true)}
            >
              <Text style={{color: '#4A5568'}}>
                {selectedSexo ? selectedSexo.name : 'Macho'}
              </Text>
              <ChevronDown size={16} color="#A0A7BA" />
            </TouchableOpacity>
          </View>
        </View>

        {/* DESCRIÇÃO / HISTÓRIA */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DESCRIÇÃO E CUIDADOS</Text>
          <TextInput
            style={[styles.inputField, styles.textArea]}
            placeholder="Conte um pouco sobre o temperamento dele..."
            placeholderTextColor="#A0A7BA"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
            <Text style={styles.btnTextCancel}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSubmit} onPress={() => navigation.navigate('MeusPets')}>
            <Text style={styles.btnTextSubmit}>Salvar Pet</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* MODAL: SELECIONAR ESPÉCIE */}
      <Modal
        visible={modalEspecieOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalEspecieOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma Espécie</Text>
            <FlatList
              data={especies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderModalItem(item, (selected) => {
                setSelectedEspecie(selected);
                setModalEspecieOpen(false);
              })}
              scrollEnabled={true}
            />
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalEspecieOpen(false)}
            >
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: SELECIONAR SEXO */}
      <Modal
        visible={modalSexoOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalSexoOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Sexo</Text>
            <FlatList
              data={sexos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderModalItem(item, (selected) => {
                setSelectedSexo(selected);
                setModalSexoOpen(false);
              })}
              scrollEnabled={true}
            />
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalSexoOpen(false)}
            >
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TabBar onLogout={handleLogout} />
    </SafeAreaView>
  );
}