import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/locale-context';
import { ArrowUpRight } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { CONTACT_CHANNELS, CHANNEL_LOGO_SRC } from '@/lib/contact-channels';
import ContactChannelGlyph from '@/components/mobile/ContactChannelGlyph';
import NavbarControls from '@/components/NavbarControls';
import { getLocaleFromPath } from '@/lib/locale-path';

type MobileContactSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** App-style contact bottom sheet (mobile) — replaces the floating bubble. */
const MobileContactSheet = ({ open, onOpenChange }: MobileContactSheetProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="msheet">
        <div className="msheet-head">
          <DrawerTitle className="msheet-title">
            {t('contact.sectionTitle', { defaultValue: 'Contacto' })}
          </DrawerTitle>
          <DrawerDescription className="msheet-sub">
            {t('contact.heading', { defaultValue: 'Cuéntame de tu proyecto' })}
          </DrawerDescription>
        </div>
        <div className="msheet-list">
          {CONTACT_CHANNELS.map((ch) => {
            const isLogo = ch.id in CHANNEL_LOGO_SRC;
            return (
              <a
                key={ch.id}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(ch.ariaKey)}
                onClick={() => onOpenChange(false)}
                className="msheet-row"
              >
                <span
                  className="msheet-glyph"
                  style={isLogo ? { background: 'hsl(var(--pure-linen))', color: '#111' } : { background: ch.brand, color: '#fff' }}
                >
                  <ContactChannelGlyph id={ch.id} />
                </span>
                <span className="msheet-label">{t(ch.labelKey)}</span>
                <ArrowUpRight className="msheet-arrow" aria-hidden="true" />
              </a>
            );
          })}
        </div>
        {/* Phones have no top bar, so language and theme live here. */}
        <div className="msheet-controls items-center gap-3 border-t border-border/50 pt-3">
          <span className="msheet-label">{t('navbar.languageAndTheme')}</span>
          <NavbarControls currentLocale={getLocaleFromPath(pathname)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileContactSheet;
