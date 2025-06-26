// navigation/AppNavigator.tsx (ou onde quer que esteja seu arquivo)
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Não precisa de NativeStackScreenProps aqui
import Home from "../screens/home/Home";
import Form from "../screens/form/Form";
import Users from "../screens/Users";

import AdminScreen from "../screens/admin"; // Renomeie o import se o nome do arquivo for 'admin.tsx' para evitar confusão com a rota 'admin'
  // Por exemplo, AdminScreen se o arquivo for admin.tsx
  // Se o arquivo for Admin.tsx (com 'A' maiúsculo), então 'Admin' está ok.
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import { store as globalAppStore } from '../config/store'; // <--- IMPORTE SUA STORE GLOBAL
import Roullete from "../screens/roullete/Roullete";

// Defina os nomes das rotas e seus parâmetros
export type RootStackParamList = {
  Home: undefined;
  Form: undefined;
  Users: undefined;
  Roullete: undefined;
  admin: undefined; // Mantenha 'admin' minúsculo se for o nome da rota que você quer
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    // Forneça a instância da store global para o provider
    <TinybaseProvider store={globalAppStore}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ contentStyle: { padding: 8 } /* initialRouteName="Home" // Opcional: defina a rota inicial aqui também */ }}>
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
            // options={{ title: "Usuários Cadastrados" }} // Exemplo de título
          />
          <Stack.Screen
            name="Form"
            component={Form}
            // options={{ title: "Cadastro de Usuário" }}
          />
          <Stack.Screen
            name="admin" // Nome da rota
            component={AdminScreen} // Componente associado (AdminScreen é o import)
            options={{ headerShown: true, title: "Painel Admin" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TinybaseProvider>
  );
}

export default AppNavigator;