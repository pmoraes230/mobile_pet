import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResponsavelLogin from "./src/pages/ResponsavelLogin/ResponsavelLogin";
import ResponsavelCadastro from "./src/pages/ResponsavelCadastro/ResponsavelCadastro";
import SplashApp from "./src/pages/SplashApp/SplashApp";
import TelaInicial from "./src/pages/TelaInicial/TelaInicial";
import Mensagens from "./src/pages/Mensagens/Mensagens";
import TelaAgendamento from "./src/pages/Agendamento/Agendamento";
import TelaDiario from "./src/pages/Diario/Diario";
import TelaMeusPets from "./src/pages/MeusPets/MeusPets";
import TelaProntuario from "./src/pages/Prontuario/Prontuario";
import TinderPet from "./src/pages/CupidoPet/CupidoPet";
import TelaAdocao from "./src/pages/Adocao/Adocao";
import Configuracoes from "./src/pages/Configuracoes/Configuracoes";
import Perfil from "./src/pages/Perfil/Perfil";
import EditarPerfil from "./src/pages/EditarPerfil/EditarPerfil";
import PetDetail from "./src/pages/PetDetail/PetDetail";
import detalhespet from "./src/pages/DetalhesPet/DetalhesPet";
import ChatPrivado from "./src/pages/ChatPrivado/ChatPrivado";
import novoagendamento from "./src/pages/NovoAgendamento/NovoAgendamento";
import anunciarpet from "./src/pages/AnunciarPet/AnunciarPet";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashApp} />
        <Stack.Screen name="Login" component={ResponsavelLogin} />
        <Stack.Screen name="Cadastro" component={ResponsavelCadastro} />
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
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}