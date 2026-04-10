import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResponsavelLogin from "./src/screens/responsavellogin";
import ResponsavelCadastro from "./src/screens/responsavelcadastro";
import SplashApp from "./src/screens/spleshApp";
import TelaInicial from "./src/screens/telainicial";
import Mensagens from "./src/screens/mensagens";
import TelaAgendamento from "./src/screens/agendamento";
import TelaDiario from "./src/screens/diario";
import TelaMeusPets from "./src/screens/meuspets";
import TelaProntuario from "./src/screens/prontuario";
import TinderPet from "./src/screens/cupidopet";
import TelaAdocao from "./src/screens/adocao";
import Configuracoes from "./src/screens/configuracoes";
import Perfil from "./src/screens/perfil";
import EditarPerfil from "./src/screens/editarperfil";
import PetDetail from "./src/screens/petDetail";
import detalhespet from "./src/screens/detalhespet";
import ChatPrivado from "./src/screens/chatprivado"; // Crie este arquivo
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
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}