import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const INLINE_TOKEN_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const HAS_MARKDOWN_LINK_RE = /\[[^\]]+\]\([^)\s]+\)/;

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
    .map((segment) => segment.href);

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

    if (isExternalHref(segment.href)) {
      return (
        <a key={`a-${index}`} href={segment.href} target="_blank" rel="noopener noreferrer">
          {segment.label}
        </a>
      );
    }

    return (
      <Link key={`l-${index}`} to={segment.href}>
        {segment.label}
      </Link>
    );
  });

  return <>{nodes}</>;
};
