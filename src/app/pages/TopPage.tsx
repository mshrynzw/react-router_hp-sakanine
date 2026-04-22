import { useMemo, useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja, enUS, zhCN, ko } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';
import { Play } from 'lucide-react';
import {
  DUMMY_IMAGE_URLS_ROTATION,
  getDummyImageUrlByFileName,
} from '../config/dummyAssets';
import {
  DUMMY_ACTIVITY_CARD_CONFIGS,
  isDummyActivityThumbsEnabled,
} from '../config/dummyActivityFeed';
import {
  buildTwitchPlayerEmbedSrc,
  extraTwitchEmbedParentsFromEnv,
  socialProfileUrls,
} from '../config/socialUrls';
import {
  fetchLatestActivity,
  type ActivityItem,
} from '../lib/activityFeed';

const useDummyActivityThumbs = isDummyActivityThumbsEnabled();

const dateLocales = {
  ja,
  en: enUS,
  zh: zhCN,
  ko,
} as const;

function formatRelativeTime(
  publishedAt: number,
  lang: keyof typeof dateLocales
): string {
  return formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: dateLocales[lang],
  });
}

function formatLocalizedDateTime(
  publishedAt: number,
  lang: keyof typeof dateLocales
): string {
  const localeByLang: Record<keyof typeof dateLocales, string> = {
    ja: 'ja-JP',
    en: 'en-US',
    zh: 'zh-CN',
    ko: 'ko-KR',
  };
  return new Intl.DateTimeFormat(localeByLang[lang], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(publishedAt));
}

function resolveActivityThumbnail(
  item: ActivityItem,
  index: number
): string | null {
  if (useDummyActivityThumbs) {
    if (item.thumbnail) return item.thumbnail;
    if (DUMMY_IMAGE_URLS_ROTATION.length > 0) {
      return (
        DUMMY_IMAGE_URLS_ROTATION[index % DUMMY_IMAGE_URLS_ROTATION.length] ??
        null
      );
    }
    return null;
  }
  if (item.thumbnail) return item.thumbnail;
  if (DUMMY_IMAGE_URLS_ROTATION.length === 0) return null;
  return (
    DUMMY_IMAGE_URLS_ROTATION[index % DUMMY_IMAGE_URLS_ROTATION.length] ?? null
  );
}

/** 最新アクティビティのカード1枚分（タグ・サムネ・タイトル・日付） */
type ActivityCardView = {
  key: string;
  /** 右上バッジ（プラットフォーム名） */
  tag: string;
  thumbnailUrl: string | null;
  title: string;
  publishedAt: number;
  /** 言語に応じた相対日付（表示用） */
  dateLabel: string;
  url: string;
};

function buildActivityCards(
  items: ActivityItem[],
  lang: keyof typeof dateLocales
): ActivityCardView[] {
  const sorted = [...items].sort((a, b) => b.publishedAt - a.publishedAt);
  return sorted.map((item, index) => ({
    key: `${item.platform}-${item.id}`,
    tag: item.tagLabel ?? item.platform.toUpperCase(),
    thumbnailUrl: resolveActivityThumbnail(item, index),
    title: item.title,
    publishedAt: item.publishedAt,
    dateLabel: formatRelativeTime(item.publishedAt, lang),
    url: item.url,
  }));
}

