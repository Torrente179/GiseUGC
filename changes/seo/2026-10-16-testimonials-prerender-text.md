# Homepage testimonials text in the prerendered HTML

**Status:** Current
**Implemented:** 2026-10-16
**Scope:** `/` and `/en/` `#testimonials` placeholder. Not the lazy video cards.

The live Fiverr reviews (Juan Pablo, `ba0c5f1`..`9fbe766`) live in
`src/data/fiverr-reviews.ts`. The homepage still lazy-mounts
`Testimonials` so videos and client photos stay out of the first HTML.
The placeholder was an `aria-hidden` shimmer, so curl / Googlebot / answer
engines saw none of the quotes.

## What changed

`DeferredSection` still swaps the placeholder for the lazy cards. The
placeholder now renders the review **text** from that same data file:

- client handle (`user`)
- country, when the row has an ISO code (`Intl.DisplayNames` in the page locale)
- star rating
- the quote (`text`)

No invented reviews. No edits to anyone's wording. No per-review `Review`
schema. `AggregateRating` 4.7/177 and the rest of the homepage JSON-LD are
untouched.

The section is no longer `aria-hidden` once it contains that text. The quotes
are `sr-only` inside the existing `min-h-[500px]` shimmer so the lazy swap
does not show two copies or grow the box. Videos and posters are still absent
from the first HTML; they load only after `Testimonials` hydrates.

## Runtime touchpoints

- `src/components/TestimonialsReviewQuotes.tsx`
- `src/pages/Index.tsx` (skeleton only)
- `src/components/motion/SectionSkeleton.tsx` (`aria-hidden` only when the
  skeleton has no real children)

`src/components/Testimonials.tsx` is unchanged.

## Before / after (raw HTML)

Recorded against production on 2026-10-16, commit `9fbe766`:

| Check | `/` before | `/en/` before |
|---|---|---|
| Distinctive Fiverr quotes in the HTML | 0 | 0 |
| `#testimonials` `aria-hidden` | true | true |
| `AggregateRating` | 4.7 / 177 | 4.7 / 177 |
| H1 count | 1 | 1 |
| Review video URLs in the HTML | 0 | 0 |

After deploy, the same curl should find every `FIVERR_REVIEWS[].text`, no
`aria-hidden` on `#testimonials`, still one H1, the same AggregateRating, and
still no `videos/reviews/*.mp4` in the first HTML.

## Do not

- Add `Review` / `reviewBody` nodes
- Use `GiseUGC` as a keyword (public brand is Gisela Saldarriaga / Gisela.UGC)
- Rework the testimonials layout or player — that file is mid-edit
