import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const base = isGithubPages ? '/gtradesdkshowcase/' : '/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
});
