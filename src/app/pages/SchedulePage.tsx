import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { type ActivityItem, fetchLatestActivity } from '../lib/activityFeed';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;
const JST_OFFSET_HOURS = 9;
const TIMELINE_STEP_HOURS = 2;
const TIMELINE_PIVOT_HOUR = 12;
const timelineLocaleByLang = {
  ja: 'ja-JP',
  en: 'en-US',
  zh: 'zh-CN',
  ko: 'ko-KR',
} as const;
const offsetFromJstByLang = {
  ja: 0,
  en: -7,
  zh: -1,
  ko: 0,
} as const;
const fallbackIconImage = new URL('../assets/images/icon.webp', import.meta.url).href;

type PastVideo = ActivityItem & { startHour: number; durationSeconds?: number };
type TimelineConfig = {
  startHour: number;
  endHour: number;
  columns: number[];
  totalHours: number;
};

function buildDayKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function normalizeHourForTimeline(hour: number): number {
  return hour < TIMELINE_PIVOT_HOUR ? hour + 24 : hour;
}

function getLanguageShiftMs(language: keyof typeof timelineLocaleByLang): number {
  return offsetFromJstByLang[language] * 60 * 60 * 1000;
}

function formatHourLabel(baseHour: number, language: keyof typeof timelineLocaleByLang): string {
  const shiftedHour = (baseHour + offsetFromJstByLang[language] + 24) % 24;
  return `${shiftedHour}:00`;
}

function getTimezoneText(language: keyof typeof timelineLocaleByLang): string {
  const gmtOffset = JST_OFFSET_HOURS + offsetFromJstByLang[language];
  if (gmtOffset === 0) return 'GMT+0';
  return gmtOffset > 0 ? `GMT+${gmtOffset}` : `GMT${gmtOffset}`;
}

function formatTimelineRowLabel(timestamp: number, language: keyof typeof timelineLocaleByLang) {
  const locale = timelineLocaleByLang[language];
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(timestamp);
  const md = new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' }).format(timestamp);
  return { weekday, monthDay: md };
}

function floorToStep(hour: number): number {
  return Math.floor(hour / TIMELINE_STEP_HOURS) * TIMELINE_STEP_HOURS;
}

function ceilToStep(hour: number): number {
  return Math.ceil(hour / TIMELINE_STEP_HOURS) * TIMELINE_STEP_HOURS;
}

function buildTimelineConfig(groups: Array<{ videos: PastVideo[] }>): TimelineConfig {
  const flattened = groups.flatMap((group) => group.videos);
  if (flattened.length === 0) {
    const defaultColumns = [14, 16, 18, 20, 22, 24, 26, 28];
    return {
      startHour: 14,
      endHour: 28,
      columns: defaultColumns,
      totalHours: 14,
    };
  }

  let minStart = Number.POSITIVE_INFINITY;
  let maxEnd = Number.NEGATIVE_INFINITY;
  for (const video of flattened) {
    const start = video.startHour;
    const durationHours = Math.min(
      Math.max((video.durationSeconds ?? 2 * 60 * 60) / 3600, 0.5),
      12
    );
    minStart = Math.min(minStart, start);
    maxEnd = Math.max(maxEnd, start + durationHours);
  }

  const startHour = floorToStep(minStart);
  const endHour = Math.max(startHour + TIMELINE_STEP_HOURS, ceilToStep(maxEnd));
  const columns = Array.from(
    { length: Math.floor((endHour - startHour) / TIMELINE_STEP_HOURS) + 1 },
    (_, index) => startHour + index * TIMELINE_STEP_HOURS
  );
  return {
    startHour,
    endHour,
    columns,
    totalHours: endHour - startHour,
  };
}

function calcTimelineLeftPercent(startHour: number, timeline: TimelineConfig): number {
  return ((startHour - timeline.startHour) / timeline.totalHours) * 100;
}

function calcTimelineWidthPercent(
  durationSeconds: number | undefined,
  timeline: TimelineConfig
): number {
  const safeDurationSeconds = Math.min(
    Math.max(durationSeconds ?? 2 * 60 * 60, 30 * 60),
    12 * 60 * 60
  );
  return (safeDurationSeconds / (timeline.totalHours * 3600)) * 100;
}

