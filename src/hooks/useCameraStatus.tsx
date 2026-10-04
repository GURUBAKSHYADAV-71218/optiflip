import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CameraStatus } from '../types/simulation';

interface CameraStatusValue {
  status: CameraStatus;
  setStatus: (status: CameraStatus) => void;
}

const CameraStatusContext = createContext<CameraStatusValue>({
  status: 'idle',
  setStatus: () => undefined,
});

/** Lets the navbar reflect the real camera state owned by the simulator. */
export function CameraStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CameraStatus>('idle');
  const value = useMemo(() => ({ status, setStatus }), [status]);
  return <CameraStatusContext.Provider value={value}>{children}</CameraStatusContext.Provider>;
}

export function useCameraStatus(): CameraStatusValue {
  return useContext(CameraStatusContext);
}
