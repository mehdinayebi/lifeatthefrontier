import { defineConfig } from 'astro/config';

// Static output only. Pages build to /privacy.html etc. so every static host
// serves them at /privacy (Vercel needs `cleanUrls`, set in vercel.json).
export default defineConfig({
  site: 'https://www.lifeatthefrontier.com',
  output: 'static',
  build: {
    format: 'file',
    // The whole stylesheet is about 13 KB: inline it so first paint waits on nothing.
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
