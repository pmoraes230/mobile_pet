import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Send, ChevronLeft, MoreVertical } from 'lucide-react-native';
import { styles } from './styles';

export default function ChatPrivado() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { nome } = route.params || { nome: 'Veterinário' };
  const [msg, setMsg] = useState('');

  const enviarMensagem = () => {
    if (msg.trim().length > 0) {
      // Aqui você pode adicionar a lógica de enviar mensagem real
      setMsg('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* HEADER PERSONALIZADO */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ padding: 5 }}
        >
          <ChevronLeft size={28} color="#0D214F" strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{nome}</Text>
          <View style={styles.onlineRow}>
            <View style={styles.dot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={{ padding: 5 }}>
          <MoreVertical size={22} color="#A0A7BA" />
        </TouchableOpacity>
      </View>

      {/* ÁREA DE MENSAGENS */}
      <ScrollView 
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Balão Recebido */}
        <View style={styles.bubbleReceived}>
          <Text style={styles.textReceived}>
            Olá! Vi o histórico da Missy aqui. Ela tomou a medicação das 08:00 corretamente?
          </Text>
          <Text style={styles.timeText}>14:30</Text>
        </View>

        {/* Balão Enviado */}
        <View style={styles.bubbleSent}>
          <Text style={styles.textSent}>
            Oi Dr! Tomou sim, ela está bem ativa agora à tarde.
          </Text>
          <Text style={styles.timeTextWhite}>14:32</Text>
        </View>
      </ScrollView>

      {/* INPUT FLUTUANTE */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.inputWrapper}
      >
        <View style={styles.inputBar}>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Conversar..."
            placeholderTextColor="#A0A7BA"
            style={styles.input}
            multiline
          />
          <TouchableOpacity 
            style={[styles.btnSend, { opacity: msg.length > 0 ? 1 : 0.6 }]}
            onPress={enviarMensagem}
            disabled={msg.length === 0}
          >
            <Send size={20} color="#FFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}