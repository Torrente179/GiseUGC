/**
 * Load a TypeScript module from src/ inside a plain Node script.
 *
 * The entrypoint sync scripts (enrich-service-entrypoints, expand-boot-shells,
 * sync-hub-entrypoints, sync-resource-entrypoint-meta)
 * used to carry hand-copied string literals that mirrored src/data/*.ts. They
 * now import the real data modules through this loader, so the static HTML
 * can never drift from the copy React renders.
 *
 * How it works: esbuild bundles the requested module (and everything it
 * imports) into one in-memory ESM file, resolving the `@/` alias to src/ and
 * replacing `import.meta.env` with a build-time object whose VITE_* keys are
 * absent, so env fallbacks resolve to their committed defaults. The bundle is
 * written to a throwaway file in the OS temp dir, dynamically imported, and
 * deleted.
 *
 * Guard rail: only relative imports, `@/` imports and `node:` builtins may be
 * resolved. Any bare package import (react, react-router-dom, hls.js, ...) or
 * asset import (css, images) fails the build, because data modules must stay
 * pure TS that runs in Node without a DOM.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const srcDir = path.join(rootDir, 'src');

const IMPORT_META_ENV = JSON.stringify({
  MODE: 'production',
  DEV: false,
  PROD: true,
  SSR: true,
  BASE_URL: '/',
});

const pureDataGuard = {
  name: 'pure-data-guard',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^@\// }, async (args) => {
      const resolved = await pluginBuild.resolve(`./${args.path.slice(2)}`, {
        kind: args.kind,
        resolveDir: srcDir,
      });
      if (resolved.errors.length > 0) return { errors: resolved.errors };
      return { path: resolved.path };
    });

    pluginBuild.onResolve({ filter: /^node:/ }, (args) => ({ path: args.path, external: true }));

    pluginBuild.onResolve({ filter: /^[^./]/ }, (args) => ({
      errors: [
        {
          text: `"${args.path}" imported from ${path.relative(rootDir, args.importer)} is not allowed: modules loaded by scripts/lib/load-ts-module.mjs must not pull in packages (React, browser code). Keep data modules pure TS.`,
        },
      ],
    }));

    pluginBuild.onLoad({ filter: /\.(css|scss|svg|png|jpe?g|webp|avif|gif|mp4|webm|woff2?)$/ }, (args) => ({
      errors: [{ text: `Asset import ${path.relative(rootDir, args.path)} is not allowed in a data module.` }],
    }));
  },
};

/**
 * Bundle and import a TS module, e.g. `await loadTsModule('src/data/service-pages.ts')`.
 * @param {string} entry Path relative to the repo root (or absolute).
 * @returns {Promise<Record<string, any>>} The module namespace.
 */
export async function loadTsModule(entry) {
  const entryPath = path.resolve(rootDir, entry);
  const result = await build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    write: false,
    logLevel: 'silent',
    absWorkingDir: rootDir,
    define: { 'import.meta.env': IMPORT_META_ENV },
    plugins: [pureDataGuard],
  });

  const code = result.outputFiles[0].text;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-ts-module-'));
  const tempFile = path.join(tempDir, `${path.basename(entryPath).replace(/\.[cm]?tsx?$/u, '')}.mjs`);
  fs.writeFileSync(tempFile, code);
  try {
    return await import(pathToFileURL(tempFile).href);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
