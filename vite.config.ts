import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static single-page build. No server, no environment variables required.
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020' },
});
