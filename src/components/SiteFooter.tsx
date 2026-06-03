import Footer from '@/components/Footer';

/** Set to true when the site footer is ready to ship again. */
export const SHOW_SITE_FOOTER = false;

const SiteFooter = () => (SHOW_SITE_FOOTER ? <Footer /> : null);

export default SiteFooter;
