import Index from '@/pages/Index';
import { bootstrapApp } from '@/client-runtime';
import { loadHls } from '@/lib/feed-stream';

bootstrapApp({ Index });

// The portfolio's reels stream through hls.js (src/lib/feed-stream.ts). Fetch
// it once the page is idle, so the first reel's opening seconds can start
// loading the moment the section mounts, not after the library downloads.
const prefetchStreaming = () => {
  void loadHls();
};
if (document.readyState === 'complete') {
  window.setTimeout(prefetchStreaming, 1500);
} else {
  window.addEventListener('load', () => window.setTimeout(prefetchStreaming, 1500), { once: true });
}
