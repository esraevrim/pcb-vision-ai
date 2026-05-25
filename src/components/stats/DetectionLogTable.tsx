// Port of _refresh_log_table() from DashboardWidget
// Severity-based row coloring matches Python's SEVERITY_COLOR dict
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { formatConfidence } from '../../utils/formatters';
import type { DefectLog } from '../../types/database';

// Mirrors SEVERITY_COLOR from dashboard_widget.py — adapted to dark theme
const SEVERITY: Record<string, { border: string; text: string; bg: string }> = {
  'Short Circuit':   { border: Colors.danger,  text: Colors.danger,  bg: Colors.dangerDim  },
  'Open Circuit':    { border: Colors.danger,  text: Colors.danger,  bg: Colors.dangerDim  },
  'Missing Hole':    { border: Colors.warning, text: Colors.warning, bg: Colors.warningDim },
  'Spur':            { border: Colors.warning, text: Colors.warning, bg: Colors.warningDim },
  'Mouse Bite':      { border: Colors.warning, text: Colors.warning, bg: Colors.warningDim },
  'Spurious Copper': { border: Colors.accent,  text: Colors.accent,  bg: Colors.accentGlow },
};

const DEFAULT_SEV = { border: Colors.textMuted, text: Colors.textSecondary, bg: 'transparent' };

const formatTs = (ts: string): string => {
  try { return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  catch { return ts.slice(11, 19); }
};

const formatBBox = (log: DefectLog): string => {
  if (log.bboxX == null) return '—';
  return `${log.bboxX},${log.bboxY} ${log.bboxW}×${log.bboxH}`;
};

interface DetectionLogTableProps {
  logs: DefectLog[];
  limit?: number;
}

export const DetectionLogTable = ({ logs, limit = 30 }: DetectionLogTableProps) => {
  const displayed = logs.slice(0, limit);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.thead}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colTime]}>Time</Text>
        <Text style={[styles.th, styles.colType]}>Defect Type</Text>
        <Text style={[styles.th, styles.colConf]}>Conf.</Text>
        <Text style={[styles.th, styles.colBbox]}>BBox</Text>
        <Text style={[styles.th, styles.colStatus]}>Status</Text>
      </View>

      {displayed.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No detection records yet</Text>
        </View>
      ) : (
        displayed.map((log, i) => {
          const sev = SEVERITY[log.defectType] ?? DEFAULT_SEV;
          const isAlt = i % 2 !== 0;
          const confColor = log.confidence >= 0.9 ? Colors.success : Colors.warning;

          return (
            <View key={log.id} style={[styles.row, isAlt && styles.rowAlt]}>
              <Text style={[styles.td, styles.colId, { color: Colors.textMuted }]}>
                #{log.id}
              </Text>
              <Text style={[styles.td, styles.colTime]} numberOfLines={1}>
                {formatTs(log.timestamp)}
              </Text>
              {/* Defect type cell with severity color — mirrors type_item in Python */}
              <View style={[styles.colType, styles.typePill, { backgroundColor: sev.bg, borderColor: `${sev.border}55` }]}>
                <Text style={[styles.typeText, { color: sev.text }]} numberOfLines={1}>
                  {log.defectType}
                </Text>
              </View>
              {/* Confidence — mirrors conf_item color logic in Python */}
              <Text style={[styles.td, styles.colConf, { color: confColor, fontWeight: '700' }]}>
                {formatConfidence(log.confidence)}
              </Text>
              <Text style={[styles.td, styles.colBbox, { color: Colors.textMuted }]} numberOfLines={1}>
                {formatBBox(log)}
              </Text>
              {/* Status pill — always DEFECTIVE since these are defect_logs */}
              <View style={[styles.colStatus, styles.statusPill]}>
                <Text style={styles.statusText}>DEFECTIVE</Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  thead: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  th: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}60`,
  },
  rowAlt: { backgroundColor: `${Colors.bgSurface}70` },
  td: { fontSize: 11, color: Colors.textSecondary },
  colId:     { width: 36 },
  colTime:   { width: 76 },
  colType:   { flex: 1.8 },
  colConf:   { width: 48, textAlign: 'right' },
  colBbox:   { flex: 1.2, paddingHorizontal: 4 },
  colStatus: { width: 72, alignItems: 'flex-end' },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  typeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  statusPill: {
    backgroundColor: Colors.dangerDim,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: `${Colors.danger}44`,
  },
  statusText: { fontSize: 8, fontWeight: '800', color: Colors.danger, letterSpacing: 0.5 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 12, fontStyle: 'italic' },
});
