import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginApp from "./src/screens/loginApp";
import SplashApp from "./src/screens/spleshApp";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashApp} />
        <Stack.Screen name="Login" component={LoginApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}