import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EyeMark from './EyeMark';
import { useCameraStatus } from '../hooks/useCameraStatus';
import { cx } from '../utils/cx';
import type { CameraStatus } from '../types/simulation';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/simulator', label: 'Simulator', end: false },
  { to: '/learn', label: 'Learn', end: false },
  { to: '/about', label: 'About', end: false },
];

const STATUS_LABEL: Record<CameraStatus, string> = {
  idle: 'Camera off',
  requesting: 'Starting camera',
  active: 'Camera live',
  denied: 'Camera blocked',
  'no-device': 'No camera found',
  unavailable: 'Camera unavailable',
  unsupported: 'Camera not supported',
};

function StatusChip() {
  const { status } = useCameraStatus();
  const live = status === 'active';
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium"
    >
      <span
        aria-hidden="true"
        className={cx('h-2 w-2 rounded-full', live ? 'bg-emerald-400' : status === 'requesting' ? 'bg-amber-300' : 'bg-slate-500')}
      />
      {STATUS_LABEL[status]}
    </p>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-white/10 text-fg' : 'text-mute hover:text-fg',
    );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="OptiFlip home">
          <EyeMark />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight">OptiFlip</span>
            <span className="hidden text-xs text-mute sm:block">Same World. Different Colors.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <StatusChip />
          </div>
          <button
            type="button"
            className="btn-secondary !px-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={(state) => cx(linkClass(state), 'min-h-11 content-center')}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 sm:hidden">
            <StatusChip />
          </div>
        </nav>
      )}
    </header>
  );
}
