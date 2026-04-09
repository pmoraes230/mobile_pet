import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Send, ChevronLeft, MoreVertical } from 'lucide-react-native';
import { styles } from '../style/chatprivadostyle';

export default function ChatPrivado() {
  const navigation = useNavigation();
  const route = useRoute();
  const { nome } = route.params || { nome: 'Veterinário' };
  const [msg, setMsg] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER CUSTOMIZADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#0D214F" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{nome}</Text>
          <Text style={{ fontSize: 12, color: '#00D7C4', marginLeft: 15, fontWeight: 'bold' }}>
            ● Online
          </Text>
        </View>
        <TouchableOpacity>
          <MoreVertical size={20} color="#A0A7BA" />
        </TouchableOpacity>
      </View>

      {/* ÁREA DE MENSAGENS */}
      <ScrollView 
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mensagem Recebida */}
        <View style={styles.bubbleReceived}>
          <Text style={styles.textReceived}>
            Olá Asafe! Vi o prontuário da Missy. Como ela está se comportando hoje?
          </Text>
          <Text style={styles.timeText}>14:30</Text>
        </View>

        {/* Mensagem Enviada (Exemplo) */}
        <View style={styles.bubbleSent}>
          <Text style={styles.textSent}>
            Oi Doutor! Ela está bem melhor, já começou a comer ração seca novamente.
          </Text>
          <Text style={styles.timeTextWhite}>14:32</Text>
        </View>

      </ScrollView>

      {/* INPUT FIXO NO RODAPÉ */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.inputWrapper}
      >
        <View style={styles.inputBar}>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Escreva sua mensagem..."
            placeholderTextColor="#A0A7BA"
            style={styles.input}
            multiline={false}
          />
          <TouchableOpacity 
            style={[styles.btnSend, { opacity: msg.length > 0 ? 1 : 0.6 }]}
            disabled={msg.length === 0}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}