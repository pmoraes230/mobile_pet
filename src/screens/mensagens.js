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
import { Send } from 'lucide-react-native';

import { styles } from '../style/mensagensstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

const IMG_PADRAO = require('../assets/pet.png'); 

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
    // Lógica de envio aqui (futuramente conectando ao banco)
    setMensagem('');
  };

  const renderConversas = ({ item }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.conversaCard} 
      activeOpacity={0.7} 
      onPress={() => setChatAtivo(item)} 
    >
      <Image source={item.avatar} style={styles.avatar} />
      
      <View style={styles.conversaInfo}>
        <Text style={styles.conversaNome}>{item.name}</Text>
        <Text style={styles.conversaSubtitulo} numberOfLines={1}>{item.subtitle}</Text>
      </View>

      <View style={styles.verPerfilBtn}>
        <Text style={styles.verPerfilText}>CHAT</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER DINÂMICO */}
        <HeaderHome 
          userName={chatAtivo ? chatAtivo.name : "Asafe"} 
          showSearch={false} 
          showBackButton={true} 
          showGreeting={false} 
          onBackPress={chatAtivo ? () => setChatAtivo(null) : () => navigation.goBack()} 
        />

        {!chatAtivo ? (
          /* --- VISÃO 1: LISTA DE CONVERSAS --- */
          <View style={{ flex: 1 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.title}>Mensagens</Text>
              <Text style={styles.subtitle}>Fale com nossos profissionais</Text>
            </View>

            <FlatList
              data={INITIAL_CONVERSAS}
              keyExtractor={(item) => item.id}
              renderItem={renderConversas}
              contentContainerStyle={styles.listaContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          /* --- VISÃO 2: CHAT ABERTO --- */
          <View style={{ flex: 1 }}>
            <ScrollView 
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Balão de exemplo */}
              <View style={{ 
                alignSelf: 'flex-start', 
                backgroundColor: '#FFF', 
                padding: 15, 
                borderRadius: 20, 
                borderBottomLeftRadius: 5,
                elevation: 2,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 5,
                maxWidth: '85%' 
              }}>
                <Text style={{ color: '#4A5568', fontSize: 15 }}>
                  Olá! Como posso ajudar você e seu pet hoje?
                </Text>
              </View>
            </ScrollView>

            {/* BARRA DE INPUT */}
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
          </View>
        )}

        {/* TAB BAR (SÓ APARECE NA LISTA) */}
        {!chatAtivo && (
          <TabBar 
            activeTab="mensagens" 
            onTabPress={(id) => navigation.navigate(id === 'home' ? 'Home' : id)} 
          />
        )}
      </View>
    </SafeAreaView>
  );
}