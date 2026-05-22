import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface FPSIndicatorProps {
  fps: number;
}

export const FPSIndicator = ({ fps }: FPSIndicatorProps) => {
  const color = fps >= 25 ? Colors.success : fps >= 15 ? Colors.warning : Colors.danger;
  return (
    <View style={[styles.container, { borderColor: `${color}44` }]}>
      <Text style={[styles.fps, { color }]}>{fps}</Text>
      <Text style={styles.unit}>FPS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.bgCard,
    gap: 3,
  },
  fps: { fontSize: 16, fontWeight: '800' },
  unit: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});
