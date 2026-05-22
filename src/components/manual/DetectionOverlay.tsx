import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors, DefectColors } from '../../constants/colors';
import { formatConfidence } from '../../utils/formatters';
import type { Detection } from '../../types';

const { width: SW } = Dimensions.get('window');
const OVERLAY_W = SW - 32;
const OVERLAY_H = OVERLAY_W * 0.7;

interface DetectionOverlayProps {
  imageUri: string;
  detections: Detection[];
}

export const DetectionOverlay = ({ imageUri, detections }: DetectionOverlayProps) => (
  <View style={styles.container}>
    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

    {detections.map((d) => {
      const color = DefectColors[d.defectClass] ?? Colors.accent;
      const x = d.boundingBox.x * OVERLAY_W;
      const y = d.boundingBox.y * OVERLAY_H;
      const w = d.boundingBox.width * OVERLAY_W;
      const h = d.boundingBox.height * OVERLAY_H;

      return (
        <View key={d.id} style={[styles.box, { left: x, top: y, width: w, height: h, borderColor: color }]}>
          <View style={[styles.tag, { backgroundColor: `${color}DD` }]}>
            <Text style={styles.tagText}>{d.defectClass}</Text>
            <Text style={styles.tagConf}>{formatConfidence(d.confidence)}</Text>
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: OVERLAY_W,
    height: OVERLAY_H,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center',
  },
  image: { width: '100%', height: '100%' },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 3,
  },
  tag: {
    position: 'absolute',
    top: -20,
    left: 0,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  tagText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  tagConf: { fontSize: 8, color: 'rgba(255,255,255,0.8)' },
});
