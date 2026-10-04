import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { SimulationMode } from '../types/simulation';
import type { Matrix3 } from '../utils/colorMatrices';
import { processFrame, simulationMatrix } from '../utils/imageProcessor';
import type { FramePair } from '../utils/snapshot';

/** Frames are downscaled to this width before processing to keep ordinary laptops smooth. */
const MAX_PROCESSING_WIDTH = 800;

interface Options {
  videoRef: RefObject<HTMLVideoElement>;
  active: boolean;
  mode: SimulationMode;
  /** 0 to 1 */
  intensity: number;
  compare: boolean;
}

export interface SimulationStats {
  fps: number | null;
  width: number;
  height: number;
}

/**
 * Runs the video -> canvas -> pixel transform loop. Mode, intensity and layout
 * live in refs, so changing them never restarts the camera or the loop, and
 * nothing re-renders React per frame (stats update about once per second).
 */
export function useSimulation({ videoRef, active, mode, intensity, compare }: Options) {
  const outputRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const settingsRef = useRef<{ matrix: Matrix3 | null; compare: boolean }>({
    matrix: simulationMatrix(mode, intensity),
    compare,
  });
  const dirtyRef = useRef(true);
  const [stats, setStats] = useState<SimulationStats>({ fps: null, width: 0, height: 0 });

  useEffect(() => {
    settingsRef.current = { matrix: simulationMatrix(mode, intensity), compare };
    dirtyRef.current = true;
  }, [mode, intensity, compare]);

  useEffect(() => {
    const output = outputRef.current;
    const video = videoRef.current;

    if (!active) {
      output?.getContext('2d')?.clearRect(0, 0, output.width, output.height);
      setStats((previous) => (previous.fps === null ? previous : { ...previous, fps: null }));
      return;
    }
    if (!video || !output) return;

    const source = sourceRef.current ?? (sourceRef.current = document.createElement('canvas'));
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    const outputCtx = output.getContext('2d');
    if (!sourceCtx || !outputCtx) return;

    let frameId = 0;
    let lastVideoTime = -1;
    let width = 0;
    let height = 0;
    let outImage: ImageData | null = null;
    let processed = 0;
    let windowStart = performance.now();

    const render = (now: number) => {
      frameId = requestAnimationFrame(render);

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0) return;
      // Skip when the camera has not produced a new frame, unless settings changed.
      if (video.currentTime === lastVideoTime && !dirtyRef.current) return;
      lastVideoTime = video.currentTime;
      dirtyRef.current = false;

      const scale = Math.min(1, MAX_PROCESSING_WIDTH / video.videoWidth);
      const w = Math.max(1, Math.round(video.videoWidth * scale));
      const h = Math.max(1, Math.round(video.videoHeight * scale));
      if (w !== width || h !== height) {
        width = w;
        height = h;
        source.width = w;
        source.height = h;
        output.width = w;
        output.height = h;
        outImage = new ImageData(w, h);
        setStats((previous) => ({ ...previous, width: w, height: h }));
      }
      if (!outImage) return;

      sourceCtx.drawImage(video, 0, 0, w, h);
      const frame = sourceCtx.getImageData(0, 0, w, h);
      processFrame(frame, outImage, settingsRef.current.matrix);
      outputCtx.putImageData(outImage, 0, 0);

      const original = originalRef.current;
      if (settingsRef.current.compare && original) {
        if (original.width !== w || original.height !== h) {
          original.width = w;
          original.height = h;
        }
        original.getContext('2d')?.drawImage(source, 0, 0);
      }

      processed += 1;
      const elapsed = now - windowStart;
      if (elapsed >= 1000) {
        const fps = Math.round((processed * 1000) / elapsed);
        setStats((previous) => ({ ...previous, fps }));
        processed = 0;
        windowStart = now;
      }
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [active, videoRef]);

  /** The latest original frame and its simulated counterpart, from the same loop pass. */
  const captureFrames = useCallback((): FramePair | null => {
    const source = sourceRef.current;
    const simulated = outputRef.current;
    if (!active || !source || !simulated || source.width === 0) return null;
    return { original: source, simulated };
  }, [active]);

  return { outputRef, originalRef, stats, captureFrames };
}
