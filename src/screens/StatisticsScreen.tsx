/**
 * StatisticsScreen.tsx
 *
 * Integrates dashboard_widget.py into the existing React Native UI.
 * Mirrors DashboardWidget layout:
 *   ├── RangeSelector   (QComboBox → Today / This Week / This Month)
 *   ├── Metric Cards    (MetricCard × 4)
 *   ├── WeeklyTrendChart (line chart — scanned vs faulty)
 *   ├── DefectPieChart   (pie chart — defect distribution)
 *   ├── Daily Bar Chart  (existing DefectChart)
 *   └── DetectionLogTable (log table with severity colors)
 *
 * Auto-refresh every 5 seconds — mirrors QTimer(5000) in DashboardWidget.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import {
  Search,
  RefreshCw,
  Scan,
  AlertTriangle,
  TrendingDown,
  Zap,
  Activity,
  Database,
  BarChart3,
  Clock,
} from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { useDatabaseStore } from '../store/useDatabaseStore';
import { useStatsStore }    from '../store/useStatsStore';
import { RangeSelector }       from '../components/stats/RangeSelector';
import { DashboardMetricCard } from '../components/stats/DashboardMetricCard';
import { WeeklyTrendChart }    from '../components/stats/WeeklyTrendChart';
import { DefectPieChart }      from '../components/stats/DefectPieChart';
import { DetectionLogTable }   from '../components/stats/DetectionLogTable';
import { DefectChart }         from '../components/stats/DefectChart';
import { Badge }               from '../components/ui/Badge';
import { CHART_CONFIG }        from '../constants/config';
import { MOCK_LINE_CHART_DATA, MOCK_DEFECT_DISTRIBUTION } from '../mock/statistics';
import type { DateRange }      from '../types/database';

const { width: SW } = Dimensions.get('window');

// Mirrors DashboardWidget.refresh_metrics() range logic
function useRangeMetrics(range: DateRange, db: ReturnType<typeof useDatabaseStore.getState>) {
  switch (range) {
    case 'today':
      return {
        scanned:  db.dailyStats.totalScanned,
        faulty:   db.dailyStats.totalFaulty,
        rate:     db.dailyStats.defectRate,
        avgMs:    db.dailyStats.avgInferenceMs,
      };
    case 'month':
      return {
        scanned:  db.monthlySummary.totalScanned,
        faulty:   db.monthlySummary.totalFaulty,
        rate:     db.monthlySummary.defectRate,
        avgMs:    0,
      };
    case 'week':
    default:
      return {
        scanned:  db.weeklyStats.totalScanned,
        faulty:   db.weeklyStats.totalFaulty,
        rate:     db.weeklyStats.avgDefectRate,
        avgMs:    db.weeklyStats.avgInferenceMs,
      };
  }
}

export default function StatisticsScreen() {
  const dbStore   = useDatabaseStore();
  const statsStore = useStatsStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Mirror DashboardWidget auto-refresh (QTimer interval: 5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      dbStore.refreshAll();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = useCallback(() => {
    dbStore.refreshAll();
    statsStore.refreshData();
  }, [dbStore, statsStore]);

  const metrics = useRangeMetrics(dbStore.selectedRange, dbStore);

  const rateColor = metrics.rate > 15
    ? Colors.danger
    : metrics.rate > 10
    ? Colors.warning
    : Colors.success;

  const rateSubtitle = metrics.rate > 10 ? 'Above target threshold' : 'Within target ✓';

  // Filter detection log by search
  const filteredLogs = dbStore.recentLogs.filter(
    (l) =>
      searchQuery === '' ||
      l.defectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.timestamp.includes(searchQuery),
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgSurface} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Analytics & Reports</Text>
            <Text style={styles.screenSub}>PCB Defect Detection Dashboard</Text>
          </View>
          <View style={styles.headerRight}>
            <Badge label="● LIVE" color={Colors.success} />
            <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.7}>
              <RefreshCw
                size={15}
                color={dbStore.isRefreshing ? Colors.accent : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Range selector — mirrors QComboBox in DashboardWidget */}
        <View style={styles.rangeRow}>
          <RangeSelector selected={dbStore.selectedRange} onChange={dbStore.setRange} />
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <Search size={14} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search defect type or timestamp…"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={dbStore.isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        {/* ── SECTION: System Metrics ─────────────────────────────── */}
        {/* Mirrors 4 MetricCard widgets in DashboardWidget._build_ui() */}
        <View style={styles.sectionHeader}>
          <Database size={13} color={Colors.accent} />
          <Text style={styles.sectionTitle}>SYSTEM METRICS</Text>
          <Text style={styles.sectionSub}>via database.py service layer</Text>
        </View>

        <View style={styles.metricsGrid}>
          <DashboardMetricCard
            icon={<Scan size={14} color={Colors.accent} />}
            label="Total Scanned"
            value={metrics.scanned.toLocaleString()}
            style={styles.metricCard}
          />
          <DashboardMetricCard
            icon={<AlertTriangle size={14} color={Colors.danger} />}
            label="Faulty PCBs"
            value={metrics.faulty.toLocaleString()}
            valueColor={Colors.danger}
            style={styles.metricCard}
          />
          <DashboardMetricCard
            icon={<Activity size={14} color={rateColor} />}
            label="Defect Rate"
            value={`${metrics.rate.toFixed(1)}%`}
            valueColor={rateColor}
            subtitle={rateSubtitle}
            style={styles.metricCard}
          />
          <DashboardMetricCard
            icon={<Zap size={14} color={Colors.warning} />}
            label="Avg Inference"
            value={metrics.avgMs > 0 ? `${metrics.avgMs.toFixed(1)} ms` : '—'}
            valueColor={Colors.warning}
            style={styles.metricCard}
          />
        </View>

        {/* ── SECTION: Weekly Trend ───────────────────────────────── */}
        {/* Mirrors _refresh_line_chart() — scanned vs faulty, 4 weeks */}
        <View style={styles.sectionHeader}>
          <BarChart3 size={13} color={Colors.accent} />
          <Text style={styles.sectionTitle}>WEEKLY TREND</Text>
        </View>
        <WeeklyTrendChart weeklySeries={dbStore.weeklySeries} />

        {/* ── SECTION: Defect Distribution ─────────────────────────── */}
        {/* Mirrors _refresh_pie_chart() */}
        <View style={styles.sectionHeader}>
          <Activity size={13} color={Colors.accent} />
          <Text style={styles.sectionTitle}>DEFECT DISTRIBUTION</Text>
        </View>
        <DefectPieChart distribution={dbStore.defectDistribution} />

        {/* ── SECTION: Daily Defect Trend ─────────────────────────── */}
        {/* Mirrors _refresh_bar_chart() */}
        <View style={styles.sectionHeader}>
          <TrendingDown size={13} color={Colors.accent} />
          <Text style={styles.sectionTitle}>DAILY DEFECT COUNT</Text>
          <Badge label="7-DAY" color={Colors.accent} size="sm" />
        </View>
        <View style={styles.chartCard}>
          <LineChart
            data={MOCK_LINE_CHART_DATA}
            width={SW - 64}
            height={160}
            chartConfig={CHART_CONFIG}
            bezier
            withShadow={false}
            style={styles.lineChart}
          />
        </View>

        {/* ── SECTION: Defect By Type (Bar) ────────────────────────── */}
        <DefectChart
          title="Defect Frequency by Type"
          data={MOCK_DEFECT_DISTRIBUTION.map((d) => ({
            label: d.name,
            value: d.count,
            color: d.color,
          }))}
        />

        {/* ── SECTION: Detection Log ──────────────────────────────── */}
        {/* Mirrors _refresh_log_table() — severity-colored rows */}
        <View style={styles.sectionHeader}>
          <Clock size={13} color={Colors.accent} />
          <Text style={styles.sectionTitle}>DETECTION LOG</Text>
          <Badge
            label={`${filteredLogs.length} entries`}
            color={Colors.textSecondary}
            size="sm"
          />
        </View>
        <DetectionLogTable logs={filteredLogs} limit={30} />

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

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
    paddingBottom: 8,
  },
  screenTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  screenSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeRow: { paddingHorizontal: 16, paddingBottom: 10 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, height: 36, color: Colors.textPrimary, fontSize: 12 },

  scroll: { flex: 1 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionSub: {
    fontSize: 9,
    color: Colors.textMuted,
    marginLeft: 4,
    fontStyle: 'italic',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  metricCard: { minWidth: '45%' },

  chartCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    overflow: 'hidden',
  },
  lineChart: { borderRadius: 12, marginLeft: -16 },

  bottomPad: { height: 32 },
});
