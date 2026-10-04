import { Link } from 'react-router-dom';
import EyeMark from './EyeMark';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <EyeMark size={30} />
            <span className="font-display text-lg font-semibold">OptiFlip</span>
          </div>
          <p className="mt-3 text-sm text-mute">Same World. Different Colors.</p>
          <p className="mt-3 text-xs leading-relaxed text-mute">
            An educational simulation, not a diagnostic tool. Results are approximations and vary between individuals.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-mute hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-mute">Built with React, TypeScript, Vite, Tailwind CSS and the Canvas API.</p>
        </nav>
      </div>
    </footer>
  );
}
