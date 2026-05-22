import { delay, generateId } from '../utils/helpers';
import { MOCK_MANUAL_RESULT } from '../mock/detections';
import type { DetectionResult } from '../types';

// Simulates async PCB defect detection pipeline with realistic timing
export const runManualDetection = async (
  imageUri: string,
  onProgress: (progress: number) => void
): Promise<DetectionResult> => {
  onProgress(10);
  await delay(300);  // preprocessing

  onProgress(30);
  await delay(500);  // model inference

  onProgress(65);
  await delay(400);  // NMS + postprocessing

  onProgress(85);
  await delay(200);  // result formatting

  onProgress(100);
  await delay(150);

  return {
    ...MOCK_MANUAL_RESULT,
    id: generateId(),
    imageUri,
    processedAt: new Date().toISOString(),
  };
};
