import React, { useEffect } from 'react';
import { createNavigationContainerRef, DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'expo-status-bar';

import { setupAxiosInterceptors } from './src/services/auth';

import ResponsavelLogin from './src/screens/ResponsavelLogin/ResponsavelLogin';
import ResponsavelCadastro from './src/screens/ResponsavelCadastro/ResponsavelCadastro';
import SplashApp from './src/screens/SplashApp/SplashApp';
import TelaInicial from './src/screens/TelaInicial/TelaInicial';
import Mensagens from './src/screens/Mensagens/Mensagens';
import TelaAgendamento from './src/screens/Agendamento/Agendamento';
import TelaDiario from './src/screens/Diario/Diario';
import TelaMeusPets from './src/screens/MeusPets/MeusPets';
import TelaProntuario from './src/screens/Prontuario/Prontuario';
import TinderPet from './src/screens/CupidoPet/CupidoPet';
import TelaAdocao from './src/screens/Adocao/Adocao';
import Configuracoes from './src/screens/Configuracoes/Configuracoes';
import Perfil from './src/screens/Perfil/Perfil';
import EditarPerfil from './src/screens/EditarPerfil/EditarPerfil';
import PetDetail from './src/screens/PetDetail/PetDetail';
import detalhespet from './src/screens/DetalhesPet/DetalhesPet';
import ChatPrivado from './src/screens/ChatPrivado/ChatPrivado';
import novoagendamento from './src/screens/NovoAgendamento/NovoAgendamento';
import anunciarpet from './src/screens/AnunciarPet/AnunciarPet';
import EsqueciSenha from './src/screens/EsqueciSenha/EsqueciSenha';
import CodigoSenha from './src/screens/CodigoSenha/CodigoSenha';
import RedefinirSenha from './src/screens/RedefinirSenha/RedefinirSenha';
import NotificacoesGerais from './src/screens/NotificacoesGerais/notificacoesgerais';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { AppAlertProvider } from './src/components/AppAlert';
import {
  addNotificationResponseListener,
  getLastNotificationResponseAsync,
} from './src/services/pushNotifications';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

function withThemeRefresh(ScreenComponent) {
  return function ThemeAwareScreen(props) {
    const { themeVersion } = useAppTheme();
    return <ScreenComponent {...props} themeVersion={themeVersion} />;
  };
}

const ScreenSplashApp = withThemeRefresh(SplashApp);
const ScreenResponsavelLogin = withThemeRefresh(ResponsavelLogin);
const ScreenResponsavelCadastro = withThemeRefresh(ResponsavelCadastro);
const ScreenEsqueciSenha = withThemeRefresh(EsqueciSenha);
const ScreenCodigoSenha = withThemeRefresh(CodigoSenha);
const ScreenRedefinirSenha = withThemeRefresh(RedefinirSenha);
const ScreenAgendamento = withThemeRefresh(TelaAgendamento);
const ScreenDiario = withThemeRefresh(TelaDiario);
const ScreenMeusPets = withThemeRefresh(TelaMeusPets);
const ScreenDetalhesPet = withThemeRefresh(detalhespet);
const ScreenProntuario = withThemeRefresh(TelaProntuario);
const ScreenCupidoPet = withThemeRefresh(TinderPet);
const ScreenPetDetail = withThemeRefresh(PetDetail);
const ScreenAdocao = withThemeRefresh(TelaAdocao);
const ScreenPerfil = withThemeRefresh(Perfil);
const ScreenEditarPerfil = withThemeRefresh(EditarPerfil);
const ScreenHome = withThemeRefresh(TelaInicial);
const ScreenMensagens = withThemeRefresh(Mensagens);
const ScreenConfiguracoes = withThemeRefresh(Configuracoes);
const ScreenChatPrivado = withThemeRefresh(ChatPrivado);
const ScreenNovoAgendamento = withThemeRefresh(novoagendamento);
const ScreenAnunciarPet = withThemeRefresh(anunciarpet);
const ScreenNotificacoesGerais = withThemeRefresh(NotificacoesGerais);

const lightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9127E1',
    background: '#F8F9FD',
    card: '#FFFFFF',
    text: '#0D214F',
    border: '#E2E8F0',
  },
};

const darkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#B77CFF',
    background: '#0F1020',
    card: '#17182B',
    text: '#F5F7FF',
    border: '#2A2D45',
  },
};

function AppRoutes() {
  const { isDarkMode } = useAppTheme();
  const backgroundColor = isDarkMode ? '#0F1020' : '#F8F9FD';

  const openNotificationsScreen = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('NotificacoesGerais');
    }
  };

  useEffect(() => {
    const subscription = addNotificationResponseListener(() => {
      openNotificationsScreen();
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={backgroundColor} />
      <NavigationContainer
        ref={navigationRef}
        theme={isDarkMode ? darkNavigationTheme : lightNavigationTheme}
        onReady={async () => {
          const response = await getLastNotificationResponseAsync();
          if (response) {
            openNotificationsScreen();
          }
        }}
      >
        <Stack.Navigator
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }}
        >
          <Stack.Screen name="Splash" component={ScreenSplashApp} />
          <Stack.Screen name="Login" component={ScreenResponsavelLogin} />
          <Stack.Screen name="Cadastro" component={ScreenResponsavelCadastro} />
          <Stack.Screen name="EsqueciSenha" component={ScreenEsqueciSenha} />
          <Stack.Screen name="CodigoSenha" component={ScreenCodigoSenha} />
          <Stack.Screen name="RedefinirSenha" component={ScreenRedefinirSenha} />
          <Stack.Screen name="Agendamento" component={ScreenAgendamento} />
          <Stack.Screen name="Diario" component={ScreenDiario} />
          <Stack.Screen name="MeusPets" component={ScreenMeusPets} />
          <Stack.Screen name="detalhespet" component={ScreenDetalhesPet} />
          <Stack.Screen name="Prontuario" component={ScreenProntuario} />
          <Stack.Screen name="Cupidopet" component={ScreenCupidoPet} />
          <Stack.Screen name="PetDetail" component={ScreenPetDetail} />
          <Stack.Screen name="Adocao" component={ScreenAdocao} />
          <Stack.Screen name="Perfil" component={ScreenPerfil} />
          <Stack.Screen name="EditarPerfil" component={ScreenEditarPerfil} />
          <Stack.Screen name="Home" component={ScreenHome} />
          <Stack.Screen name="Mensagens" component={ScreenMensagens} />
          <Stack.Screen name="Configuracoes" component={ScreenConfiguracoes} />
          <Stack.Screen name="ChatPrivado" component={ScreenChatPrivado} />
          <Stack.Screen name="novoagendamento" component={ScreenNovoAgendamento} />
          <Stack.Screen name="anunciarpet" component={ScreenAnunciarPet} />
          <Stack.Screen
            name="NotificacoesGerais"
            component={ScreenNotificacoesGerais}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <ThemeProvider>
      <AppAlertProvider>
        <AppRoutes />
      </AppAlertProvider>
    </ThemeProvider>
  );
}
