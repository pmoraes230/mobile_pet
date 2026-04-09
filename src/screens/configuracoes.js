import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/configuracoesstyle';
import HeaderHome from '../components/Header/HeaderHome';
import TabBar from '../components/TabBar/TabBar';

export default function Configuracoes() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [lembretesVacinas, setLembretesVacinas] = useState(true);
  const [dicasSemanais, setDicasSemanais] = useState(false);

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'mensagens') {
      navigation.navigate('Mensagens');
    }
    if (tabId === 'consultas') {
      alert('Ir para Consultas (não implementado)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderHome
          userName="Pedro"
          showSearch={false}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          showGreeting={true}
          showNotifications={false}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Configurações da Conta</Text>
          <Text style={styles.pageSubtitle}>
            Ajuste seu app do jeito que você prefere.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Idioma</Text>
            <Text style={styles.cardDescription}>Escolha o idioma da plataforma.</Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Português (Brasil)</Text>
              <View style={styles.badgeValue}>
                <Text style={styles.badgeText}>Selecionado</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notificações</Text>
            <Text style={styles.cardDescription}>Gerencie alertas e lembretes.</Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Notificações por e-mail</Text>
                  <Switch
                    value={notificacoesEmail}
                    onValueChange={setNotificacoesEmail}
                    thumbColor={notificacoesEmail ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>Receba notícias e avisos no seu e-mail.</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Lembretes de vacinas</Text>
                  <Switch
                    value={lembretesVacinas}
                    onValueChange={setLembretesVacinas}
                    thumbColor={lembretesVacinas ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>Receba lembretes para as vacinas do seu pet.</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionText}>Dicas semanais de cuidados</Text>
                  <Switch
                    value={dicasSemanais}
                    onValueChange={setDicasSemanais}
                    thumbColor={dicasSemanais ? '#7C3AED' : '#f4f3f4'}
                    trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                  />
                </View>
                <Text style={styles.optionHint}>Receba dicas para cuidar melhor do seu pet.</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Privacidade</Text>
            <Text style={styles.cardDescription}>Controle quem vê seus dados.</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Redefinir minha senha</Text>
            </TouchableOpacity>
            <Text style={styles.comingSoon}>Autenticação 2 Fatores em breve</Text>
          </View>

          <View style={[styles.card, styles.dangerCard]}>
            <Text style={[styles.cardTitle, styles.dangerTitle]}>Desativar conta</Text>
            <Text style={[styles.cardDescription, styles.dangerDescription]}>
              Ao desativar sua conta, você perderá acesso permanente a todos os seus pets, registros e histórico. Essa ação é irreversível.
            </Text>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
              <Text style={styles.actionButtonText}>DESATIVAR MINHA CONTA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabBar activeTab={activeTab} onTabPress={handleTabPress} onLogout={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} />
      </View>
    </SafeAreaView>
  );
}
