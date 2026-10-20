import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const INLINE_TOKEN_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const HAS_MARKDOWN_LINK_RE = /\[[^\]]+\]\([^)\s]+\)/;

// Copy is currently authored in the repo, but it is also serialized into
// prerendered route data. Keep future data sources from turning a copy link
// into a javascript:, data:, or protocol-relative navigation.
const safeInlineHref = (href: string): string | null => {
  if (href.includes('\\') || [...href].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  if (href.startsWith('#') && /^#[a-z][a-z0-9_-]*$/iu.test(href)) return href;
  if (!href.startsWith('https://')) return null;
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? href : null;
  } catch {
    return null;
  }
};

export type InlineCopySegment =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'bold'; value: string };

export const parseInlineCopy = (text: string): InlineCopySegment[] => {
  const segments: InlineCopySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, index) });
    }
    if (match[3] !== undefined) {
      segments.push({ type: 'bold', value: match[3] });
    } else {
      segments.push({ type: 'link', label: match[1], href: match[2] });
    }
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
};

export type InlineCopyInput = string | InlineCopySegment[];

/**
 * In the browser, copy read from #route-data is already segments:
 * serializeRouteDataJson splits every "[label](href)" string before it ships.
 * Every helper takes either shape, so a field typed `string` in the data
 * modules cannot crash hydration when it carries a link.
 */
const toSegments = (text: InlineCopyInput): InlineCopySegment[] =>
  typeof text === 'string' ? parseInlineCopy(text) : text;

export const visibleInlineCopy = (text: InlineCopyInput) =>
  toSegments(text)
    .map((segment) => (segment.type === 'link' ? segment.label : segment.value))
    .join('');

export const inlineCopyHrefs = (text: InlineCopyInput) =>
  toSegments(text)
    .filter((segment): segment is Extract<InlineCopySegment, { type: 'link' }> => segment.type === 'link')
    .map((segment) => safeInlineHref(segment.href))
    .filter((href): href is string => href !== null);

export const serializeRouteDataJson = (data: unknown) =>
  JSON.stringify(data, (_key, value) => {
    if (typeof value === 'string' && HAS_MARKDOWN_LINK_RE.test(value)) {
      return parseInlineCopy(value);
    }
    return value;
  }).replace(/</g, '\\u003c');

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export const InlineCopy = ({ text }: { text: InlineCopyInput }) => {
  const segments = toSegments(text);
  const nodes: ReactNode[] = segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <Fragment key={`t-${index}`}>{segment.value}</Fragment>;
    }

    if (segment.type === 'bold') {
      return <strong key={`b-${index}`}>{segment.value}</strong>;
    }

    const href = safeInlineHref(segment.href);
    if (!href) return <Fragment key={`t-${index}`}>{segment.label}</Fragment>;

    if (isExternalHref(href)) {
      return (
        <a key={`a-${index}`} href={href} target="_blank" rel="noopener noreferrer">
          {segment.label}
        </a>
      );
    }

    return (
      <Link key={`l-${index}`} to={href}>
        {segment.label}
      </Link>
    );
  });

  return <>{nodes}</>;
};
