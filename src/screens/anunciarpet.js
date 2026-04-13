import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, ChevronDown } from 'lucide-react-native';
import { styles } from '../style/anunciarpetstyle';
import HeaderHome from '../components/Header/HeaderHome';

export default function AnunciarPet() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderHome 
        userName="Rayan" 
        showBackButton={true} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Anunciar pet meu</Text>
          <Text style={styles.subtitle}>Preencha os dados do pet para encontrar um novo lar.</Text>
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
            placeholder="Ex: Neymar Jr" 
            placeholderTextColor="#CBD5E0"
          />
        </View>

        {/* ESPÉCIE E RAÇA */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={[styles.inputGroup, {width: '48%'}]}>
                <Text style={styles.label}>ESPÉCIE</Text>
                <TouchableOpacity style={[styles.inputField, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                    <Text style={{color: '#4A5568'}}>Cachorro</Text>
                    <ChevronDown size={16} color="#A0A7BA" />
                </TouchableOpacity>
            </View>
            <View style={[styles.inputGroup, {width: '48%'}]}>
                <Text style={styles.label}>IDADE</Text>
                <TextInput style={styles.inputField} placeholder="Ex: 2 anos" placeholderTextColor="#CBD5E0" />
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

          <TouchableOpacity style={styles.btnSubmit} onPress={() => alert('Anúncio publicado!')}>
            <Text style={styles.btnTextSubmit}>Publicar Anúncio</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}