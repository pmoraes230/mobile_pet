import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';

export default function TelaMeusPets() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  
  // Dados fictícios baseados no seu pet
  const pets = [
    {
      id: 1,
      nome: 'Missy',
      tipo: 'GATO',
      cor: 'PRETA',
      idade: '2 anos',
      foto: 'https://placekitten.com/500/300' // Substitua pela URI da imagem real
    },
    // Adicione mais pets aqui para testar o scroll
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <HeaderHome userName="Pedro" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>Meus pets</Text>
            <Text style={styles.subtitle}>Gerencie as informações de todos os seus amigos.</Text>
          </View>

          {/* BOTÃO ADICIONAR PET */}
          <TouchableOpacity style={styles.btnAddPet}>
            <Text style={{fontSize: 20, color: '#9127E1', fontWeight: 'bold'}}>+</Text>
            <Text style={styles.btnAddText}>Adicionar pet</Text>
          </TouchableOpacity>

          {/* LISTA DE PETS - AQUI FOI LIGADO */}
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => navigation.navigate('detalhespet')}
              onMenuPress={() => {}}
            />
          ))}

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}