import { ArrowDown } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import HeroEye from './HeroEye';

const STEPS = ['Allow the camera', 'Pick a vision type', 'Compare with the original'];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section aria-labelledby="hero-title" className="page-glow relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16 lg:pt-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1
            id="hero-title"
            variants={item}
            className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Same World.
            <span className="block bg-gradient-to-r from-aqua via-iris to-blush bg-clip-text text-transparent">Different Colors.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
            Explore how the world may appear under different color-vision conditions through an interactive real-time camera experience.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button type="button" onClick={onStart} className="btn-primary !min-h-12 !px-6 !text-base">
              Start Exploring
              <ArrowDown size={18} aria-hidden="true" />
            </button>
            <p className="text-sm text-mute">Awareness • Accessibility • Visual Exploration</p>
          </motion.div>

          <motion.ol variants={item} className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3" aria-label="How it works">
            {STEPS.map((step, index) => (
              <li key={step} className="border-l border-white/15 pl-3 text-sm">
                <span className="block text-xs text-mute">Step {index + 1}</span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </motion.ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto w-full max-w-xl lg:max-w-none lg:translate-x-6"
        >
          <HeroEye className="h-auto w-full" />
        </motion.div>
      </div>
    </section>
  );
}
