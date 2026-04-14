import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Share2, Heart } from 'lucide-react-native';
import { styles } from './styles';
import TabBar from '../../components/TabBar';

const TUTOR_IMAGE = require('../../assets/rayan_lindo.webp');

export default function PetDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('home');
  const [isFavorite, setIsFavorite] = useState(false);

  // Dados do pet vindo dos params ou valores padrão
  const { petData } = route.params || {};
  
  const pet = petData || {
    name: 'Niça',
    breed: 'Branco',
    age: '11',
    weight: '-- kg',
    castrated: 'Não',
    description: 'O tutor ainda não escreveu uma descrição detalhada para este pet.',
    personality: 'Nenhuma característica informada.',
    tutor: 'Rayan Rodrigues',
    tutorImage: TUTOR_IMAGE,
    image: 'https://placekitten.com/400/600'
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleContact = () => {
    Alert.alert('Contato', 'Enviando mensagem para entrar em contato com o tutor...');
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Compartilhando perfil do ' + pet.name);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#333" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{pet.name}</Text>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#FF6B9D' : '#CCC'} 
              fill={isFavorite ? '#FF6B9D' : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* SCROLL CONTENT */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* PET IMAGE */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: pet.image }} 
              style={styles.petImage} 
            />
            {/* GENDER BADGE */}
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>♂</Text>
            </View>
          </View>

          {/* PET INFO CARDS */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>IDADE</Text>
              <Text style={styles.infoValue}>{pet.age} anos</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>PESO</Text>
              <Text style={styles.infoValue}>{pet.weight}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>CASTRADO</Text>
              <Text style={styles.infoValue}>{pet.castrated}</Text>
            </View>
          </View>

          {/* CONHEÇA A NIÇA */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBorder} />
              <Text style={styles.sectionTitle}>Conheça o {pet.name}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {pet.description}
            </Text>
          </View>

          {/* PERSONALIDADE */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emojiIcon}>✨</Text>
              <Text style={styles.sectionTitle}>Personalidade</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {pet.personality}
            </Text>
          </View>

          {/* TUTOR RESPONSÁVEL */}
          <View style={styles.tutorCard}>
            <Text style={styles.tutorLabel}>TUTOR RESPONSÁVEL</Text>
            <View style={styles.tutorContent}>
              <Image 
                source={pet.tutorImage} 
                style={styles.tutorImage} 
              />
              <View style={styles.tutorInfo}>
                <Text style={styles.tutorName}>{pet.tutor}</Text>
              </View>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleContact}
              >
                <Text style={styles.messageButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={18} color="#A0A7BA" />
              <Text style={styles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Heart size={18} color="white" />
              <Text style={styles.contactButtonText}>Quero entrar em contato</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} onTabPress={setActiveTab} onLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
