import type { RefObject } from 'react';
import { cx } from '../utils/cx';
import type { ViewLayout } from '../types/simulation';

interface Props {
  outputRef: RefObject<HTMLCanvasElement>;
  originalRef: RefObject<HTMLCanvasElement>;
  layout: ViewLayout;
  simulatedLabel: string;
}

/**
 * Both canvases are always mounted. The original canvas is only painted by the
 * render loop while the side-by-side layout is on, so both halves come from the
 * same camera frame.
 */
export default function ComparisonView({ outputRef, originalRef, layout, simulatedLabel }: Props) {
  const split = layout === 'split';
  return (
    <div className={cx('grid h-full w-full', split && 'grid-rows-2 gap-px bg-white/10 sm:grid-cols-2 sm:grid-rows-1')}>
      <figure className={cx('relative min-h-0 bg-black', !split && 'hidden')}>
        <canvas ref={originalRef} aria-label="Original camera view" className="h-full w-full object-contain" />
        <figcaption className="absolute bottom-2 left-2 rounded-md bg-ink-950/80 px-2 py-1 text-xs font-medium">Original</figcaption>
      </figure>
      <figure className="relative min-h-0 bg-black">
        <canvas ref={outputRef} aria-label={`Simulated camera view: ${simulatedLabel}`} className="h-full w-full object-contain" />
        {split && (
          <figcaption className="absolute bottom-2 left-2 rounded-md bg-ink-950/80 px-2 py-1 text-xs font-medium">
            Simulated · {simulatedLabel}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
