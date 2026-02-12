import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  ArrowRight,
  Send,
  Instagram,
  Linkedin,
  Facebook,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const fiverrLogoSrc = '/uploads/fiverr-logo-56.webp';
const whatsappLogoSrc = '/uploads/whatsapp.png';
const tiktokLogoSrc = '/uploads/TikTok-Icon-Logo.wine.svg';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/';
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga';
const threadsUrl = import.meta.env.VITE_THREADS_URL ?? 'https://www.threads.com/@sm_gisela';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/gisela.saldarriaga';

const ThreadsIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">
    @
  </span>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

  const desktopNavLinkKeys = [
    { key: 'navbar.home', href: '#home', number: '01' },
    { key: 'navbar.services', href: '#services', number: '02' },
    { key: 'navbar.portfolio', href: '#portfolio', number: '03' },
    { key: 'navbar.testimonials', href: '#testimonials', number: '04' },
    { key: 'navbar.contact', href: '#contact', number: '05' },
  ];
  const mobileNavLinkKeys = desktopNavLinkKeys.filter((link) => link.key !== 'navbar.contact');

  const contactPlatforms = [
    {
      key: 'floatingContact.whatsappLabel',
      ariaKey: 'floatingContact.whatsappAria',
      href: whatsappUrl,
      icon: (
        <img
          src={whatsappLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-emerald-400/70 via-emerald-500/40 to-emerald-600/70',
    },
    {
      key: 'floatingContact.telegramLabel',
      ariaKey: 'floatingContact.telegramAria',
      href: telegramUrl,
      icon: <Send className="h-[18px] w-[18px] -rotate-12" />,
      iconClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      glowClass: 'from-sky-400/70 via-sky-500/40 to-blue-600/70',
    },
    {
      key: 'floatingContact.fiverrLabel',
      ariaKey: 'floatingContact.fiverrAria',
      href: fiverrUrl,
      icon: (
        <img
          src={fiverrLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-green-400/70 via-green-500/40 to-emerald-600/70',
    },
    {
      key: 'floatingContact.instagramLabel',
      ariaKey: 'floatingContact.instagramAria',
      href: instagramUrl,
      icon: <Instagram className="h-[18px] w-[18px]" />,
      iconClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-300',
      glowClass: 'from-pink-400/70 via-fuchsia-500/45 to-rose-500/70',
    },
    {
      key: 'floatingContact.tiktokLabel',
      fallbackLabel: 'TikTok',
      ariaKey: 'floatingContact.tiktokAria',
      href: tiktokUrl,
      icon: (
        <img
          src={tiktokLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-9 w-9 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-zinc-500/70 via-zinc-700/45 to-zinc-900/70',
    },
    {
      key: 'floatingContact.threadsLabel',
      ariaKey: 'floatingContact.threadsAria',
      href: threadsUrl,
      icon: <ThreadsIcon className="text-[18px] font-black leading-none" />,
      iconClass: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-200',
      glowClass: 'from-zinc-400/70 via-zinc-500/45 to-zinc-600/70',
    },
    {
      key: 'floatingContact.linkedinLabel',
      ariaKey: 'floatingContact.linkedinAria',
      href: linkedinUrl,
      icon: <Linkedin className="h-[18px] w-[18px]" />,
      iconClass: 'bg-blue-600/15 text-blue-700 dark:text-blue-300',
      glowClass: 'from-blue-400/70 via-blue-600/45 to-indigo-600/70',
    },
    {
      key: 'floatingContact.facebookLabel',
      ariaKey: 'floatingContact.facebookAria',
      href: facebookUrl,
      icon: <Facebook className="h-[18px] w-[18px]" />,
      iconClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      glowClass: 'from-indigo-400/70 via-indigo-500/45 to-blue-600/70',
    },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageButtonClass = (language: string) =>
    `inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] ${
      i18n.resolvedLanguage === language
        ? 'bg-primary/22 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]'
        : 'text-foreground/85 hover:text-primary'
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-background/96 backdrop-blur-md transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />

        <div className="relative h-full flex flex-col pt-24 px-6">
          <nav className="flex-1 flex flex-col justify-center gap-3">
            {mobileNavLinkKeys.map((link, index) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(event) => handleHashLinkClick(event, closeMobileMenu)}
                className={`group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all duration-500 ${
                  mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${120 + index * 60}ms` : '0ms',
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">{link.number}</span>
                  <span className="section-label text-foreground group-hover:text-primary transition-colors">
                    {t(link.key)}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </nav>

          <div
            className={`pb-10 transition-all duration-500 ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: mobileMenuOpen ? '460ms' : '0ms' }}
          >
            <div className="relative overflow-hidden rounded-[1.7rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/55 p-4 shadow-[0_28px_46px_-34px_hsl(var(--foreground)/0.85)]">
              <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
              <div className="pointer-events-none absolute -right-6 -bottom-8 h-20 w-20 rounded-full bg-accent/15 blur-2xl" />
              <p className="section-label text-muted-foreground">{t('navbar.hireMe')}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {contactPlatforms.map((platform) => (
                  <a
                    key={platform.key}
                    href={platform.href}
                    aria-label={t(platform.ariaKey)}
                    onClick={closeMobileMenu}
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/75 px-2 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_28px_-20px_hsl(var(--foreground)/0.9)]"
                  >
                    <span
                      className={`absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r ${platform.glowClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <span className={`mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full ${platform.iconClass}`}>
                      {platform.icon}
                    </span>
                    <span className="mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground/85">
                      {t(platform.key, { defaultValue: platform.fallbackLabel ?? platform.key })}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-5 border-t border-border text-center">
              <span className="brand-logo text-2xl text-accent">
                Gisela<span className="text-foreground font-normal">.UGC</span>
              </span>
              <p className="section-label text-muted-foreground mt-2">{t('navbar.studioLabel')}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className={`fixed top-0 left-0 w-full z-[110] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div
            className={`flex items-center justify-between rounded-[1.15rem] px-4 md:px-6 transition-all duration-500 ${
              isScrolled
                ? 'py-2.5 bg-card/92 backdrop-blur-md border border-border shadow-[0_16px_36px_-28px_hsl(var(--foreground)/0.7)]'
                : 'py-3 bg-card/65 backdrop-blur-sm border border-transparent'
            }`}
          >
            <a
              href="#home"
              className="brand-logo text-xl md:text-2xl text-accent"
              onClick={(event) => handleHashLinkClick(event, closeMobileMenu)}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>

            <div className="hidden md:flex items-center gap-7">
              {desktopNavLinkKeys.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={handleHashLinkClick}
                  className="section-label text-foreground/80 transition-colors hover:text-primary"
                >
                  {t(link.key)}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                <button
                  onClick={() => changeLanguage('es')}
                  className={languageButtonClass('es')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={languageButtonClass('en')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <a href="#contact" onClick={handleHashLinkClick} className="btn-primary-nordic px-5 py-2.5">
                {t('navbar.hireMe')}
              </a>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                <button
                  onClick={() => changeLanguage('es')}
                  className={languageButtonClass('es')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={languageButtonClass('en')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:text-primary"
                aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
