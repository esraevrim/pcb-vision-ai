import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Camera, Cpu, CheckCircle, AlertTriangle, FileImage, RotateCcw } from 'lucide-react-native';
import { Colors, DefectColors, DefectBgColors } from '../constants/colors';
import { useDetectionStore } from '../store/useDetectionStore';
import { runManualDetection } from '../services/mockDetectionService';
import { DetectionOverlay } from '../components/manual/DetectionOverlay';
import { ResultSummaryCard } from '../components/manual/ResultSummaryCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatConfidence } from '../utils/formatters';

// Processing animation with orbiting dots
const ProcessingAnimation = ({ progress }: { progress: number }) => {
  const rotate = useSharedValue(0);
  React.useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, [rotate]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.processingWrap}>
      <Animated.View style={[styles.spinRing, spinStyle]}>
        <View style={styles.spinDot} />
      </Animated.View>
      <Cpu size={24} color={Colors.accent} />
      <Text style={styles.processingLabel}>Running YOLOv12 Inference…</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressPct}>{progress}%</Text>
    </View>
  );
};

// Empty state before any image is selected
const EmptyState = ({ onGallery, onCamera }: { onGallery: () => void; onCamera: () => void }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconRing}>
      <FileImage size={36} color={Colors.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No PCB Image Selected</Text>
    <Text style={styles.emptySubtitle}>Upload or capture a PCB image to begin AI defect analysis</Text>
    <View style={styles.emptyButtons}>
      <TouchableOpacity style={styles.emptyBtn} onPress={onGallery} activeOpacity={0.75}>
        <Upload size={18} color={Colors.accent} />
        <Text style={styles.emptyBtnText}>Upload from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.emptyBtn, styles.emptyBtnAlt]} onPress={onCamera} activeOpacity={0.75}>
        <Camera size={18} color={Colors.warning} />
        <Text style={[styles.emptyBtnText, { color: Colors.warning }]}>Capture with Camera</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ManualDetectionScreen() {
  const { imageUri, isProcessing, result, processingProgress, setImage, startProcessing, setResult, setProgress, reset } =
    useDetectionStore();

  const pickFromGallery = useCallback(async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets[0]) {
      setImage(res.assets[0].uri);
    }
  }, [setImage]);

  const captureFromCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled && res.assets[0]) {
      setImage(res.assets[0].uri);
    }
  }, [setImage]);

  const runDetection = useCallback(async () => {
    if (!imageUri) return;
    startProcessing();
    const r = await runManualDetection(imageUri, setProgress);
    setResult(r);
  }, [imageUri, startProcessing, setProgress, setResult]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgSurface} />

      {/* Screen header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Manual Inspection</Text>
            <Text style={styles.screenSub}>Upload or capture a PCB image</Text>
          </View>
          <Badge label="YOLOv12" color={Colors.accent} size="sm" />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* EMPTY STATE */}
        {!imageUri && !isProcessing && (
          <EmptyState onGallery={pickFromGallery} onCamera={captureFromCamera} />
        )}

        {/* IMAGE SELECTED — preview + controls */}
        {imageUri && !isProcessing && (
          <>
            {/* Image overlay (with bounding boxes if result exists) */}
            {result ? (
              <DetectionOverlay imageUri={imageUri} detections={result.detections} />
            ) : (
              <View style={styles.previewWrap}>
                <DetectionOverlay imageUri={imageUri} detections={[]} />
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              <Button
                title="Run Detection"
                onPress={runDetection}
                icon={<Cpu size={16} color="#fff" />}
                style={styles.runBtn}
                disabled={!!result}
              />
              <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.75}>
                <RotateCcw size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Re-pick buttons */}
            {!result && (
              <View style={styles.rePick}>
                <TouchableOpacity style={styles.rePickBtn} onPress={pickFromGallery} activeOpacity={0.75}>
                  <Upload size={14} color={Colors.textSecondary} />
                  <Text style={styles.rePickText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rePickBtn} onPress={captureFromCamera} activeOpacity={0.75}>
                  <Camera size={14} color={Colors.textSecondary} />
                  <Text style={styles.rePickText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* RESULTS */}
            {result && (
              <>
                <ResultSummaryCard result={result} />

                <View style={styles.defectListHeader}>
                  <Text style={styles.defectListTitle}>DETECTED DEFECTS</Text>
                  <Badge label={`${result.totalDefects} found`} color={result.totalDefects > 0 ? Colors.danger : Colors.success} size="sm" />
                </View>

                {result.detections.length === 0 ? (
                  <View style={styles.noDefects}>
                    <CheckCircle size={22} color={Colors.success} />
                    <Text style={styles.noDefectsText}>No defects found — PCB passes inspection</Text>
                  </View>
                ) : (
                  result.detections.map((d) => {
                    const color = DefectColors[d.defectClass] ?? Colors.accent;
                    const bg = DefectBgColors[d.defectClass] ?? Colors.accentGlow;
                    return (
                      <View key={d.id} style={[styles.defectRow, { borderColor: `${color}33`, backgroundColor: bg }]}>
                        <AlertTriangle size={14} color={color} />
                        <View style={styles.defectInfo}>
                          <Text style={[styles.defectClass, { color }]}>{d.defectClass}</Text>
                          <Text style={styles.defectMeta}>
                            Conf: {formatConfidence(d.confidence)} · BBox ({(d.boundingBox.x * 100).toFixed(0)}%,{(d.boundingBox.y * 100).toFixed(0)}%)
                          </Text>
                        </View>
                        <View style={styles.confBar}>
                          <View style={[styles.confBarFill, { width: `${d.confidence * 100}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={[styles.confLabel, { color }]}>{formatConfidence(d.confidence)}</Text>
                      </View>
                    );
                  })
                )}
              </>
            )}
          </>
        )}

        {/* PROCESSING STATE */}
        {isProcessing && (
          <ProcessingAnimation progress={processingProgress} />
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const { width: SW } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  header: {
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  screenTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  screenSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingBottom: 32 },
  emptyState: {
    margin: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  emptyButtons: { width: '100%', gap: 10, marginTop: 8 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  emptyBtnAlt: { backgroundColor: Colors.warningDim, borderColor: `${Colors.warning}44` },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  previewWrap: { paddingHorizontal: 16 },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  runBtn: { flex: 1 },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rePick: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 8 },
  rePickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rePickText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  defectListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  defectListTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  noDefects: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: Colors.successDim,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.success}44`,
  },
  noDefectsText: { fontSize: 13, fontWeight: '600', color: Colors.success },
  defectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  defectInfo: { flex: 1 },
  defectClass: { fontSize: 13, fontWeight: '700' },
  defectMeta: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  confBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.bgSurface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  confBarFill: { height: '100%', borderRadius: 2 },
  confLabel: { fontSize: 11, fontWeight: '700', minWidth: 38, textAlign: 'right' },
  processingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    margin: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  spinRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: `${Colors.accent}33`,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  spinDot: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  processingLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  progressTrack: {
    width: 200,
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 3 },
  progressPct: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  bottomPad: { height: 32 },
});
