import React, { useState } from 'react';
import {
  View, Text, Image, TextInput,
  TouchableOpacity, Modal,
  KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { login, setupAxiosInterceptors } from '../../services/auth';

export default function ResponsavelLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showCustomModal('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      setupAxiosInterceptors();
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      showCustomModal('Falha no login', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.screenContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image
            source={require('../../assets/pet.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.titulo}>Bem vindo!</Text>
          <Text style={styles.subtitulo}>
            Acesse sua conta e gerencie seus pets com facilidade.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#A0A7E6"
            secureTextEntry
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
            <Text style={styles.esqueci}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Ainda não tem uma conta?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Cadastro')}
            >
              Criar conta
            </Text>
          </Text>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <Text style={styles.modalMessage}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}