import { Camera, Info, Loader2, Minimize } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RefObject } from 'react';
import ComparisonView from './ComparisonView';
import type { CameraStatus, ViewLayout } from '../types/simulation';
import type { SimulationStats } from '../hooks/useSimulation';
import { cx } from '../utils/cx';

type Message = { title: string; body: string; action?: string };

const MESSAGES: Record<Exclude<CameraStatus, 'active' | 'requesting'>, Message> = {
  idle: {
    title: 'Camera is off',
    body: 'Start the camera to run the simulation on your own surroundings. Frames stay in your browser.',
    action: 'Start camera',
  },
  denied: {
    title: 'Camera access is blocked',
    body: 'Open your browser’s site settings (the camera or lock icon beside the address bar), set Camera to Allow, then try again.',
    action: 'Try again',
  },
  'no-device': {
    title: 'No camera found',
    body: 'Connect a webcam and make sure it is enabled in your system settings, then check again.',
    action: 'Check again',
  },
  unavailable: {
    title: 'Camera unavailable',
    body: 'Another app or browser tab may be using the camera, or it was disconnected. Close other apps using it and try again.',
    action: 'Try again',
  },
  unsupported: {
    title: 'Camera not available here',
    body: 'Camera access needs a current browser and a secure (HTTPS) page. Try the latest Chrome, Edge, Firefox or Safari over HTTPS.',
  },
};

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  outputRef: RefObject<HTMLCanvasElement>;
  originalRef: RefObject<HTMLCanvasElement>;
  stageRef: RefObject<HTMLDivElement>;
  status: CameraStatus;
  layout: ViewLayout;
  simulatedLabel: string;
  stats: SimulationStats;
  isFullscreen: boolean;
  onStart: () => void;
  onExitFullscreen: () => void;
}

export default function CameraView({
  videoRef,
  outputRef,
  originalRef,
  stageRef,
  status,
  layout,
  simulatedLabel,
  stats,
  isFullscreen,
  onStart,
  onExitFullscreen,
}: Props) {
  const active = status === 'active';
  const split = layout === 'split';
  const message = status === 'active' || status === 'requesting' ? null : MESSAGES[status];

  return (
    <div
      ref={stageRef}
      className={cx(
        'relative overflow-hidden bg-black ring-1 ring-white/10',
        isFullscreen ? 'h-full w-full' : cx('rounded-2xl', split ? 'aspect-[4/5] sm:aspect-video' : 'aspect-video'),
      )}
    >
      {/* Off-screen source element: it must stay mounted and playing so frames can be drawn from it. */}
      <video ref={videoRef} playsInline muted aria-hidden="true" className="pointer-events-none absolute h-px w-px opacity-0" />

      <ComparisonView outputRef={outputRef} originalRef={originalRef} layout={layout} simulatedLabel={simulatedLabel} />

      {active && (
        <>
          <p className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink-950/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
            Live
            {stats.width > 0 && (
              <span className="text-mute" title="Processing rate measured in this browser">
                {stats.width}×{stats.height}
                {stats.fps !== null && ` · ${stats.fps} fps`}
              </span>
            )}
          </p>
          {isFullscreen && (
            <button type="button" onClick={onExitFullscreen} className="btn-secondary absolute right-3 top-3 bg-ink-950/80 backdrop-blur">
              <Minimize size={16} aria-hidden="true" />
              Exit fullscreen
            </button>
          )}
        </>
      )}

      <AnimatePresence>
        {!active && (
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-ink-900 p-6 text-center"
          >
            {status === 'requesting' ? (
              <div role="status" className="max-w-sm">
                <Loader2 className="mx-auto animate-spin text-aqua" size={32} aria-hidden="true" />
                <p className="mt-4 font-display text-xl font-semibold">Starting camera…</p>
                <p className="mt-2 text-sm text-mute">If your browser asks for permission, choose Allow.</p>
              </div>
            ) : message ? (
              <div className="max-w-sm">
                {status === 'idle' ? (
                  <Camera className="mx-auto text-aqua" size={32} aria-hidden="true" />
                ) : (
                  <Info className="mx-auto text-blush" size={32} aria-hidden="true" />
                )}
                <p className="mt-4 font-display text-xl font-semibold">{message.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{message.body}</p>
                {message.action && (
                  <button id="start-camera" type="button" onClick={onStart} className="btn-primary mt-5">
                    <Camera size={16} aria-hidden="true" />
                    {message.action}
                  </button>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
