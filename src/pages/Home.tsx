import { useCallback, useEffect, useRef, useState } from 'react';
import ComingSoonSection from '../components/ComingSoonSection';
import EducationSection from '../components/EducationSection';
import HeroSection from '../components/HeroSection';
import PrivacyNotice from '../components/PrivacyNotice';
import SimulatorWorkspace from '../components/SimulatorWorkspace';

export default function Home() {
  const [highlighted, setHighlighted] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleStart = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('simulator')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setHighlighted(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHighlighted(false), 1800);
    // Move keyboard focus to the start button; the camera itself only starts when it is pressed.
    window.setTimeout(() => document.getElementById('start-camera')?.focus({ preventScroll: true }), reduce ? 0 : 500);
  }, []);

  return (
    <>
      <HeroSection onStart={handleStart} />
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6">
        <div id="simulator" className="scroll-mt-20">
          <SimulatorWorkspace highlighted={highlighted} />
        </div>
        <EducationSection compact />
        <PrivacyNotice />
        <ComingSoonSection />
      </div>
    </>
  );
}
