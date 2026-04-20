import type { ComponentType } from 'react';
import { Youtube, Twitter, Twitch, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { socialProfileUrls } from '../config/socialUrls';
import {
  DropdownMenuItem,
} from './ui/dropdown-menu';

const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim();
const discordLine = (import.meta.env.VITE_DISCORD_LINE ?? '').trim();
const discordInviteUrl = /^https?:\/\//i.test(discordLine) ? discordLine : '';

/** `src/app/assets/images/discord.svg` と同形 */
export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.73 4.86999C18.2673 4.18817 16.7204 3.70393 15.13 3.42999C14.92 3.82999 14.73 4.22999 14.55 4.63999C12.86 4.38999 11.15 4.38999 9.45003 4.63999C9.27003 4.22999 9.08003 3.81999 8.86003 3.43999C7.26003 3.70999 5.72003 4.18999 4.26003 4.86999C1.65972 8.61377 0.488795 13.1662 0.960027 17.7C2.65746 18.9737 4.56212 19.9446 6.59003 20.57C7.05003 19.95 7.45003 19.29 7.79003 18.59C7.14003 18.34 6.50003 18.04 5.89003 17.67C6.06003 17.55 6.21003 17.43 6.36003 17.3C9.94003 19 14.06 19 17.64 17.3L18.1 17.67C17.5 18.03 16.85 18.34 16.2 18.59C16.55 19.29 16.95 19.94 17.4 20.57C19.43 19.94 21.34 18.97 23.04 17.7C23.51 12.83 22.26 8.60999 19.74 4.86999H19.73ZM8.30003 15.12C7.20003 15.12 6.30003 14.1 6.30003 12.85C6.30003 11.61 7.18003 10.59 8.30003 10.59C9.42003 10.59 10.32 11.61 10.3 12.85C10.3 14.1 9.41003 15.12 8.30003 15.12ZM15.7 15.12C14.6 15.12 13.7 14.1 13.7 12.85C13.7 11.61 14.58 10.59 15.7 10.59C16.82 10.59 17.72 11.61 17.7 12.85C17.7 14.1 16.82 15.12 15.7 15.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** `src/app/assets/images/doneru.svg` と同形 */
export function DoneruIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.6123 39.3291L16.7949 40.8156C18.9866 41.8702 21.4336 42.46 24.0147 42.46C27.767 42.46 31.236 41.2145 34.0488 39.1041C31.8118 40.2643 29.2832 40.9182 26.6054 40.9182C24.1059 40.9182 21.736 40.3487 19.6123 39.3291Z"
        fill="currentColor"
      />
      <path
        d="M26.6054 7C24.9772 7 23.4039 7.24186 21.9182 7.69198C15.0746 9.76566 10.08 16.264 10.08 23.9588C10.08 27.8434 11.3527 31.4231 13.4936 34.2822L11.0952 43.7997L16.7726 40.8045C16.7798 40.8082 16.7871 40.8112 16.7944 40.8149L19.6118 39.3284C21.7355 40.348 24.1054 40.9174 26.6049 40.9174C29.2827 40.9174 31.8112 40.2635 34.0483 39.1033C39.436 36.309 43.1303 30.5768 43.1303 23.9583C43.1307 14.5928 35.7322 7 26.6054 7ZM26.6054 38.1145C24.5356 38.1145 22.5788 37.644 20.8232 36.8014L19.5524 36.1915L15.3408 38.4132L16.5355 33.6714L15.7343 32.6015C13.9475 30.2152 12.8802 27.2227 12.8802 23.9588C12.8802 16.0738 19.0908 9.80286 26.6045 9.80286C34.1181 9.80286 40.3287 16.0738 40.3287 23.9588C40.3287 31.8437 34.119 38.1145 26.6054 38.1145Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9189 7.69198C23.4047 7.24186 24.978 7 26.6061 7C35.733 7 43.1314 14.5928 43.1314 23.9588C43.1314 30.5773 39.4372 36.3095 34.0495 39.1037C31.8124 40.264 29.2839 40.9179 26.6061 40.9179C24.1065 40.9179 21.7366 40.3484 19.6129 39.3288L16.7956 40.8153C16.7919 40.8135 16.7883 40.8119 16.7847 40.8102C16.781 40.8085 16.7774 40.8068 16.7738 40.805L11.0964 43.8001L8.2336 45.3102L10.633 35.7882C8.3574 32.8207 7 29.0781 7 25.0101C7 16.1011 13.5107 8.75151 21.9189 7.69198ZM20.824 36.8014C22.5796 37.644 24.5364 38.1145 26.6062 38.1145C34.1198 38.1145 40.3295 31.8437 40.3295 23.9588C40.3295 16.0738 34.1189 9.80285 26.6053 9.80285C19.0916 9.80285 12.881 16.0738 12.881 23.9588C12.881 27.2226 13.9483 30.2152 15.7351 32.6015L16.5363 33.6713L15.3416 38.4132L19.5531 36.1915L20.824 36.8014Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.4041 15.8301H25.4849V22.9782H22.4041V15.8301ZM30.3866 15.8301H33.4674V22.838H30.3866V15.8301ZM26.0653 35.3621L23.4156 36.6394L17.8525 25.0786L20.5021 23.8013L21.3876 25.6408H30.5271V28.5839H22.804L26.0653 35.3621Z"
        fill="currentColor"
      />
    </svg>
  );
}

