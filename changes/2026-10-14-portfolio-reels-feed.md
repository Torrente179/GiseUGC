# "Reels que venden": the portfolio as a social feed

**Status:** Live on main
**Implemented:** 2026-10-14
**Scope:** `Portfolio` (`#portfolio`, the section after the hero chapter), all
breakpoints, light and dark.

Design canvas: after two rounds that missed ("too generic"), the user picked
**C1 · Phone feed** mixed with C3's ambient glow, with the title refined in its
existing serif style. The rows "round 3" and "the mix" are on
<https://claude.ai/artifact/L7DtvF1VoqjmT1hfxe9Qz6>.

## What it is now

- **Desktop / iPad (≥ 768px):** the reels play inside the hero's iPhone
  (`ReelPhone`) as a vertical feed, with TikTok-style category tabs (Para ti ·
  Moda · Belleza · Tech · Lifestyle). On the left: the title, a "now playing"
  spec card (category, length, language from the clip data) and "Quiero un video
  así". The CTA opens WhatsApp with the reel's title pre-filled. On the right
  (≥ 1200px): "A continuación" and the reel count. Under the phone there are
  ↑ ↓ and a sound toggle (beside the phone from 1200px).
  - **Dark theme:** the playing reel's poster (180px variant), blurred 90px,
    tints the whole section and crossfades between reels.
  - **Light theme:** the cream ground with the soft teal and sand fields from
    the C1 board.
- **Phones (< 768px):** the page shows one reel in a card (`.rf-inline`), on
  the same theme grounds as desktop: the title, category chips, the playing
  reel (counter, title, category · length · language, progress) and "Quiero un
  video así". Swiping sideways on the card changes the reel. Tapping it opens
  the full-screen feed (`.rf-mob--overlay`, portalled to `<body>`, above the
  tab bar), which has:
  - reels swiped up and down;
  - the tabs;
  - a side column (sound, like with the 4.7 rating, 177 reviews, 28+ brands);
  - a caption with "Quiero uno así";
  - a "Desliza" hint until the first swipe;
  - a round glass ✕ at the top right.

  The feed opens on the reel the card was showing, with sound on. When it
  closes (✕ or Escape), the card shows wherever the feed left off. Glass ‹ ›
  arrows on the card browse the reels before opening one. Video files and
  playback: changes/2026-10-14-feed-video-delivery.md.
- **Title:** "Reels que *venden*" stays in Cormorant, as the user asked. It is
  larger, on two lines, and a brushed underline draws under the italic word the
  first time the section comes into view. EN: "Reels that *sell*".
- Only the active reel mounts a `<video>`: the mobile rendition with HLS through
  `AdaptiveVideo`. Every other slide is a poster. On desktop, a reel that ends
  moves to the next one; on phones it loops.
- Replaced: the free-scroll rail with outlined ghost numerals, the phone
  carousel and the full-screen theater player in this section. The `dc-gallery*`
  and `dc-reel-*` rules in `index.css` are now unused (left in place: that file
  is edited in parallel).

## Scroll handling

- **Desktop wheel:** a non-passive listener on the phone moves through the feed
  and calls `preventDefault`, except at the first and last reel, where the page
  scrolls on. Vertical drags on the phone move through reels too, and the click
  is swallowed so a drag doesn't also "like" the reel.
- **Phones:** the first version put the full-screen feed inside the page, and
  that made the page hard to scroll past (reported by the user). Now the page
  only holds the card, so it scrolls normally. The vertical feed exists only
  while the overlay is open. While it's open:
  - the body is locked (`position: fixed` + `top: -scrollY`, restored on
    close);
  - focus goes to the ✕, then back to the card;
  - the scroller is `overscroll-behavior: contain`.

## Gotchas

- The card's `<video>` and caption are siblings. Both were keyed
  `clip.id`, and the duplicate key stopped React removing old videos
  (one more `<video>` per reel change). The caption is now keyed
  `caption-${clip.id}`. Only one `<video>` exists at a time: in the card, or in
  the overlay while it is open.

- The caption lines and the top pill are `<p>`s. The global `p` colour in
  `index.css` turned them dark ink over the video until `color: #fff` was set
  on them.
- The bottom overlays sit above the glass tab bar's fade
  (`--app-dock-clearance` + 2.75rem). Inside it, the cream fade washed them out.
- `ReelPhone`'s "tap to like" hint is hidden here; the tabs take its place.

## Verified

Headless Chrome (puppeteer):
- **1440px, light and dark:** the video plays, the next button and the wheel
  change the reel without scrolling the page, and the Tech tab filters to
  12 reels.
- **820px (iPad):** the two-column layout, with the controls under the phone.
- **390px, light and dark:**
  - the page scrolls past the card;
  - a sideways swipe moves the card to 02/26;
  - a tap opens the overlay full screen (z 230), focuses the ✕ and locks the
    body;
  - scrolling the feed reaches 04/26 with one video mounted and hides the hint;
  - the ✕ closes the overlay, restores the scroll position and shows 04/26 on
    the card;
  - Escape closes it too.
- **320px and 430px:** the card fits with no horizontal overflow. Desktop is
  unchanged.
- **Checks:** `npm run typecheck`, `npm test` (351 passed), ESLint.
