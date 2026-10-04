import { Check } from 'lucide-react';
import SpectrumStrip from './SpectrumStrip';
import { MODES, getModeInfo, type SimulationMode } from '../types/simulation';
import { cx } from '../utils/cx';

interface Props {
  mode: SimulationMode;
  intensity: number;
  onChange: (mode: SimulationMode) => void;
}

export default function ModeSelector({ mode, intensity, onChange }: Props) {
  const selected = getModeInfo(mode);

  return (
    <div>
      <h3 className="font-display text-lg font-semibold">Color vision mode</h3>
      <div role="group" aria-label="Color vision mode" className="mt-3 grid gap-2">
        {MODES.map((option) => {
          const isSelected = option.id === mode;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.id)}
              className={cx(
                'w-full rounded-xl border p-3 text-left transition-colors',
                isSelected ? 'border-aqua/70 bg-aqua/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]',
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium">{option.label}</span>
                <span className="flex items-center gap-2 text-xs text-mute">
                  {option.rare && <span className="rounded-full border border-white/15 px-2 py-0.5">Rare</span>}
                  {isSelected && (
                    <span className="flex items-center gap-1 text-aqua">
                      <Check size={14} aria-hidden="true" />
                      Selected
                    </span>
                  )}
                </span>
              </span>
              <span className="mt-0.5 block text-sm text-mute">{option.summary}</span>
              <SpectrumStrip mode={option.id} intensity={intensity} className="mt-2" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-ink-800/50 p-4 text-sm leading-relaxed">
        <p className="font-medium">{selected.cone}</p>
        <p className="mt-1 text-mute">{selected.detail}</p>
        <p className="mt-3 text-xs text-mute">
          An approximation for education. Color vision varies between people, and this is not a diagnostic test.
        </p>
      </div>
    </div>
  );
}
