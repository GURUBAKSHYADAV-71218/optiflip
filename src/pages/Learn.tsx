import EducationSection from '../components/EducationSection';

export default function Learn() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Understanding color vision</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">
        A short, beginner-friendly guide to how cones work, what the main types of color vision deficiency are, and how to read what OptiFlip shows you.
      </p>
      <div className="mt-12">
        <EducationSection />
      </div>
    </div>
  );
}
