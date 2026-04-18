import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, Phone, Smile, Plus, Trash2 } from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { searchTutors } from '../../services/searchTutor';
import { consumerCPF } from '../../services/consumerCPF';
import { getUserInfo } from '../../services/auth';
import { formateCPF, formateDate } from '../../utils/formatters';

const TUTOR_IMAGE = require('../../assets/user_default.png');

export default function EditarPerfil() {
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneDdd, setPhoneDdd] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userData, setUserData] = useState(null);
  const [imageUser, setImageUser] = useState(null);
  const [cpfData, setCpfData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar os dados do tutor
  const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await searchTutors();
        const cpfResponse = await consumerCPF();
        const image = await getUserInfo();

        setUserData(user);
        setCpfData(cpfResponse);
        setImageUser(image);

        setName(user?.nome_tutor || '');
        setAddress(user?.ENDERECO || '');

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAll()
  }, []);


  // ==================== TELAS DE CARREGAMENTO E ERRO ====================
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#9127E1" />
        <Text style={{ marginTop: 15, color: '#666' }}>Carregando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={loadAll}>
          <Text style={{ color: '#9127E1', fontWeight: 'bold' }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        {/* HEADER FIXO */}
        <HeaderHome
          userName={false}
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

          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Editar meu perfil</Text>
            <Text style={styles.pageSubtitle}>Mantenha seus dados e contatos atualizados</Text>
          </View>

          {/* FOTO DE PERFIL */}
          <View style={styles.photoCard}>
            <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.9}>
              <Image
                source={
                  imageUser?.imagem
                    ? { uri: imageUser.imagem }
                    : require('../../assets/user_default.png')
                }
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
              <View style={styles.iconBadge}>
                <Smile size={20} color="#9127E1" />
              </View>
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
                value={formateCPF(cpfData?.cpf)}
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
              <View style={[styles.iconBadge, { backgroundColor: '#E6FFFA' }]}>
                <Phone size={20} color="#00D7C4" />
              </View>
              <Text style={styles.sectionTitle}>Meus Telefones</Text>
            </View>

            <TouchableOpacity style={styles.newContactButton}>
              <Plus size={14} color="#9127E1" />
              <Text style={styles.newContactText}>NOVO CONTATO</Text>
            </TouchableOpacity>

            <View style={styles.phoneRow}>
              <View style={styles.phoneSelect}>
                <Text style={styles.phoneSelectText}>WhatsApp</Text>
              </View>
              <TextInput
                value={phoneDdd}
                onChangeText={setPhoneDdd}
                placeholder="DDD"
                placeholderTextColor="#cbd5e1"
                style={[styles.textInput, styles.dddInput]}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Número"
                placeholderTextColor="#cbd5e1"
                style={[styles.textInput, styles.numInput]}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.trashButton}>
                <Trash2 size={18} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTÕES DE AÇÃO */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => alert('Perfil atualizado!')}
            >
              <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* TAB BAR FIXA */}
        <TabBar />

      </View>
    </KeyboardAvoidingView>
  );
}