import { ShieldCheck } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <aside aria-labelledby="privacy-title" className="flex gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
      <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={24} aria-hidden="true" />
      <div>
        <h2 id="privacy-title" className="font-display text-lg font-semibold">Privacy</h2>
        <p className="mt-1 text-sm leading-relaxed">
          Your camera feed is processed locally in your browser. OptiFlip does not upload or store your camera footage.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-mute">
          The camera only starts when you press Start camera and stops when you stop it or leave the simulator. Snapshots are saved only if you download them.
        </p>
      </div>
    </aside>
  );
}
