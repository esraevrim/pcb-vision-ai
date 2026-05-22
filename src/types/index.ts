import type { DefectClass } from '../constants/defects';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  defectClass: DefectClass;
  confidence: number;
  boundingBox: BoundingBox;
  timestamp: string;
  frameId?: number;
}

export interface DetectionResult {
  id: string;
  imageUri?: string;
  detections: Detection[];
  processedAt: string;
  totalDefects: number;
  qualityScore: number;
  mostCommonDefect?: DefectClass;
  processingTimeMs: number;
}

export interface ProductionLog {
  id: string;
  pcbId: string;
  timestamp: string;
  defectCount: number;
  status: 'pass' | 'fail' | 'review';
  detections: Detection[];
  lineId: string;
  operatorId: string;
}

export interface DailyStats {
  date: string;
  totalPCBs: number;
  defectivePCBs: number;
  defectRate: number;
  defectBreakdown: Partial<Record<DefectClass, number>>;
}

export interface SystemStatus {
  modelActive: boolean;
  cameraConnected: boolean;
  lineRunning: boolean;
  fps: number;
  uptime: string;
  lastDetection: string;
}

export interface KPIData {
  label: string;
  value: string | number;
  change: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Alert {
  id: string;
  type: 'defect' | 'system' | 'warning';
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'low';
}
