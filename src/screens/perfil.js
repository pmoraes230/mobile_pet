import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/perfilstyle';
import { Mail, Phone, MapPin, ShieldCheck, PawPrint, Edit } from 'lucide-react-native';

export default function Perfil() {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileTopCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Luiza Ferreira</Text>
              <View style={styles.tagRow}>
                <Text style={styles.profileTag}>TUTOR PRIME</Text>
              </View>
              <Text style={styles.memberText}>Membro Ativo</Text>
              <View style={styles.contactRow}>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#8b5cf6" />
                  <Text style={styles.contactText}>luiza@gmail.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#8b5cf6" />
                  <Text style={styles.contactText}>Não informado</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={() => navigation.navigate('EditarPerfil')}>
            <Edit size={16} color="#fff" />
            <Text style={styles.editButtonText}>EDITAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={18} color="#7c3aed" />
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
              <Text style={styles.detailValue}>we 33 - 1021</Text>
            </View>
          </View>

          <View style={styles.card}> 
            <View style={styles.sectionHeader}>
              <View style={styles.iconCirclePet}>
                <PawPrint size={18} color="#0f766e" />
              </View>
              <Text style={styles.cardTitle}>Meus Pets</Text>
            </View>
            <View style={styles.petItem}>
              <View style={styles.petAvatar}>
                <Text style={styles.petInitial}>M</Text>
              </View>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>Missy</Text>
                <Text style={styles.petBreed}>Preta</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8} onPress={() => navigation.navigate('MeusPets')}>
              <Text style={styles.viewAllText}>VER TODOS →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={18} color="#f97316" />
            </View>
            <Text style={styles.cardTitle}>Privacidade e Acesso</Text>
          </View>
          <Text style={styles.bottomText}>Gerencie o seu acesso, senha e segurança da conta.</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>ALTERAR SENHA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleLogout}>
              <Text style={styles.primaryButtonText}>DESCONECTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
