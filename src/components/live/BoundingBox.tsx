import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { DefectColors } from '../../constants/colors';
import { formatConfidence } from '../../utils/formatters';
import type { Detection } from '../../types';

interface BoundingBoxProps {
  detection: Detection;
  containerWidth: number;
  containerHeight: number;
}

export const BoundingBox = ({ detection, containerWidth, containerHeight }: BoundingBoxProps) => {
  const { boundingBox, defectClass, confidence } = detection;
  const color = DefectColors[defectClass] ?? '#00A8FF';

  const opacity = useSharedValue(0);
  const borderOpacity = useSharedValue(1);

  const x = boundingBox.x * containerWidth;
  const y = boundingBox.y * containerHeight;
  const w = boundingBox.width * containerWidth;
  const h = boundingBox.height * containerHeight;

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 15 });
    borderOpacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      false
    );
  }, [detection.id, opacity, borderOpacity]);

  const boxStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const borderStyle = useAnimatedStyle(() => ({ opacity: borderOpacity.value }));

  return (
    <Animated.View style={[boxStyle, styles.container, { left: x, top: y, width: w, height: h }]}>
      {/* Pulsing border */}
      <Animated.View style={[StyleSheet.absoluteFillObject, borderStyle, { borderRadius: 4, borderWidth: 2, borderColor: color }]} />

      {/* Corner accents */}
      <View style={[styles.corner, styles.tl, { borderColor: color }]} />
      <View style={[styles.corner, styles.tr, { borderColor: color }]} />
      <View style={[styles.corner, styles.bl, { borderColor: color }]} />
      <View style={[styles.corner, styles.br, { borderColor: color }]} />

      {/* Label */}
      <View style={[styles.label, { backgroundColor: `${color}E0`, top: -22 }]}>
        <Text style={styles.labelText} numberOfLines={1}>
          {defectClass} {formatConfidence(confidence)}
        </Text>
      </View>
    </Animated.View>
  );
};

const CORNER_SIZE = 10;
const CORNER_WIDTH = 2;

const styles = StyleSheet.create({
  container: { position: 'absolute' },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE },
  tl: { top: -1, left: -1, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderTopLeftRadius: 3 },
  tr: { top: -1, right: -1, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderTopRightRadius: 3 },
  bl: { bottom: -1, left: -1, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderBottomLeftRadius: 3 },
  br: { bottom: -1, right: -1, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderBottomRightRadius: 3 },
  label: {
    position: 'absolute',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    left: 0,
  },
  labelText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.4 },
});
