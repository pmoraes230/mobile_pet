import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/editarperfilstyle';
import { Camera, Phone, Smile, ChevronLeft, Plus } from 'lucide-react-native';

export default function EditarPerfil() {
  const navigation = useNavigation();
  const [name, setName] = useState('Luiza Ferreira');
  const [cpf] = useState('80386336016');
  const [address, setAddress] = useState('we 33 - 1021');
  const [phoneType, setPhoneType] = useState('WhatsApp');
  const [phoneDdd, setPhoneDdd] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('984242060');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={20} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>EDITAR MEU PERFIL</Text>
            <Text style={styles.pageSubtitle}>Mantenha seus dados e contatos atualizados</Text>
          </View>
        </View>

        <View style={styles.photoCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Camera size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.photoTitle}>FOTO DE PERFIL</Text>
          <Text style={styles.photoSubtitle}>Clique no ícone para alterar a imagem</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Smile size={18} color="#7c3aed" />
            </View>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          </View>

          <View style={styles.rowFields}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nome Completo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nome completo"
                placeholderTextColor="#9ca3af"
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
          </View>

          <View style={styles.fieldContainerFull}>
            <Text style={styles.fieldLabel}>Endereço Residencial</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Endereço residencial"
              placeholderTextColor="#9ca3af"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadgePhone}>
              <Phone size={18} color="#10b981" />
            </View>
            <Text style={styles.sectionTitle}>Meus Telefones</Text>
          </View>
          <TouchableOpacity style={styles.newContactButton} activeOpacity={0.8}>
            <Plus size={14} color="#7c3aed" />
            <Text style={styles.newContactText}>NOVO CONTATO</Text>
          </TouchableOpacity>

          <View style={styles.phoneCard}>
            <View style={styles.phoneSelect}>
              <Text style={styles.phoneSelectText}>{phoneType}</Text>
            </View>
            <TextInput
              value={phoneDdd}
              onChangeText={setPhoneDdd}
              style={[styles.textInput, styles.phoneInput, styles.dddInput]}
              keyboardType="numeric"
            />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={[styles.textInput, styles.phoneInput, styles.phoneNumberInput]}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.trashButton} activeOpacity={0.7}>
              <Text style={styles.trashText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveText}>SALVAR PERFIL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
