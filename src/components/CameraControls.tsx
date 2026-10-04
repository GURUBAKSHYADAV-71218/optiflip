import { Camera, CameraOff, Maximize, Minimize, SwitchCamera } from 'lucide-react';
import type { CameraStatus, ViewLayout } from '../types/simulation';
import { cx } from '../utils/cx';

interface Props {
  status: CameraStatus;
  canSwitch: boolean;
  fullscreenSupported: boolean;
  isFullscreen: boolean;
  layout: ViewLayout;
  onStart: () => void;
  onStop: () => void;
  onSwitch: () => void;
  onSnapshot: () => void;
  onFullscreen: () => void;
  onLayout: (layout: ViewLayout) => void;
}

const LAYOUTS: { id: ViewLayout; label: string }[] = [
  { id: 'simulated', label: 'Simulated' },
  { id: 'split', label: 'Side by side' },
];

export default function CameraControls({
  status,
  canSwitch,
  fullscreenSupported,
  isFullscreen,
  layout,
  onStart,
  onStop,
  onSwitch,
  onSnapshot,
  onFullscreen,
  onLayout,
}: Props) {
  const active = status === 'active';
  const requesting = status === 'requesting';

  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Camera controls">
      {active || requesting ? (
        <button type="button" className="btn-secondary" onClick={onStop}>
          <CameraOff size={16} aria-hidden="true" />
          Stop camera
        </button>
      ) : (
        <button type="button" className="btn-primary" onClick={onStart} disabled={status === 'unsupported'}>
          <Camera size={16} aria-hidden="true" />
          Start camera
        </button>
      )}
      <button type="button" className="btn-secondary" onClick={onSwitch} disabled={!active || !canSwitch} title={canSwitch ? undefined : 'Only one camera detected'}>
        <SwitchCamera size={16} aria-hidden="true" />
        Switch
      </button>
      <button type="button" className="btn-secondary" onClick={onSnapshot} disabled={!active}>
        <Camera size={16} aria-hidden="true" />
        Snapshot
      </button>
      {fullscreenSupported && (
        <button type="button" className="btn-secondary" onClick={onFullscreen} disabled={!active}>
          {isFullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
          Fullscreen
        </button>
      )}

      <div className="ml-auto flex rounded-lg border border-white/10 bg-white/5 p-1" role="group" aria-label="Preview layout">
        {LAYOUTS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={layout === option.id}
            onClick={() => onLayout(option.id)}
            className={cx(
              'min-h-9 rounded-md px-3 text-sm font-medium transition-colors',
              layout === option.id ? 'bg-fg text-ink-950' : 'text-mute hover:text-fg',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
