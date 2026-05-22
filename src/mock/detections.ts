import type { Detection, DetectionResult, ProductionLog, Alert } from '../types';

const ts = (minutesAgo: number): string => {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  return d.toISOString();
};

export const MOCK_LIVE_DETECTIONS: Detection[] = [
  {
    id: 'd001',
    defectClass: 'Missing Hole',
    confidence: 0.94,
    boundingBox: { x: 0.12, y: 0.18, width: 0.08, height: 0.07 },
    timestamp: ts(0.2),
    frameId: 4821,
  },
  {
    id: 'd002',
    defectClass: 'Short Circuit',
    confidence: 0.88,
    boundingBox: { x: 0.55, y: 0.35, width: 0.12, height: 0.09 },
    timestamp: ts(0.5),
    frameId: 4819,
  },
  {
    id: 'd003',
    defectClass: 'Spurious Copper',
    confidence: 0.76,
    boundingBox: { x: 0.72, y: 0.62, width: 0.1, height: 0.08 },
    timestamp: ts(1.1),
    frameId: 4815,
  },
  {
    id: 'd004',
    defectClass: 'Mouse Bite',
    confidence: 0.91,
    boundingBox: { x: 0.3, y: 0.7, width: 0.09, height: 0.06 },
    timestamp: ts(1.8),
    frameId: 4810,
  },
  {
    id: 'd005',
    defectClass: 'Open Circuit',
    confidence: 0.83,
    boundingBox: { x: 0.45, y: 0.22, width: 0.11, height: 0.08 },
    timestamp: ts(2.4),
    frameId: 4806,
  },
  {
    id: 'd006',
    defectClass: 'Spur',
    confidence: 0.69,
    boundingBox: { x: 0.2, y: 0.48, width: 0.07, height: 0.07 },
    timestamp: ts(3.2),
    frameId: 4800,
  },
];

export const MOCK_MANUAL_RESULT: DetectionResult = {
  id: 'res-001',
  detections: [
    {
      id: 'md001',
      defectClass: 'Missing Hole',
      confidence: 0.96,
      boundingBox: { x: 0.15, y: 0.2, width: 0.1, height: 0.09 },
      timestamp: ts(0),
    },
    {
      id: 'md002',
      defectClass: 'Short Circuit',
      confidence: 0.87,
      boundingBox: { x: 0.6, y: 0.4, width: 0.13, height: 0.1 },
      timestamp: ts(0),
    },
    {
      id: 'md003',
      defectClass: 'Spurious Copper',
      confidence: 0.72,
      boundingBox: { x: 0.35, y: 0.65, width: 0.09, height: 0.08 },
      timestamp: ts(0),
    },
  ],
  processedAt: ts(0),
  totalDefects: 3,
  qualityScore: 34,
  mostCommonDefect: 'Missing Hole',
  processingTimeMs: 312,
};

export const MOCK_PRODUCTION_LOGS: ProductionLog[] = [
  { id: 'log001', pcbId: 'PCB-2024-0841', timestamp: ts(2), defectCount: 0, status: 'pass', detections: [], lineId: 'LINE-A1', operatorId: 'OP-007' },
  { id: 'log002', pcbId: 'PCB-2024-0842', timestamp: ts(5), defectCount: 2, status: 'fail', detections: MOCK_LIVE_DETECTIONS.slice(0, 2), lineId: 'LINE-A1', operatorId: 'OP-007' },
  { id: 'log003', pcbId: 'PCB-2024-0843', timestamp: ts(8), defectCount: 0, status: 'pass', detections: [], lineId: 'LINE-A1', operatorId: 'OP-007' },
  { id: 'log004', pcbId: 'PCB-2024-0844', timestamp: ts(12), defectCount: 1, status: 'review', detections: MOCK_LIVE_DETECTIONS.slice(2, 3), lineId: 'LINE-A1', operatorId: 'OP-008' },
  { id: 'log005', pcbId: 'PCB-2024-0845', timestamp: ts(15), defectCount: 0, status: 'pass', detections: [], lineId: 'LINE-A1', operatorId: 'OP-008' },
  { id: 'log006', pcbId: 'PCB-2024-0846', timestamp: ts(18), defectCount: 3, status: 'fail', detections: MOCK_LIVE_DETECTIONS.slice(0, 3), lineId: 'LINE-A2', operatorId: 'OP-009' },
  { id: 'log007', pcbId: 'PCB-2024-0847', timestamp: ts(22), defectCount: 0, status: 'pass', detections: [], lineId: 'LINE-A2', operatorId: 'OP-009' },
  { id: 'log008', pcbId: 'PCB-2024-0848', timestamp: ts(28), defectCount: 1, status: 'review', detections: MOCK_LIVE_DETECTIONS.slice(4, 5), lineId: 'LINE-A2', operatorId: 'OP-009' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a001', type: 'defect', message: 'Critical: Short Circuit detected on PCB-0842', timestamp: ts(5), read: false, severity: 'high' },
  { id: 'a002', type: 'warning', message: 'Defect rate exceeded 15% threshold on LINE-A2', timestamp: ts(18), read: false, severity: 'medium' },
  { id: 'a003', type: 'system', message: 'Camera calibration recommended — drift detected', timestamp: ts(45), read: true, severity: 'low' },
  { id: 'a004', type: 'defect', message: 'Missing Hole cluster detected — 3 consecutive PCBs', timestamp: ts(120), read: true, severity: 'high' },
];
