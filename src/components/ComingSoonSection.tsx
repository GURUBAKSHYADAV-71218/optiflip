import { FlaskConical } from 'lucide-react';

export default function ComingSoonSection() {
  return (
    <section aria-labelledby="screening-title" className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-white/15 p-5">
      <FlaskConical className="text-iris" size={24} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h2 id="screening-title" className="flex flex-wrap items-center gap-3 font-display text-lg font-semibold">
          Color Vision Screening
          <span className="rounded-full border border-iris/50 bg-iris/10 px-2.5 py-0.5 font-sans text-xs font-medium text-iris">Coming Soon</span>
        </h2>
        <p className="mt-1 text-sm text-mute">An interactive screening experience is being explored for a future release.</p>
      </div>
    </section>
  );
}
