import React, { useState, useEffect } from 'react';
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
  PencilLine,
  Scale,
  Venus,
  Calendar,
  Plus,
  Pill
} from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { updatePet } from '../../services/updatePet';
import api from '../../services/api';
// IMPORTADO O FORMATADOR DE DATA
import { formateDate } from '../../utils/formatters';

export default function TelaDetalhesPet({ route }) {
  const navigation = useNavigation();
  const { pet } = route.params;

  const [activeTab, setActiveTab] = useState('Sobre');

  const [descricao, setDescricao] = useState(pet.descricao || pet.DESCRICAO || '');
  const [personalidade, setPersonalidade] = useState(pet.personalidade || pet.PERSONALIDADE || '');
  const [especie, setEspecie] = useState(pet.especie || pet.ESPECIE || '');
  const [raca, setRaca] = useState(pet.raca || pet.RACA || '');
  const [peso, setPeso] = useState(pet.peso || pet.PESO ? String(pet.peso || pet.PESO) : '');
  const [sexo, setSexo] = useState(pet.sexo || pet.SEXO || '');

  const [vacinas, setVacinas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    carregarVacinas();
    carregarMedicamentos();
  }, []);

  const carregarVacinas = async () => {
    try {
      const response = await api.get(`/vacinas/pet/${pet.id || pet.ID}`);
      setVacinas(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar vacinas:', error);
    }
  };

  const carregarMedicamentos = async () => {
    try {
      const response = await api.get(`/medicamentos/pet/${pet.id || pet.ID}`);
      setMedicamentos(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar medicamentos:', error);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleSavePet = async () => {
    try {
      await updatePet(pet.id || pet.ID, {
        DESCRICAO: descricao,
        PERSONALIDADE: personalidade,
        ESPECIE: especie,
        RACA: raca,
        PESO: peso,
        SEXO: sexo,
      });

      alert('Pet atualizado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  const rawImage = pet.imagem || pet.IMAGEM;
  const imageUri = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${rawImage}`
    : null;

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
          <View style={styles.profileCard}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../../assets/default-pet.png')
              }
              style={styles.petImg}
            />

            <View style={styles.nameWrapper}>
              <Text style={styles.petName}>{pet.nome || pet.NOME}</Text>
              <TouchableOpacity>
                <PencilLine size={20} color="#9127E1" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={styles.petBreed}>{raca}</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#E8D5F7' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: '#9127E1' }]}>
                    PESO
                  </Text>
                  <TextInput
                    value={peso}
                    onChangeText={setPeso}
                    placeholder="Peso"
                    keyboardType="numeric"
                    style={[styles.statValue, { color: '#9127E1' }]}
                  />
                </View>
                <Scale size={22} color="#9127E1" />
              </View>

              <View style={[styles.statBox, { backgroundColor: '#C6F0FF' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: '#4A90E2' }]}>
                    SEXO
                  </Text>
                  <TextInput
                    value={sexo}
                    onChangeText={setSexo}
                    placeholder="Macho/Fêmea"
                    style={[styles.statValue, { color: '#4A90E2' }]}
                  />
                </View>
                <Venus size={22} color="#4A90E2" />
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.appointmentCard}>
            <View>
              <Text style={styles.appointmentLabel}>Próxima consulta</Text>
              <Text style={styles.appointmentDate}>14 - Abr</Text>
              <Text style={styles.appointmentType}>Consulta Geral</Text>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 12,
                borderRadius: 20,
              }}
            >
              <Calendar size={30} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.contentCard}>
            <View style={styles.tabRow}>
              {['Sobre', 'Vacinas', 'Medicamentos'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabBtn,
                    activeTab === tab && styles.tabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
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
                  <Text style={styles.label}>Sobre o {pet.nome || pet.NOME}:</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    placeholder="Escreva uma descrição sobre seu pet..."
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Personalidade</Text>
                  <TextInput
                    style={styles.textInput}
                    value={personalidade}
                    onChangeText={setPersonalidade}
                    placeholder="Ex: brincalhão, calmo, carinhoso..."
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>ESPÉCIE</Text>
                    <TextInput
                      style={styles.textInput}
                      value={especie}
                      onChangeText={setEspecie}
                      placeholder="Ex: Gato"
                    />
                  </View>

                  <View style={{ width: '48%' }}>
                    <Text style={styles.labelUpper}>RAÇA</Text>
                    <TextInput
                      style={styles.textInput}
                      value={raca}
                      onChangeText={setRaca}
                      placeholder="Ex: Siamês"
                    />
                  </View>
                </View>
              </View>
            ) : activeTab === 'Vacinas' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.label}>Carteira de vacinação</Text>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#9127E1',
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Plus size={14} color="#FFF" strokeWidth={3} />
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}
                    >
                      NOVO
                    </Text>
                  </TouchableOpacity>
                </View>

                {vacinas.length === 0 ? (
                  <Text style={{ color: '#A0A7BA' }}>
                    Nenhuma vacina cadastrada.
                  </Text>
                ) : (
                  vacinas.map((vacina) => (
                    <View key={vacina.id || vacina.ID} style={styles.treatmentSection}>
                      <Text style={styles.label}>{vacina.nome || vacina.NOME}</Text>
                      {/* APLICADO O FORMATADOR DE DATA AQUI */}
                      <Text>Aplicação: {formateDate(vacina.dataAplicacao || vacina.DATA_APLICACAO)}</Text>
                      <Text>Próxima Dose: {formateDate(vacina.proximaDose || vacina.PROXIMA_DOSE)}</Text>
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.label}>Cronograma</Text>
                  <Pill size={20} color="#9127E1" />
                </View>

                {medicamentos.length === 0 ? (
                  <View style={styles.treatmentEmpty}>
                    <Text
                      style={{
                        color: '#A0A7BA',
                        fontSize: 13,
                        textAlign: 'center',
                      }}
                    >
                      Nenhum medicamento cadastrado.
                    </Text>
                  </View>
                ) : (
                  medicamentos.map((med) => (
                    <View key={med.id || med.ID} style={styles.treatmentSection}>
                      <Text style={styles.label}>{med.nome || med.NOME}</Text>
                      <Text>Dosagem: {med.dosagem || med.DOSAGEM}</Text>
                      <Text>Frequência: {med.frequencia || med.FREQUENCIA}</Text>
                    </View>
                  ))
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.btnSave}
              activeOpacity={0.8}
              onPress={handleSavePet}
            >
              <Text style={styles.btnSaveText}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}