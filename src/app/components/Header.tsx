import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SocialLinksDropdownItems } from './SocialLinksShared';

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-lg shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={iconImage}
                alt="STREAMER"
                className="relative w-10 h-10 rounded-lg object-cover border-2 border-primary/30 shadow-lg"
              />
            </div>
            <span className="font-['WDXL_Lubrifont_JP_N',_'Noto_Sans_JP',_sans-serif] tracking-widest">
              <span>サカナイン / Sakanine </span>
              <span className="hidden xl:inline">（世界のの屁こき隊）</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={scrollToTop}
                style={
                  !isActive(item.path)
                    ? { animationDelay: `${index * 0.28}s` }
                    : undefined
                }
                className={`px-4 py-2 rounded-lg transition-all duration-300 tracking-wider text-sm ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground nav-invite-glow'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group relative overflow-hidden rounded-lg p-px text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground"
                >
                  <span
                    aria-hidden
                    className="sns-header-trigger-gradient pointer-events-none absolute inset-0 rounded-lg"
                  />
                  <span className="relative z-[1] flex items-center gap-1 rounded-[calc(0.5rem-1px)] bg-muted/90 px-3 py-2 text-sm tracking-wider transition-colors hover:bg-muted/80 group-data-[state=open]:bg-background/85">
                    {t.footer.social}
                    <ChevronDown
                      className="w-4 h-4 opacity-70 transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(calc(100vw-2rem),18rem)] p-2">
                <SocialLinksDropdownItems />
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-muted/20 hover:bg-muted/30 border border-primary/20 flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-primary/20 bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  scrollToTop();
                  setMobileMenuOpen(false);
                }}
                style={
                  !isActive(item.path)
                    ? { animationDelay: `${index * 0.28}s` }
                    : undefined
                }
                className={`block px-4 py-3 rounded-lg transition-all duration-300 tracking-wider ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground nav-invite-glow'
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
