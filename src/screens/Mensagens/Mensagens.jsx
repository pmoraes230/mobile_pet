import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageSquare } from 'lucide-react-native'; // Ícone sugestivo

import { styles as originalStyles } from './styles'; // Mantendo os estilos originais para o container
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Mensagens() {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={originalStyles.container}>
      {/* Header padrão para manter a identidade visual */}
      <HeaderHome
        userName="Pet Coração"
        showSearch={false}
        showBackButton={true}
        showGreeting={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={localStyles.centeredContent}>
        <View style={localStyles.iconContainer}>
          <MessageSquare size={64} color="#A0A7BA" strokeWidth={1.5} />
        </View>
        
        <Text style={localStyles.title}>
          {t('Em Breve')}
        </Text>
        
        <Text style={localStyles.subtitle}>
          {t('Estamos trabalhando para trazer a melhor experiência de conversa para você e seu pet.')}
        </Text>
      </View>

      {/* Mantém a TabBar para que o usuário possa navegar para outras telas */}
      <TabBar activeTab="mensagens" />
    </View>
  );
}

const localStyles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    // O background transparente ou dinâmico aqui ajuda no modo escuro 
    // se o originalStyles.container já lidar com isso
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: '#F7FAFC', // Ajuste para uma cor que combine com seu modo claro/escuro
    padding: 24,
    borderRadius: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748', // No modo escuro real, você usaria uma cor dinâmica aqui
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
});

/* 
CÓDIGO ORIGINAL COMENTADO PARA REFERÊNCIA FUTURA:

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';

import { styles } from './styles';
import ConversationCard from '../../components/ConversationCard';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { useLanguage } from '../../i18n/LanguageContext';

const IMG_PADRAO = require('../../assets/pet.png');

const INITIAL_CONVERSAS = [
  { id: '1', name: 'Dr(a). Rayan Rodrigues', subtitle: 'Veterinário - Online', avatar: IMG_PADRAO },
  { id: '2', name: 'Assistência Coração', subtitle: 'Suporte 24h', avatar: IMG_PADRAO },
];

export default function Mensagens() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
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
      subtitle={t(item.subtitle)}
      onPress={() => setChatAtivo(item)}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <HeaderHome
          userName={chatAtivo ? chatAtivo.name : 'Rayan'}
          showSearch={false}
          showBackButton={true}
          showGreeting={false}
          onBackPress={chatAtivo ? () => setChatAtivo(null) : () => navigation.goBack()}
        />

        <View style={styles.chatContainer}>
          {!chatAtivo ? (
            <FlatList
              data={INITIAL_CONVERSAS}
              keyExtractor={(item) => item.id}
              renderItem={renderConversas}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom, 16) + 12 },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <Text style={styles.title}>{t('Mensagens')}</Text>
                  <Text style={styles.subtitle}>{t('Fale com nossos profissionais')}</Text>
                </View>
              }
            />
          ) : (
            <>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingBottom: 12 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.messageReceived}>
                  <Text style={{ color: '#4A5568', fontSize: 15, lineHeight: 21 }}>
                    {t('Olá! Como posso ajudar você e seu pet hoje?')}
                  </Text>
                </View>
              </ScrollView>

              <View style={[styles.chatFooter, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
                <View style={styles.inputBar}>
                  <TextInput
                    value={mensagem}
                    onChangeText={setMensagem}
                    placeholder={t('Digite sua mensagem...')}
                    placeholderTextColor="#A0A7BA"
                    style={styles.input}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.botaoEnviar}
                    onPress={enviarMensagem}
                    accessibilityRole="button"
                    accessibilityLabel={t('Enviar mensagem')}
                  >
                    <Send size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {!chatAtivo && <TabBar activeTab="mensagens" />}
    </KeyboardAvoidingView>
  );
}
*/