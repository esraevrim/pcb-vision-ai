// TypeScript mirror of database.py data structures
// These types match the Python SQLite schema 1-to-1

export interface DefectLog {
  id: number;
  timestamp: string;
  defectType: string;
  confidence: number;
  bboxX?: number;
  bboxY?: number;
  bboxW?: number;
  bboxH?: number;
  imagePath?: string;
  cameraId: number;
}

export interface DailyStats {
  date: string;
  totalScanned: number;
  totalFaulty: number;
  defectRate: number;
  avgInferenceMs: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalScanned: number;
  totalFaulty: number;
  avgDefectRate: number;
  avgInferenceMs: number;
  mostCommonDefect: string;
}

export interface DefectTypeCount {
  defectType: string;
  count: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalScanned: number;
  totalFaulty: number;
  defectRate: number;
}

// Matches log_defect() signature from database.py
export interface LogDefectParams {
  defectType: string;
  confidence: number;
  bbox?: [number, number, number, number];
  imagePath?: string;
  cameraId?: number;
  inferenceMs?: number;
}

export type DateRange = 'today' | 'week' | 'month';
