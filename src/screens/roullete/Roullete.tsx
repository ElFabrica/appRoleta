import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  Modal,
  useWindowDimensions,
  Image
} from 'react-native';
import tw from 'twrnc';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { store, PRIZES_TABLE, USERS_TABLE } from '../../config/store';
import { updateRow } from '../../config/store'

import { styles } from './style';
import { Button } from '../../components/buttom/Buttom';

type RootStackParamList = {
  Home: undefined;
  Roullete: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Prize {
  id: string;
  name: string;
  prizeReal: string;
  color: string;
  probability: number;
  quant: number;
  isPrize: boolean;
}

function Roullete() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();

  const wheelSize = width * 0.9;
  const radius = wheelSize / 2;
  const center = radius;

  const rotation = useRef(new Animated.Value(0)).current;

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [result, setResult] = useState<Prize | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const anglePerSlice = 360 / (prizes.length || 1);

  useEffect(() => {
    const load = () => {
      const data = Object.entries(store.getTable(PRIZES_TABLE))
        .map(([key, value]: [string, any]) => ({
          id: key,
          name: value.name,
          color: value.color,
          probability: value.probability ?? 1,
          quant: value.quant,
          isPrize: value.isPrize,
          prizeReal: value.prizeReal
        }))
        .filter((prize) => prize.quant > 0);

      setPrizes(data);
      console.log('Prêmios carregados:', data);
    };

    load();
    const listenerId = store.addTableListener(PRIZES_TABLE, load);
    return () => {
      store.delListener(listenerId);
    };
  }, []);

  const getPrizeByProbability = (): number => {
    const total = prizes.reduce((sum, p) => sum + p.probability, 0);
    const rand = Math.random() * total;
    let acc = 0;

    for (let i = 0; i < prizes.length; i++) {
      acc += prizes[i].probability;
      if (rand <= acc) return i;
    }

    return prizes.length - 1;
  };

  const spin = () => {
    if (prizes.length === 0 || isSpinning) return;

    setIsSpinning(true);

    const winnerIndex = getPrizeByProbability();

    const rounds = 5;
    const endRotation =
      rounds * 360 +
      (prizes.length - winnerIndex) * anglePerSlice - anglePerSlice / 2;

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

      if (prize.isPrize) {
        setShowConfetti(true);
      }

      setIsSpinning(false);
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
    const angleInRadians = ((angleInDegrees - 0) * Math.PI) / 180.0;
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
    <View style={styles.Container}>
      <Image style={styles.imagem} source={require("../../assets/Logo_Paslimina.png")} />
      <Text style={styles.Title}>Girou Ganhou</Text>

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

        <View
          style={tw`absolute top-[-5] w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 z-10`}
        />

        <Pressable
          onPress={spin}
          disabled={isSpinning}
          style={{
            position: 'absolute',
            width: wheelSize * 0.24,
            height: wheelSize * 0.24,
            borderRadius: (wheelSize * 0.24) / 2,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={tw`text-gray-700 font-bold p-4`}>
            {isSpinning ? '' : 'Girar'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.subContainer}>
        <Button
        size={24}
          title={isSpinning ? 'Girando...' : 'Girar Roleta'}
          onPress={spin}
          disabled={isSpinning}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/60`}>
          {showConfetti && (
            <ConfettiCannon
              count={80}
              origin={{ x: width / 2, y: -10 }}
              fadeOut
              fallSpeed={3000}
              explosionSpeed={0}
              onAnimationEnd={() => setShowConfetti(false)}
            />
          )}

          <View style={tw`bg-white p-8 rounded-2xl items-center z-10`}>
            <Text style={tw`text-2xl font-bold mb-4`}>
              {result?.isPrize ? "🎉 Parabéns!" : "Que Pena"}
            </Text>
            <Text style={tw`text-lg mb-6`}>
              {result?.isPrize ? `Você ganhou ${result?.prizeReal}` : `${result?.prizeReal}`}
            </Text>

            <Pressable
              style={tw`bg-green-600 px-6 py-2 rounded-lg`}
              onPress={() => {
                setModalVisible(false);
                if (result?.isPrize && result.quant > 0) {
                  updateRow(PRIZES_TABLE, result.id, {
                    quant: result.quant - 1,
                  });
                }
                navigation.navigate('Home');
              }}
            >
              <Text style={tw`text-white font-bold`}>
                {result?.isPrize ? "Resgatar" : "Concluir"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Roullete;
