import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';

const NotificacoesGerais = () => {
  const navigation = useNavigation();
  const [showAll, setShowAll] = useState(false);

  const [notificacoes] = useState([
    { id: '1', titulo: 'Nova mensagem', descricao: 'Você recebeu uma nova mensagem do voluntário.', data: '2026-04-10' },
    { id: '2', titulo: 'Adoção aprovada', descricao: 'Parabéns! Sua solicitação de adoção foi aprovada.', data: '2026-04-09' },
    { id: '3', titulo: 'Evento amanhã', descricao: 'Não esqueça do evento de adoção amanhã às 10h.', data: '2026-04-08' },
    { id: '4', titulo: 'Atualização disponível', descricao: 'Uma nova versão do app está disponível na loja.', data: '2026-04-07' },
    { id: '5', titulo: 'Agradecimento', descricao: 'Obrigado por sua doação ao abrigo local.', data: '2026-04-06' },
  ]);

  const previewItems = notificacoes.slice(0, 3);
  const itemsToShow = showAll ? notificacoes : previewItems;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        
        {/* HEADER */}
        <HeaderHome
          showSearch={false}
          showGreeting={false}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.notificacoesArea}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Todas as Notificações</Text>
              <TouchableOpacity
                style={styles.verTudoButton}
                onPress={() => setShowAll(prev => !prev)}
              >
                <Text style={styles.verTudoText}>
                  {showAll ? 'Mostrar menos' : 'Ver tudo'}
                </Text>
              </TouchableOpacity>
            </View>

            {itemsToShow.length > 0 ? (
              itemsToShow.map(item => (
                <View key={item.id} style={styles.notificacaoItem}>
                  <View style={styles.notificacaoRow}>
                    <Text style={styles.notificacaoTitulo}>{item.titulo}</Text>
                    <Text style={styles.notificacaoData}>{item.data}</Text>
                  </View>
                  <Text style={styles.notificacaoDescricao}>{item.descricao}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noNotificacoes}>Nenhuma notificação disponível.</Text>
            )}
          </View>
        </ScrollView>

        {/* TAB BAR */}
        <TabBar />
      </View>
    </KeyboardAvoidingView>
  );
};

export default NotificacoesGerais;