import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

  const navLinkKeys = [
    { key: 'navbar.home', href: '#home', number: '01' },
    { key: 'navbar.services', href: '#services', number: '02' },
    { key: 'navbar.portfolio', href: '#portfolio', number: '03' },
    { key: 'navbar.testimonials', href: '#testimonials', number: '04' },
    { key: 'navbar.contact', href: '#contact', number: '05' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageButtonClass = (language: string) =>
    `rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5em] transition-colors duration-300 ${
      i18n.resolvedLanguage === language
        ? 'bg-primary/15 text-primary'
        : 'text-foreground/70 hover:text-primary'
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
            {navLinkKeys.map((link, index) => (
              <a
                key={link.key}
                href={link.href}
                onClick={closeMobileMenu}
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
            <a
              href="#contact"
              onClick={closeMobileMenu}
              className="btn-primary-nordic w-full py-4"
            >
              {t('navbar.hireMe')}
            </a>
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
              onClick={closeMobileMenu}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>

            <div className="hidden md:flex items-center gap-7">
              {navLinkKeys.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
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
              <a href="#contact" className="btn-primary-nordic px-5 py-2.5">
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
                className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:text-primary"
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
