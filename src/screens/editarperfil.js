import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, Phone, Smile, Plus, Trash2 } from 'lucide-react-native';

// IMPORTAÇÕES DE COMPONENTES
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';
import { styles } from '../style/editarperfilstyle';

const TUTOR_IMAGE = require('../assets/rayan_lindo.webp');

export default function EditarPerfil() {
  const navigation = useNavigation();
  const [name, setName] = useState('Rayan Rodrigues');
  const [cpf] = useState('803.863.360-16');
  const [address, setAddress] = useState('WE 33 - 1021');
  const [phoneDdd, setPhoneDdd] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('984242060');

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER FIXO */}
      <HeaderHome 
        userName="Luiza Ferreira" 
        showSearch={false} 
        showBackButton={true} 
        showGreeting={false} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Editar meu perfil</Text>
          <Text style={styles.pageSubtitle}>Mantenha seus dados e contatos atualizados</Text>
        </View>

        {/* FOTO DE PERFIL */}
        <View style={styles.photoCard}>
          <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.9}>
            <Image
              source={TUTOR_IMAGE}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Camera size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoTitle}>FOTO DE PERFIL</Text>
          <Text style={styles.photoSubtitle}>Clique para alterar a imagem</Text>
        </View>

        {/* SEÇÃO DADOS PESSOAIS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}><Smile size={20} color="#9127E1" /></View>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nome Completo</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>CPF (não editável)</Text>
            <TextInput
              value={cpf}
              editable={false}
              style={[styles.textInput, styles.disabledInput]}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Endereço Residencial</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.textInput}
            />
          </View>
        </View>

        {/* SEÇÃO TELEFONES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, {backgroundColor: '#E6FFFA'}]}><Phone size={20} color="#00D7C4" /></View>
            <Text style={styles.sectionTitle}>Meus Telefones</Text>
          </View>
          
          <TouchableOpacity style={styles.newContactButton}>
            <Plus size={14} color="#9127E1" />
            <Text style={styles.newContactText}>NOVO CONTATO</Text>
          </TouchableOpacity>

          <View style={styles.phoneRow}>
            <View style={styles.phoneSelect}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: '#4A5568'}}>WhatsApp</Text>
            </View>
            <TextInput
              value={phoneDdd}
              onChangeText={setPhoneDdd}
              style={[styles.textInput, styles.dddInput]}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={[styles.textInput, styles.numInput]}
              keyboardType="numeric"
            />
            <TouchableOpacity style={{marginLeft: 5}}>
              <Trash2 size={20} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => alert('Perfil atualizado!')}>
            <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 2. TABBAR FIXA */}
      <TabBar />

    </SafeAreaView>
  );
}