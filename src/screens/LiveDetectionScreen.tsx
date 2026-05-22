import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  PlayCircle,
  StopCircle,
  Cpu,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { useLiveStore } from '../store/useLiveStore';
import { useDetectionSimulation } from '../hooks/useDetectionSimulation';
import { CameraPreview } from '../components/live/CameraPreview';
import { FPSIndicator } from '../components/live/FPSIndicator';
import { RecentDetectionsPanel } from '../components/live/RecentDetectionsPanel';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { Button } from '../components/ui/Button';

// Alert pulse when a defect is found
const DefectAlertBanner = ({ count }: { count: number }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 400 }), withTiming(1, { duration: 400 })),
      4,
      false
    );
  }, [count, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (count === 0) return null;

  return (
    <Animated.View style={[styles.alertBanner, style]}>
      <AlertTriangle size={14} color={Colors.danger} />
      <Text style={styles.alertText}>{count} DEFECT{count > 1 ? 'S' : ''} DETECTED IN CURRENT FRAME</Text>
    </Animated.View>
  );
};

export default function LiveDetectionScreen() {
  useDetectionSimulation();

  const { isStreaming, fps, detectionCount, activeDetections, systemStatus, recentDetections, startStream, stopStream } =
    useLiveStore();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgSurface} />

      {/* Screen header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Live Detection</Text>
            <Text style={styles.screenSub}>Production Line A1 — Camera 01</Text>
          </View>
          <View style={styles.headerRight}>
            <FPSIndicator fps={fps} />
            <Badge
              label={isStreaming ? 'ACTIVE' : 'IDLE'}
              color={isStreaming ? Colors.success : Colors.textMuted}
              dot={isStreaming}
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Camera preview */}
        <CameraPreview isStreaming={isStreaming} detections={activeDetections} />

        {/* Defect alert banner */}
        <View style={styles.alertWrap}>
          <DefectAlertBanner count={activeDetections.length} />
        </View>

        {/* Stream controls */}
        <View style={styles.controlsRow}>
          {isStreaming ? (
            <Button
              title="STOP STREAM"
              onPress={stopStream}
              variant="danger"
              icon={<StopCircle size={16} color="#fff" />}
              style={styles.controlBtn}
            />
          ) : (
            <Button
              title="START STREAM"
              onPress={startStream}
              variant="primary"
              icon={<PlayCircle size={16} color="#fff" />}
              style={styles.controlBtn}
            />
          )}
        </View>

        {/* System status grid */}
        <View style={styles.statusGrid}>
          <StatusCard
            icon={<Cpu size={16} color={Colors.accent} />}
            label="AI Model"
            value="YOLOv12-PCB"
            status={systemStatus.modelActive ? 'online' : 'offline'}
          />
          <StatusCard
            icon={isStreaming ? <Wifi size={16} color={Colors.success} /> : <WifiOff size={16} color={Colors.textMuted} />}
            label="Camera"
            value={isStreaming ? 'Connected' : 'Offline'}
            status={isStreaming ? 'online' : 'offline'}
          />
          <StatusCard
            icon={<CheckCircle size={16} color={Colors.warning} />}
            label="Detections"
            value={detectionCount.toString()}
            status="online"
            valueColor={Colors.warning}
          />
          <StatusCard
            icon={<RefreshCw size={16} color={Colors.accent} />}
            label="Uptime"
            value={systemStatus.uptime}
            status="online"
          />
        </View>

        {/* AI Health strip */}
        <View style={styles.healthStrip}>
          <Text style={styles.healthTitle}>AI SYSTEM HEALTH</Text>
          <View style={styles.healthMetrics}>
            <HealthMetric label="Inference" value="31ms" good />
            <HealthMetric label="Confidence Thr." value="45%" good />
            <HealthMetric label="NMS Time" value="4ms" good />
            <HealthMetric label="Memory" value="62%" good />
          </View>
        </View>

        {/* Recent detections panel */}
        <RecentDetectionsPanel detections={recentDetections} />

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const StatusCard = ({
  icon, label, value, status, valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'online' | 'offline' | 'warning';
  valueColor?: string;
}) => (
  <View style={styles.statusCard}>
    <View style={styles.statusCardIcon}>{icon}</View>
    <Text style={styles.statusCardLabel}>{label}</Text>
    <Text style={[styles.statusCardValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    <StatusIndicator status={status} label={status === 'online' ? 'OK' : 'OFFLINE'} size="sm" />
  </View>
);

const HealthMetric = ({ label, value, good }: { label: string; value: string; good: boolean }) => (
  <View style={styles.healthMetric}>
    <Text style={[styles.healthValue, { color: good ? Colors.success : Colors.danger }]}>{value}</Text>
    <Text style={styles.healthLabel}>{label}</Text>
  </View>
);

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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scroll: { flex: 1 },
  alertWrap: { paddingHorizontal: 16, marginTop: 8 },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerDim,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: `${Colors.danger}44`,
  },
  alertText: { fontSize: 11, fontWeight: '700', color: Colors.danger, letterSpacing: 0.5 },
  controlsRow: { paddingHorizontal: 16, marginTop: 12 },
  controlBtn: { width: '100%' },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    gap: 4,
  },
  statusCardIcon: { marginBottom: 4 },
  statusCardLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusCardValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  healthStrip: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  healthTitle: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  healthMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  healthMetric: { alignItems: 'center', gap: 4 },
  healthValue: { fontSize: 14, fontWeight: '800' },
  healthLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  bottomPad: { height: 24 },
});
