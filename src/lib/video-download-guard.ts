/**
 * Keeps the site's videos from being saved with the browser's own tools: no
 * "Save video as…" on right-click and no dragging a video out to the desktop,
 * for every <video> on every page (the pooled feed players are created outside
 * React, so this listens on the document instead of on each element). Videos
 * with native controls also set controlsList="nodownload", and CSS turns off
 * the iOS long-press menu (src/index.css).
 *
 * This stops casual saving only: a file the browser can play can be fetched.
 * Behind it, the media host serves a video only to the site's own pages, so a
 * copied video URL opened anywhere else gets a 403
 * (scripts/cloudflare-video-lock.mjs; vercel.json does the same for the
 * startup clips the site serves itself). The Fiverr review videos also carry
 * Fiverr's watermark in the picture, for anyone who gets past both
 * (scripts/self-host-fiverr-media.mjs).
 */

const isVideoTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest('video') !== null;

const block = (event: Event) => {
  if (isVideoTarget(event.target)) event.preventDefault();
};

let installed = false;

export const installVideoDownloadGuard = (doc: Document = document) => {
  if (installed && doc === document) return;
  doc.addEventListener('contextmenu', block, { capture: true });
  doc.addEventListener('dragstart', block, { capture: true });
  if (doc === document) installed = true;
};