export default function TopPage() {
  const { t, language } = useLanguage();
  const isLive = false;
  /** Twitch は `parent` が必須のため、マウント後に hostname を確実に含めて組み立てる */
  const [twitchEmbed, setTwitchEmbed] = useState<
    { status: 'pending' } | { status: 'ready'; src: string } | { status: 'missing' }
  >({ status: 'pending' });

  useEffect(() => {
    const parents = [
      window.location.hostname,
      ...extraTwitchEmbedParentsFromEnv(),
    ];
    const src = buildTwitchPlayerEmbedSrc(parents);
    setTwitchEmbed(src ? { status: 'ready', src } : { status: 'missing' });
  }, []);

  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [youtubeApiError, setYoutubeApiError] = useState<string | undefined>();
  const [twitchApiError, setTwitchApiError] = useState<string | undefined>();

  useEffect(() => {
    const ac = new AbortController();
    setFeedLoading(true);
    setYoutubeApiError(undefined);
    setTwitchApiError(undefined);
    fetchLatestActivity(ac.signal)
      .then(({ items, youtubeError, twitchError }) => {
        setActivityItems(items);
        setYoutubeApiError(youtubeError);
        setTwitchApiError(twitchError);
      })
      .finally(() => {
        if (!ac.signal.aborted) setFeedLoading(false);
      });
    return () => ac.abort();
  }, []);

  const displayedActivityItems = useMemo((): ActivityItem[] => {
    if (feedLoading) return [];
    if (activityItems.length > 0) return activityItems;
    if (!useDummyActivityThumbs) return [];
    if (DUMMY_ACTIVITY_CARD_CONFIGS.length > 0) {
      return DUMMY_ACTIVITY_CARD_CONFIGS.map((c, i) => ({
        id: `dummy-${i}`,
        platform: c.platform,
        tagLabel: c.tag ?? c.platform.toUpperCase(),
        title: c.title,
        publishedAt: c.publishedAt,
        thumbnail: c.thumbnailFile
          ? getDummyImageUrlByFileName(c.thumbnailFile)
          : null,
        url: c.url,
      }));
    }
    if (DUMMY_IMAGE_URLS_ROTATION.length > 0) {
      const n = DUMMY_IMAGE_URLS_ROTATION.length;
      return Array.from({ length: n }, (_, i) => ({
        id: `dummy-${i}`,
        platform: i % 2 === 0 ? ('youtube' as const) : ('twitch' as const),
        title: t.activityFeed.dummyCardTitle,
        publishedAt: Date.now() - i * 86_400_000,
        thumbnail: null,
        url: i % 2 === 0 ? socialProfileUrls.youtube : socialProfileUrls.twitch,
      }));
    }
    return [];
  }, [feedLoading, activityItems, t.activityFeed.dummyCardTitle]);

  const showDummyFeedNotice =
    useDummyActivityThumbs &&
    !feedLoading &&
    activityItems.length === 0 &&
    displayedActivityItems.length > 0;

  /** タグ・サムネ・タイトル・日付をまとめた表示用配列（publishedAt 降順＝最新が先頭） */
  const activityCards = useMemo(
    () => buildActivityCards(displayedActivityItems, language),
    [displayedActivityItems, language]
  );

  return (
    <div className="w-full">
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="aspect-video w-full min-h-[200px] rounded-lg overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20 bg-black/50 backdrop-blur-sm">
            {twitchEmbed.status === 'pending' && (
              <div
                className="flex h-full min-h-[12rem] items-center justify-center bg-black/40 text-muted-foreground text-sm"
                aria-hidden
              >
                …
              </div>
            )}
            {twitchEmbed.status === 'ready' && (
              <iframe
                src={twitchEmbed.src}
                className="block w-full h-full border-0"
                title="Twitch live embed"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
            {twitchEmbed.status === 'missing' && (
              <div className="flex h-full min-h-[12rem] items-center justify-center px-4 text-center text-muted-foreground text-sm">
                <a
                  href={socialProfileUrls.twitch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:opacity-90"
                >
                  Twitch
                </a>
                <span className="mx-1">（</span>
                <span>VITE_TWITCH 未設定のため埋め込みなし</span>
                <span className="mx-1">）</span>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-md border border-primary/30">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-destructive animate-pulse' : 'bg-muted'}`} />
              <span className="tracking-wider">{isLive ? t.hero.live : t.hero.offline}</span>
            </div>
            {/* <h1 className="mt-4 tracking-wider glow-text">{t.hero.streamerName}</h1> */}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <h2 className="tracking-widest">{t.activityFeed.title}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
        </div>

        {feedLoading ? (
          <p className="text-center text-muted-foreground py-12 tracking-wide">
            {t.activityFeed.loading}
          </p>
        ) : activityCards.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 max-w-lg mx-auto leading-relaxed space-y-3">
            <p className="tracking-wide">{t.activityFeed.empty}</p>
            {youtubeApiError && (
              <p className="text-sm text-destructive/90 break-words font-mono">
                {youtubeApiError}
              </p>
            )}
            {twitchApiError && (
              <p className="text-sm text-destructive/90 break-words font-mono">
                {twitchApiError}
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* {showDummyFeedNotice && (
              <p className="text-center text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {t.activityFeed.dummyFeedNotice}
                {youtubeApiError && (
                  <span className="block mt-3 text-destructive/90 break-words font-mono text-xs">
                    {youtubeApiError}
                  </span>
                )}
              </p>
            )} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activityCards.map((card) => (
                <a
                  key={card.key}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-card/60 backdrop-blur-md rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer block"
                >
                  <div className="aspect-video bg-muted/30 relative overflow-hidden">
                    {card.thumbnailUrl ? (
                      <img
                        src={card.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-xs tracking-wider">
                      {card.tag}
                    </div>
                    {card.thumbnailUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Play className="w-12 h-12 text-primary drop-shadow-lg" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 mb-2">{card.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatLocalizedDateTime(card.publishedAt, language)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            {(youtubeApiError || twitchApiError) && (
              <div className="mt-6 text-center space-y-2">
                {youtubeApiError && (
                  <p className="text-xs text-destructive/90 break-words font-mono">
                    {youtubeApiError}
                  </p>
                )}
                {twitchApiError && (
                  <p className="text-xs text-destructive/90 break-words font-mono">
                    {twitchApiError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
