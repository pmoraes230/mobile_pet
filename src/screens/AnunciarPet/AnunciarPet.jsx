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
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, ChevronDown, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

export default function AnunciarPet() {
  const navigation = useNavigation();
  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedSexo, setSelectedSexo] = useState(null);
  const [modalEspecieOpen, setModalEspecieOpen] = useState(false);
  const [modalSexoOpen, setModalSexoOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [petImage, setPetImage] = useState(null);
  const [petName, setPetName] = useState('');
  const [petRaca, setPetRaca] = useState('');
  const [petData, setPetData] = useState('');
  const [petDescricao, setPetDescricao] = useState('');
  const [petPeso, setPetPeso] = useState('');

  const especies = [
    { id: 1, name: 'Cachorro' },
    { id: 2, name: 'Gato' },
    { id: 3, name: 'Coelho' },
    { id: 4, name: 'Hamster' },
    { id: 5, name: 'Pássaro' },
  ];

  const sexos = [
    { id: 1, name: 'Macho' },
    { id: 2, name: 'Femea' },
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Função da Máscara de Data
  const handleDataChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
    }
    setPetData(formatted);
  };

  // Função para selecionar imagem
  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Erro', 'Permissão para galeria é necessária.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });
      if (!result.canceled && result.assets[0]) {
        setPetImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Erro imagem:', error);
    }
  };

  const handleSavePet = async () => {
    try {
      if (!petName.trim() || !selectedEspecie || !petImage) {
        Alert.alert('Erro', 'Preencha nome, espécie e foto.');
        return;
      }
      
      setLoading(true);

      const filename = `pet_${Date.now()}.jpg`;

      const formData = new FormData();
      formData.append('nome', petName);
      formData.append('especie', selectedEspecie.name);
      formData.append('raca', petRaca || 'Não informada');
      formData.append('sexo', selectedSexo?.name || 'Macho');
      formData.append('descricao', petDescricao || "");
      formData.append('dataNascimento', petData);
      formData.append('peso', petPeso ? petPeso.replace(',', '.') : "0");
      formData.append('imagem', {
        uri: petImage.uri,
        type: 'image/jpeg', 
        name: filename,
      });

      console.log('📤 Enviando pet via axios:', { nome: petName, especie: selectedEspecie.name });
      console.log('🖼️ URI:', petImage.uri);
      console.log('🖼️ IMAGE:', petImage);
      const response = await api.post('/pets', formData);

      console.log('✅ Pet cadastrado com sucesso:', response.data);

      Alert.alert('Sucesso', 'Pet cadastrado!', [
        { text: 'OK', onPress: () => navigation.navigate('MeusPets') },
      ]);
    } catch (error) {
      console.log('❌ Erro ao salvar:', error.message);
      console.log('Response data:', error.response?.data);
      console.log('Error code:', error.code);
      Alert.alert('Erro', error.response?.data?.message || error.message || 'Não foi possível salvar o pet.');
    } finally {
      setLoading(false);
    }
  };

  const renderModalItem = (item) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        if (modalEspecieOpen) setSelectedEspecie(item);
        if (modalSexoOpen) setSelectedSexo(item);
        setModalEspecieOpen(false);
        setModalSexoOpen(false);
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
          <View style={styles.headerSection}>
            <Text style={styles.title}>Adicionar Pet</Text>
            <Text style={styles.subtitle}>Complete as informações para cadastrar seu pet.</Text>
          </View>

          <Text style={styles.label}>FOTO DO PET</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleSelectImage}>
            {petImage ? (
              <>
                <Image source={{ uri: petImage.uri }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
                <TouchableOpacity 
                  style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#FFF', borderRadius: 20, padding: 5 }}
                  onPress={() => setPetImage(null)}
                >
                  <X size={20} color="#000" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Camera size={30} color="#A0A7BA" />
                <Text style={styles.uploadText}>Clique para enviar uma foto</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME DO PET</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Ex: Paçoca"
              placeholderTextColor="#CBD5E0"
              value={petName}
              onChangeText={setPetName}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>ESPÉCIE</Text>
              <TouchableOpacity
                style={[styles.inputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setModalEspecieOpen(true)}
              >
                <Text style={{ color: '#4A5568' }}>
                  {selectedEspecie ? selectedEspecie.name : 'Selecione'}
                </Text>
                <ChevronDown size={16} color="#A0A7BA" />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>RAÇA</Text>
              <TextInput 
                style={styles.inputField} 
                placeholder="Ex: Vira-lata" 
                placeholderTextColor="#CBD5E0"
                value={petRaca}
                onChangeText={setPetRaca}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>DATA DE NASCIMENTO</Text>
              <TextInput
                style={styles.inputField}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#CBD5E0"
                keyboardType="numeric"
                maxLength={10}
                value={petData}
                onChangeText={handleDataChange}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>SEXO</Text>
              <TouchableOpacity
                style={[styles.inputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setModalSexoOpen(true)}
              >
                <Text style={{ color: '#4A5568' }}>
                  {selectedSexo ? selectedSexo.name : 'Selecione'}
                </Text>
                <ChevronDown size={16} color="#A0A7BA" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PESO (KG)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Ex: 5.5"
              placeholderTextColor="#CBD5E0"
              keyboardType="decimal-pad"
              value={petPeso}
              onChangeText={setPetPeso}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DESCRIÇÃO E CUIDADOS</Text>
            <TextInput
              style={[styles.inputField, styles.textArea]}
              placeholder="Conte um pouco..."
              placeholderTextColor="#A0A7BA"
              multiline
              numberOfLines={4}
              value={petDescricao}
              onChangeText={setPetDescricao}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
              <Text style={styles.btnTextCancel}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnSubmit, loading && { opacity: 0.6 }]} 
              onPress={handleSavePet}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.btnTextSubmit}>Salvar Pet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={modalEspecieOpen} transparent animationType="fade" onRequestClose={() => setModalEspecieOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione uma Espécie</Text>
              <FlatList
                data={especies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item)}
              />
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalEspecieOpen(false)}>
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={modalSexoOpen} transparent animationType="fade" onRequestClose={() => setModalSexoOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione o Sexo</Text>
              <FlatList
                data={sexos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderModalItem(item)}
              />
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalSexoOpen(false)}>
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}