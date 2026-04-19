import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Youtube, Twitter, Twitch, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { socialProfileUrls } from '../config/socialUrls';

const doneruIconUrl = new URL('../assets/images/doneru.svg', import.meta.url).href;

const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim();
const discordLine = (import.meta.env.VITE_DISCORD_LINE ?? '').trim();
/** 招待 URL のときだけリンクにする */
const discordInviteUrl = /^https?:\/\//i.test(discordLine) ? discordLine : '';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"></path>
    </svg>
  );
}

type SocialLink =
  | { label: string; url: string; color: string; icon: LucideIcon }
  | { label: string; url: string; color: string; imageSrc: string };

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks: SocialLink[] = [
    { icon: Twitch, label: 'Twitch', url: socialProfileUrls.twitch, color: 'hover:text-[#9146FF]' },
    { icon: Youtube, label: 'YouTube', url: socialProfileUrls.youtube, color: 'hover:text-[#FF0000]' },
    { icon: Twitter, label: 'X', url: socialProfileUrls.x, color: 'hover:text-[#1DA1F2]' },
    { label: 'Doneru', url: socialProfileUrls.doneru, color: 'hover:text-[#A855F7]', imageSrc: doneruIconUrl },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="mb-4 tracking-widest">{t.footer.social}</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-lg bg-muted/20 hover:bg-muted/30 border border-primary/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                  aria-label={social.label}
                >
                  {'imageSrc' in social ? (
                    <img
                      src={social.imageSrc}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </a>
              ))}
            </div>
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

          <div>
            <h3 className="mb-4 tracking-widest">CONTACT</h3>
            <div className="space-y-3 text-muted-foreground">
              {contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm hover:text-foreground transition-colors break-all"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DiscordIcon className="w-4 h-4 shrink-0 text-[#5865F2]" />
                {discordInviteUrl ? (
                  <a
                    href={discordInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    サカナインのサーバー
                  </a>
                ) : (
                  <span className="text-sm">サカナインのサーバー</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
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
