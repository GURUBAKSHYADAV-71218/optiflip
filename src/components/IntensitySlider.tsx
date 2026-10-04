import type { CSSProperties } from 'react';

interface Props {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export default function IntensitySlider({ value, disabled, onChange }: Props) {
  const style = {
    '--track': `linear-gradient(to right, #52d0f5, #8f82ff ${value}%, rgba(255,255,255,0.14) ${value}%)`,
  } as CSSProperties;

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-800/50 px-4 py-3">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="intensity" className="text-sm font-medium">
          Simulation intensity
        </label>
        <output htmlFor="intensity" className="font-display text-lg font-semibold tabular-nums">
          {value}%
        </output>
      </div>
      <input
        id="intensity"
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        aria-describedby="intensity-help"
        onChange={(event) => onChange(Number(event.target.value))}
        className="range mt-1"
        style={style}
      />
      <p id="intensity-help" className="text-xs text-mute">
        {disabled ? 'Choose a simulation mode to adjust intensity.' : '0% shows the original image; 100% shows the full simulation.'}
      </p>
    </div>
  );
}
