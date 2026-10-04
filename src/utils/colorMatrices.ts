import type { SimulationMode } from '../types/simulation';

/**
 * Row-major 3x3 matrix, applied to LINEAR RGB (not gamma-encoded sRGB):
 *   [R']   [m0 m1 m2] [R]
 *   [G'] = [m3 m4 m5] [G]
 *   [B']   [m6 m7 m8] [B]
 */
export type Matrix3 = readonly number[];

export const IDENTITY: Matrix3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/**
 * Dichromacy matrices at severity 1.0 from:
 *   Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F. (2009).
 *   "A Physiologically-based Model for Simulation of Color Vision Deficiency."
 *   IEEE Transactions on Visualization and Computer Graphics, 15(6), 1291-1298.
 *   https://doi.org/10.1109/TVCG.2009.113
 *
 * Limitations (also explained to users in the UI):
 *  - Color vision varies between individuals; these are approximations.
 *  - The output is not an exact reproduction of anyone's subjective experience.
 *  - Camera sensors, display calibration and lighting all affect what you see.
 *  - This is an educational tool, not a diagnostic test.
 */
const PROTANOPIA: Matrix3 = [
  0.152286, 1.052583, -0.204868,
  0.114503, 0.786281, 0.099216,
  -0.003882, -0.048116, 1.051998,
];

const DEUTERANOPIA: Matrix3 = [
  0.367322, 0.860646, -0.227968,
  0.280085, 0.672501, 0.047413,
  -0.01182, 0.04294, 0.968881,
];

const TRITANOPIA: Matrix3 = [
  1.255528, -0.076749, -0.178779,
  -0.078411, 0.930809, 0.147602,
  0.004733, 0.691367, 0.3039,
];

/**
 * Achromatopsia is approximated as relative luminance (Rec. 709 / sRGB
 * primaries, computed in linear light) copied into all three channels.
 */
const ACHROMATOPSIA: Matrix3 = [
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722,
  0.2126, 0.7152, 0.0722,
];

export function getModeMatrix(mode: SimulationMode): Matrix3 {
  switch (mode) {
    case 'protanopia':
      return PROTANOPIA;
    case 'deuteranopia':
      return DEUTERANOPIA;
    case 'tritanopia':
      return TRITANOPIA;
    case 'achromatopsia':
      return ACHROMATOPSIA;
    case 'normal':
      return IDENTITY;
  }
}

/**
 * Linear interpolation between the identity matrix and a full-severity
 * matrix. Machado et al. interpolate their matrices in the same way to
 * express severity, so intensity 0 = original, 1 = full simulation.
 * Intensity is a blend control for exploration; it is not a calibrated
 * clinical severity.
 */
export function blendMatrix(target: Matrix3, intensity: number): Matrix3 {
  const k = Math.min(1, Math.max(0, intensity));
  return target.map((value, index) => (1 - k) * IDENTITY[index] + k * value);
}
