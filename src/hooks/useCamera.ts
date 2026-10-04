import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraStatus } from '../types/simulation';
import { classifyCameraError, isCameraSupported, listVideoInputs, stopStream } from '../utils/camera';

/**
 * Owns the MediaStream. The camera only starts from an explicit call to
 * start(), never automatically, and every track is stopped on stop() and on unmount.
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const tokenRef = useRef(0);
  const busyRef = useRef(false);

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>();

  const release = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }, []);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    busyRef.current = false;
    release();
    setStatus('idle');
  }, [release]);

  const start = useCallback(
    async (requestedId?: string) => {
      if (!isCameraSupported()) {
        setStatus('unsupported');
        return;
      }
      if (busyRef.current) return;
      busyRef.current = true;
      const token = ++tokenRef.current;
      release();
      setStatus('requesting');

      try {
        const size = { width: { ideal: 1280 }, height: { ideal: 720 } };
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: requestedId ? { deviceId: { exact: requestedId }, ...size } : { facingMode: 'user', ...size },
        });

        // The user may have stopped the camera or left the page while the prompt was open.
        if (token !== tokenRef.current) {
          stopStream(stream);
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          release();
          return;
        }

        video.srcObject = stream;
        if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('The video stream could not be loaded.'));
          });
          video.onloadedmetadata = null;
          video.onerror = null;
        }
        await video.play();
        if (token !== tokenRef.current) return;

        const [track] = stream.getVideoTracks();
        track?.addEventListener('ended', () => {
          if (token !== tokenRef.current) return;
          release();
          setStatus('unavailable');
        });

        setDeviceId(track?.getSettings().deviceId ?? requestedId);
        setStatus('active');

        const inputs = await listVideoInputs();
        if (token === tokenRef.current) setDevices(inputs);
      } catch (error) {
        if (token !== tokenRef.current) return;
        release();
        setStatus(classifyCameraError(error));
      } finally {
        if (token === tokenRef.current) busyRef.current = false;
      }
    },
    [release],
  );

  const switchCamera = useCallback(() => {
    if (devices.length < 2) return;
    const index = devices.findIndex((device) => device.deviceId === deviceId);
    const next = devices[(index + 1) % devices.length];
    void start(next.deviceId);
  }, [devices, deviceId, start]);

  // Keep the device list current when cameras are plugged in or removed.
  useEffect(() => {
    const media = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    if (!media) return;
    const refresh = () => {
      if (streamRef.current) void listVideoInputs().then(setDevices);
    };
    media.addEventListener('devicechange', refresh);
    return () => media.removeEventListener('devicechange', refresh);
  }, []);

  // Stop every track when the simulator unmounts.
  useEffect(() => {
    return () => {
      tokenRef.current += 1;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  return { videoRef, status, devices, start, stop, switchCamera };
}
