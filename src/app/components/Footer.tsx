import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { SocialLinksFooterList } from './SocialLinksShared';

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.top, path: '/' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.schedule, path: '/schedule' },
    { label: t.nav.support, path: '/support' },
    { label: t.nav.contact, path: '/contact' },
  ];

  return (
    <footer className="relative mt-20 border-t border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="mb-4 tracking-widest">{t.footer.social}</h3>
            <SocialLinksFooterList />
          </div>

          <div>
            <h3 className="mb-4 tracking-widest">NAVIGATION</h3>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sakanine. All rights reserved.
          </p>
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
