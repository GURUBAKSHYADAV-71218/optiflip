import { Link } from 'react-router-dom';

const PIPELINE = [
  'The browser gives OptiFlip a live video stream after you grant permission.',
  'Each new frame is drawn onto a canvas at up to 800 px wide.',
  'Every pixel is converted from sRGB to linear light and multiplied by a 3×3 matrix.',
  'The result is clamped, converted back to sRGB and painted to the screen.',
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">About OptiFlip</h1>
      <p className="mt-4 text-lg leading-relaxed text-mute">
        OptiFlip is an independent, browser-based project for color vision awareness and accessibility education. It shows how a scene may look under different color vision conditions, using your own camera.
      </p>

      <section className="mt-10" aria-labelledby="how-title">
        <h2 id="how-title" className="font-display text-2xl font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-mute">
          {PIPELINE.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 leading-relaxed text-mute">
          The matrices come from Machado, Oliveira and Fernandes (2009). The intensity slider interpolates between the identity matrix and the full-severity matrix, which is how that paper expresses severity. Nothing is generated or reconstructed, so objects keep their identity, shape and motion.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="limits-title">
        <h2 id="limits-title" className="font-display text-2xl font-semibold">Limitations</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-mute">
          <li>Simulations are approximations. Color vision varies between individuals and cannot be fully reproduced on a screen.</li>
          <li>Camera sensors, auto white balance, display calibration and lighting affect the result.</li>
          <li>The achromatopsia mode is a grayscale approximation; it does not model light sensitivity or reduced sharpness.</li>
          <li>Processing speed depends on your device. The frame rate shown in the simulator is measured live.</li>
          <li>OptiFlip is not a medical or diagnostic tool.</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="privacy-about">
        <h2 id="privacy-about" className="font-display text-2xl font-semibold">Privacy</h2>
        <p className="mt-3 leading-relaxed text-mute">
          Your camera feed is processed locally in your browser. OptiFlip does not upload or store your camera footage. It has no backend and makes no network requests with camera data.
        </p>
      </section>

      <Link to="/simulator" className="btn-primary mt-10">
        Open the simulator
      </Link>
    </div>
  );
}
