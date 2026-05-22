import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { formatQualityScore, getQualityColor } from '../../utils/formatters';
import type { DetectionResult } from '../../types';

interface ResultSummaryCardProps {
  result: DetectionResult;
}

export const ResultSummaryCard = ({ result }: ResultSummaryCardProps) => {
  const qualityColor = getQualityColor(result.qualityScore);
  const qualityLabel = formatQualityScore(result.qualityScore);
  const isPassing = result.qualityScore >= 70;

  const StatusIcon = isPassing ? CheckCircle : result.qualityScore >= 40 ? AlertCircle : XCircle;
  const iconColor = isPassing ? Colors.success : result.qualityScore >= 40 ? Colors.warning : Colors.danger;

  return (
    <View style={[styles.card, { borderColor: `${iconColor}40` }]}>
      {/* Header */}
      <View style={styles.header}>
        <StatusIcon size={22} color={iconColor} />
        <Text style={[styles.headerText, { color: iconColor }]}>
          {isPassing ? 'PCB PASSES INSPECTION' : result.qualityScore >= 40 ? 'REQUIRES REVIEW' : 'PCB FAILS INSPECTION'}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Metrics row */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: result.totalDefects > 0 ? Colors.danger : Colors.success }]}>
            {result.totalDefects}
          </Text>
          <Text style={styles.metricLabel}>Total Defects</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: qualityColor }]}>{result.qualityScore}</Text>
          <Text style={styles.metricLabel}>Quality Score</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: Colors.accent }]}>{result.processingTimeMs}ms</Text>
          <Text style={styles.metricLabel}>Inference</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Quality bar */}
      <View style={styles.qualityRow}>
        <Text style={styles.qualityLabel}>PCB Quality</Text>
        <Text style={[styles.qualityGrade, { color: qualityColor }]}>{qualityLabel}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${result.qualityScore}%`, backgroundColor: qualityColor }]} />
      </View>

      {result.mostCommonDefect && (
        <Text style={styles.commonDefect}>
          Most common: <Text style={{ color: Colors.warning }}>{result.mostCommonDefect}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  headerText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 24, fontWeight: '800' },
  metricLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500', marginTop: 2, textAlign: 'center' },
  metricDivider: { width: 1, backgroundColor: Colors.border },
  qualityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qualityLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  qualityGrade: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  barTrack: { height: 6, backgroundColor: Colors.bgSurface, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  barFill: { height: '100%', borderRadius: 3 },
  commonDefect: { fontSize: 11, color: Colors.textMuted },
});
