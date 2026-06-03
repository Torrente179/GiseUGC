import Footer from '@/components/Footer';
import PageEndStrip from '@/components/PageEndStrip';

/** Set to true when the full site footer is ready to ship again. */
export const SHOW_SITE_FOOTER = false;

const SiteFooter = () => (
  <>
    {SHOW_SITE_FOOTER ? <Footer /> : <PageEndStrip />}
  </>
);

export default SiteFooter;
