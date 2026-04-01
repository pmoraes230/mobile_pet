import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResponsavelLogin from "./src/screens/responsavellogin";
import ResponsavelCadastro from "./src/screens/responsavelcadastro";
import SplashApp from "./src/screens/spleshApp";
import TelaInicial from "./src/screens/telainicial";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashApp} />
        <Stack.Screen name="Login" component={ResponsavelLogin} />
        <Stack.Screen name="Cadastro" component={ResponsavelCadastro} />
        <Stack.Screen name="Home" component={TelaInicial} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}