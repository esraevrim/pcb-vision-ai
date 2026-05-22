// Additional system event logs and audit trail mock data
export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source: string;
}

const ts = (minutesAgo: number): string =>
  new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

export const SYSTEM_LOGS: SystemLog[] = [
  { id: 'sl001', level: 'info',  message: 'Model YOLOv12-PCB loaded successfully (312ms)', timestamp: ts(480), source: 'InferenceEngine' },
  { id: 'sl002', level: 'info',  message: 'Camera stream initialized — 1920x1080 @ 30fps', timestamp: ts(478), source: 'CameraManager' },
  { id: 'sl003', level: 'info',  message: 'Production line LINE-A1 started', timestamp: ts(470), source: 'LineController' },
  { id: 'sl004', level: 'warn',  message: 'Confidence below threshold for frame #3821 — skipped', timestamp: ts(320), source: 'InferenceEngine' },
  { id: 'sl005', level: 'error', message: 'Short Circuit detected: PCB-2024-0842 — routed to reject bin', timestamp: ts(180), source: 'QualityGate' },
  { id: 'sl006', level: 'warn',  message: 'Defect rate spike detected: 16.0% on 2026-05-18', timestamp: ts(160), source: 'Analytics' },
  { id: 'sl007', level: 'info',  message: 'Daily report generated and archived', timestamp: ts(60), source: 'ReportService' },
  { id: 'sl008', level: 'info',  message: 'Batch PCB-0840 to PCB-0860 completed — pass rate 87%', timestamp: ts(45), source: 'LineController' },
  { id: 'sl009', level: 'warn',  message: 'Camera module temperature: 68°C — monitor advised', timestamp: ts(30), source: 'Hardware' },
  { id: 'sl010', level: 'info',  message: 'Auto-calibration cycle completed', timestamp: ts(15), source: 'CameraManager' },
  { id: 'sl011', level: 'info',  message: 'Inference latency avg: 31ms (±4ms)', timestamp: ts(5), source: 'InferenceEngine' },
  { id: 'sl012', level: 'info',  message: 'System health check passed — all subsystems nominal', timestamp: ts(1), source: 'HealthMonitor' },
];
