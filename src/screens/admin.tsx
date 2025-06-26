import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import tw from 'twrnc';
import { store, PRIZES_TABLE } from '../config/store';

import { CircleDashed, CircleCheck } from "lucide-react-native";




// 🎯 Interface para o prêmio
interface Prize {
  name: string;
  prizeReal:string
  color: string;
  probability: number;
  quant: number
  isPrize: boolean
}

const Admin = () => {
  const [name, setName] = useState('');
  const [prizeReal, setPrizeReal] = useState('');
  const [color, setColor] = useState('#f94144');
  const [probability, setProbability] = useState('20');
  const [quant, setQuant] = useState(0)
  const [isPrize, setIsPrize] = useState(true)

  const [prizes, setPrizes] = useState<[string, Prize][]>([]);


    function confirmPrize() {
    if (isPrize === true) {
      setIsPrize(false)
      console.log("Desconfirma")
      return
    } else {
      setIsPrize(true)
      console.log("Confirma")
    }
  }

  // 🚀 Carrega os prêmios e escuta alterações
  useEffect(() => {
    const loadPrizes = async () => {
      const table = store.getTable(PRIZES_TABLE) as unknown as Record<string, Prize>;
      const data = Object.entries(table);
      setPrizes(data);
      console.log('Prêmios carregados:', data);
    };

    loadPrizes();

    const listenerId = store.addTableListener(PRIZES_TABLE, loadPrizes);

    return () => {
      store.delListener(listenerId);
    };
  }, []);

  // ➕ Adiciona um prêmio novo
  const addPrize = () => {
    if(!name || !quant || !color || !prizeReal){
      Alert.alert("Atenção", "Preencha os camopos corretamente")
      return
    }
    store.addRow(PRIZES_TABLE, {
      name,
      color,
      probability: parseInt(probability),
      quant,
      isPrize,
      prizeReal
    });

    setName('');
    setPrizeReal('');
    setColor('#f94144');
    setProbability('20');
    setQuant(3)
    setIsPrize(true)
  };

  // ❌ Deleta um prêmio
  const deletePrize = (rowId: string) => {
    store.delRow(PRIZES_TABLE, rowId);
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>
        🎯 Gerenciar Prêmios
      </Text>

      {/* Formulário */}
      <TextInput
        placeholder="Nome do prêmio"
        value={name}
        onChangeText={setName}
        style={tw`border border-gray-300 p-2 rounded mb-2`}
      />
        <TextInput
        placeholder="Título do prêmio (popup)"
        value={prizeReal}
        onChangeText={setPrizeReal}
        style={tw`border border-gray-300 p-2 rounded mb-2`}
      />
      <TextInput
        placeholder="Cor (hex)"
        value={color}
        onChangeText={setColor}
        style={tw`border border-gray-300 p-2 rounded mb-2`}
      />
      <TextInput
        placeholder="Probabilidade (%)"
        value={probability}
        keyboardType="numeric"
        onChangeText={setProbability}
        style={tw`border border-gray-300 p-2 rounded mb-4`}
      />
        <TextInput
        placeholder="Quantidade"
        value={quant.toString()}
        keyboardType="numeric"
        onChangeText={(text) => {
    const num = parseInt(text) || 0;
    setQuant(num);
    
  }}
  
        style={tw`border border-gray-300 p-2 rounded mb-4`}
      />
       <View style={{ flexDirection: "row", gap: "8", marginBottom: 20, alignItems:"center" }} >
        {isPrize === true ? (<CircleCheck size={24} color="#AAAAAA" onPress={confirmPrize} />) : (<CircleDashed size={24} color="#AAAAAA" onPress={confirmPrize} />)}
        <Text onPress={confirmPrize}>É prêmio ?</Text>
      </View>

      <Pressable
        style={tw`bg-blue-600 p-3 rounded mb-6`}
        onPress={addPrize}
      >
        <Text style={tw`text-white text-center font-bold`}>
          ➕ Adicionar Prêmio
        </Text>
      </Pressable>

      {/* Lista de Prêmios */}
      <FlatList
        data={prizes}
        keyExtractor={([id]) => id}
        renderItem={({ item }) => {
          const [id, prize] = item;
          return (
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <View style={{width:"80%"}}>
                <Text style={tw`font-bold text-lg`}>Prêmio: {prize.name}</Text>
                <Text style={{fontSize:14, fontWeight:500}}>Prêmio mensagem: {prize.prizeReal}</Text>
                <Text style={tw`text-sm text-gray-500`}>Cor: {prize.color}</Text>
                <Text style={tw`text-sm text-gray-500`}>Probabilidade: {prize.probability}%</Text>
                <Text style={tw`text-sm text-gray-500`}>Quantidade: {prize.quant}</Text>
                <Text style={tw`text-sm text-gray-500`}>Prêmio: {prize.isPrize==true?"Sim":"Não"}</Text>
                
              </View>
              <Pressable
                onPress={() => deletePrize(id)}
                style={tw`bg-red-500 px-3 py-2 rounded`}
              >
                <Text style={tw`text-white`}>🗑️ Excluir</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Admin;
