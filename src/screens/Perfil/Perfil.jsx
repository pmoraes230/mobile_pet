import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Mail, Phone, ShieldCheck, PawPrint, Edit3, Lock } from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { useAppTheme } from '../../theme/ThemeContext';
import { searchTutors } from '../../services/searchTutor';
import { consumerCPF } from '../../services/consumerCPF';
import { getPetsByTutor } from '../../services/pet';
import { logout } from '../../services/auth';
import { normalizeTutorImage } from '../../services/tutorProfile';
import { formateCPF, formateDate } from '../../utils/formatters';

const defaultAvatar = require('../../assets/user_default.png');
const defaultPetImage = require('../../assets/default-pet.png');

const Perfil = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();

  const [userData, setUserData] = useState(null);
  const [cpfData, setCpfData] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleData = (res) => {
    if (!res) return null;
    return Array.isArray(res) ? res[0] : res;
  };

  const normalizePets = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.pets)) return res.pets;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  const getPetName = (pet) => pet?.NOME || pet?.nome || pet?.name || 'Pet';
  const getPetBreed = (pet) => pet?.RACA || pet?.raca || pet?.COR || pet?.cor || 'Sem detalhe';
  const getPetImage = (pet) => {
    const rawImage =
      pet?.imagem ||
      pet?.IMAGEM ||
      pet?.foto ||
      pet?.FOTO ||
      pet?.imagemPet ||
      pet?.imagem_pet;

    return normalizeTutorImage(rawImage);
  };

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tutorRes, cpfRes, petsRes] = await Promise.all([
        searchTutors(),
        consumerCPF(),
        getPetsByTutor().catch(() => []),
      ]);

      setUserData(handleData(tutorRes));
      setCpfData(handleData(cpfRes));
      setPets(normalizePets(petsRes));
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [loadAllData])
  );

  const executeLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: executeLogout,
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#0F1020' : '#fff',
        }}
      >
        <ActivityIndicator size="large" color={isDarkMode ? '#B77CFF' : '#9127E1'} />
      </View>
    );
  }

  const nomeExibir = userData?.nome || userData?.nome_tutor || 'Nome não encontrado';
  const emailExibir = userData?.email || userData?.EMAIL || 'Não informado';
  const telefoneExibir = userData?.telefone || userData?.TELEFONE || 'Não informado';
  const enderecoExibir = userData?.endereco || userData?.ENDERECO || 'Endereço não informado';
  const rawNascimento = userData?.dataNascimento || userData?.DATA_NASCIMENTO;
  const cpfBruto = cpfData?.cpf || cpfData?.CPF || userData?.cpf || userData?.CPF;
  const fotoUrl = normalizeTutorImage(userData?.imagemPerfil || userData?.imagem_perfil_tutor);
  const fotoPerfil = fotoUrl ? { uri: fotoUrl } : defaultAvatar;
  const firstPet = pets[0];
  const firstPetImage = getPetImage(firstPet);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
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
          <View style={styles.profileTopCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <Image source={fotoPerfil} style={styles.avatar} />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{nomeExibir}</Text>
                <View style={styles.tagRow}>
                  <Text style={styles.profileTag}>Responsavel</Text>
                </View>
                <Text style={styles.memberText}>Membro Ativo</Text>

                <View style={styles.contactRow}>
                  <View style={styles.contactItem}>
                    <Mail size={14} color="#9127E1" />
                    <Text style={styles.contactText}>{emailExibir}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Phone size={14} color="#9127E1" />
                    <Text style={styles.contactText}>{telefoneExibir}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditarPerfil')}
            >
              <Edit3 size={16} color="#fff" />
              <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}

          <View style={styles.sectionRow}>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}>
                  <ShieldCheck size={20} color="#9127E1" />
                </View>
                <Text style={styles.cardTitle}>Dados Pessoais</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Documento CPF</Text>
                <Text style={styles.detailValue}>
                  {cpfBruto ? formateCPF(cpfBruto) : 'Não informado'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nascimento</Text>
                <Text style={styles.detailValue}>
                  {rawNascimento ? formateDate(rawNascimento) : 'Não informado'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Endereço registrado</Text>
                <Text style={styles.detailValue}>{enderecoExibir}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, { backgroundColor: '#E6FFFA' }]}>
                  <PawPrint size={20} color="#00D7C4" />
                </View>
                <Text style={styles.cardTitle}>Meus Pets</Text>
              </View>

              {firstPet ? (
                <View style={styles.petItem}>
                  <View style={styles.petAvatar}>
                    {firstPetImage ? (
                      <Image
                        source={{ uri: firstPetImage }}
                        style={styles.petAvatarImage}
                      />
                    ) : (
                      <Image
                        source={defaultPetImage}
                        style={styles.petAvatarImage}
                      />
                    )}
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{getPetName(firstPet)}</Text>
                    <Text style={styles.petBreed}>{getPetBreed(firstPet)}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.detailValue}>Nenhum pet cadastrado</Text>
              )}

              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('MeusPets')}
              >
                <Text style={styles.viewAllText}>VER TODOS OS PETS</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF4EE' }]}>
                <Lock size={20} color="#FF7A2F" />
              </View>
              <Text style={styles.cardTitle}>Privacidade e Acesso</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('EsqueciSenha', emailExibir !== 'Não informado' ? { email: emailExibir } : undefined)}
              >
                <Text style={styles.secondaryButtonText}>ALTERAR SENHA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <Text style={styles.primaryButtonText}>SAIR DA CONTA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Perfil;

