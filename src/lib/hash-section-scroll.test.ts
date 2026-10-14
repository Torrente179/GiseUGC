import { describe, expect, it } from 'vitest';
import { hashTargetLooksUnsettled, shouldRetryHashScroll } from '@/lib/hash-section-scroll';

describe('hashTargetLooksUnsettled', () => {
  it('retries while a tall page still reports a near-top target', () => {
    expect(hashTargetLooksUnsettled(0, 7000, 800)).toBe(true);
    expect(hashTargetLooksUnsettled(80, 7000, 800)).toBe(true);
  });

  it('stops once the target is actually down the page', () => {
    expect(hashTargetLooksUnsettled(6400, 7000, 800)).toBe(false);
  });

  it('does not retry on a short page (the target really is near the top)', () => {
    expect(hashTargetLooksUnsettled(0, 600, 800)).toBe(false);
  });
});

describe('shouldRetryHashScroll', () => {
  it('waits out the minimum attempts so view transitions can finish', () => {
    expect(shouldRetryHashScroll(6400, 7000, 800, 0)).toBe(true);
    expect(shouldRetryHashScroll(6400, 7000, 800, 7)).toBe(true);
    expect(shouldRetryHashScroll(6400, 7000, 800, 8)).toBe(false);
  });

  it('keeps retrying an unsettled footer after the minimum window', () => {
    expect(shouldRetryHashScroll(0, 7000, 800, 8)).toBe(true);
    expect(shouldRetryHashScroll(0, 7000, 800, 25)).toBe(false);
  });
});