type SocialIcon = LucideIcon | ComponentType<{ className?: string }>;

export type SocialLinkItem = {
  label: string;
  url: string;
  color: string;
  icon: SocialIcon;
};

/** hover（フッター）＋ Radix メニュー highlight（ヘッダー）の両方でブランド色に */
export const footerSocialLinks: SocialLinkItem[] = [
  {
    icon: Twitch,
    label: 'Twitch',
    url: socialProfileUrls.twitch,
    color: 'hover:text-[#9146FF] data-[highlighted]:!text-[#9146FF]',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    url: socialProfileUrls.youtube,
    color: 'hover:text-[#FF0000] data-[highlighted]:!text-[#FF0000]',
  },
  {
    icon: Twitter,
    label: 'X',
    url: socialProfileUrls.x,
    color: 'hover:text-[#1DA1F2] data-[highlighted]:!text-[#1DA1F2]',
  },
  {
    icon: DoneruIcon,
    label: 'Doneru',
    url: socialProfileUrls.doneru,
    color: 'hover:text-[#A855F7] data-[highlighted]:!text-[#A855F7]',
  },
];

const footerRowClass =
  'flex items-center gap-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-muted-foreground';
const footerIconBoxClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background/40 border border-primary/25';

/** フッター左カラムと同一の SNS 一覧 */
export function SocialLinksFooterList() {
  return (
    <div className="flex flex-col gap-2">
      {footerSocialLinks.map((social) => (
        <a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${footerRowClass} ${social.color}`}
        >
          <span className={footerIconBoxClass}>
            <social.icon className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium tracking-wide">{social.label}</span>
        </a>
      ))}
      {contactEmail && (
        <a
          href={`mailto:${contactEmail}`}
          className={`${footerRowClass} hover:text-sky-400`}
        >
          <span className={footerIconBoxClass}>
            <Mail className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium tracking-wide break-all">Mail</span>
        </a>
      )}
      {discordInviteUrl ? (
        <a
          href={discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${footerRowClass} hover:text-[#5865F2]`}
        >
          <span className={footerIconBoxClass}>
            <DiscordIcon className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium tracking-wide">Discord</span>
        </a>
      ) : (
        <div className={`${footerRowClass} cursor-default`}>
          <span className={footerIconBoxClass}>
            <DiscordIcon className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium tracking-wide">Discord</span>
        </div>
      )}
    </div>
  );
}

const menuIconBoxClass =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/30 border border-primary/20 text-inherit';

/** Radix DropdownMenuItem の accent（オレンジ）を無効化し、currentColor でアイコンを親に追従 */
const snsDropdownLinkBase =
  'flex cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors ' +
  'focus:!bg-transparent focus:!text-muted-foreground focus-visible:!bg-transparent ' +
  'data-[highlighted]:!bg-muted/50 ' +
  '[&_svg]:!text-current';

const mailDiscordDropdownColors =
  'hover:text-sky-400 data-[highlighted]:!text-sky-400';

const discordBrandDropdownColors =
  'hover:text-[#5865F2] data-[highlighted]:!text-[#5865F2]';

/** ヘッダー用ドロップダウン（フッターと同じ項目） */
export function SocialLinksDropdownItems() {
  return (
    <>
      {footerSocialLinks.map((social) => (
        <DropdownMenuItem key={social.label} asChild>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${snsDropdownLinkBase} ${social.color}`}
          >
            <span className={menuIconBoxClass}>
              <social.icon className="w-4 h-4" />
            </span>
            <span className="font-medium tracking-wide">{social.label}</span>
          </a>
        </DropdownMenuItem>
      ))}
      {contactEmail && (
        <DropdownMenuItem asChild>
          <a
            href={`mailto:${contactEmail}`}
            className={`${snsDropdownLinkBase} ${mailDiscordDropdownColors}`}
          >
            <span className={menuIconBoxClass}>
              <Mail className="w-4 h-4" />
            </span>
            <span className="font-medium tracking-wide">Mail</span>
          </a>
        </DropdownMenuItem>
      )}
      {discordInviteUrl ? (
        <DropdownMenuItem asChild>
          <a
            href={discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${snsDropdownLinkBase} ${discordBrandDropdownColors}`}
          >
            <span className={menuIconBoxClass}>
              <DiscordIcon className="w-4 h-4" />
            </span>
            <span className="font-medium tracking-wide">Discord</span>
          </a>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem disabled className="flex items-center gap-3 opacity-80">
          <span className={menuIconBoxClass}>
            <DiscordIcon className="w-4 h-4" />
          </span>
          <span className="font-medium tracking-wide">Discord</span>
        </DropdownMenuItem>
      )}
    </>
  );
}
