import { Download, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadUrl, snapshotFilename, type Snapshot } from '../utils/snapshot';

interface Props {
  snapshot: Snapshot;
  onDismiss: () => void;
}

export default function SnapshotPreview({ snapshot, onDismiss }: Props) {
  const time = new Date(snapshot.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const items = [
    { kind: 'original' as const, label: 'Original', url: snapshot.originalUrl },
    { kind: 'simulated' as const, label: `${snapshot.modeLabel} · ${snapshot.intensity}%`, url: snapshot.simulatedUrl },
  ];

  return (
    <motion.section
      aria-label="Snapshot preview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="mt-4 rounded-2xl border border-white/10 bg-ink-800/50 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Snapshot</h3>
          <p className="text-xs text-mute">
            Taken at {time}, {snapshot.width}×{snapshot.height}. It exists only in this tab until you download it.
          </p>
        </div>
        <button type="button" className="btn-secondary !min-h-9 !px-2" onClick={onDismiss} aria-label="Dismiss snapshot">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure key={item.kind}>
            <img src={item.url} alt={`${item.label} snapshot`} className="w-full rounded-lg bg-black" />
            <figcaption className="mt-2 flex items-center justify-between gap-2 text-sm">
              <span>{item.label}</span>
              <button
                type="button"
                className="btn-secondary !min-h-9"
                onClick={() => downloadUrl(item.url, snapshotFilename(item.kind, snapshot.mode))}
              >
                <Download size={14} aria-hidden="true" />
                Download PNG
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </motion.section>
  );
}
