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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/mensagensstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

const INITIAL_CONVERSAS = [
  {
    id: '1',
    name: 'Dr(a). rayan rodrigues',
    subtitle: 'Veterinário',
    avatar: require('../assets/pet.png'),
  },
  {
    id: '2',
    name: 'Assistência',
    subtitle: 'Suporte 24h',
    avatar: require('../assets/pet.png'),
  },
];

export default function Mensagens() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [conversas, setConversas] = useState(INITIAL_CONVERSAS);
  const [mensagem, setMensagem] = useState('');

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    const novaMensagem = {
      id: `${Date.now()}`,
      name: 'Você',
      subtitle: mensagem.trim(),
      avatar: require('../assets/pet.png'),
    };

    setConversas([novaMensagem, ...conversas]);
    setMensagem('');
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') navigation.navigate('Home');
    if (tabId === 'consultas') alert('Ir para Consultas (não implementado)');
    if (tabId === 'configuracoes') alert('Ir para Configurações (não implementado)');
  };

  const renderConversas = ({ item }) => (
    <View style={styles.conversaCard}>
      <Image source={item.avatar} style={styles.avatar} resizeMode="contain" />
      <View style={styles.conversaInfo}>
        <Text style={styles.conversaNome}>{item.name}</Text>
        <Text style={styles.conversaSubtitulo}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.verPerfilBtn} onPress={() => alert(`Ver perfil de ${item.name}`)}>
        <Text style={styles.verPerfilText}>VER PERFIL</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderHome userName="asafe" />

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Boa tarde, asafe!</Text>
          <Text style={styles.subtitle}>Conversas</Text>
        </View>

        <FlatList
          data={conversas}
          keyExtractor={(item) => item.id}
          renderItem={renderConversas}
          style={styles.lista}
          contentContainerStyle={styles.listaContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>Inicie uma conversa...</Text>}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          <View style={styles.inputBar}>
            <TextInput
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
              <Text style={styles.iconeEnviar}>➡</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
}
