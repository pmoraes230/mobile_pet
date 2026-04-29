import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';
import { getPetsByTutor } from '../../services/pet';
import { formateCPF, formateDate } from '../../utils/formatters';

export default function TelaMeusPets() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('home');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  async function loadPets() {
    try {
      setLoading(true);

      const data = await getPetsByTutor();

      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Erro ao buscar pets:', error.message);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
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
            <Text style={styles.title}>Meus pets</Text>
            <Text style={styles.subtitle}>
              Gerencie as informações de todos os seus amigos.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.btnAddPet} 
            onPress={() => navigation.navigate('anunciarpet')}
          >
            <Text style={{ fontSize: 20, color: '#9127E1', fontWeight: 'bold' }}>
              +
            </Text>
            <Text style={styles.btnAddText}>Adicionar pet</Text>
          </TouchableOpacity>

          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Carregando pets...
            </Text>
          ) : pets.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Você ainda não cadastrou nenhum pet.
            </Text>
          ) : (
            pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={{
                  id: pet.id,
                  nome: pet.NOME,
                  tipo: pet.ESPECIE,
                  cor: pet.RACA,
                  idade: formateDate(pet.DATA_NASCIMENTO),
                  foto: pet.IMAGEM,
                }}
                onPress={() => navigation.navigate('detalhespet', { pet })}
                onMenuPress={() => {}}
              />
            ))
          )}

        </ScrollView>

        <TabBar 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
          onLogout={handleLogout} 
        />
      </View>
    </KeyboardAvoidingView>
  );
}