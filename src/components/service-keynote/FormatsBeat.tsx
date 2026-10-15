import { useState } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { useMediaIntent } from '@/hooks/use-media-intent';
import { getClipById } from '@/lib/service-clips';
import { sectionTitleClass } from './title-class';
import KnPhone from './KnPhone';
import SegmentedControl from './SegmentedControl';
import type { KeynoteBeatProps } from './types';
import WantCta from './WantCta';

/**
 * 2 · Formats: a CSS iPhone whose screen plays the clip for the selected
 * format. Every format keeps its poster in the stack so switching is a
 * crossfade; one muted preview plays on top, only while the phone is in view
 * and only in the shell the visitor can actually see.
 */
const FormatsBeat = ({ page, locale, variant, kicker, titleId }: KeynoteBeatProps) => {
  const isMobile = variant === 'mobile';
  const [active, setActive] = useState(0);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const mediaIntent = useMediaIntent({ autoStart: true });
  const shellQuery = isMobile ? '(max-width: 767px)' : '(min-width: 768px)';
  const idPrefix = `kn-fm-${variant}`;

  const slots = page.deliverables.map((item, index) => ({
    item,
    clip: getClipById(item.clipId ?? page.featuredExamples[index % page.featuredExamples.length]?.clipId),
  }));
  const activeClip = slots[active]?.clip;

  return (
    <>
      <p className="kn-k">{kicker}</p>
      <h2 id={titleId} className={sectionTitleClass(page.deliverablesTitle)}>
        {page.deliverablesTitle}
      </h2>

      <div className="kn-dev">
        <div className="kn-spot" aria-hidden="true" />
        <div className="kn-shadow" aria-hidden="true" />
        <KnPhone className="kn-phone--stage">
          {slots.map(({ item, clip }, index) =>
            clip ? (
              <ResponsivePosterImage
                key={item.title}
                clip={clip}
                className={index === active ? 'kn-shot is-on' : 'kn-shot'}
                alt={index === active ? item.title : ''}
                aria-hidden={index === active ? undefined : true}
                sizes={isMobile ? '232px' : '(min-width: 1100px) 322px, 280px'}
                media={shellQuery}
              />
            ) : null,
          )}
          {/* No `poster` here: the stacked stills underneath are the poster, and a poster
              attribute is fetched at once, even while the phone is far below the fold. */}
          {mediaIntent && activeClip ? (
            <AutoplayPreviewVideo
              key={activeClip.id}
              src={activeClip.previewSrc}
              className={playingId === activeClip.id ? 'kn-vid is-on' : 'kn-vid'}
              aria-hidden="true"
              preload="metadata"
              playbackPriority="preview"
              rootMargin="120px 0px"
              activationQuery={shellQuery}
              onPlaying={() => setPlayingId(activeClip.id)}
            />
          ) : null}
          <span className="kn-bars" aria-hidden="true">
            {slots.map(({ item }, index) => (
              <i key={item.title} className={index === active ? 'is-on' : undefined} />
            ))}
          </span>
        </KnPhone>
      </div>

      <SegmentedControl
        className="kn-seg"
        ariaLabel={page.deliverablesTitle}
        idPrefix={idPrefix}
        items={page.deliverables.map((item) => ({ id: item.title, label: item.title }))}
        value={active}
        onChange={setActive}
      />

      <div className="kn-cap" aria-live="polite">
        {page.deliverables.map((item, index) => (
          <div
            key={item.title}
            id={`${idPrefix}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${idPrefix}-tab-${index}`}
            className={index === active ? 'is-on' : undefined}
          >
            <h3 className="section-label">{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="kn-want-row">
        <WantCta page={page} locale={locale} className="svc-want kn-want" />
      </div>
    </>
  );
};

export default FormatsBeat;
