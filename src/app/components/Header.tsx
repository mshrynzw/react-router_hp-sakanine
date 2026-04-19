import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const iconImage = new URL('../assets/images/icon.webp', import.meta.url).href;

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t.nav.top },
    { path: '/about', label: t.nav.about },
    { path: '/schedule', label: t.nav.schedule },
    { path: '/support', label: t.nav.support },
    { path: '/contact', label: t.nav.contact },
  ];

  const languages = [
    { code: 'ja', label: 'JP' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-lg shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={iconImage}
                alt="STREAMER"
                className="relative w-10 h-10 rounded-lg object-cover border-2 border-primary/30 shadow-lg"
              />
            </div>
            <span className="tracking-widest hidden sm:block">サカナイン / sakanine （旧世界のの屁こき隊）</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 tracking-wider text-sm ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-muted/20 rounded-lg p-1 border border-primary/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`px-3 py-1 rounded text-xs tracking-wider transition-all duration-300 ${
                    language === lang.code
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted/30 text-muted-foreground'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-muted/20 hover:bg-muted/30 border border-primary/20 flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 tracking-wider ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'hover:bg-muted/20 text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-primary/10">
              <div className="grid grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded text-sm tracking-wider transition-all duration-300 ${
                      language === lang.code
                        ? 'bg-primary text-white'
                        : 'bg-muted/20 hover:bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
