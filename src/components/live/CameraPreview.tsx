import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Wifi, WifiOff } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { BoundingBox } from './BoundingBox';
import type { Detection } from '../../types';

const { width: SW } = Dimensions.get('window');
const PREVIEW_WIDTH = SW - 32;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * 0.65;

interface CameraPreviewProps {
  isStreaming: boolean;
  detections: Detection[];
}

// Animated scan line that moves top→bottom to simulate a live scan
const ScanLine = () => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(PREVIEW_HEIGHT, { duration: 2200, easing: Easing.linear }),
      -1,
      false
    );
  }, [translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scanLine, style]} pointerEvents="none" />
  );
};

// PCB circuit pattern background (SVG-free grid)
const PCBGrid = () => (
  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
    {Array.from({ length: 8 }).map((_, row) => (
      <View key={row} style={[styles.gridRow, { top: (row / 8) * PREVIEW_HEIGHT }]}>
        {Array.from({ length: 12 }).map((_, col) => (
          <View key={col} style={styles.gridDot} />
        ))}
      </View>
    ))}
  </View>
);

// Corner viewfinder marks
const ViewfinderCorners = ({ active }: { active: boolean }) => {
  const color = active ? Colors.accent : Colors.textMuted;
  return (
    <>
      <View style={[styles.vfCorner, styles.vfTL, { borderColor: color }]} />
      <View style={[styles.vfCorner, styles.vfTR, { borderColor: color }]} />
      <View style={[styles.vfCorner, styles.vfBL, { borderColor: color }]} />
      <View style={[styles.vfCorner, styles.vfBR, { borderColor: color }]} />
    </>
  );
};

export const CameraPreview = ({ isStreaming, detections }: CameraPreviewProps) => {
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isStreaming) {
      glowOpacity.value = withRepeat(
        withSequence(withTiming(0.6, { duration: 1200 }), withTiming(0.2, { duration: 1200 })),
        -1,
        false
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isStreaming, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.preview,
          { borderColor: isStreaming ? `${Colors.accent}60` : Colors.border },
        ]}
      >
        {/* Background gradient simulation */}
        <View style={styles.bgDark} />
        <PCBGrid />

        {/* Glow overlay when active */}
        <Animated.View
          style={[styles.glowOverlay, glowStyle]}
          pointerEvents="none"
        />

        {/* Scan line when streaming */}
        {isStreaming && <ScanLine />}

        {/* Bounding boxes */}
        {isStreaming &&
          detections.map((d) => (
            <BoundingBox
              key={d.id}
              detection={d}
              containerWidth={PREVIEW_WIDTH - 2}
              containerHeight={PREVIEW_HEIGHT - 2}
            />
          ))}

        {/* Viewfinder corners */}
        <ViewfinderCorners active={isStreaming} />

        {/* Offline overlay */}
        {!isStreaming && (
          <View style={styles.offlineOverlay}>
            <WifiOff size={32} color={Colors.textMuted} />
            <Text style={styles.offlineTitle}>Stream Offline</Text>
            <Text style={styles.offlineSubtitle}>Press START STREAM to begin live detection</Text>
          </View>
        )}

        {/* Connection badge */}
        {isStreaming && (
          <View style={styles.streamBadge}>
            <View style={styles.recDot} />
            <Text style={styles.streamText}>LIVE</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const VF_SIZE = 20;
const VF_THICK = 2.5;

const styles = StyleSheet.create({
  outer: { paddingHorizontal: 16, paddingTop: 12 },
  preview: {
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#040810',
    position: 'relative',
  },
  bgDark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#060C1A' },
  gridRow: { position: 'absolute', flexDirection: 'row', gap: (PREVIEW_WIDTH - 32) / 12 - 2 },
  gridDot: { width: 1.5, height: 1.5, borderRadius: 1, backgroundColor: '#1A2E4A', opacity: 0.7 },
  glowOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: `${Colors.accent}12` },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
    opacity: 0.6,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 11, 20, 0.85)',
    gap: 8,
  },
  offlineTitle: { fontSize: 16, fontWeight: '700', color: Colors.textMuted },
  offlineSubtitle: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },
  streamBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,23,68,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  streamText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  vfCorner: { position: 'absolute', width: VF_SIZE, height: VF_SIZE },
  vfTL: { top: 8, left: 8, borderTopWidth: VF_THICK, borderLeftWidth: VF_THICK, borderTopLeftRadius: 4 },
  vfTR: { top: 8, right: 8, borderTopWidth: VF_THICK, borderRightWidth: VF_THICK, borderTopRightRadius: 4 },
  vfBL: { bottom: 8, left: 8, borderBottomWidth: VF_THICK, borderLeftWidth: VF_THICK, borderBottomLeftRadius: 4 },
  vfBR: { bottom: 8, right: 8, borderBottomWidth: VF_THICK, borderRightWidth: VF_THICK, borderBottomRightRadius: 4 },
});
