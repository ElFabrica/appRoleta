// App.tsx (seu arquivo raiz, geralmente na raiz do projeto ou em src/)
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc'; // Se estiver usando Tailwind RN CLI

import AppNavigator from './src/navigation/appNavigation'; // Ajuste o caminho para o seu AppNavigator
import { initializeStore } from './src/config/store';   // Ajuste o caminho para sua config da store

const App = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("App: Iniciando inicialização da store...");
        await initializeStore(); // Sua função que carrega dados e inicia o autosave
        console.log("App: Store inicializada com sucesso.");
        setIsStoreReady(true);
      } catch (e: any) {
        console.error("App: Falha crítica ao inicializar a store no App.tsx", e);
        const errorMessage = e.message || "Ocorreu um erro desconhecido ao carregar os dados do aplicativo.";
        setInitializationError(errorMessage);
        Alert.alert(
          "Erro Crítico",
          `${errorMessage}\nPor favor, reinicie o aplicativo.`
        );
      }
    };

    init();
  }, []); // Executa apenas uma vez quando o componente App é montado

  if (initializationError) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4 bg-red-100`}>
        <Text style={tw`text-red-700 text-xl font-bold mb-2`}>Erro na Inicialização</Text>
        <Text style={tw`text-red-600 text-center`}>{initializationError}</Text>
        <Text style={tw`text-gray-500 mt-4 text-center`}>
          Por favor, tente reiniciar o aplicativo. Se o problema persistir, contate o suporte.
        </Text>
      </View>
    );
  }

  if (!isStoreReady) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color={tw.color('blue-500')} />
        <Text style={tw`mt-4 text-lg text-gray-600`}>Carregando aplicativo...</Text>
      </View>
    );
  }

  // Uma vez que a store está pronta e não há erros, renderize o AppNavigator
  return <AppNavigator />;
};

export default App;