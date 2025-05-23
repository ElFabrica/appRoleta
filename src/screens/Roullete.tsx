import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  Animated,
  StyleSheet,
  Easing,
  Modal,
  Pressable,
} from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';

const items = ['Prêmio A', 'Prêmio B', 'Prêmio C', 'Prêmio D', 'Prêmio E'];
const colors = ['#f94144', '#f3722c', '#f8961e', '#43aa8b', '#577590'];

const Roullete: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const spin = () => {
    const rounds = 5;
    const winnerIndex = Math.floor(Math.random() * items.length);
    const anglePerSlice = 360 / items.length;
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

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const radius = 150;
  const center = radius;
  const anglePerSlice = 360 / items.length;

  const createArc = (index: number) => {
    const startAngle = anglePerSlice * index;
    const endAngle = startAngle + anglePerSlice;

    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');

    return pathData;
  };

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

  const getTextPosition = (index: number) => {
    const angle = anglePerSlice * index + anglePerSlice / 2;
    const pos = polarToCartesian(center, center, radius * 0.65, angle);
    return { ...pos, angle };
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width={radius * 2} height={radius * 2}>
            <G>
              {items.map((item, index) => {
                const { x, y, angle } = getTextPosition(index);
                return (
                  <G key={index}>
                    <Path
                      d={createArc(index)}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <SvgText
                      x={x}
                      y={y}
                      fill="#fff"
                      fontSize="16"
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
              <Circle cx={center} cy={center} r={40} fill="#fff" />
            </G>
          </Svg>
        </Animated.View>

        {/* 🔻 Ponteiro apontando para baixo */}
        <View style={styles.pointer} />
      </View>

      <Button title="Girar Roleta" onPress={spin} />

      {/* 🎉 Modal de Resultado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Parabéns! 🎉</Text>
            <Text style={styles.modalText}>Você ganhou: {result}</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Resgatar Prêmio</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wheelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  // 🔻 Ponteiro invertido (agora para baixo)
  pointer: {
    position: 'absolute',
    top: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'red',
    zIndex: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  // 🎉 Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#43aa8b',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Roullete;
