
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

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
    `rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.08em] transition-colors duration-300 ${
      i18n.resolvedLanguage === language
        ? 'bg-primary/15 text-primary'
        : 'text-foreground/70 hover:text-primary'
    }`;

  return (
    <>
      {/* Full-screen Mobile Menu - Modern Animated */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ease-out ${mobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-md transition-all duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMobileMenu}
        />

        <div className={`absolute top-16 right-8 w-72 h-72 bg-secondary/70 rounded-full blur-3xl transition-all duration-700 delay-100 ${mobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`} />
        <div className={`absolute bottom-12 left-8 w-96 h-96 bg-card/70 rounded-full blur-3xl transition-all duration-700 delay-200 ${mobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`} />

        <div className="relative h-full flex flex-col pt-24 px-8">
          <nav className="flex-1 flex flex-col justify-center -mt-16">
            <div className="space-y-2">
              {navLinkKeys.map((link, index) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between rounded-2xl border border-white/20 bg-card/70 px-5 py-4 backdrop-blur-md transition-all duration-500 ease-out ${mobileMenuOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                    }`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 75 + 150}ms` : '0ms'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground tracking-wider">
                      {link.number}
                    </span>
                    <span className="text-3xl font-serif font-normal tracking-[-0.04em] text-foreground group-hover:text-primary transition-colors duration-300">
                      {t(link.key)}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </div>
          </nav>

          <div
            className={`pb-12 transition-all duration-500 ease-out ${mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: mobileMenuOpen ? '500ms' : '0ms' }}
          >
            <a
              href="#contact"
              onClick={closeMobileMenu}
              className="group inline-flex items-center justify-center gap-3 w-full py-4 px-8 text-sm font-semibold uppercase tracking-[0.16em] rounded-2xl bg-foreground text-background shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              {t('navbar.hireMe')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>

            <div className="flex flex-col items-center gap-2 mt-8 pt-6 border-t border-primary/20">
              <span className="brand-logo text-2xl text-primary">
                Gisela<span className="text-foreground font-normal">.UGC</span>
              </span>
              <span className="text-sm text-foreground/60 tracking-wide">Content Creator</span>
            </div>
          </div>
        </div>
      </div>

      <nav className={`fixed top-0 left-0 w-full z-[110] transition-all duration-500 ${isScrolled ? 'pt-3' : 'pt-5'}`}>
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div
            className={`relative flex items-center justify-between rounded-[1.5rem] border border-white/35 bg-card/55 px-4 backdrop-blur-2xl shadow-[0_16px_40px_-28px_hsl(var(--foreground)/0.75)] transition-all duration-500 dark:border-white/10 dark:bg-card/30 ${isScrolled ? 'py-2 md:px-4' : 'py-2.5 md:px-5'
              }`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r from-white/22 via-white/8 to-white/4 dark:from-white/10 dark:via-white/[0.03] dark:to-transparent" />
            <div className="pointer-events-none absolute -top-4 left-1/3 h-10 w-36 rounded-full bg-white/35 blur-xl dark:bg-white/10" />

            <a
              href="#home"
              className="relative brand-logo text-xl md:text-2xl text-primary"
              onClick={closeMobileMenu}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>

            <div className="relative hidden md:flex flex-1 justify-center px-4 lg:px-8">
              <div className={`flex items-center gap-1 rounded-full border border-white/40 bg-card/60 px-2 py-1 backdrop-blur-xl shadow-[inset_0_1px_0_hsl(var(--background)/0.5)] transition-all duration-500 dark:border-white/10 dark:bg-black/20 ${isScrolled ? 'scale-[0.99]' : 'scale-100'
                }`}>
                {navLinkKeys.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-semibold tracking-[0.08em] text-foreground/80 transition-all duration-300 hover:bg-white/30 hover:text-primary dark:hover:bg-white/5"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative hidden md:flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-1 rounded-full border border-white/30 bg-white/25 p-1 dark:border-white/10 dark:bg-white/5">
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
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-20px_hsl(var(--foreground)/0.9)]"
              >
                {t('navbar.hireMe')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="relative md:hidden flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-white/30 bg-white/25 p-1 dark:border-white/10 dark:bg-white/5">
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
                className="relative rounded-full border border-white/35 bg-card/80 p-2 text-foreground transition-colors hover:text-primary dark:border-white/10 dark:bg-black/20"
                aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                      }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
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
