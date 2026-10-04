import type { SimulationMode } from '../types/simulation';

export interface Snapshot {
  mode: SimulationMode;
  modeLabel: string;
  intensity: number;
  width: number;
  height: number;
  takenAt: number;
  originalBlob: Blob;
  simulatedBlob: Blob;
  originalUrl: string;
  simulatedUrl: string;
}

export interface FramePair {
  original: HTMLCanvasElement;
  simulated: HTMLCanvasElement;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))), 'image/png');
  });
}

/** Encodes the current original and simulated frames as PNG blobs. Nothing is uploaded. */
export async function captureSnapshot(
  frames: FramePair,
  meta: { mode: SimulationMode; modeLabel: string; intensity: number },
): Promise<Snapshot> {
  const [originalBlob, simulatedBlob] = await Promise.all([
    canvasToBlob(frames.original),
    canvasToBlob(frames.simulated),
  ]);
  return {
    ...meta,
    width: frames.simulated.width,
    height: frames.simulated.height,
    takenAt: Date.now(),
    originalBlob,
    simulatedBlob,
    originalUrl: URL.createObjectURL(originalBlob),
    simulatedUrl: URL.createObjectURL(simulatedBlob),
  };
}

export function revokeSnapshot(snapshot: Snapshot | null): void {
  if (!snapshot) return;
  URL.revokeObjectURL(snapshot.originalUrl);
  URL.revokeObjectURL(snapshot.simulatedUrl);
}

export function snapshotFilename(kind: 'original' | 'simulated', mode: SimulationMode): string {
  return kind === 'original' ? 'optiflip-snapshot-original.png' : `optiflip-snapshot-${mode}.png`;
}

export function downloadUrl(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
