import { useCallback, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { SITE_PROOF } from '@/data/site-proof';
import { useTranslation } from '@/lib/locale-context';
import '@/styles/reel-phone.css';

const HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';

type Burst = { id: number; x: number; y: number };

const COPY = {
  es: { like: 'Me gusta', hint: 'Toca el video para darle me gusta' },
  en: { like: 'Like', hint: 'Tap the video to like it' },
} as const;

type ReelPhoneProps = {
  /** The reel itself: poster, video, any intro — fills the screen. */
  children: ReactNode;
  /** Title of the clip on screen, shown in the caption. */
  title: string;
  /** Changes with each clip, restarting the progress bar. */
  reelKey: string | number;
  /** Whether the reel is advancing; the progress bar only runs then. */
  playing: boolean;
  /** How long one clip stays on screen, for the progress bar. */
  clipMs: number;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
  onContact: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

/**
 * An iPhone 17 Pro Max showing a reel, with the action column a short-video
 * feed puts beside it. Clicking the video (or the heart) likes it: a heart
 * bursts where the click landed and small hearts float up the column. Nothing
 * animates until then. The other actions are real links: reviews, the
 * portfolio, and contact.
 *
 * Proportions and radii are in index.css (`.reel-phone`); the parent sets the
 * width with `--reel-phone-w`. Everything on the screen is sized in `cqw` of
 * the screen, so the UI scales with the phone.
 */
const ReelPhone = ({ children, title, reelKey, playing, clipMs, onNavigate, onContact, className }: ReelPhoneProps) => {
  const { locale, t } = useTranslation();
  const copy = COPY[locale === 'en' ? 'en' : 'es'];
  const screenRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState<Burst | null>(null);

  const like = useCallback((x: number, y: number) => {
    setLiked(true);
    setBurst((previous) => ({ id: (previous?.id ?? 0) + 1, x, y }));
  }, []);

  const handleTap = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // A keyboard press reports detail 0 and no pointer position.
    const fromKeyboard = event.detail === 0;
    like(
      fromKeyboard ? rect.width / 2 : event.clientX - rect.left,
      fromKeyboard ? rect.height * 0.42 : event.clientY - rect.top,
    );
  }, [like]);

  const handleHeart = useCallback(() => {
    const rect = screenRef.current?.getBoundingClientRect();
    like((rect?.width ?? 0) / 2, (rect?.height ?? 0) * 0.42);
  }, [like]);

  return (
    <div className={`reel-phone${className ? ` ${className}` : ''}`}>
      <span className="reel-phone__button reel-phone__button--action" aria-hidden="true" />
      <span className="reel-phone__button reel-phone__button--volume-up" aria-hidden="true" />
      <span className="reel-phone__button reel-phone__button--volume-down" aria-hidden="true" />
      <span className="reel-phone__button reel-phone__button--side" aria-hidden="true" />
      <span className="reel-phone__button reel-phone__button--camera" aria-hidden="true" />

      <div className="reel-phone__glass">
        <div className="reel-phone__screen" ref={screenRef}>
          {children}
          <span className="reel-phone__shade" aria-hidden="true" />

          <button
            type="button"
            className="reel-phone__tap"
            aria-label={copy.like}
            aria-pressed={liked}
            onClick={handleTap}
          />

          {burst && (
            <span
              key={burst.id}
              className="reel-phone__burst"
              style={{ left: burst.x, top: burst.y }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" focusable="false"><path d={HEART_PATH} /></svg>
            </span>
          )}

          {!liked && (
            <span className="reel-phone__hint" aria-hidden="true">{copy.hint}</span>
          )}

          <div className="reel-phone__rail">
            <a href="#contact" className="reel-phone__avatar" aria-label={t('hero.buttonContact')} onClick={onContact}>
              <img src="/uploads/gisela-avatar-160.webp" alt="" width="160" height="160" loading="lazy" decoding="async" />
              <span className="reel-phone__follow" aria-hidden="true">+</span>
            </a>

            <button
              type="button"
              className={`reel-phone__action${liked ? ' is-liked' : ''}`}
              aria-label={t('hero.feed.ratingAria', { rating: SITE_PROOF.fiverrRating })}
              aria-pressed={liked}
              onClick={handleHeart}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={HEART_PATH} /></svg>
              <span>{SITE_PROOF.fiverrRating}</span>
              {burst && (
                <span key={burst.id} className="reel-phone__floats" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d={HEART_PATH} /></svg>
                  <svg viewBox="0 0 24 24" focusable="false"><path d={HEART_PATH} /></svg>
                  <svg viewBox="0 0 24 24" focusable="false"><path d={HEART_PATH} /></svg>
                </span>
              )}
            </button>

            <a
              href="#testimonials"
              className="reel-phone__action"
              aria-label={t('hero.feed.reviewsAria', { count: SITE_PROOF.fiverrReviewCount })}
              onClick={onNavigate}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
              <span>{SITE_PROOF.fiverrReviewCount}</span>
            </a>

            <a
              href="#portfolio"
              className="reel-phone__action"
              aria-label={t('hero.feed.brandsAria', { count: SITE_PROOF.brandCampaigns })}
              onClick={onNavigate}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
              <span>{SITE_PROOF.brandCampaigns}+</span>
            </a>

            <a href="#contact" className="reel-phone__action" onClick={onContact}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11V5z" /></svg>
              <span>{t('hero.buttonContact')}</span>
            </a>

            <span className="reel-phone__disc" aria-hidden="true">
              <img src="/uploads/gisela-avatar-160.webp" alt="" width="160" height="160" loading="lazy" decoding="async" />
            </span>
          </div>

          <div className="reel-phone__caption">
            <p className="reel-phone__name">Gisela Saldarriaga</p>
            <p className="reel-phone__title">{title}</p>
            <p className="reel-phone__sound">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span>{t('hero.feed.soundShort')}</span>
            </p>
          </div>

          <span className="reel-phone__progress" aria-hidden="true">
            <span
              key={reelKey}
              className={`reel-phone__progress-fill${playing ? ' is-playing' : ''}`}
              style={{ '--reel-clip-ms': `${clipMs}ms` } as CSSProperties}
            />
          </span>

          <span className="reel-phone__island" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default ReelPhone;
