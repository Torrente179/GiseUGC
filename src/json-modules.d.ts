declare module '@/data/og-image-manifest.json' {
  import type { OgImageMeta } from '@/lib/og-image';
  const manifest: Record<string, OgImageMeta>;
  export default manifest;
}
