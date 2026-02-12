import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="bg-[#F6F3EE] text-foreground pt-16 md:pt-20 pb-10 md:pb-12">
      <div className="studio-container">
        <div className="max-w-4xl">
          <h3 className="brand-logo text-[clamp(2.8rem,7vw,4.6rem)] leading-none mb-7 text-primary">
            Portafolio<span className="text-accent">.</span>
          </h3>
          <p className="strategic-body text-foreground/70 text-[clamp(1.5rem,2.2vw,3rem)] leading-[1.45] max-w-4xl">
            {t('footer.description')}
          </p>

          <div className="flex gap-4 mt-10">
            <button type="button" aria-label="Instagram" className="h-16 w-16 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              <Instagram className="h-7 w-7" />
            </button>
            <button type="button" aria-label="Twitter" className="h-16 w-16 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              <Twitter className="h-7 w-7" />
            </button>
            <button type="button" aria-label="LinkedIn" className="h-16 w-16 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              <Linkedin className="h-7 w-7" />
            </button>
            <button type="button" aria-label="Facebook" className="h-16 w-16 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              <Facebook className="h-7 w-7" />
            </button>
          </div>
        </div>

        <div className="border-t border-foreground/15 pt-8 text-center">
          <p className="text-xs text-foreground/55 tracking-wider">
            © 2026 Portafolio UGC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
