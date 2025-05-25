import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import tw from 'twrnc';
import { store, PRIZES_TABLE } from '../config/store';

const Admin = () => {
  // 🔥 Estados dos inputs do formulário
  const [name, setName] = useState('');
  const [color, setColor] = useState('#f94144');
  const [probability, setProbability] = useState('20');

  // 🔥 Estado que armazena os prêmios cadastrados no banco
  const [prizes, setPrizes] = useState<any[]>([]);

  // 🚀 Hook que carrega os dados ao abrir e escuta alterações na tabela
 useEffect(() => {
  const loadPrizes = () => {
    const data = Object.entries(store.getTable(PRIZES_TABLE));
    setPrizes(data);
  };

  loadPrizes();

  // Adiciona o listener e guarda o ID
  const listenerId = store.addTableListener(PRIZES_TABLE, loadPrizes);

  // Remove o listener na desmontagem
  return () => {
    store.delListener(listenerId);
  };
}, []);



  // ➕ Função para adicionar um prêmio novo
  const addPrize = () => {
    store.addRow(PRIZES_TABLE, {
      name,
      color,
      probability: parseInt(probability),
    });

    // 🔄 Reseta os campos após adicionar
    setName('');
    setColor('#f94144');
    setProbability('20');
  };

  // ❌ Função para deletar um prêmio específico
  const deletePrize = (rowId: string) => {
    store.delRow(PRIZES_TABLE, rowId);
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>
        🎯 Gerenciar Prêmios
      </Text>

      {/* 📝 Formulário de cadastro */}
      <TextInput
        placeholder="Nome do prêmio"
        value={name}
        onChangeText={setName}
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

      <Pressable
        style={tw`bg-blue-600 p-3 rounded mb-6`}
        onPress={addPrize}
      >
        <Text style={tw`text-white text-center font-bold`}>
          ➕ Adicionar Prêmio
        </Text>
      </Pressable>

      {/* 📃 Lista dos prêmios existentes */}
      <FlatList
        data={prizes}
        keyExtractor={([id]) => id}
        renderItem={({ item }) => {
          const [id, prize] = item;
          return (
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <View>
                <Text style={tw`font-bold text-lg`}>{prize.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>Cor: {prize.color}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                  Probabilidade: {prize.probability}%
                </Text>
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
