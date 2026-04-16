import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator 
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Mail, Phone, ShieldCheck, PawPrint, Edit3, Lock } from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';
import { searchTutors } from '../../services/searchTutor';

const Perfil = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar os dados do tutor
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchTutors();
      setUserData(data);

    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setError(err.message || "Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados ao abrir a tela
  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

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
        <TouchableOpacity onPress={loadUserData}>
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
        
        {/* HEADER */}
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
          
          {/* CARD PERFIL PRINCIPAL */}
          <View style={styles.profileTopCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={
                    userData?.imagem 
                      ? { uri: userData.imagem } 
                      : require('../../assets/rayan_lindo.webp')
                  }
                  style={styles.avatar}
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.nome || 'Nome não encontrado'}</Text>
                <View style={styles.tagRow}>
                  <Text style={styles.profileTag}>Responsável</Text>
                </View>
                <Text style={styles.memberText}>Membro Ativo</Text>
                
                <View style={styles.contactRow}>
                  <View style={styles.contactItem}>
                    <Mail size={14} color="#9127E1" />
                    <Text style={styles.contactText}>{userData?.email || 'Não informado'}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Phone size={14} color="#9127E1" />
                    <Text style={styles.contactText}>Não informado</Text>
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

          {/* SEÇÕES DE DADOS */}
          <View style={styles.sectionRow}>
            {/* Dados Pessoais */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}>
                  <ShieldCheck size={20} color="#9127E1" />
                </View>
                <Text style={styles.cardTitle}>Dados Pessoais</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Documento CPF</Text>
                <Text style={styles.detailValue}>{userData?.cpf || 'Não informado'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nascimento</Text>
                <Text style={styles.detailValue}>{userData?.dataNascimento || 'Não informado'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Endereço registrado</Text>
                <Text style={styles.detailValue}>{userData?.endereco || 'Não informado'}</Text>
              </View>
            </View>

            {/* Meus Pets */}
            <View style={styles.card}> 
              <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, {backgroundColor: '#E6FFFA'}]}>
                  <PawPrint size={20} color="#00D7C4" />
                </View>
                <Text style={styles.cardTitle}>Meus Pets</Text>
              </View>
              <View style={styles.petItem}>
                <View style={styles.petAvatar}><Text style={styles.petInitial}>M</Text></View>
                <View style={{marginLeft: 12}}>
                  <Text style={{fontWeight: 'bold', color: '#0D214F'}}>Missy</Text>
                  <Text style={{fontSize: 12, color: '#7E869E'}}>Preta</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewAllButton} 
                onPress={() => navigation.navigate('MeusPets')}
              >
                <Text style={styles.viewAllText}>VER TODOS OS PETS →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PRIVACIDADE E ACESSO */}
          <View style={styles.bottomCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, {backgroundColor: '#FFF4EE'}]}>
                <Lock size={20} color="#FF7A2F" />
              </View>
              <Text style={styles.cardTitle}>Privacidade e Acesso</Text>
            </View>
            <Text style={styles.bottomText}>
              Gerencie o seu acesso, senha e segurança da conta.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
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

        {/* TAB BAR */}
        <TabBar onLogout={handleLogout} />

      </View>
    </KeyboardAvoidingView>
  );
};

export default Perfil;