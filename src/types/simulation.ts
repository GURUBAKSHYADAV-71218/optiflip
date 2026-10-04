export type SimulationMode =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export type ViewLayout = 'simulated' | 'split';

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'no-device'
  | 'unavailable'
  | 'unsupported';

export interface ModeInfo {
  id: SimulationMode;
  label: string;
  summary: string;
  cone: string;
  detail: string;
  affects: string;
  rare?: boolean;
}

export const MODES: readonly ModeInfo[] = [
  {
    id: 'normal',
    label: 'Normal vision',
    summary: 'Original camera view',
    cone: 'L, M and S cones all contribute',
    detail:
      'Typical trichromatic vision, shown exactly as the camera captured it. Use it as the reference when comparing.',
    affects: 'Nothing is changed.',
  },
  {
    id: 'protanopia',
    label: 'Protanopia',
    summary: 'Red-green · L-cones',
    cone: 'No working L (long-wavelength) cones',
    detail:
      'Without working L-cones, reds lose brightness and are easily confused with greens, browns and oranges.',
    affects: 'Typical confusions: red vs. green, red vs. dark brown, orange vs. yellow-green.',
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    summary: 'Red-green · M-cones',
    cone: 'No working M (medium-wavelength) cones',
    detail:
      'Without working M-cones, greens and reds move closer together. Reds do not darken as much as they do in protanopia.',
    affects: 'Typical confusions: green vs. red, green vs. beige, pink vs. gray.',
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    summary: 'Blue-yellow · S-cones',
    cone: 'No working S (short-wavelength) cones',
    detail:
      'Blue light is hard to detect, so blues and greens can look alike and yellows can blend into pinks or light grays. It is much rarer than the red-green types.',
    affects: 'Typical confusions: blue vs. green, yellow vs. violet, pink vs. gray.',
    rare: true,
  },
  {
    id: 'achromatopsia',
    label: 'Achromatopsia',
    summary: 'No color · grayscale approximation',
    cone: 'Little or no cone function',
    detail:
      'People with complete achromatopsia see mainly by lightness, and are often very sensitive to bright light with reduced sharpness. This mode only removes color; it does not reproduce glare sensitivity or blur.',
    affects: 'Everything is judged by brightness alone.',
    rare: true,
  },
];

export function getModeInfo(id: SimulationMode): ModeInfo {
  return MODES.find((mode) => mode.id === id) ?? MODES[0];
}
