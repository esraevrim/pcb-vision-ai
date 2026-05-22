import { useEffect, useRef, useCallback } from 'react';
import { useLiveStore } from '../store/useLiveStore';
import { MOCK_LIVE_DETECTIONS } from '../mock/detections';
import { generateId, randomInt } from '../utils/helpers';
import type { Detection } from '../types';
import { DEFECT_CLASSES } from '../constants/defects';

// Cycles through mock detections to simulate a live YOLO inference feed
export const useDetectionSimulation = () => {
  const { isStreaming, addDetection, setActiveDetections, setFPS } = useLiveStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateTick = useCallback(() => {
    const shouldDetect = Math.random() > 0.35;
    if (!shouldDetect) {
      setActiveDetections([]);
      return;
    }

    const count = randomInt(1, 3);
    const selected: Detection[] = [];

    for (let i = 0; i < count; i++) {
      const base = MOCK_LIVE_DETECTIONS[randomInt(0, MOCK_LIVE_DETECTIONS.length - 1)];
      selected.push({
        ...base,
        id: generateId(),
        defectClass: DEFECT_CLASSES[randomInt(0, DEFECT_CLASSES.length - 1)],
        confidence: 0.55 + Math.random() * 0.44,
        timestamp: new Date().toISOString(),
        boundingBox: {
          x: 0.05 + Math.random() * 0.7,
          y: 0.05 + Math.random() * 0.7,
          width: 0.07 + Math.random() * 0.12,
          height: 0.06 + Math.random() * 0.1,
        },
      });
    }

    setActiveDetections(selected);
    selected.forEach((d) => addDetection(d));
  }, [addDetection, setActiveDetections]);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(simulateTick, 1800);
      fpsIntervalRef.current = setInterval(() => {
        setFPS(randomInt(26, 30));
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fpsIntervalRef.current) clearInterval(fpsIntervalRef.current);
      setFPS(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fpsIntervalRef.current) clearInterval(fpsIntervalRef.current);
    };
  }, [isStreaming, simulateTick, setFPS]);
};
