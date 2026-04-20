import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Play } from 'lucide-react';
import gamelistRaw from '../assets/markdown/gamelist.md?raw';
import {
  ABOUT_NICONICO_HIGHLIGHTS,
  resolveHighlightThumbnailSrc,
  resolveHighlightVideoSrc,
} from '../config/aboutNicoHighlights';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const iconImage = new URL('../assets/images/icon.webp', import.meta.url).href;

const PAST_GAME_LINES: string[] = (gamelistRaw as string)
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line): line is string => line.length > 0);

function bioWithHighlightedTwitch(bio: string) {
  return bio.split(/(Twitch)/g).map((part, i) =>
    part === 'Twitch' ? (
      import.meta.env.VITE_TWITCH ? (
      <a
        key={i}
        href={`https://www.twitch.tv/${import.meta.env.VITE_TWITCH}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline font-bold text-primary tracking-wide drop-shadow-[0_0_14px_color-mix(in_srgb,var(--primary)_50%,transparent)] hover:underline"
      >
        {part}
      </a>
      ) : (
        <span key={i}>{part}</span>
      )
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const activeHighlight =
    playingIndex !== null ? ABOUT_NICONICO_HIGHLIGHTS[playingIndex] : null;
  const activeVideoSrc = activeHighlight
    ? resolveHighlightVideoSrc(activeHighlight)
    : '';
  const activePosterSrc = activeHighlight
    ? resolveHighlightThumbnailSrc(activeHighlight)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest">{t.about.title}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <section className="mb-16">
        <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-8 shadow-xl shadow-primary/10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={iconImage}
                alt="Avatar"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/50 shadow-2xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2 glow-text">{t.hero.streamerName}</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {bioWithHighlightedTwitch(t.about.bio)}
              </p>
              <p className="text-primary hover:underline leading-relaxed max-w-2xl mt-4">
                <a href="https://dic.nicovideo.jp/l/%E4%B8%96%E7%95%8C%E3%81%AE%E5%B1%81%E3%81%93%E3%81%8D%E9%9A%8A" target="_blank" rel="noopener noreferrer">
                  {t.about.niconicoOpenExternal}
                </a>
              </p>

              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <div className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                  <span className="text-sm tracking-wider">Action Games</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-sm">
                  <span className="text-sm tracking-wider">RPG</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
                  <span className="text-sm tracking-wider">Baseball</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest">{t.about.highlights}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>
        {/* <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto">
          {t.about.niconicoHighlights}
        </p> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ABOUT_NICONICO_HIGHLIGHTS.map((highlight, i) => {
            const thumbSrc = resolveHighlightThumbnailSrc(highlight);
            return (
              <div
                key={highlight.nicovideoUrl}
                className="group relative bg-card/60 backdrop-blur-md rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
              >
              <div className="aspect-video bg-muted/40 relative overflow-hidden">
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={highlight.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/90 via-muted/50 to-muted/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-xs tracking-wider z-10">
                  NICONICO
                </div>
                <button
                  type="button"
                  onClick={() => setPlayingIndex(i)}
                  className="absolute inset-0 z-10 flex items-center justify-center transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={t.about.playHighlight}
                >
                  <Play
                    className="w-16 h-16 text-primary drop-shadow-lg"
                    fill="currentColor"
                  />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <p className="tracking-wide">{highlight.title}</p>
                <a
                  href={highlight.nicovideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-block"
                >
                  {t.about.niconicoOpenExternal}
                </a>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <h1 className="tracking-widest">{t.about.pastGames}</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
        </div>
        <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-6 md:p-8 shadow-xl shadow-primary/10 max-h-[min(70vh,52rem)] overflow-y-auto">
          <ul className="list-disc list-outside pl-5 space-y-1.5 text-muted-foreground text-sm md:text-base md:columns-2 md:gap-x-10">
            {PAST_GAME_LINES.map((line, i) => (
              <li key={`${i}-${line.slice(0, 48)}`} className="break-words [break-inside:avoid]">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Dialog
        open={playingIndex !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setPlayingIndex(null);
        }}
      >
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] p-4 sm:p-6 gap-4">
          {activeHighlight && (
            <>
              <DialogHeader>
                <DialogTitle>{activeHighlight.title}</DialogTitle>
              </DialogHeader>
              <video
                key={activeVideoSrc}
                src={activeVideoSrc}
                poster={activePosterSrc ?? undefined}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full rounded-md bg-black"
              />
              <a
                href={activeHighlight.nicovideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t.about.niconicoOpenExternal}
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
