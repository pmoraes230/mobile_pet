import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashApp} />
        <Stack.Screen name="Login" component={ResponsavelLogin} />
        <Stack.Screen name="Cadastro" component={ResponsavelCadastro} />
        <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
        <Stack.Screen name="CodigoSenha" component={CodigoSenha} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
        <Stack.Screen name="Agendamento" component={TelaAgendamento} />
        <Stack.Screen name="Diario" component={TelaDiario} />
        <Stack.Screen name="MeusPets" component={TelaMeusPets} />
        <Stack.Screen name="detalhespet" component={detalhespet} />
        <Stack.Screen name="Prontuario" component={TelaProntuario} />
        <Stack.Screen name="Cupidopet" component={TinderPet} />
        <Stack.Screen name="PetDetail" component={PetDetail} />
        <Stack.Screen name="Adocao" component={TelaAdocao} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="Home" component={TelaInicial} />
        <Stack.Screen name="Mensagens" component={Mensagens} />
        <Stack.Screen name="Configuracoes" component={Configuracoes} />
        <Stack.Screen name="ChatPrivado" component={ChatPrivado} />
        <Stack.Screen name="novoagendamento" component={novoagendamento} />
        <Stack.Screen name="anunciarpet" component={anunciarpet} />
        <Stack.Screen name="NotificacoesGerais" component={NotificacoesGerais} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}