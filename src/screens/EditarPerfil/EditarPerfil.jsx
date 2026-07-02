import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Camera, Phone, Smile, Plus, Trash2 } from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { searchTutors } from '../../services/searchTutor';
import { consumerCPF } from '../../services/consumerCPF';
import { getUserInfo } from '../../services/auth';
import {
  getCurrentTutorContacts,
  normalizeTutorImage,
  updateCurrentTutorContacts,
  updateCurrentTutorProfile,
} from '../../services/tutorProfile';
import { uploadTutorPhoto } from '../../services/uploadImages';
import { formateCPF } from '../../utils/formatters';
import { useLanguage } from '../../i18n/LanguageContext';

export default function EditarPerfil() {
  const navigation = useNavigation();
  const { t } = useLanguage();

  const emptyPhone = { tipoContato: 'WhatsApp', ddd: '', numero: '' };
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phones, setPhones] = useState([emptyPhone]);
  const [userData, setUserData] = useState(null);
  const [imageUser, setImageUser] = useState(null);
  const [cpfData, setCpfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);

  const handleData = (res) => {
    if (!res) return null;
    return Array.isArray(res) ? res[0] : res;
  };

  const splitPhone = (value = '') => {
    const digits = String(value).replace(/\D/g, '');

    if (digits.length >= 10) {
      return {
        tipoContato: 'WhatsApp',
        ddd: digits.substring(0, 2),
        numero: digits.substring(2),
      };
    }

    return { tipoContato: 'WhatsApp', ddd: '', numero: digits };
  };

  const normalizeLoadedPhones = (contacts = [], fallbackPhone = '') => {
    const fromContacts = contacts
      .slice(0, 2)
      .map((contact) => ({
        tipoContato: contact.tipoContato || contact.TIPO_CONTATO || 'WhatsApp',
        ddd: String(contact.ddd || contact.DDD || '').replace(/\D/g, '').slice(0, 2),
        numero: String(contact.numero || contact.NUMERO || '').replace(/\D/g, '').slice(0, 9),
      }))
      .filter((contact) => contact.ddd || contact.numero);

    if (fromContacts.length > 0) return fromContacts;

    const fallback = splitPhone(fallbackPhone);
    return fallback.ddd || fallback.numero ? [fallback] : [emptyPhone];
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userRes, cpfRes, imageRes, contactsRes] = await Promise.all([
        searchTutors(),
        consumerCPF(),
        getUserInfo(),
        getCurrentTutorContacts().catch(() => []),
      ]);

      const user = handleData(userRes);
      const cpf = handleData(cpfRes);
      const image = handleData(imageRes);

      setUserData(user);
      setCpfData(cpf);
      setImageUser(image);
      setName(user?.nome || user?.nome_tutor || '');
      setAddress(user?.endereco || user?.ENDERECO || '');
      setPhones(normalizeLoadedPhones(contactsRes, user?.telefone || user?.TELEFONE || ''));
    } catch (err) {
      console.error(err);
      setError(t('Erro ao carregar dados para edição.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handlePickProfileImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(t('Permissão necessária'), t('Permita acesso à galeria para alterar a foto.'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const uri = result.assets[0].uri;
      const tutorId = userData?.id || imageUser?.id;

      if (!tutorId) {
        Alert.alert(t('Erro'), t('Não foi possível identificar seu usuário.'));
        return;
      }

      setUploadingPhoto(true);
      setImageUser((current) => ({ ...current, imagem: uri }));

      const updatedTutor = await uploadTutorPhoto(tutorId, uri);
      const nextImage = normalizeTutorImage(
        updatedTutor?.imagemPerfil || updatedTutor?.imagem_perfil_tutor || uri
      );

      setImageUser((current) => ({ ...current, imagem: nextImage || uri }));
      setUserData((current) => ({
        ...current,
        imagemPerfil: updatedTutor?.imagemPerfil || current?.imagemPerfil,
        imagem_perfil_tutor: updatedTutor?.imagem_perfil_tutor || current?.imagem_perfil_tutor,
      }));
      Alert.alert(t('Sucesso'), t('Foto de perfil atualizada!'));
    } catch (err) {
      console.error(err);
      Alert.alert(t('Erro'), err?.message || t('Não foi possível alterar a foto.'));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updatePhoneField = (index, field, value) => {
    const sanitizedValue = field === 'tipoContato'
      ? value
      : String(value).replace(/\D/g, '').slice(0, field === 'ddd' ? 2 : 9);

    setPhones((current) => current.map((phone, phoneIndex) => (
      phoneIndex === index ? { ...phone, [field]: sanitizedValue } : phone
    )));
  };

  const handleAddPhone = () => {
    if (phones.length >= 2) {
      Alert.alert(t('Limite atingido'), t('Você pode cadastrar no máximo 2 telefones.'));
      return;
    }

    setPhones((current) => [...current, { ...emptyPhone }]);
  };

  const handleRemovePhone = (index) => {
    setPhones((current) => {
      const nextPhones = current.filter((_, phoneIndex) => phoneIndex !== index);
      return nextPhones.length > 0 ? nextPhones : [{ ...emptyPhone }];
    });
  };

  const handleSaveProfile = async () => {
    const cleanName = name.trim();
    const cleanAddress = address.trim();
    const validPhones = phones
      .map((phone) => ({
        tipoContato: phone.tipoContato || 'WhatsApp',
        ddd: String(phone.ddd || '').replace(/\D/g, ''),
        numero: String(phone.numero || '').replace(/\D/g, ''),
      }))
      .filter((phone) => phone.ddd || phone.numero);
    const cleanPhone = validPhones[0] ? `${validPhones[0].ddd}${validPhones[0].numero}` : '';

    if (!cleanName) {
      Alert.alert(t('Preencha os campos'), t('Informe seu nome.'));
      return;
    }

    if (validPhones.length > 2) {
      Alert.alert(t('Limite atingido'), t('Você pode cadastrar no máximo 2 telefones.'));
      return;
    }

    for (const phone of validPhones) {
      if (phone.ddd.length !== 2 || phone.numero.length < 8) {
        Alert.alert(t('Telefone inválido'), t('Informe telefones válidos com DDD.'));
        return;
      }
    }

    const uniquePhones = new Set(validPhones.map((phone) => `${phone.ddd}${phone.numero}`));

    if (uniquePhones.size !== validPhones.length) {
      Alert.alert(t('Telefone repetido'), t('Os telefones precisam ser diferentes.'));
      return;
    }

    try {
      setSaving(true);

      const updatedTutor = await updateCurrentTutorProfile({
        nome: cleanName,
        endereco: cleanAddress,
        telefone: cleanPhone,
      });
      const updatedContacts = await updateCurrentTutorContacts(validPhones);

      setUserData(updatedTutor);
      setPhones(normalizeLoadedPhones(updatedContacts, cleanPhone));
      Alert.alert(t('Sucesso'), t('Perfil atualizado!'));
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert(t('Erro'), err?.message || t('Não foi possível atualizar o perfil.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#9127E1" />
        <Text style={{ marginTop: 15, color: '#666' }}>{t('Carregando dados...')}</Text>
      </View>
    );
  }

  const fotoPerfil = imageUser?.imagem || userData?.imagemPerfil || userData?.imagem_perfil_tutor
    ? { uri: normalizeTutorImage(imageUser?.imagem || userData?.imagemPerfil || userData?.imagem_perfil_tutor) }
    : require('../../assets/user_default.png');

  const cpfExibir = cpfData?.cpf || cpfData?.CPF || userData?.cpf || userData?.CPF || '';

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
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>{t('Editar meu perfil')}</Text>
            <Text style={styles.pageSubtitle}>{t('Mantenha seus dados e contatos atualizados')}</Text>
          </View>

          <View style={styles.photoCard}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              activeOpacity={0.9}
              onPress={handlePickProfileImage}
              disabled={uploadingPhoto}
              accessibilityRole="button"
              accessibilityLabel={t('Alterar foto de perfil')}
            >
              <Image source={fotoPerfil} style={styles.avatar} />
              <View style={styles.cameraBadge}>
                {uploadingPhoto ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Camera size={16} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.photoTitle}>{t('FOTO DE PERFIL')}</Text>
            <Text style={styles.photoSubtitle}>{t('Clique para alterar a imagem')}</Text>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconBadge}>
                <Smile size={20} color="#9127E1" />
              </View>
              <Text style={styles.sectionTitle}>{t('Dados Pessoais')}</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{t('Nome Completo')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.textInput}
                placeholder={t('Seu nome')}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{t('CPF (não editável)')}</Text>
              <TextInput
                value={formateCPF(cpfExibir)}
                editable={false}
                style={[styles.textInput, styles.disabledInput]}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{t('Endereço Residencial')}</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                style={styles.textInput}
                placeholder={t('Seu endereço')}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBadge, { backgroundColor: '#E6FFFA' }]}>
                <Phone size={20} color="#00D7C4" />
              </View>
              <Text style={styles.sectionTitle}>{t('Meus Telefones')}</Text>
            </View>

            <TouchableOpacity
              style={[styles.newContactButton, phones.length >= 2 && styles.newContactButtonDisabled]}
              onPress={handleAddPhone}
              disabled={phones.length >= 2}
            >
              <Plus size={14} color="#9127E1" />
              <Text style={styles.newContactText}>{t('NOVO CONTATO')}</Text>
            </TouchableOpacity>
            <Text style={styles.contactLimitText}>{t('{{count}}/2 telefones cadastrados', { count: phones.length })}</Text>

            {phones.map((phone, index) => (
              <View style={styles.phoneCard} key={`phone-${index}`}>
                <View style={styles.phoneSelect}>
                  <Text style={styles.phoneSelectText}>WhatsApp {index + 1}</Text>
                </View>
                <TextInput
                  value={phone.ddd}
                  onChangeText={(value) => updatePhoneField(index, 'ddd', value)}
                  placeholder="DDD"
                  placeholderTextColor="#cbd5e1"
                  style={[styles.textInput, styles.dddInput]}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  value={phone.numero}
                  onChangeText={(value) => updatePhoneField(index, 'numero', value)}
                  placeholder={t('Número')}
                  placeholderTextColor="#cbd5e1"
                  style={[styles.textInput, styles.phoneNumberInput]}
                  keyboardType="numeric"
                  maxLength={9}
                />
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={() => handleRemovePhone(index)}
                >
                  <Trash2 size={18} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelText}>{t('CANCELAR')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveText}>{t('SALVAR ALTERAÇÕES')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabBar />
      </View>
    </KeyboardAvoidingView>
  );
}

