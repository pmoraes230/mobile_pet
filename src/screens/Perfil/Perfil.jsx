import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Phone, ShieldCheck, PawPrint, Edit3, Lock, LogOut } from 'lucide-react-native';

import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { styles } from './styles';

const TUTOR_IMAGE = require('../../assets/rayan_lindo.webp');

export default function Perfil() {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        
        {/* HEADER FIXO */}
        <HeaderHome 
          userName="Luiza Ferreira" 
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
                  source={TUTOR_IMAGE}
                  style={styles.avatar}
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Rayan Rodrigues</Text>
                <View style={styles.tagRow}>
                  <Text style={styles.profileTag}>Responsavel</Text>
                </View>
                <Text style={styles.memberText}>Membro Ativo</Text>
                <View style={styles.contactRow}>
                  <View style={styles.contactItem}>
                    <Mail size={14} color="#9127E1" />
                    <Text style={styles.contactText}>Rayan@gmail.com</Text>
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
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}>
                  <ShieldCheck size={20} color="#9127E1" />
                </View>
                <Text style={styles.cardTitle}>Dados Pessoais</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Documento CPF</Text>
                <Text style={styles.detailValue}>803.863.360-16</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nascimento</Text>
                <Text style={styles.detailValue}>17/02/2000</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Endereço registrado</Text>
                <Text style={styles.detailValue}>WE 33 - 1021</Text>
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

          {/* PRIVACIDADE */}
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

        {/* TAB BAR FIXA NA BASE */}
        <TabBar onLogout={handleLogout} />

      </View>
    </KeyboardAvoidingView>
  );
}