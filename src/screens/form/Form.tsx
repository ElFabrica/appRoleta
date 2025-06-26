import React, { useContext, useEffect, useState } from "react";
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
import { store, USERS_TABLE } from "../../config/store"
import MaskInput from "react-native-mask-input";

import { Button } from "../../components/buttom/Buttom";
import { Input } from "../../components/input/Input";
import { styles } from "./style";

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
  const [loaded, setLoaded] = useState(true);


  const onSubmit = () => {
    if (!loaded) {
      Alert.alert("Aguarde", "O banco de dados ainda está carregando...");
      return;
    }

    console.log(name, email, phone)

    if (!name || !phone) {
      Alert.alert("Erro", "Preencha todos os dados");
      return;
    }

    {/*if (!validator.validate(email)) {
      Alert.alert("Erro", "E-mail inválido");
      return;
    } */}

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
              source={require("../../animations/Form.json")}
              autoPlay
              loop
              style={tw`w-1/2 h-40`}
            />
          </View>

          <Text
            style={styles.Title}
          >
            Cadastro
          </Text>

          {/* NOME */}
          <View style={tw`w-full mb-4`}>
            <Text style={styles.subTitile}>Nome</Text>
            <Input place="John"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* EMAIL 
          <View style={tw`w-full mb-4`}>
            <Text style={styles.subTitile}>Email</Text>
            <Input place="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail} />
          </View>
*/}
          {/* TELEFONE */}
          <View style={tw`w-full mb-4`}>
            <Text style={styles.subTitile}>Telefone</Text>
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
              style={{
                color: "#333333",
                fontSize: 14,
                fontWeight: 600,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                width: "100%",
                height: 55,
                borderColor: "##D88200"
              }}
            />
          </View>

          {/* BOTÃO */}
          <View style={styles.containerButton}>
          <Button title="Começar" 
          size={20} 
          onPress={onSubmit}
          disabled={!loaded} />
            </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Form;
