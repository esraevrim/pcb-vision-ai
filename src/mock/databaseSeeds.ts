// Mirrors _seed_demo_data() from dashboard_widget.py
// Provides realistic 7-day seeded records for all dashboard queries

import type { DefectLog, DailyStats, WeeklyStats } from '../types/database';

const pastDate = (daysAgo: number, hour = 12, minute = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString().replace('T', ' ').slice(0, 19);
};

const pastDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

// Defect distribution weights matching Python demo: Short Circuit 38%, Missing Hole 27%, Spur 18%, Spurious Copper 12%, Open Circuit 5%
const DEFECTS = ['Short Circuit', 'Missing Hole', 'Spur', 'Spurious Copper', 'Open Circuit', 'Mouse Bite'];
const WEIGHTS = [0.38, 0.27, 0.18, 0.09, 0.05, 0.03];

function weightedRandom(): string {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    cum += WEIGHTS[i];
    if (r <= cum) return DEFECTS[i];
  }
  return DEFECTS[0];
}

// Seeded daily stats — mirrors daily_stats table rows
export const SEEDED_DAILY_STATS: DailyStats[] = [
  { date: pastDateStr(6), totalScanned: 180, totalFaulty: 28, defectRate: 15.6, avgInferenceMs: 34.2 },
  { date: pastDateStr(5), totalScanned: 195, totalFaulty: 22, defectRate: 11.3, avgInferenceMs: 31.8 },
  { date: pastDateStr(4), totalScanned: 210, totalFaulty: 35, defectRate: 16.7, avgInferenceMs: 38.1 },
  { date: pastDateStr(3), totalScanned: 165, totalFaulty: 19, defectRate: 11.5, avgInferenceMs: 29.4 },
  { date: pastDateStr(2), totalScanned: 220, totalFaulty: 31, defectRate: 14.1, avgInferenceMs: 36.0 },
  { date: pastDateStr(1), totalScanned: 188, totalFaulty: 41, defectRate: 21.8, avgInferenceMs: 33.5 },
  { date: pastDateStr(0), totalScanned: 147, totalFaulty: 18, defectRate: 12.2, avgInferenceMs: 31.0 },
];

// Seeded defect logs — mirrors defect_logs table rows
let _logIdCounter = 1;
const makeLog = (daysAgo: number, hour: number, defectType: string, confidence: number): DefectLog => ({
  id: _logIdCounter++,
  timestamp: pastDate(daysAgo, hour, Math.floor(Math.random() * 60)),
  defectType,
  confidence,
  bboxX: 40 + Math.floor(Math.random() * 360),
  bboxY: 30 + Math.floor(Math.random() * 260),
  bboxW: 30 + Math.floor(Math.random() * 100),
  bboxH: 30 + Math.floor(Math.random() * 90),
  imagePath: `images/day${daysAgo}/pcb_${1000 + _logIdCounter}.jpg`,
  cameraId: 1,
});

export const SEEDED_DEFECT_LOGS: DefectLog[] = [
  // Today
  makeLog(0, 8,  'Short Circuit',  0.96),
  makeLog(0, 9,  'Missing Hole',   0.91),
  makeLog(0, 10, 'Short Circuit',  0.88),
  makeLog(0, 11, 'Spur',           0.74),
  makeLog(0, 12, 'Missing Hole',   0.93),
  makeLog(0, 13, 'Spurious Copper',0.78),
  makeLog(0, 14, 'Short Circuit',  0.95),
  makeLog(0, 15, 'Open Circuit',   0.82),
  makeLog(0, 16, 'Mouse Bite',     0.69),
  makeLog(0, 17, 'Missing Hole',   0.87),
  // Yesterday
  makeLog(1, 7,  'Short Circuit',  0.97), makeLog(1, 8,  'Missing Hole',   0.89),
  makeLog(1, 9,  'Short Circuit',  0.91), makeLog(1, 10, 'Spur',           0.76),
  makeLog(1, 11, 'Short Circuit',  0.94), makeLog(1, 12, 'Missing Hole',   0.88),
  makeLog(1, 13, 'Open Circuit',   0.83), makeLog(1, 14, 'Spurious Copper',0.72),
  makeLog(1, 15, 'Short Circuit',  0.96), makeLog(1, 16, 'Spur',           0.68),
  makeLog(1, 17, 'Missing Hole',   0.91), makeLog(1, 18, 'Short Circuit',  0.87),
  // 2 days ago
  makeLog(2, 8,  'Short Circuit',  0.93), makeLog(2, 9,  'Missing Hole',   0.86),
  makeLog(2, 10, 'Spur',           0.71), makeLog(2, 11, 'Short Circuit',  0.95),
  makeLog(2, 12, 'Mouse Bite',     0.77), makeLog(2, 13, 'Missing Hole',   0.90),
  makeLog(2, 14, 'Open Circuit',   0.84), makeLog(2, 15, 'Spurious Copper',0.69),
  makeLog(2, 16, 'Short Circuit',  0.92), makeLog(2, 17, 'Missing Hole',   0.88),
  // 3 days ago
  makeLog(3, 9,  'Short Circuit',  0.94), makeLog(3, 10, 'Missing Hole',   0.87),
  makeLog(3, 11, 'Spur',           0.73), makeLog(3, 12, 'Short Circuit',  0.91),
  makeLog(3, 14, 'Missing Hole',   0.89), makeLog(3, 15, 'Open Circuit',   0.80),
  makeLog(3, 16, 'Short Circuit',  0.96), makeLog(3, 17, 'Spurious Copper',0.75),
  // 4-6 days ago
  makeLog(4, 10, 'Short Circuit',  0.95), makeLog(4, 12, 'Missing Hole',   0.88),
  makeLog(4, 14, 'Spur',           0.70), makeLog(4, 15, 'Short Circuit',  0.93),
  makeLog(5, 9,  'Short Circuit',  0.97), makeLog(5, 11, 'Missing Hole',   0.85),
  makeLog(5, 13, 'Open Circuit',   0.81), makeLog(5, 15, 'Short Circuit',  0.90),
  makeLog(6, 10, 'Short Circuit',  0.94), makeLog(6, 12, 'Missing Hole',   0.87),
  makeLog(6, 14, 'Spur',           0.72), makeLog(6, 16, 'Spurious Copper',0.76),
];

// Weekly stats for 4 weeks (mirrors get_weekly_stats for chart rendering)
export const SEEDED_WEEKLY_STATS: WeeklyStats[] = [
  {
    weekStart: pastDateStr(27), weekEnd: pastDateStr(21),
    totalScanned: 920, totalFaulty: 118, avgDefectRate: 12.8,
    avgInferenceMs: 33.4, mostCommonDefect: 'Short Circuit',
  },
  {
    weekStart: pastDateStr(20), weekEnd: pastDateStr(14),
    totalScanned: 1050, totalFaulty: 145, avgDefectRate: 13.8,
    avgInferenceMs: 34.1, mostCommonDefect: 'Short Circuit',
  },
  {
    weekStart: pastDateStr(13), weekEnd: pastDateStr(7),
    totalScanned: 980, totalFaulty: 127, avgDefectRate: 13.0,
    avgInferenceMs: 32.8, mostCommonDefect: 'Short Circuit',
  },
  {
    weekStart: pastDateStr(6), weekEnd: pastDateStr(0),
    totalScanned: 1305, totalFaulty: 194, avgDefectRate: 14.9,
    avgInferenceMs: 33.4, mostCommonDefect: 'Short Circuit',
  },
];