function ActivityThumbnail({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [useFallback, setUseFallback] = useState(false);
  return (
    <img
      src={useFallback ? fallbackIconImage : src}
      alt={alt}
      onError={() => setUseFallback(true)}
      className={useFallback ? 'h-full w-full object-contain p-2 bg-black/40' : className}
    />
  );
}

export default function SchedulePage() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | undefined>();

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setFeedError(undefined);

    fetchLatestActivity(ac.signal)
      .then(({ items: latestItems, youtubeError, twitchError }) => {
        setItems(latestItems);
        if (youtubeError || twitchError) {
          setFeedError([youtubeError, twitchError].filter(Boolean).join(' / '));
        }
      })
      .catch((error: unknown) => {
        setItems([]);
        setFeedError(error instanceof Error ? error.message : 'Failed to fetch activity feed.');
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, []);

  const groupedByDay = useMemo(() => {
    const now = Date.now();
    const from = now - ONE_WEEK_MS;
    const byDay = new Map<string, PastVideo[]>();
    const shiftMs = getLanguageShiftMs(language);

    for (const item of items) {
      if (item.publishedAt < from || item.publishedAt > now) continue;
      if (item.platform === 'x') continue;
      if (!item.url.includes('youtube.com') && !item.url.includes('twitch.tv')) continue;
      const shiftedAt = item.publishedAt + shiftMs;
      const d = new Date(shiftedAt);
      const startHour = normalizeHourForTimeline(d.getHours()) + d.getMinutes() / 60;
      const key = buildDayKey(shiftedAt);
      const list = byDay.get(key) ?? [];
      list.push({ ...item, publishedAt: shiftedAt, startHour });
      byDay.set(key, list);
    }

    const sortedDays = Array.from(byDay.entries())
      .map(([key, videos]) => ({
        key,
        date: videos[0]?.publishedAt ?? 0,
        videos: videos.sort((a, b) => b.publishedAt - a.publishedAt),
      }))
      .sort((a, b) => b.date - a.date);

    return sortedDays;
  }, [items, language]);

  const timeline = useMemo(() => buildTimelineConfig(groupedByDay), [groupedByDay]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          {t.schedule.title}
        </h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <div className="bg-[#060b1c]/80 backdrop-blur-md rounded-lg border border-primary/30 p-6 md:p-8 shadow-xl shadow-primary/10">
        <h2 className="mb-8 text-center tracking-wider text-2xl font-semibold">
          過去の配信
        </h2>

        <div className="rounded-xl border border-primary/20 bg-[#050916]/80 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1020px]">
              <div className="grid grid-cols-[80px_1fr] border-b border-primary/20 bg-white/5">
                <div className="sticky left-0 z-20 px-3 py-3 text-sm font-semibold text-muted-foreground bg-[#0a1124] border-r border-primary/15">
                  {getTimezoneText(language)}
                </div>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(${timeline.columns.length}, minmax(0, 1fr))` }}
                >
                  {timeline.columns.map((hour) => (
                    <div
                      key={hour}
                      className="px-1 py-3 text-center text-sm font-semibold text-muted-foreground"
                    >
                      {formatHourLabel(hour % 24, language)}
                    </div>
                  ))}
                </div>
              </div>

              {loading ? (
                <p className="py-14 text-center text-muted-foreground">{t.activityFeed.loading}</p>
              ) : groupedByDay.length === 0 ? (
                <p className="py-14 text-center text-muted-foreground">{t.schedule.noSchedule}</p>
              ) : (
                <div>
                  {groupedByDay.map((group) => {
                    const rowLabel = formatTimelineRowLabel(group.date, language);
                    return (
                      <div
                        key={group.key}
                        className="grid grid-cols-[80px_1fr] border-b border-primary/15 last:border-b-0 min-h-[110px]"
                      >
                        <div className="sticky left-0 z-10 px-3 py-4 text-center border-r border-primary/10 bg-[#08122a]">
                          <p className="text-sm font-semibold">{rowLabel.weekday}</p>
                          <p className="text-sm text-muted-foreground">{rowLabel.monthDay}</p>
                        </div>
                        <div className="relative px-3 py-3">
                          <div
                            className="absolute inset-y-0 left-3 right-3 grid pointer-events-none"
                            style={{
                              gridTemplateColumns: `repeat(${timeline.columns.length}, minmax(0, 1fr))`,
                            }}
                          >
                            {timeline.columns.map((hour) => (
                              <div key={hour} className="border-l border-primary/10 first:border-l-0" />
                            ))}
                          </div>

                          <div className="relative space-y-2">
                            {group.videos.map((video) => {
                              const leftPercent = calcTimelineLeftPercent(video.startHour, timeline);
                              const widthPercent = calcTimelineWidthPercent(video.durationSeconds, timeline);
                              const clampedLeft = Math.min(Math.max(leftPercent, 0), 96);
                              const clampedWidth = Math.min(Math.max(widthPercent, 8), 75);
                              const locale = timelineLocaleByLang[language];
                              const timeLabel = new Intl.DateTimeFormat(locale, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              }).format(video.publishedAt);
                              return (
                                <a
                                  key={`${video.platform}-${video.id}`}
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative block rounded-lg border border-primary/25 bg-[#090f25] hover:border-primary/50 transition-colors"
                                  style={{
                                    marginLeft: `${clampedLeft}%`,
                                    width: `${clampedWidth}%`,
                                    minWidth: '220px',
                                    maxWidth: '520px',
                                  }}
                                >
                                  <div className="flex items-stretch min-h-[72px]">
                                    <div className="flex-1 p-3">
                                      <p className="text-xs text-primary/80 mb-1 flex items-center gap-1.5">
                                        <Clock3 className="w-3.5 h-3.5" />
                                        {timeLabel}
                                      </p>
                                      <p className="text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors w-1/2">
                                        {video.title}
                                      </p>
                                    </div>
                                    {video.thumbnail && (
                                      <div className="w-24 shrink-0 border-l border-primary/20">
                                        <ActivityThumbnail
                                          src={video.thumbnail}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center min-h-6">
          {feedError ? (
            <p className="text-xs text-destructive/90 break-words font-mono">{feedError}</p>
          ) : (
            <span className="text-xs text-muted-foreground">last 7 days / video archive</span>
          )}
        </div>
      </div>
    </div>
  );
}
