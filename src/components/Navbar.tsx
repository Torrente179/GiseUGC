
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
                  className={`group flex items-center gap-4 py-4 transition-all duration-500 ease-out ${mobileMenuOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                    }`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 75 + 150}ms` : '0ms'
                  }}
                >
                  <span className="text-xs font-mono text-muted-foreground tracking-wider">
                    {link.number}
                  </span>
                  <span className="text-3xl font-playfair text-foreground group-hover:text-primary transition-colors duration-300">
                    {t(link.key)}
                  </span>
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
              className="flex items-center justify-center gap-3 w-full py-4 px-8 bg-primary text-primary-foreground text-lg font-medium rounded-2xl shadow-sm hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              {t('navbar.hireMe')}
              <ArrowRight className="w-5 h-5" />
            </a>

            <div className="flex flex-col items-center gap-2 mt-8 pt-6 border-t border-primary/20">
              <span className="text-2xl font-cormorant italic text-primary font-semibold">
                Gisela<span className="text-foreground not-italic font-normal">.UGC</span>
              </span>
              <span className="text-sm text-foreground/60 tracking-wide">Content Creator</span>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${isScrolled
          ? 'py-3 bg-background/92 backdrop-blur-xl border-b border-border shadow-[0_12px_30px_-24px_hsl(var(--foreground)/0.35)]'
          : 'py-5 bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <a
              href="#home"
              className="text-xl md:text-2xl font-semibold font-cormorant text-primary italic tracking-wide"
              onClick={closeMobileMenu}
            >
              Gisela<span className="text-foreground not-italic font-medium">.UGC</span>
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navLinkKeys.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm text-foreground hover-lift hover:text-primary transition-all"
                >
                  {t(link.key)}
                </a>
              ))}
              <div className="flex items-center space-x-2 ml-4 border-l border-primary/20 pl-4">
                <button
                  onClick={() => changeLanguage('es')}
                  className={`text-sm font-medium ${i18n.resolvedLanguage === 'es' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-primary'}`}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <span className="text-foreground/30 text-sm">|</span>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`text-sm font-medium ${i18n.resolvedLanguage === 'en' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-primary'}`}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <a
                href="#contact"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover-grow btn-press shadow-sm ml-2"
              >
                {t('navbar.hireMe')}
              </a>
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeLanguage('es')}
                  className={`text-sm font-medium ${i18n.resolvedLanguage === 'es' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-primary'}`}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <span className="text-foreground/30 text-sm">|</span>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`text-sm font-medium ${i18n.resolvedLanguage === 'en' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-primary'}`}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="relative p-2 -mr-2 text-foreground hover:text-primary transition-colors bg-card/85 border border-border rounded-full"
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
