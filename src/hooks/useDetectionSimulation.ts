import { useEffect, useRef, useCallback } from 'react';
import { useLiveStore } from '../store/useLiveStore';
import { useDatabaseStore } from '../store/useDatabaseStore';
import { MOCK_LIVE_DETECTIONS } from '../mock/detections';
import { generateId, randomInt } from '../utils/helpers';
import type { Detection } from '../types';
import { DEFECT_CLASSES } from '../constants/defects';

// Cycles through mock detections to simulate a live YOLO inference feed
export const useDetectionSimulation = () => {
  const { isStreaming, addDetection, setActiveDetections, setFPS } = useLiveStore();
  const { logDefect, logScan } = useDatabaseStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateTick = useCallback(() => {
    const inferenceMs = 28 + Math.random() * 20;
    const shouldDetect = Math.random() > 0.35;

    // Every tick = one PCB scanned — mirrors log_scan() call in pipeline
    logScan(1, inferenceMs);

    if (!shouldDetect) {
      setActiveDetections([]);
      return;
    }

    const count = randomInt(1, 3);
    const selected: Detection[] = [];

    for (let i = 0; i < count; i++) {
      const base = MOCK_LIVE_DETECTIONS[randomInt(0, MOCK_LIVE_DETECTIONS.length - 1)];
      const defectClass = DEFECT_CLASSES[randomInt(0, DEFECT_CLASSES.length - 1)];
      const confidence = 0.55 + Math.random() * 0.44;
      const bbox = {
        x: 0.05 + Math.random() * 0.7,
        y: 0.05 + Math.random() * 0.7,
        width: 0.07 + Math.random() * 0.12,
        height: 0.06 + Math.random() * 0.1,
      };

      selected.push({
        ...base,
        id: generateId(),
        defectClass,
        confidence,
        timestamp: new Date().toISOString(),
        boundingBox: bbox,
      });

      // Feed into database service — mirrors log_defect() call after YOLO inference
      logDefect({
        defectType:  defectClass,
        confidence,
        bboxX:       Math.round(bbox.x * 640),
        bboxY:       Math.round(bbox.y * 480),
        bboxW:       Math.round(bbox.width * 640),
        bboxH:       Math.round(bbox.height * 480),
        inferenceMs,
      });
    }

    setActiveDetections(selected);
    selected.forEach((d) => addDetection(d));
  }, [addDetection, setActiveDetections, logDefect, logScan]);

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
