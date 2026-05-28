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

const IMG_PADRAO = require('../../assets/pet.png');

const INITIAL_CONVERSAS = [
  { id: '1', name: 'Dr(a). Rayan Rodrigues', subtitle: 'Veterinário - Online', avatar: IMG_PADRAO },
  { id: '2', name: 'Assistência Coração', subtitle: 'Suporte 24h', avatar: IMG_PADRAO },
];

export default function Mensagens() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                  <Text style={styles.title}>Mensagens</Text>
                  <Text style={styles.subtitle}>Fale com nossos profissionais</Text>
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
                    Olá! Como posso ajudar você e seu pet hoje?
                  </Text>
                </View>
              </ScrollView>

              <View style={[styles.chatFooter, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
                <View style={styles.inputBar}>
                  <TextInput
                    value={mensagem}
                    onChangeText={setMensagem}
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor="#A0A7BA"
                    style={styles.input}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.botaoEnviar}
                    onPress={enviarMensagem}
                    accessibilityRole="button"
                    accessibilityLabel="Enviar mensagem"
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
