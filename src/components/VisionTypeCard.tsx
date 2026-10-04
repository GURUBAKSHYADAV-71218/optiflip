import SpectrumStrip from './SpectrumStrip';
import type { ModeInfo } from '../types/simulation';

export default function VisionTypeCard({ info }: { info: ModeInfo }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-ink-900/70 p-5">
      <h3 className="font-display text-xl font-semibold">{info.label}</h3>
      <p className="mt-0.5 text-sm text-aqua">{info.cone}</p>
      <SpectrumStrip mode={info.id} className="mt-3" />
      <p className="mt-3 text-sm leading-relaxed text-mute">{info.detail}</p>
      <p className="mt-2 text-sm leading-relaxed">{info.affects}</p>
    </article>
  );
}
