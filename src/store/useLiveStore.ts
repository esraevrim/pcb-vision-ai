import { create } from 'zustand';
import type { Detection, SystemStatus } from '../types';

interface LiveStore {
  isStreaming: boolean;
  fps: number;
  detectionCount: number;
  activeDetections: Detection[];
  systemStatus: SystemStatus;
  recentDetections: Detection[];

  startStream: () => void;
  stopStream: () => void;
  setFPS: (fps: number) => void;
  addDetection: (detection: Detection) => void;
  setActiveDetections: (detections: Detection[]) => void;
  clearDetections: () => void;
}

export const useLiveStore = create<LiveStore>((set) => ({
  isStreaming: false,
  fps: 0,
  detectionCount: 0,
  activeDetections: [],
  recentDetections: [],
  systemStatus: {
    modelActive: true,
    cameraConnected: false,
    lineRunning: true,
    fps: 0,
    uptime: '08:14:32',
    lastDetection: '--',
  },

  startStream: () =>
    set((s) => ({
      isStreaming: true,
      systemStatus: { ...s.systemStatus, cameraConnected: true, fps: 28 },
    })),

  stopStream: () =>
    set((s) => ({
      isStreaming: false,
      activeDetections: [],
      systemStatus: { ...s.systemStatus, cameraConnected: false, fps: 0 },
    })),

  setFPS: (fps) =>
    set((s) => ({ fps, systemStatus: { ...s.systemStatus, fps } })),

  addDetection: (detection) =>
    set((s) => ({
      detectionCount: s.detectionCount + 1,
      recentDetections: [detection, ...s.recentDetections].slice(0, 20),
      systemStatus: { ...s.systemStatus, lastDetection: detection.timestamp },
    })),

  setActiveDetections: (detections) => set({ activeDetections: detections }),

  clearDetections: () => set({ activeDetections: [], detectionCount: 0, recentDetections: [] }),
}));
