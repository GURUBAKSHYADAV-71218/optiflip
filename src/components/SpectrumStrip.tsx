import { useEffect, useRef } from 'react';
import type { SimulationMode } from '../types/simulation';
import { cx } from '../utils/cx';
import { drawSpectrum } from '../utils/imageProcessor';

interface Props {
  mode: SimulationMode;
  intensity?: number;
  className?: string;
}

/** A hue strip passed through the same math as the camera frames. */
export default function SpectrumStrip({ mode, intensity = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) drawSpectrum(ref.current, mode, intensity);
  }, [mode, intensity]);

  return <canvas ref={ref} width={160} height={8} aria-hidden="true" className={cx('block h-2 w-full rounded-full', className)} />;
}
