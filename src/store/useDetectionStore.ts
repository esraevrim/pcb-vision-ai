import { create } from 'zustand';
import type { DetectionResult } from '../types';

interface DetectionStore {
  imageUri: string | null;
  isProcessing: boolean;
  result: DetectionResult | null;
  processingProgress: number;

  setImage: (uri: string) => void;
  startProcessing: () => void;
  setResult: (result: DetectionResult) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useDetectionStore = create<DetectionStore>((set) => ({
  imageUri: null,
  isProcessing: false,
  result: null,
  processingProgress: 0,

  setImage: (uri) => set({ imageUri: uri, result: null }),
  startProcessing: () => set({ isProcessing: true, processingProgress: 0 }),
  setResult: (result) => set({ result, isProcessing: false, processingProgress: 100 }),
  setProgress: (progress) => set({ processingProgress: progress }),
  reset: () => set({ imageUri: null, isProcessing: false, result: null, processingProgress: 0 }),
}));
