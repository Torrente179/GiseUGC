export type TextSegment = { text: string; strong: boolean };

/**
 * Split `text` into runs, marking the exact matches of `phrases` as strong.
 * First occurrence only, longest phrase wins on overlap, and a phrase that is
 * not in the text is ignored, so copy edits degrade to plain text instead of
 * breaking the page.
 */
export const segmentHighlights = (text: string, phrases: readonly string[] = []): TextSegment[] => {
  const spans: { start: number; end: number }[] = [];
  const ordered = [...phrases].filter(Boolean).sort((a, b) => b.length - a.length);

  for (const phrase of ordered) {
    const start = text.indexOf(phrase);
    if (start === -1) continue;
    const end = start + phrase.length;
    if (spans.some((span) => start < span.end && end > span.start)) continue;
    spans.push({ start, end });
  }

  spans.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) segments.push({ text: text.slice(cursor, span.start), strong: false });
    segments.push({ text: text.slice(span.start, span.end), strong: true });
    cursor = span.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), strong: false });
  return segments.length > 0 ? segments : [{ text, strong: false }];
};

/** Sentences of a paragraph, each keeping its closing punctuation. */
export const splitSentences = (text: string): string[] => {
  const matches = text.match(/[^.!?]+[.!?]+(?:["”’)]+)?(?=\s|$)|[^.!?]+$/gu);
  return (matches ?? [text]).map((sentence) => sentence.trim()).filter(Boolean);
};

/**
 * Split an intro paragraph at the sentence boundary nearest its middle, so it
 * can sit on both sides of the figure. One-sentence copy stays whole on the
 * left. Joining the halves with a space restores the original text.
 */
export const splitIntro = (text: string): [string, string] => {
  const sentences = splitSentences(text);
  if (sentences.length < 2) return [text, ''];

  const total = sentences.reduce((sum, sentence) => sum + sentence.length, 0);
  let bestIndex = 1;
  let bestDistance = Number.POSITIVE_INFINITY;
  let running = 0;
  for (let index = 1; index < sentences.length; index += 1) {
    running += sentences[index - 1].length;
    const distance = Math.abs(running - total / 2);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return [sentences.slice(0, bestIndex).join(' '), sentences.slice(bestIndex).join(' ')];
};

export type TitleTier = 'xl' | 'lg' | 'md' | 'sm';

/** Length limits (xl, lg, md) for the headline scale: the Overview statement is set far larger than the rest. */
export const OVERVIEW_TITLE_LIMITS: readonly [number, number, number] = [24, 32, 38];
export const SECTION_TITLE_LIMITS: readonly [number, number, number] = [40, 56, 72];

/** Display tier for a section title, by length, so long Spanish titles still sit in a few lines. */
export const titleTier = (
  title: string,
  limits: readonly [number, number, number] = SECTION_TITLE_LIMITS,
): TitleTier => {
  const length = title.length;
  if (length <= limits[0]) return 'xl';
  if (length <= limits[1]) return 'lg';
  if (length <= limits[2]) return 'md';
  return 'sm';
};

export type SayTier = 'lg' | 'md' | 'sm';

/** Type size for one half of the intro, by length, so the longest halves still fit beside the figure. */
export const sayTier = (text: string): SayTier => {
  const length = text.length;
  if (length <= 120) return 'lg';
  if (length <= 175) return 'md';
  return 'sm';
};
