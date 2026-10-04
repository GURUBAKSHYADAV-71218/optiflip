import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CameraControls from './CameraControls';
import CameraView from './CameraView';
import IntensitySlider from './IntensitySlider';
import ModeSelector from './ModeSelector';
import SnapshotPreview from './SnapshotPreview';
import { useCamera } from '../hooks/useCamera';
import { useCameraStatus } from '../hooks/useCameraStatus';
import { useSimulation } from '../hooks/useSimulation';
import { getModeInfo, type SimulationMode, type ViewLayout } from '../types/simulation';
import { cx } from '../utils/cx';
import { captureSnapshot, revokeSnapshot, type Snapshot } from '../utils/snapshot';

export default function SimulatorWorkspace({ highlighted = false }: { highlighted?: boolean }) {
  const camera = useCamera();
  const { setStatus } = useCameraStatus();
  const stageRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<SimulationMode>('deuteranopia');
  const [intensity, setIntensity] = useState(100);
  const [layout, setLayout] = useState<ViewLayout>('simulated');
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const active = camera.status === 'active';
  const modeInfo = getModeInfo(mode);
  const fullscreenSupported = typeof document !== 'undefined' && document.fullscreenEnabled === true;

  const simulation = useSimulation({
    videoRef: camera.videoRef,
    active,
    mode,
    intensity: intensity / 100,
    compare: layout === 'split',
  });

  // Mirror the real camera state into the navbar; reset when leaving the page.
  useEffect(() => setStatus(camera.status), [camera.status, setStatus]);
  useEffect(() => () => setStatus('idle'), [setStatus]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Release snapshot object URLs when replaced, dismissed or unmounted.
  useEffect(() => () => revokeSnapshot(snapshot), [snapshot]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleStart = useCallback(() => {
    setNotice(null);
    void camera.start();
  }, [camera]);

  const handleSnapshot = useCallback(async () => {
    const frames = simulation.captureFrames();
    if (!frames) {
      setNotice('Start the camera before taking a snapshot.');
      return;
    }
    try {
      const next = await captureSnapshot(frames, { mode, modeLabel: modeInfo.label, intensity });
      setSnapshot(next);
    } catch {
      setNotice('The snapshot could not be created. Please try again.');
    }
  }, [simulation, mode, modeInfo.label, intensity]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stageRef.current?.requestFullscreen();
    } catch {
      setNotice('Your browser blocked fullscreen.');
    }
  }, []);

  return (
    <section
      aria-labelledby="simulator-title"
      className={cx(
        'rounded-3xl border bg-ink-900/70 p-4 transition-[border-color,box-shadow] duration-500 sm:p-6',
        highlighted ? 'border-aqua/70 shadow-[0_0_0_5px_rgba(82,208,245,0.14)]' : 'border-white/10',
      )}
    >
      <div className="mb-5">
        <h2 id="simulator-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Live simulator
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-mute">
          Your camera, passed through a color vision model frame by frame. Objects keep their shape and position; only the colors change.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <CameraView
            videoRef={camera.videoRef}
            outputRef={simulation.outputRef}
            originalRef={simulation.originalRef}
            stageRef={stageRef}
            status={camera.status}
            layout={layout}
            simulatedLabel={`${modeInfo.label}${mode === 'normal' ? '' : ` ${intensity}%`}`}
            stats={simulation.stats}
            isFullscreen={isFullscreen}
            onStart={handleStart}
            onExitFullscreen={toggleFullscreen}
          />

          <CameraControls
            status={camera.status}
            canSwitch={camera.devices.length > 1}
            fullscreenSupported={fullscreenSupported}
            isFullscreen={isFullscreen}
            layout={layout}
            onStart={handleStart}
            onStop={camera.stop}
            onSwitch={camera.switchCamera}
            onSnapshot={handleSnapshot}
            onFullscreen={toggleFullscreen}
            onLayout={setLayout}
          />

          <IntensitySlider value={intensity} disabled={mode === 'normal'} onChange={setIntensity} />

          <p role="status" className="min-h-5 text-sm text-blush">
            {notice}
          </p>

          <AnimatePresence>
            {snapshot && <SnapshotPreview key={snapshot.takenAt} snapshot={snapshot} onDismiss={() => setSnapshot(null)} />}
          </AnimatePresence>
        </div>

        <ModeSelector mode={mode} intensity={intensity / 100} onChange={setMode} />
      </div>
    </section>
  );
}
