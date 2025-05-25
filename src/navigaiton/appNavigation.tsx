import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Form from "../screens/Form";
import Users from "../screens/Users"
import Roullete from "../screens/Roullete";
import { Provider as TinybaseProvider } from "tinybase/ui-react";

// Defina os nomes das rotas e seus parâmetros (aqui não há parâmetros para simplificar)
export type RootStackParamList = {
  Home: undefined;
  Form: undefined;
  Users: undefined;
  Roullete: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <TinybaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ contentStyle: { padding: 8 } }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Roullete"
            component={Roullete}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Users"
            component={Users}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TinybaseProvider>
  );
}

export default AppNavigator;
