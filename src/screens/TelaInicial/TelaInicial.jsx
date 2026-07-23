import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { Calendar, Clipboard, BookOpen, PawPrint, Heart, Dog } from 'lucide-react-native';
import HeaderHome from '../../components/HeaderHome';
import DashboardCard from '../../components/DashboardCard';
import TabBar from '../../components/TabBar';
import { getAgendaTutor } from '../../services/agendamentoService';
import { useLanguage } from '../../i18n/LanguageContext';

const getAxiosErrorDetails = (error) => ({
  message: error?.message,
  status: error?.response?.status,
  url: error?.config?.url,
  baseURL: error?.config?.baseURL,
  response: error?.response?.data,
});

const normalizarDataHora = (item) => {
  const data = item?.data_consulta || item?.data_aplicacao;
  if (!data) return null;

  const dataHora = new Date(data);
  const hora = item?.horario_consulta;

  if (hora && typeof hora === 'string') {
    const [horas, minutos] = hora.split(':');
    dataHora.setUTCHours(Number(horas) || 0, Number(minutos) || 0, 0, 0);
  }

  return Number.isNaN(dataHora.getTime()) ? null : dataHora;
};

const formatarCompromisso = (compromisso, t, language) => {
  if (!compromisso) {
    return {
      titulo: t('Sem agendamentos'),
      subtitulo: t('Tudo tranquilo por enquanto.'),
    };
  }

  const dataHora = normalizarDataHora(compromisso);
  const data = dataHora
    ? dataHora.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC',
      })
    : t('Data não informada');

  const hora = compromisso.horario_consulta?.slice(0, 5);
  const pet = compromisso.pet?.nome || 'Pet';
  const tipo = compromisso.tipo_de_consulta || compromisso.nome || t('Consulta');

  return {
    titulo: `${tipo} - ${pet}`,
    subtitulo: hora ? `${data} as ${hora}` : data,
  };
};

export default function TelaInicial() {
  const navigation = useNavigation();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [agenda, setAgenda] = useState({ consultas: [], vacinas: [] });
  const [carregandoAgenda, setCarregandoAgenda] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('home');
      let ativo = true;

      const buscarProximoCompromisso = async () => {
        setCarregandoAgenda(true);
        try {
          const dados = await getAgendaTutor();
          if (ativo) setAgenda(dados);
        } catch (error) {
          console.error('Erro ao buscar proximo compromisso:', getAxiosErrorDetails(error));
          if (ativo) setAgenda({ consultas: [], vacinas: [] });
        } finally {
          if (ativo) setCarregandoAgenda(false);
        }
      };

      buscarProximoCompromisso();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const proximoCompromisso = useMemo(() => {
    const agora = new Date();
    const compromissos = [
      ...(agenda.consultas || []),
      ...(agenda.vacinas || []),
    ];

    return compromissos
      .map((item) => ({ item, dataHora: normalizarDataHora(item) }))
      .filter(({ dataHora }) => dataHora && dataHora >= agora)
      .sort((a, b) => a.dataHora - b.dataHora)[0]?.item || null;
  }, [agenda]);

  const cardCompromisso = carregandoAgenda
    ? { titulo: t('Carregando agenda...'), subtitulo: t('Buscando seus proximos compromissos.') }
    : formatarCompromisso(proximoCompromisso, t, language);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleCardPress = (cardId) => {
    switch (cardId) {
      case 1: navigation.navigate('Agendamento'); break;
      case 2: navigation.navigate('Prontuario'); break;
      case 3: navigation.navigate('Diario'); break;
      case 4: navigation.navigate('MeusPets'); break;
      case 5: navigation.navigate('Cupidopet'); break;
      case 6: navigation.navigate('Adocao'); break;
      default: break;
    }
  };

  const cards = [
    { id: 1, title: t('Agendamento'), description: t('Acesse o Agendamento de Consultas.'), icon: Calendar, color: '#E8D5F7' },
    { id: 2, title: t('Prontuário'), description: t('Acesse o prontuário de seus pets.'), icon: Clipboard, color: '#E8D5F7' },
    { id: 3, title: t('Diário emocional'), description: t('Registre o diário.'), icon: BookOpen, color: '#E8D5F7' },
    { id: 4, title: t('Meus pets'), description: t('Acesse seus pets.'), icon: PawPrint, color: '#E8D5F7' },
    { id: 5, title: t('Cupidopet'), description: t('Faça o seu pet encontrar um novo parceiro.'), icon: Heart, color: '#E8D5F7', badge: true },
    { id: 6, title: t('Adoção'), description: t('Adote um pet e dê uma nova chance.'), icon: Dog, color: '#E8D5F7' },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'mensagens') {
      navigation.navigate('Mensagens');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <HeaderHome userName="Rayan" showSearch={false} />

        {/* SCROLL CARDS */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.screenContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* PRÓXIMO COMPROMISSO CARD */}
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>{t('Próximo Compromisso')}</Text>
            <Text style={styles.appointmentMain}>{cardCompromisso.titulo}</Text>
            <Text style={styles.appointmentSubtitle}>{cardCompromisso.subtitulo}</Text>
          </View>

          <View style={styles.gridContainer}>
            {cards.map((card) => (
              <DashboardCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                badge={card.badge}
                onPress={() => handleCardPress(card.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* TAB BAR */}
        <TabBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onLogout={handleLogout}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
