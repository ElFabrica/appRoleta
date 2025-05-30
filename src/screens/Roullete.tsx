import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Easing,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { store, PRIZES_TABLE, USERS_TABLE } from '../config/store';

// Tipagem da navegação
type RootStackParamList = {
  Home: undefined;
  Roullete: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Interface dos prêmios
interface Prize {
  id: string;
  name: string;
  color: string;
  probability: number; // Percentual ou peso
}

const Roullete: React.FC = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();

  const wheelSize = width * 0.9;
  const radius = wheelSize / 2;
  const center = radius;

  const rotation = useRef(new Animated.Value(0)).current;

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [result, setResult] = useState<Prize | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false); // Estado para controlar se está girando

  const anglePerSlice = 360 / (prizes.length || 1);

  // Carregamento dos prêmios
  useEffect(() => {
    const load = () => {
      const data = Object.entries(store.getTable(PRIZES_TABLE)).map(
        ([key, value]: [string, any]) => ({
          id: key,
          name: value.name,
          color: value.color,
          probability: value.probability ?? 1, // Default 1 se não houver
        })
      );
      setPrizes(data);
      console.log(data)
    };

    load();
    const listenerId = store.addTableListener(PRIZES_TABLE, load);
    return () => {
      store.delListener(listenerId);
    };
  }, []);

  // Função para escolher prêmio baseado na probabilidade
  const getPrizeByProbability = (): number => {
    const total = prizes.reduce((sum, p) => sum + p.probability, 0);
    const rand = Math.random() * total;
    let acc = 0;

    for (let i = 0; i < prizes.length; i++) {
      acc += prizes[i].probability;
      if (rand <= acc) return i;
    }

    return prizes.length - 1; // fallback de segurança
  };

  // Função de rodar a roleta
  const spin = () => {
    if (prizes.length === 0 || isSpinning) return; // Bloqueia se já estiver girando

    setIsSpinning(true); // Bloqueia o botão

    const winnerIndex = getPrizeByProbability();

    const rounds = 5; // Voltas completas
    const endRotation =
      rounds * 360 +
      (prizes.length - winnerIndex) * anglePerSlice -
      anglePerSlice / 2;

    Animated.timing(rotation, {
      toValue: endRotation,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const prize = prizes[winnerIndex];
      setResult(prize);
      setModalVisible(true);
      rotation.setValue(endRotation % 360);

      store.addRow(USERS_TABLE, {
        userId: Date.now().toString(),
        userName: 'Usuário Teste',
        prize: prize.name,
        date: new Date().toISOString(),
      });

      setIsSpinning(false); // Libera o botão após a animação
    });
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

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

  const getTextPosition = (index: number) => {
    const angle = anglePerSlice * index + anglePerSlice / 2;
    const pos = polarToCartesian(center, center, radius * 0.65, angle);
    return { ...pos, angle };
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <View style={tw`absolute top-5 right-3`}>
      <Image style={tw`w-32 h-20  rounded-xl`} source={require("./assets/P-A-B.png")}/>
      </View>
      <Text style={tw`text-cyan-500 font-bold text-5xl mb-16 leading-10`}>
        Girou Ganhou
      </Text>

      <View style={tw`justify-center items-center mb-10`}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width={wheelSize} height={wheelSize}>
            <G>
              {prizes.map((item, index) => {
                const { x, y, angle } = getTextPosition(index);
                return (
                  <G key={index}>
                    <Path
                      d={createArc(index)}
                      fill={item.color || '#333'}
                      stroke="#fff"
                      strokeWidth={2}
                    />
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
                      {item.name}
                    </SvgText>
                  </G>
                );
              })}
              {/* Círculo central visível */}
              <Circle
                cx={center}
                cy={center}
                r={wheelSize * 0.12}
                fill={isSpinning ? '#ccc' : '#fff'}
                stroke="#ccc"
                strokeWidth={2}
              />
            </G>
          </Svg>
        </Animated.View>

        {/* Indicador */}
        <View
          style={tw`absolute top-[-5] w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 z-10`}
        />

        {/* Botão invisível sobre o círculo central */}
        <Pressable
          onPress={spin}
          disabled={isSpinning}
          style={[
            {
              position: 'absolute',
              width: wheelSize * 0.24,
              height: wheelSize * 0.24,
              borderRadius: (wheelSize * 0.24) / 2,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Text style={tw`text-gray-700 font-bold p-4`}>
            {isSpinning ? '' : 'Girar'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={tw.style(
          'px-6 py-3 rounded-lg',
          isSpinning ? 'bg-gray-400' : 'bg-blue-600'
        )}
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={tw`text-white text-lg font-bold`}>
          {isSpinning ? 'Girando...' : 'Girar Roleta'}
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/60`}>
          <View style={tw`bg-white p-8 rounded-2xl items-center`}>
            <Text style={tw`text-2xl font-bold mb-4`}>🎉 Parabéns!</Text>
            <Text style={tw`text-lg mb-6`}>Você ganhou: {result?.name}</Text>

            <Pressable
              style={tw`bg-cyan-500 px-6 py-2 rounded-lg`}
              onPress={() => [
                setModalVisible(false),
                navigation.navigate('Home'),
              ]}
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
