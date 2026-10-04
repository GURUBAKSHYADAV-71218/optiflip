import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import VisionTypeCard from './VisionTypeCard';
import { MODES } from '../types/simulation';

const CONES = [
  { name: 'L-cones', range: 'Long wavelengths', note: 'Respond most to reddish light.', color: '#ff5d73' },
  { name: 'M-cones', range: 'Medium wavelengths', note: 'Respond most to greenish light.', color: '#4ade80' },
  { name: 'S-cones', range: 'Short wavelengths', note: 'Respond most to bluish light.', color: '#5b8cff' },
];

const SOURCES = [
  {
    label: 'Machado, Oliveira & Fernandes (2009), A Physiologically-based Model for Simulation of Color Vision Deficiency, IEEE TVCG 15(6)',
    href: 'https://doi.org/10.1109/TVCG.2009.113',
  },
  {
    label: 'National Eye Institute, Color blindness',
    href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness',
  },
];

function Cones() {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold tracking-tight">How you see color</h3>
      <p className="mt-2 max-w-2xl leading-relaxed text-mute">
        Color vision starts with cones, light-sensing cells in the retina. Most people have three kinds. Your brain compares their signals to build the colors you see.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {CONES.map((cone) => (
          <li key={cone.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="flex items-center gap-2 font-medium">
              <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: cone.color }} />
              {cone.name}
            </span>
            <span className="mt-1 block text-sm">{cone.range}</span>
            <span className="block text-sm text-mute">{cone.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EducationSection({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section aria-labelledby="learn-teaser" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Cones />
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6">
          <h2 id="learn-teaser" className="font-display text-xl font-semibold">Reading the simulation</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            OptiFlip does not replace objects or reconstruct the scene. It applies a documented color transform to every pixel, so shapes and motion stay exactly where they are.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Real color vision varies from person to person, so treat the result as an approximation, not a diagnosis.
          </p>
          <Link to="/learn" className="btn-secondary mt-5">
            Read the full guide
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-14">
      <Cones />

      <section aria-labelledby="types-title">
        <h2 id="types-title" className="font-display text-2xl font-semibold tracking-tight">Types of color vision</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-mute">
          Each strip below is a rainbow passed through the same transform OptiFlip applies to your camera. Many people have a milder form, called anomalous trichromacy, where all three cone types exist but one responds differently. The intensity slider lets you explore milder versions, though it is not a calibrated match for any individual.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODES.map((info) => (
            <VisionTypeCard key={info.id} info={info} />
          ))}
        </div>
      </section>

      <section aria-labelledby="interpret-title" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="interpret-title" className="font-display text-2xl font-semibold tracking-tight">How to interpret the simulation</h2>
          <ul className="mt-3 space-y-3 leading-relaxed text-mute">
            <li>Color vision deficiencies vary widely between individuals, and no single image captures them all.</li>
            <li>The output is a mathematical approximation. It is not an exact reproduction of another person’s experience.</li>
            <li>Your camera, display and room lighting also change what you see.</li>
            <li>OptiFlip is for awareness and education. It is not a diagnostic test; an eye care professional can test color vision properly.</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Why it matters for design</h2>
          <ul className="mt-3 space-y-3 leading-relaxed text-mute">
            <li>Do not rely on color alone to show status, errors or selection. Add labels, icons or patterns.</li>
            <li>Check contrast in lightness, not only in hue.</li>
            <li>Test charts, maps and interfaces under several simulations before shipping.</li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            According to the U.S. National Eye Institute, color vision deficiency is more common in men than in women: about 1 in 12 men and 1 in 200 women with Northern European ancestry. Rates vary across populations.
          </p>
        </div>
      </section>

      <section aria-labelledby="sources-title">
        <h2 id="sources-title" className="font-display text-xl font-semibold">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-aqua underline-offset-4 hover:underline">
                <span>{source.label}</span>
                <ExternalLink size={14} className="mt-1 shrink-0" aria-label="opens in a new tab" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
