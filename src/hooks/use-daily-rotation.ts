import { useEffect, useMemo, useState } from 'react';

/**
 * Deterministic daily rotation over a catalog.
 *
 * The order is seeded by the UTC day bucket, so every visitor sees the same
 * selection on a given day and it changes exactly once every 24h. Being
 * deterministic (rather than `Math.random()`) also means server and client
 * agree, and a reload inside the same day is stable.
 *
 * A tab left open across the UTC boundary re-rotates on its own — the timer
 * re-arms whenever the bucket advances, so no reload is needed.
 *
 * Mirrors the rotation Portfolio.tsx runs over the same catalog.
 */

const DAY_MS = 86_400_000;

const getUtcDayBucket = () => Math.floor(Date.now() / DAY_MS);

/** mulberry32 — small, fast, well-distributed for a seeded shuffle. */
const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const useDailyRotation = <T,>(items: T[], count: number): T[] => {
  const [utcDayBucket, setUtcDayBucket] = useState(getUtcDayBucket);

  useEffect(() => {
    const nextBoundary = (utcDayBucket + 1) * DAY_MS;
    // +20ms so the timer never fires a hair *before* the boundary and re-reads
    // the same bucket, which would leave the rotation stuck for a whole day.
    const delay = Math.max(nextBoundary - Date.now(), 1000) + 20;
    const timeoutId = window.setTimeout(() => setUtcDayBucket(getUtcDayBucket()), delay);
    return () => window.clearTimeout(timeoutId);
  }, [utcDayBucket]);

  return useMemo(
    () => shuffleWithSeed(items, utcDayBucket).slice(0, count),
    [items, count, utcDayBucket],
  );
};
