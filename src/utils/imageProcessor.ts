import type { SimulationMode } from '../types/simulation';
import { blendMatrix, getModeMatrix, type Matrix3 } from './colorMatrices';

/** sRGB (0-255) -> linear light (0-1), precomputed once. */
const SRGB_TO_LINEAR = (() => {
  const table = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    table[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  return table;
})();

/** Linear light (0-1, quantised to 4096 steps) -> sRGB (0-255), precomputed once. */
const ENCODE_STEPS = 4095;
const LINEAR_TO_SRGB = (() => {
  const table = new Uint8ClampedArray(ENCODE_STEPS + 1);
  for (let i = 0; i <= ENCODE_STEPS; i++) {
    const l = i / ENCODE_STEPS;
    const c = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
    table[i] = Math.round(c * 255);
  }
  return table;
})();

/**
 * Returns the matrix to apply for a mode and intensity (0-1), or null when
 * the output should equal the input (normal vision, or intensity of 0).
 */
export function simulationMatrix(mode: SimulationMode, intensity: number): Matrix3 | null {
  if (mode === 'normal' || intensity <= 0) return null;
  return blendMatrix(getModeMatrix(mode), intensity);
}

/**
 * Transforms every pixel of `src` into `dst` (same dimensions).
 * Pixels are linearised, multiplied by the matrix, clamped to the displayable
 * range and re-encoded. Lookup tables keep the per-pixel cost low.
 */
export function processFrame(src: ImageData, dst: ImageData, matrix: Matrix3 | null): void {
  const input = src.data;
  const output = dst.data;

  if (!matrix) {
    output.set(input);
    return;
  }

  const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = matrix;
  const toLinear = SRGB_TO_LINEAR;
  const toSrgb = LINEAR_TO_SRGB;

  for (let i = 0; i < input.length; i += 4) {
    const r = toLinear[input[i]];
    const g = toLinear[input[i + 1]];
    const b = toLinear[input[i + 2]];

    let lr = m0 * r + m1 * g + m2 * b;
    let lg = m3 * r + m4 * g + m5 * b;
    let lb = m6 * r + m7 * g + m8 * b;

    lr = lr < 0 ? 0 : lr > 1 ? 1 : lr;
    lg = lg < 0 ? 0 : lg > 1 ? 1 : lg;
    lb = lb < 0 ? 0 : lb > 1 ? 1 : lb;

    output[i] = toSrgb[(lr * ENCODE_STEPS + 0.5) | 0];
    output[i + 1] = toSrgb[(lg * ENCODE_STEPS + 0.5) | 0];
    output[i + 2] = toSrgb[(lb * ENCODE_STEPS + 0.5) | 0];
    output[i + 3] = input[i + 3];
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/**
 * Paints a red-to-violet hue strip through the same transform used on camera
 * frames, so each mode can show how the visible spectrum shifts.
 */
export function drawSpectrum(canvas: HTMLCanvasElement, mode: SimulationMode, intensity: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  const src = ctx.createImageData(width, height);
  const dst = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    const [r, g, b] = hslToRgb((x / (width - 1)) * 300, 0.9, 0.5);
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      src.data[i] = r;
      src.data[i + 1] = g;
      src.data[i + 2] = b;
      src.data[i + 3] = 255;
    }
  }

  processFrame(src, dst, simulationMatrix(mode, intensity));
  ctx.putImageData(dst, 0, 0);
}
