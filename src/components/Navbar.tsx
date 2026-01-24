
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
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

  const navLinkKeys = [
    { key: 'navbar.home', href: '#home' },
    { key: 'navbar.services', href: '#services' },
    { key: 'navbar.portfolio', href: '#portfolio' },
    { key: 'navbar.testimonials', href: '#testimonials' },
    { key: 'navbar.contact', href: '#contact' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 glass shadow-sm'
          : 'py-5 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            className="text-xl md:text-2xl font-medium font-cormorant text-primary italic"
          >
            Gisela<span className="text-foreground not-italic font-normal">.UGC</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinkKeys.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-foreground hover-lift hover:text-primary/80 transition-all"
              >
                {t(link.key)}
              </a>
            ))}
            {/* Language Switcher - Desktop */}
            <div className="flex items-center space-x-2 ml-4 border-l border-border/30 pl-4">
              <button
                onClick={() => changeLanguage('es')}
                className={`text-sm font-medium ${i18n.resolvedLanguage === 'es' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
                aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
              >
                ES
              </button>
              <span className="text-foreground/30 text-sm">|</span>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-sm font-medium ${i18n.resolvedLanguage === 'en' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
                aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
              >
                EN
              </button>
            </div>
            {/* Theme Toggle - Desktop */}
            <ThemeToggle />
            <a
              href="#contact"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm hover-grow btn-press shadow-sm ml-2"
            >
              {t('navbar.hireMe')}
            </a>
          </div>

          {/* Mobile Navigation - Right Side */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Language Switcher - Mobile Header */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLanguage('es')}
                className={`text-sm font-medium ${i18n.resolvedLanguage === 'es' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
                aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
              >
                ES
              </button>
              <span className="text-foreground/30 text-sm">|</span>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-sm font-medium ${i18n.resolvedLanguage === 'en' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
                aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
              >
                EN
              </button>
            </div>
            {/* Theme Toggle - Mobile */}
            <ThemeToggle />
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors btn-press"
              aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full Screen Takeover */}
      <div
        className={`fixed inset-0 md:hidden z-40 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center space-y-6">
            {mobileMenuOpen && navLinkKeys.map((link, index) => (
              <a
                key={link.key}
                href={link.href}
                className="text-2xl font-medium text-foreground hover:text-primary transition-all stagger-item"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {t(link.key)}
              </a>
            ))}
            {mobileMenuOpen && (
              <a
                href="#contact"
                className="px-8 py-3 text-lg rounded-full bg-primary text-white hover-grow btn-press mt-4 stagger-item"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: '0.3s' }}
              >
                {t('navbar.hireMe')}
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
