import PrivacyNotice from '../components/PrivacyNotice';
import SimulatorWorkspace from '../components/SimulatorWorkspace';

export default function Simulator() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <SimulatorWorkspace />
      <PrivacyNotice />
    </div>
  );
}
