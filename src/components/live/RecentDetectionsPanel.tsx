import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors, DefectColors, DefectBgColors } from '../../constants/colors';
import { formatRelativeTime, formatConfidence } from '../../utils/formatters';
import type { Detection } from '../../types';

interface RecentDetectionsPanelProps {
  detections: Detection[];
}

const DetectionChip = ({ detection }: { detection: Detection }) => {
  const color = DefectColors[detection.defectClass] ?? Colors.accent;
  const bg = DefectBgColors[detection.defectClass] ?? Colors.accentGlow;

  return (
    <View style={[styles.chip, { borderColor: `${color}40`, backgroundColor: bg }]}>
      <AlertTriangle size={10} color={color} />
      <View style={styles.chipText}>
        <Text style={[styles.chipClass, { color }]} numberOfLines={1}>{detection.defectClass}</Text>
        <Text style={styles.chipMeta}>{formatConfidence(detection.confidence)} · {formatRelativeTime(detection.timestamp)}</Text>
      </View>
    </View>
  );
};

export const RecentDetectionsPanel = ({ detections }: RecentDetectionsPanelProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Recent Detections</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{detections.length}</Text>
      </View>
    </View>

    {detections.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No defects detected this session</Text>
      </View>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {detections.slice(0, 15).map((d) => (
          <DetectionChip key={d.id} detection={d} />
        ))}
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  title: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' },
  countBadge: {
    backgroundColor: Colors.accentGlow,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
  },
  countText: { fontSize: 10, fontWeight: '800', color: Colors.accent },
  empty: { paddingHorizontal: 16, paddingVertical: 8 },
  emptyText: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  scroll: {},
  scrollContent: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {},
  chipClass: { fontSize: 11, fontWeight: '700' },
  chipMeta: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },
});
