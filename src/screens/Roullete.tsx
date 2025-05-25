import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import tw from 'twrnc';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Tipagem das rotas da aplicação
type RootStackParamList = {
  Home: undefined;
  Roullete: undefined;
};

// Tipagem específica para navegação
type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

// 🎁 Itens da roleta
const items = ['Prêmio A', 'Prêmio B', 'Prêmio C', 'Prêmio D', 'Prêmio E'];

// 🎨 Cores para cada segmento
const colors = ['#f94144', '#f3722c', '#f8961e', '#43aa8b', '#577595'];

const Roullete: React.FC = () => {
  const { width } = useWindowDimensions(); // 📐 Obtem largura da tela para dimensionar a roleta
  const wheelSize = width * 0.9;
  const radius = wheelSize / 2;
  const center = radius;
  const anglePerSlice = 360 / items.length;

  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [result, setResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;

  /**
   * 🔄 Função que executa a rotação da roleta.
   * Calcula um giro aleatório e define o prêmio baseado na posição final.
   */
  const spin = () => {
    const rounds = 5; // 🔁 Número de voltas completas
    const winnerIndex = Math.floor(Math.random() * items.length); // 🎯 Item sorteado
    const endRotation =
      rounds * 360 + (items.length - winnerIndex) * anglePerSlice - anglePerSlice / 2;

    Animated.timing(rotation, {
      toValue: endRotation,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setResult(items[winnerIndex]);
      setModalVisible(true);
      rotation.setValue(endRotation % 360);
    });
  };

  // 🔗 Mapeia valores de rotação em graus para animação
  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  /**
   * 📍 Converte ângulos polares para coordenadas cartesianas
   * Usado para desenhar os arcos da roleta e posicionar os textos
   */
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  /**
   * 🌀 Cria um segmento (fatias) da roleta baseado no índice.
   */
  const createArc = (index: number) => {
    const startAngle = anglePerSlice * index;
    const endAngle = startAngle + anglePerSlice;

    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  /**
   * 🏷️ Calcula a posição do texto dentro de cada segmento.
   */
  const getTextPosition = (index: number) => {
    const angle = anglePerSlice * index + anglePerSlice / 2;
    const pos = polarToCartesian(center, center, radius * 0.65, angle);
    return { ...pos, angle };
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-blue-500 font-medium text-3xl mb-5 leading-10`}>
        Girou Ganhou</Text>
      <View style={tw`justify-center items-center mb-10`}>
        {/* 🔄 Roleta Giratória */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width={wheelSize} height={wheelSize}>
            <G>
              {items.map((item, index) => {
                const { x, y, angle } = getTextPosition(index);
                return (
                  <G key={index}>
                    {/* 🎨 Fatia da roleta */}
                    <Path
                      d={createArc(index)}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    {/* 🏷️ Texto do prêmio */}
                    <SvgText
                      x={x}
                      y={y}
                      fill="#fff"
                      fontSize={16}
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${angle} ${x} ${y})`}
                    >
                      {item}
                    </SvgText>
                  </G>
                );
              })}
              {/* 🔘 Círculo central */}
              <Circle cx={center} cy={center} r={wheelSize * 0.12} fill="#fff" />
            </G>
          </Svg>
        </Animated.View>

        {/* 🔻 Ponteiro (agora apontando para baixo) */}
        <View
          style={tw`absolute top-[-5] w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 z-10`}
        />
      </View>

      {/* 🎯 Botão Girar */}
      <Pressable style={tw`bg-blue-600 px-6 py-3 rounded-lg`} onPress={spin}>
        <Text style={tw`text-white text-lg font-bold`}>Girar Roleta</Text>
      </Pressable>

      {/* 🎉 Modal de Resultado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/60`}>
          <View style={tw`bg-white p-8 rounded-2xl items-center`}>
            <Text style={tw`text-2xl font-bold mb-4`}>🎉 Parabéns!</Text>
            <Text style={tw`text-lg mb-6`}>Você ganhou: {result}</Text>

            <Pressable
              style={tw`bg-green-600 px-6 py-2 rounded-lg`}
              onPress={() => [setModalVisible(false), navigation.navigate('Home')]}
            >
              <Text style={tw`text-white font-bold`}>Resgatar Prêmio</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Roullete;
