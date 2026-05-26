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
import { consumerCPF } from '../../services/consumerCPF';
import { getUserInfo } from '../../services/auth';
import { formateCPF, formateDate } from '../../utils/formatters';

const Perfil = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [imageUser, setImageUser] = useState(null);
  const [cpfData, setCpfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleData = (res) => {
    if (!res) return null;
    return Array.isArray(res) ? res[0] : res;
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tutorRes, cpfRes, infoRes] = await Promise.all([
        searchTutors(),
        consumerCPF(),
        getUserInfo()
      ]);

      // DEBUG LOG: Se ainda não funcionar, olhe o terminal do seu VSCode e veja o que aparece aqui:
      console.log("DADOS QUE CHEGARAM DO TUTOR:", JSON.stringify(tutorRes, null, 2));

      setUserData(handleData(tutorRes));
      setCpfData(handleData(cpfRes));
      setImageUser(handleData(infoRes));

    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setError("Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#9127E1" />
      </View>
    );
  }

// --- MAPEAMENTO AJUSTADO PARA OS NOMES DA ENTIDADE ---
  
  // No Back-end definimos: this.nome
  const nomeExibir = userData?.nome || 'Nome não encontrado';
  
  // No Back-end definimos: this.email
  const emailExibir = userData?.email || 'Não informado';
  
  const telefoneExibir = userData?.telefone || 'Não informado';
  
  // No Back-end definimos: this.endereco
  const enderecoExibir = userData?.endereco || 'Endereço não informado';
  
  // No Back-end definimos: this.dataNascimento
  const rawNascimento = userData?.dataNascimento;
  
  // CPF (Vem do serviço de CPF ou do userData se estiver lá)
  const cpfBruto = cpfData?.cpf || cpfData?.CPF || userData?.cpf || userData?.CPF;

  // Foto (Ajustada para o caminho do S3 que vimos no seu log)
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  const fotoUrl = userData?.imagemPerfil; // Nome definido na entidade
  
  const fotoPerfil = fotoUrl 
    ? { uri: `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${fotoUrl}` } 
    : { uri: defaultAvatar };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                  <Text style={styles.profileTag}>Responsável</Text>
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

          <View style={styles.bottomCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, {backgroundColor: '#FFF4EE'}]}>
                <Lock size={20} color="#FF7A2F" />
              </View>
              <Text style={styles.cardTitle}>Privacidade e Acesso</Text>
            </View>
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
        <TabBar onLogout={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Perfil;