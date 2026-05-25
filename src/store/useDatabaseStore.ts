/**
 * useDatabaseStore.ts
 * Zustand wrapper around databaseService.ts
 *
 * Mirrors DashboardWidget's refresh_all() / refresh_metrics() pattern,
 * including the 5-second auto-refresh from PyQt6's QTimer.
 */

import { create } from 'zustand';
import * as db from '../services/databaseService';
import type {
  DefectLog, DailyStats, WeeklyStats,
  DefectTypeCount, MonthlySummary, LogDefectParams, DateRange,
} from '../types/database';

interface DatabaseStore {
  // Data state
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
  dailySeries: DailyStats[];
  defectDistribution: DefectTypeCount[];
  recentLogs: DefectLog[];
  monthlySummary: MonthlySummary;
  weeklySeries: WeeklyStats[];

  // UI state
  selectedRange: DateRange;
  isRefreshing: boolean;

  // Actions — matching database.py write operations
  logDefect: (params: LogDefectParams) => void;
  logScan: (count?: number, inferenceMs?: number) => void;

  // Refresh — mirrors DashboardWidget.refresh_all()
  refreshAll: () => void;
  setRange: (range: DateRange) => void;
}

const now = new Date();

const initialState = {
  dailyStats:          db.getDailyStats(),
  weeklyStats:         db.getWeeklyStats(),
  dailySeries:         db.getDailySeries(7),
  defectDistribution:  db.getDefectTypeDistribution(7),
  recentLogs:          db.getRecentLogs(30),
  monthlySummary:      db.getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
  weeklySeries:        db.getWeeklySeries(),
  selectedRange:       'week' as DateRange,
  isRefreshing:        false,
};

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  ...initialState,

  logDefect: (params) => {
    db.logDefect(params);
    get().refreshAll();
  },

  logScan: (count = 1, inferenceMs = 0) => {
    db.logScan(count, inferenceMs);
    const updated = db.getDailyStats();
    set({ dailyStats: updated });
  },

  refreshAll: () => {
    set({ isRefreshing: true });
    const n = new Date();
    set({
      dailyStats:         db.getDailyStats(),
      weeklyStats:        db.getWeeklyStats(),
      dailySeries:        db.getDailySeries(7),
      defectDistribution: db.getDefectTypeDistribution(7),
      recentLogs:         db.getRecentLogs(30),
      monthlySummary:     db.getMonthlySummary(n.getFullYear(), n.getMonth() + 1),
      weeklySeries:       db.getWeeklySeries(),
      isRefreshing:       false,
    });
  },

  setRange: (range) => set({ selectedRange: range }),
}));
