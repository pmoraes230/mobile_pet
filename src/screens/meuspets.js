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
import { styles } from '../style/petstyle';
import TabBar from '../components/TabBar/TabBar';
import HeaderHome from '../components/Header/HeaderHome';

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
        <HeaderHome userName="Rayan" showSearch={false} showBackButton={true} showGreeting={false} onBackPress={() => navigation.goBack()} />

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
            <TouchableOpacity 
              key={pet.id} 
              style={styles.petCard}
              onPress={() => navigation.navigate('detalhespet')} // Comando para ligar as telas
            >
              
              {/* CONTAINER DA IMAGEM */}
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: pet.foto }} 
                  style={styles.petImage}
                />
                {/* BOTÃO DE MENU (TRÊS PONTINHOS) */}
                <TouchableOpacity style={styles.menuBtn}>
                  <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
              </View>

              {/* INFORMAÇÕES */}
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.nome}</Text>
                <Text style={styles.petBreed}>{pet.tipo} • {pet.cor}</Text>
                
                <View style={styles.ageBadge}>
                  <Text style={styles.ageText}>{pet.idade}</Text>
                </View>
              </View>

            </TouchableOpacity>
          ))}

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}