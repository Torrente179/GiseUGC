import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const INLINE_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const HAS_MARKDOWN_LINK_RE = /\[[^\]]+\]\([^)\s]+\)/;

export type InlineCopySegment =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string };

export const parseInlineCopy = (text: string): InlineCopySegment[] => {
  const segments: InlineCopySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_LINK_RE)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, index) });
    }
    segments.push({ type: 'link', label: match[1], href: match[2] });
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
};

export const visibleInlineCopy = (text: string) =>
  parseInlineCopy(text)
    .map((segment) => (segment.type === 'text' ? segment.value : segment.label))
    .join('');

export const inlineCopyHrefs = (text: string) =>
  parseInlineCopy(text)
    .filter((segment): segment is Extract<InlineCopySegment, { type: 'link' }> => segment.type === 'link')
    .map((segment) => segment.href);

export type InlineCopyInput = string | InlineCopySegment[];

export const serializeRouteDataJson = (data: unknown) =>
  JSON.stringify(data, (_key, value) => {
    if (typeof value === 'string' && HAS_MARKDOWN_LINK_RE.test(value)) {
      return parseInlineCopy(value);
    }
    return value;
  }).replace(/</g, '\\u003c');

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export const InlineCopy = ({ text }: { text: InlineCopyInput }) => {
  const segments = typeof text === 'string' ? parseInlineCopy(text) : text;
  const nodes: ReactNode[] = segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <Fragment key={`t-${index}`}>{segment.value}</Fragment>;
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
