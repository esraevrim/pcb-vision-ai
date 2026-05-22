import { useState, useCallback } from 'react';
import { Camera } from 'expo-camera';

export const useCameraPermission = () => {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status as 'granted' | 'denied' | 'undetermined');
    return status === 'granted';
  }, []);

  return { permission, requestPermission };
};
