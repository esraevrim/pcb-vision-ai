/**
 * databaseService.ts
 * TypeScript port of database.py
 *
 * Mirrors the full API of the Python SQLite module:
 *   log_defect()  → logDefect()
 *   log_scan()    → logScan()
 *   get_daily_stats()           → getDailyStats()
 *   get_weekly_stats()          → getWeeklyStats()
 *   get_daily_series()          → getDailySeries()
 *   get_defect_type_distribution() → getDefectTypeDistribution()
 *   get_recent_logs()           → getRecentLogs()
 *   get_monthly_summary()       → getMonthlySummary()
 *
 * Currently backed by in-memory mock data (seeded from databaseSeeds.ts).
 * Replace the store arrays with REST API calls when the Python backend is ready.
 */

import type {
  DefectLog, DailyStats, WeeklyStats,
  DefectTypeCount, MonthlySummary, LogDefectParams,
} from '../types/database';
import {
  SEEDED_DAILY_STATS,
  SEEDED_DEFECT_LOGS,
  SEEDED_WEEKLY_STATS,
} from '../mock/databaseSeeds';

// ---------------------------------------------------------------------------
// In-memory store (replaces SQLite for the frontend-only build)
// ---------------------------------------------------------------------------

let _logs: DefectLog[]      = [...SEEDED_DEFECT_LOGS];
let _daily: DailyStats[]    = [...SEEDED_DAILY_STATS];
let _weekly: WeeklyStats[]  = [...SEEDED_WEEKLY_STATS];
let _nextId = _logs.length + 1;

const todayStr = (): string => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Write operations — mirrors database.py write section
// ---------------------------------------------------------------------------

/**
 * log_defect() — record one defect detection event.
 * Returns the synthetic row id.
 */
export function logDefect(params: LogDefectParams): number {
  const {
    defectType, confidence,
    bbox, imagePath,
    cameraId = 1, inferenceMs = 0,
  } = params;

  const newLog: DefectLog = {
    id: _nextId++,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    defectType,
    confidence,
    bboxX: bbox?.[0], bboxY: bbox?.[1],
    bboxW: bbox?.[2], bboxH: bbox?.[3],
    imagePath,
    cameraId,
  };

  _logs = [newLog, ..._logs];
  _updateDailyStats(todayStr(), inferenceMs, 0, true);
  return newLog.id;
}

/**
 * log_scan() — record that a board was processed (defect or clean).
 */
export function logScan(scannedCount = 1, inferenceMs = 0): void {
  _updateDailyStats(todayStr(), inferenceMs, scannedCount, false);
}

/** _update_daily_stats() — upsert the today row in _daily. */
function _updateDailyStats(
  date: string,
  inferenceMs: number,
  scannedDelta: number,
  faultyIncrement: boolean,
): void {
  const idx = _daily.findIndex((r) => r.date === date);
  if (idx === -1) {
    _daily = [
      ...(_daily),
      {
        date,
        totalScanned: scannedDelta,
        totalFaulty: faultyIncrement ? 1 : 0,
        defectRate: 0,
        avgInferenceMs: inferenceMs,
      },
    ];
    return;
  }

  const prev = _daily[idx];
  const alpha = 0.1;
  const newAvg = prev.avgInferenceMs === 0
    ? inferenceMs
    : prev.avgInferenceMs * (1 - alpha) + inferenceMs * alpha;

  const newScanned = prev.totalScanned + scannedDelta;
  const newFaulty  = prev.totalFaulty + (faultyIncrement ? 1 : 0);
  const rate = newScanned > 0 ? (newFaulty / newScanned) * 100 : 0;

  const updated: DailyStats = {
    ...prev,
    totalScanned: newScanned,
    totalFaulty: newFaulty,
    defectRate: Math.round(rate * 100) / 100,
    avgInferenceMs: Math.round(newAvg * 100) / 100,
  };

  _daily = [..._daily.slice(0, idx), updated, ..._daily.slice(idx + 1)];
}

// ---------------------------------------------------------------------------
// Read operations — mirrors database.py read section
// ---------------------------------------------------------------------------

/** get_daily_stats() — stats for one day (default today). */
export function getDailyStats(date?: string): DailyStats {
  const d = date ?? todayStr();
  return (
    _daily.find((r) => r.date === d) ?? {
      date: d, totalScanned: 0, totalFaulty: 0,
      defectRate: 0, avgInferenceMs: 0,
    }
  );
}

/** get_weekly_stats() — aggregated stats for current week. */
export function getWeeklyStats(weekIndex = 3): WeeklyStats {
  return _weekly[weekIndex] ?? _weekly[_weekly.length - 1];
}

/** get_daily_series() — last N days for bar chart. */
export function getDailySeries(days = 7): DailyStats[] {
  return _daily.slice(-days);
}

/** get_defect_type_distribution() — per-type counts for pie chart. */
export function getDefectTypeDistribution(days = 7): DefectTypeCount[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const counts: Record<string, number> = {};
  for (const log of _logs) {
    if (new Date(log.timestamp) >= cutoff) {
      counts[log.defectType] = (counts[log.defectType] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([defectType, count]) => ({ defectType, count }))
    .sort((a, b) => b.count - a.count);
}

/** get_recent_logs() — most recent detection records. */
export function getRecentLogs(limit = 30): DefectLog[] {
  return _logs.slice(0, limit);
}

/** get_monthly_summary() — aggregate for a calendar month. */
export function getMonthlySummary(year: number, month: number): MonthlySummary {
  const prefix = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`;
  const rows = _daily.filter((r) => r.date.startsWith(prefix));

  const totalScanned = rows.reduce((s, r) => s + r.totalScanned, 0);
  const totalFaulty  = rows.reduce((s, r) => s + r.totalFaulty, 0);
  const defectRate   = totalScanned > 0
    ? Math.round((totalFaulty / totalScanned) * 10000) / 100
    : 0;

  return { year, month, totalScanned, totalFaulty, defectRate };
}

/** get_weekly_series() — 4-week series for line chart. */
export function getWeeklySeries(): WeeklyStats[] {
  return _weekly;
}
