#!/usr/bin/env node

import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LEGACY_REEL_CLIPS } from '../src/data/portfolio-clips.ts';
import { NUEVOS_R2_READY_CLIPS } from '../src/data/nuevos-r2-ready.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'public/uploads/videos/startups/v1');
const clips = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];
const force = process.argv.includes('--force');

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const runWithRetry = async (command, args, attempts = 4) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await run(command, args);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        process.stdout.write(`  source retry ${attempt}/${attempts - 1}\n`);
        await wait(attempt * 750);
      }
    }
  }
  throw lastError;
};

await mkdir(outputDir, { recursive: true });

for (const [index, clip] of clips.entries()) {
  const outputPath = path.join(outputDir, `${clip.id}.mp4`);
  const tempPath = `${outputPath}.tmp`;

  if (!force) {
    try {
      const existing = await stat(outputPath);
      if (existing.size > 16_000) {
        process.stdout.write(`[${index + 1}/${clips.length}] ${clip.id} already exists\n`);
        continue;
      }
    } catch {
      // Missing output is generated below.
    }
  }

  process.stdout.write(`[${index + 1}/${clips.length}] ${clip.id} exact-quality bridge\n`);
  await rm(tempPath, { force: true });

  try {
    await runWithRetry('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-rw_timeout',
      '20000000',
      '-i',
      clip.mobileSrc,
      '-t',
      '1.6',
      '-map',
      '0:v:0',
      '-map',
      '0:a:0?',
      '-c',
      'copy',
      '-movflags',
      '+faststart',
      '-f',
      'mp4',
      tempPath,
    ]);
    await rename(tempPath, outputPath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }
}

process.stdout.write(`Generated ${clips.length} versioned startup bridges in ${outputDir}\n`);
