import { View, Text, Pressable, Modal, TextInput, Alert, Image } from "react-native";
import React, { useState } from "react";
import tw from 'twrnc';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from "../../components/buttom/Buttom";

import { styles } from "./style";

// 🔗 Tipagem das rotas
type RootStackParamList = {
  Users: undefined;
  Form: undefined;
  admin: undefined
  OutraTela: undefined; // 👉 Adicione essa rota ou ajuste conforme sua necessidade
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Form'>;

export default function HomeScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // 🔥 Estados para controlar modal de senha e dropdown do menu
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [chave, setChave] = useState<string>('');

  // 🔑 Função que valida o código de acesso
  function acessoRestrito() {
    if (chave !== "Fala1234@") {
      Alert.alert("Código inválido");
      setChave("");
      return;
    }
    setModalVisible(false);
    setDropdownVisible(false);
    navigation.navigate("Users");
    setChave("");
  }

  // 🔧 Função para outra ação (configurada para navegar para 'OutraTela')
  function outraAcao() {
    setDropdownVisible(false);
    navigation.navigate("admin"); // 🔥 Substitua por sua tela desejada
  }

  return (
    <View style={styles.container}>
      
      {/* ⚙️ Ícone de configurações com dropdown */}
      <View style={[styles.subContainer, {marginTop: 16, marginLeft: 16}]}>
        <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Icon name="gear" size={24} color="purple" />
        </Pressable>

        {/* 🔽 Dropdown */}
        {dropdownVisible && (
          <View style={tw`absolute bg-white shadow-lg rounded-md p-2 top-8 left-0 z-50`}>
            <Pressable
              onPress={() => {
                setDropdownVisible(false);
                setModalVisible(true); // 👉 Abre o modal da senha
              }}
              style={tw`px-4 py-2`}
            >
              <Text style={tw`text-base text-purple-700`}>🔑 Acesso Restrito</Text>
            </Pressable>
            <Pressable
              onPress={outraAcao} // 👉 Executa outra ação
              style={tw`px-4 py-2`}
            >
              <Text style={tw`text-base text-purple-700`}>🧠 Prêmios</Text>
            </Pressable>
          </View>
        )}
      </View>
      <Image style={styles.imagem} source={require("../../assets/Logo_Paslimina.png")}/>

      {/* 🎯 Conteúdo principal */}
      <View style={tw` items-center`}>
        <Text style={styles.Title}>
          Bem-vindo ao{"\n"}Girou Ganhou!
        </Text>

        {/* 🎥 Animação */}
        <LottieView
          source={require('../../animations/Roullete.json')}
          autoPlay
          loop
          style={tw`w-5/6 h-1/3`}
        />

        <Text style={[styles.subTitile, {marginBottom:16}]}>
          Instruções
        </Text>

        {/* ℹ️ Bloco de instruções */}
        <View style={[styles.containerInstructions, {marginBottom:20}]}>
          <Text style={styles.textInstructions}>Concorra a brindes.</Text>
          <Text style={styles.textInstructions}>Preencha um formulário rápido.</Text>
          <Text style={styles.textInstructions}>Cada cadastro tem direito a um giro.</Text>
        </View>

        {/* 🚀 Botão de iniciar */}

        <Button title="Iniciar" size={20} onPress={() => navigation.navigate("Form")} />
      </View>

      {/* 🔒 Modal de acesso restrito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white w-80 p-5 rounded-lg shadow-lg`}>
            <Text style={tw`text-xl font-semibold mb-4 text-center`}>Acesso Restrito</Text>

            <TextInput
              placeholder="Digite a chave"
              placeholderTextColor="#888"
              style={tw`border border-purple-500 rounded-md p-3 mb-4 text-base`}
              value={chave}
              onChangeText={setChave}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-5 py-2 rounded-md`}
                onPress={() => {
                  setModalVisible(false);
                  setChave("");
                }}
              >
                <Text style={tw`text-white text-base`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-blue-500 px-5 py-2 rounded-md`}
                onPress={acessoRestrito}
              >
                <Text style={tw`text-white text-base`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
