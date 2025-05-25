import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import validator from "email-validator";
import tw from "twrnc";
import LottieView from "lottie-react-native";
import { store, USERS_TABLE, initializeStore } from "../config/store";
import MaskInput from "react-native-mask-input";

// Tipagem da stack e props da tela
type RootStackParamList = {
  Form: undefined;
  Roullete: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Form">;

const Form: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Inicializando store...");
        await initializeStore();
        console.log("Store pronto!");
        setLoaded(true);
      } catch (e) {
        console.error("Erro ao inicializar banco:", e);
        Alert.alert("Erro", "Não foi possível carregar o banco de dados.");
      }
    };
    loadData();
  }, []);

  const onSubmit = () => {
    if (!loaded) {
      Alert.alert("Aguarde", "O banco de dados ainda está carregando...");
      return;
    }

    if (!name || !email || !phone) {
      Alert.alert("Erro", "Preencha todos os dados");
      return;
    }

    if (!validator.validate(email)) {
      Alert.alert("Erro", "E-mail inválido");
      return;
    }

    const id = Math.random().toString(30).substring(2, 20);
    try {
      store.setRow(USERS_TABLE, id, { name, email, phone });
      console.log("Usuário adicionado com sucesso");

      setName("");
      setEmail("");
      setPhone("");

      navigation.navigate("Roullete");
    } catch (error) {
      console.error("Erro ao salvar dados no banco:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={tw`flex-grow px-4 mb-20`}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`items-center mt-4`}>
            <LottieView
              source={require("../animations/Form.json")}
              autoPlay
              loop
              style={tw`w-1/2 h-40`}
            />
          </View>

          <Text
            style={tw`text-blue-500 font-medium text-4xl font-bold text-center`}
          >
            Cadastro
          </Text>

          {/* NOME */}
          <View style={tw`w-full mb-4`}>
            <Text style={tw`text-lg font-bold`}>Nome</Text>
            <TextInput
              style={tw`p-4 border-2 border-blue-500 w-full rounded-md`}
              placeholder="John"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* EMAIL */}
          <View style={tw`w-full mb-4`}>
            <Text style={tw`text-lg font-bold`}>Email</Text>
            <TextInput
              style={tw`p-4 border-2 border-blue-500 w-full rounded-md`}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* TELEFONE */}
          <View style={tw`w-full mb-4`}>
            <Text style={tw`text-lg font-bold`}>Telefone</Text>
            <MaskInput
              value={phone}
              onChangeText={setPhone}
              mask={[
                "(",
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              keyboardType="numeric"
              placeholder="(00) 00000-0000"
              style={tw`p-4 border-2 border-blue-500 w-full rounded-md`}
            />
          </View>

          {/* BOTÃO */}
          <Pressable
            style={[
              tw`p-4 rounded-md mt-6 w-full justify-center items-center`,
              loaded ? tw`bg-blue-800` : tw`bg-gray-400`,
            ]}
            onPress={onSubmit}
            disabled={!loaded}
          >
            <Text style={tw`text-white font-bold`}>
              {loaded ? "Começar" : "Carregando..."}
            </Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Form;
