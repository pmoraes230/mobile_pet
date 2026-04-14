import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../style/responsavelloginstyle';
import { login, setupAxiosInterceptors } from '../services/auth';

export default function ResponsavelLogin() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados do Modal Customizado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error'); // 'error' ou 'success'

  const showCustomAlert = (title, message, type = 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showCustomAlert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    setLoading(true);

    try {
      await login(email, senha);
      setupAxiosInterceptors();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err) {
      const mensagem = err.response?.data?.message || 
                      err.message || 
                      'Email ou senha incorretos';
      showCustomAlert('Falha no Login', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image
        source={require('../assets/pet.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>BEM VINDO!</Text>
      <Text style={styles.subtitulo}>
        Insira o e-mail e a senha cadastrados.
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity>
        <Text style={styles.esqueci}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botao} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.textoBotao}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Ainda Não tem uma conta ?{' '}
        <Text 
          style={{ color: '#F4C542' }}
          onPress={() => navigation.navigate('Cadastro')}
        >
          Criar Conta
        </Text>
      </Text>

      {/* ==================== MODAL CUSTOMIZADO ==================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalTitle}
            </Text>
            
            <Text style={styles.modalMessage}>
              {modalMessage}
            </Text>

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
  );
}
