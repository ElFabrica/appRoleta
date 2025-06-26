import { View, Text, Pressable, Alert, TextInput, Modal,FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { store, USERS_TABLE, initializeStore, clearTable } from "../config/store";
import { Input } from '../components/input/Input';


interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nota:string
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [nota, setNota] = useState("")

  const CORRECT_KEY = "Fala1234@";

  const handleClear = async (): Promise<void> => {
    try {
      await clearTable(USERS_TABLE);
      get(); // Atualiza a lista
      Alert.alert("Sucesso", "Todos os dados foram apagados.");
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
      Alert.alert("Erro", "Não foi possível limpar os dados.");
    }
  };

  const handleClearConfirmation = (): void => {
    if (password === CORRECT_KEY) {
      handleClear();
      setModalVisible(false);
      setPassword('');
    } else {
      Alert.alert("Senha incorreta", "A chave digitada está incorreta.");
    }
  };

  const UpdateItems = async (user: User): Promise<void> => {
    try {
      const response = await fetch("https://nasago.bubbleapps.io/version-test/api/1.1/wf/form_totem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const json = await response.json();
      console.log(json);
    } catch (error) {
      Alert.alert("Erro de conexão ou inesperado.");
      console.error('Erro:', error);
    }
  };

  const loopUpdateItems = async (): Promise<void> => {
    for (const item of users) {
      await UpdateItems(item);
    }
    Alert.alert("Dados enviados com sucesso!");
    setNota("")
  };

  const get = (): void => {
    const data = store.getTable(USERS_TABLE);
    const response: User[] = Object.entries(data).map(([id, user]) => ({
      id,
      name: String(user.name),
      email: String(user.email),
      phone: String(user.phone),
      game: String("Roleta"),
      nota: String(nota)
    }));
    setUsers(response);
    // console.log('📦 Dados atuais:', data); //Mostrar dados no console
  };

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        await initializeStore();
        get(); // Carrega os dados após inicializar
      } catch (e) {
        console.error("Erro ao inicializar banco:", e);
        Alert.alert("Erro", "Não foi possível carregar o banco de dados.");
      }
    };
    loadData();
  }, [nota]);

  return (
    <ScrollView scrollEnabled={true} >
    <View style={tw`flex-1 items-center mt-8 px-4`}>
      <Text style={tw`text-xl font-medium`}>Inscritos</Text>
      <View style={tw`mt-6 w-full`}>
        {users.length > 0 && (
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base text-center min-w-30`}>Nome</Text>
            <Text style={tw`text-base text-center min-w-30`}>Email</Text>
            <Text style={tw`text-base text-center min-w-30`}>Telefone</Text>
          </View>
        )}
        
        <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const id = item;
          return (
            <View >
              <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
                <Text style={{fontSize:12, fontWeight:500, color:"#333333"}}> {item.name}</Text>
                <Text style={{fontSize:12, fontWeight:500, color:"#333333"}}>{item.email}</Text>
                <Text style={{fontSize:12, fontWeight:500, color:"#333333"}}> {item.phone}</Text>
                
              </View>
            </View>
          );
        }}
      />
        {users.length > 0 && (
          <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:20}}>
            <Pressable
              style={tw`bg-purple-500 p-4 rounded-md`}
              onPress={() => setUploadModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Subir dados</Text>
            </Pressable>

            <Pressable
              style={tw`bg-red-500 p-4 rounded-md`}
              onPress={() => setModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Limpar dados</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 🔐 Modal limpar */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>
              Digite a chave para limpar
            </Text>
            <TextInput
              placeholder="Digite aqui..."
              style={tw`border border-gray-400 rounded-md p-2 mb-4`}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => {
                  setModalVisible(false);
                  setPassword('');
                }}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-red-500 px-4 py-2 rounded-md`}
                onPress={handleClearConfirmation}
              >
                <Text style={tw`text-white font-bold`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🚀 Modal Upload */}
      <Modal
        transparent
        visible={uploadModalVisible}
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={{backgroundColor:"#FFFFFF", borderRadius:16, padding:24, gap:8, width:350}}>
            <Text style={tw`text-lg font-bold mb-4`}>
              
              Deseja realmente enviar os dados?
            </Text>
            <Text style={tw`mb-4`}>
              Isso irá enviar todos os inscritos para o servidor.
            </Text>
            <Input place='Digite uma nota'
              value={nota}
              onChangeText={(value)=> setNota(value)
              }
              />
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => setUploadModalVisible(false)}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-purple-500 px-4 py-2 rounded-md`}
                onPress={() => {
                  setUploadModalVisible(false);
                  loopUpdateItems();
                }}
              >
                <Text style={tw`text-white font-bold`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
}

export default Users