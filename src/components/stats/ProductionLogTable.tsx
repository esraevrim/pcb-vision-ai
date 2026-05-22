import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import { formatRelativeTime } from '../../utils/formatters';
import type { ProductionLog } from '../../types';

interface ProductionLogTableProps {
  logs: ProductionLog[];
}

const LogRow = ({ log, isEven }: { log: ProductionLog; isEven: boolean }) => {
  const statusColor = getStatusColor(log.status);

  return (
    <View style={[styles.row, isEven && styles.rowAlt]}>
      <Text style={[styles.cell, styles.cellId]} numberOfLines={1}>{log.pcbId}</Text>
      <Text style={[styles.cell, styles.cellTime]} numberOfLines={1}>{formatRelativeTime(log.timestamp)}</Text>
      <Text style={[styles.cell, styles.cellCount, { color: log.defectCount > 0 ? Colors.danger : Colors.success }]}>
        {log.defectCount}
      </Text>
      <View style={styles.cellStatus}>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}22`, borderColor: `${statusColor}55` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{getStatusLabel(log.status)}</Text>
        </View>
      </View>
    </View>
  );
};

export const ProductionLogTable = ({ logs }: ProductionLogTableProps) => (
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.cellId]}>PCB ID</Text>
      <Text style={[styles.headerCell, styles.cellTime]}>Time</Text>
      <Text style={[styles.headerCell, styles.cellCount]}>Defects</Text>
      <Text style={[styles.headerCell, styles.cellStatus]}>Status</Text>
    </View>

    {logs.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No logs found</Text>
      </View>
    ) : (
      logs.map((log, i) => (
        <LogRow key={log.id} log={log} isEven={i % 2 === 0} />
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCell: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  rowAlt: { backgroundColor: `${Colors.bgSurface}80` },
  cell: { fontSize: 12, color: Colors.textSecondary },
  cellId: { flex: 2.2 },
  cellTime: { flex: 1.5 },
  cellCount: { flex: 1, fontWeight: '700' },
  cellStatus: { flex: 1.4, alignItems: 'flex-end' },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
});
