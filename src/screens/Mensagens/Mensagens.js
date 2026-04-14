import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Send, ChevronLeft } from 'lucide-react-native';

import { styles } from './styles';
import ConversationCard from '../../components/ConversationCard';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';

const IMG_PADRAO = require('../../assets/pet.png'); 

const INITIAL_CONVERSAS = [
  { id: '1', name: 'Dr(a). Rayan Rodrigues', subtitle: 'Veterinário - Online', avatar: IMG_PADRAO },
  { id: '2', name: 'Assistência Coração', subtitle: 'Suporte 24h', avatar: IMG_PADRAO },
];

export default function Mensagens() {
  const navigation = useNavigation();
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;
    setMensagem('');
  };

  const renderConversas = ({ item }) => (
    <ConversationCard
      avatar={item.avatar}
      name={item.name}
      subtitle={item.subtitle}
      onPress={() => setChatAtivo(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER FIXO - Fora do Scroll para não bugar o espaçamento */}
      <HeaderHome 
        userName={chatAtivo ? chatAtivo.name : "Rayan"} 
        showSearch={false} 
        showBackButton={true} 
        showGreeting={false} 
        onBackPress={chatAtivo ? () => setChatAtivo(null) : () => navigation.goBack()} 
      />

      <View style={styles.container}>
        {!chatAtivo ? (
          /* --- VISÃO 1: LISTA DE CONVERSAS --- */
          <FlatList
            data={INITIAL_CONVERSAS}
            keyExtractor={(item) => item.id}
            renderItem={renderConversas}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>Mensagens</Text>
                <Text style={styles.subtitle}>Fale com nossos profissionais</Text>
              </View>
            }
          />
        ) : (
          /* --- VISÃO 2: CHAT ABERTO --- */
          <>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.messageReceived}>
                <Text style={{ color: '#4A5568', fontSize: 15 }}>
                  Olá! Como posso ajudar você e seu pet hoje?
                </Text>
              </View>
            </ScrollView>

            {/* BARRA DE INPUT FLUTUANTE */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              style={styles.inputWrapper}
            >
              <View style={styles.inputBar}>
                <TextInput
                  value={mensagem}
                  onChangeText={setMensagem}
                  placeholder="Digite sua mensagem..."
                  placeholderTextColor="#A0A7BA"
                  style={styles.input}
                />
                <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
                  <Send size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </View>

      {/* TAB BAR (SUMIR NO CHAT PARA DAR MAIS ESPAÇO) */}
      {!chatAtivo && <TabBar activeTab="mensagens" />}
      
    </SafeAreaView>
  );
}