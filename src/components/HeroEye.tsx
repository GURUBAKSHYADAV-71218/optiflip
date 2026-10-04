const SPOKES = 56;
const CX = 260;
const CY = 190;
const IRIS_R = 74;
const EYE_PATH = 'M110 190 C165 108 355 108 410 190 C355 272 165 272 110 190 Z';

const spokes = Array.from({ length: SPOKES }, (_, i) => {
  const angle = (i / SPOKES) * Math.PI * 2;
  return {
    x1: CX + Math.cos(angle) * 24,
    y1: CY + Math.sin(angle) * 24,
    x2: CX + Math.cos(angle) * IRIS_R,
    y2: CY + Math.sin(angle) * IRIS_R,
    hue: (i / SPOKES) * 360,
  };
});

/** Brand illustration: an eye with a full-spectrum iris behind a glasses lens. Pure SVG, no external assets. */
export default function HeroEye({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 380"
      role="img"
      aria-label="Illustration of an eye behind glasses, with an iris showing the full spectrum of colors"
      className={className}
    >
      <defs>
        <linearGradient id="he-frame" x1="0" y1="0" x2="520" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#52d0f5" />
          <stop offset="0.55" stopColor="#8f82ff" />
          <stop offset="1" stopColor="#ff7ab6" />
        </linearGradient>
        <radialGradient id="he-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#8f82ff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#8f82ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="he-sclera" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#f7f9ff" />
          <stop offset="0.8" stopColor="#cfd6f0" />
          <stop offset="1" stopColor="#8f9bc4" />
        </radialGradient>
        <radialGradient id="he-shade" cx="50%" cy="50%" r="50%">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.68" />
        </radialGradient>
        <linearGradient id="he-lid" x1="0" y1="110" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#05070f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#05070f" stopOpacity="0" />
        </linearGradient>
        <clipPath id="he-eye">
          <path d={EYE_PATH} />
        </clipPath>
        <clipPath id="he-iris">
          <circle cx={CX} cy={CY} r={IRIS_R} />
        </clipPath>
      </defs>

      <ellipse cx={CX} cy={CY} rx="255" ry="175" fill="url(#he-glow)" />

      <g className="eye-blink">
        <path d={EYE_PATH} fill="url(#he-sclera)" />
        <g clipPath="url(#he-eye)">
          <circle cx={CX} cy={CY} r={IRIS_R} fill="#101830" />
          <g clipPath="url(#he-iris)">
            {spokes.map((s) => (
              <line
                key={s.hue}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={`hsl(${s.hue} 90% 58%)`}
                strokeWidth="6"
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle cx={CX} cy={CY} r={IRIS_R} fill="url(#he-shade)" />
          <circle cx={CX} cy={CY} r={IRIS_R} fill="none" stroke="#0a0f1e" strokeWidth="5" opacity="0.7" />
          <circle cx={CX} cy={CY} r="26" fill="#05070f" />
          <ellipse cx="238" cy="162" rx="13" ry="8" fill="#fff" opacity="0.85" />
          <circle cx="282" cy="214" r="4" fill="#fff" opacity="0.4" />
          <rect x="100" y="100" width="320" height="100" fill="url(#he-lid)" />
        </g>
        <path d={EYE_PATH} fill="none" stroke="#070a14" strokeWidth="6" strokeLinejoin="round" />
      </g>

      <rect x="30" y="30" width="460" height="320" rx="120" fill="#52d0f5" fillOpacity="0.05" />
      <rect x="30" y="30" width="460" height="320" rx="120" fill="none" stroke="url(#he-frame)" strokeWidth="14" />
      <rect x="40" y="40" width="440" height="300" rx="110" fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="2" />
      <path d="M92 130 Q125 78 200 66" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 185 H6" stroke="url(#he-frame)" strokeWidth="12" strokeLinecap="round" />
      <path d="M490 185 H514" stroke="url(#he-frame)" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}
