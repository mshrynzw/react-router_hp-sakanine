import { socialIds } from '../config/socialUrls';

export type ActivityPlatform = 'youtube' | 'twitch' | 'x';

export interface ActivityItem {
  id: string;
  platform: ActivityPlatform;
  /** カード右上バッジの上書き（ダミー表示用。未指定時は platform 名を大文字化） */
  tagLabel?: string;
  title: string;
  /** 相対表示用（ミリ秒 Unix） */
  publishedAt: number;
  thumbnail: string | null;
  url: string;
}

/** API から組み立てた行（型述語用。`ActivityItem` の部分型） */
type YouTubeFeedRow = {
  id: string;
  platform: 'youtube';
  title: string;
  publishedAt: number;
  thumbnail: string | null;
  url: string;
};

type TwitchFeedRow = {
  id: string;
  platform: 'twitch';
  title: string;
  publishedAt: number;
  thumbnail: string | null;
  url: string;
};

export interface ActivityFetchResult {
  items: ActivityItem[];
  /** YouTube を試みたが失敗したとき（403 等。UI に表示用） */
  youtubeError?: string;
  /** Twitch を試みたが失敗したとき（401/403 等。UI に表示用） */
  twitchError?: string;
}

function twitchThumbUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  return raw
    .replace(/%\{width\}|\{width\}/g, '640')
    .replace(/%\{height\}|\{height\}/g, '360');
}

function parseGoogleApiError(body: unknown): string {
  const o = body as {
    error?: { message?: string; errors?: Array<{ reason?: string }> };
  };
  const msg = o.error?.message;
  const reason = o.error?.errors?.[0]?.reason;
  if (msg && reason) return `${msg} (${reason})`;
  if (msg) return msg;
  return 'Unknown error';
}

function normalizeTwitchAccessToken(raw: string): string {
  return raw.replace(/^Bearer\s+/i, '').trim();
}

function parseTwitchApiError(status: number, body: unknown): string {
  const o = body as { message?: string; error?: string };
  if (o?.message) return `Twitch API ${status}: ${o.message}`;
  if (o?.error) return `Twitch API ${status}: ${o.error}`;
  return `Twitch API ${status}: Unknown error`;
}

/**
 * channels.list → uploads プレイリスト ID 取得 → playlistItems.list
 * search.list よりクォータ消費が少なく、チャンネル最新動画取得に適している。
 */
async function fetchYouTubeLatest(
  channelId: string,
  apiKey: string,
  maxResults: number,
  signal: AbortSignal | undefined
): Promise<{ items: ActivityItem[]; error?: string }> {
  const chUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  chUrl.searchParams.set('part', 'contentDetails');
  chUrl.searchParams.set('id', channelId);
  chUrl.searchParams.set('key', apiKey);

  const chRes = await fetch(chUrl.toString(), { signal });
  const chJson = await chRes.json();

  if (!chRes.ok) {
    return {
      items: [],
      error: parseGoogleApiError(chJson),
    };
  }

  const uploadsId = (
    chJson as {
      items?: Array<{
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }>;
    }
  ).items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsId) {
    return {
      items: [],
      error: 'チャンネルが見つからないか、アップロード一覧を取得できませんでした。',
    };
  }

  const plUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  plUrl.searchParams.set('part', 'snippet');
  plUrl.searchParams.set('playlistId', uploadsId);
  plUrl.searchParams.set('maxResults', String(maxResults));
  plUrl.searchParams.set('key', apiKey);

  const plRes = await fetch(plUrl.toString(), { signal });
  const plJson = await plRes.json();

  if (!plRes.ok) {
    return {
      items: [],
      error: parseGoogleApiError(plJson),
    };
  }

  const rawItems = (
    plJson as {
      items?: Array<{
        snippet?: {
          title?: string;
          publishedAt?: string;
          thumbnails?: {
            medium?: { url?: string };
            default?: { url?: string };
          };
          resourceId?: { videoId?: string };
        };
      }>;
    }
  ).items;

  const items = (rawItems ?? [])
    .map((row) => {
      const sn = row.snippet;
      const videoId = sn?.resourceId?.videoId;
      if (!videoId || !sn?.title || !sn?.publishedAt) return null;
      const thumb =
        sn.thumbnails?.medium?.url ?? sn.thumbnails?.default?.url ?? null;
      return {
        id: videoId,
        platform: 'youtube' as const,
        title: sn.title,
        publishedAt: new Date(sn.publishedAt).getTime(),
        thumbnail: thumb,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter((x): x is YouTubeFeedRow => x !== null);

  return { items };
}

async function fetchTwitchUserId(
  login: string,
  clientId: string,
  accessToken: string,
  signal: AbortSignal | undefined
): Promise<{ userId: string | null; error?: string }> {
  const res = await fetch(
    `https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`,
    {
      signal,
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = (await res.json()) as { data?: Array<{ id?: string }> };
  if (!res.ok) {
    return { userId: null, error: parseTwitchApiError(res.status, data) };
  }
  return { userId: data.data?.[0]?.id ?? null };
}

async function fetchTwitchLatest(
  login: string,
  clientId: string,
  accessToken: string,
  maxResults: number,
  signal: AbortSignal | undefined
): Promise<{ items: ActivityItem[]; error?: string }> {
  const { userId, error: userIdError } = await fetchTwitchUserId(
    login,
    clientId,
    accessToken,
    signal
  );
  if (!userId) return { items: [], ...(userIdError ? { error: userIdError } : {}) };

  const res = await fetch(
    `https://api.twitch.tv/helix/videos?user_id=${encodeURIComponent(userId)}&first=${maxResults}&type=archive`,
    {
      signal,
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = (await res.json()) as {
    data?: Array<{
      id?: string;
      title?: string;
      created_at?: string;
      published_at?: string;
      thumbnail_url?: string;
      url?: string;
    }>;
  };
  if (!res.ok) {
    return { items: [], error: parseTwitchApiError(res.status, data) };
  }

  const items = (data.data ?? [])
    .map((v) => {
      const published = v.published_at ?? v.created_at;
      if (!v.id || !v.title || !published || !v.url) return null;
      return {
        id: v.id,
        platform: 'twitch' as const,
        title: v.title,
        publishedAt: new Date(published).getTime(),
        thumbnail: twitchThumbUrl(v.thumbnail_url),
        url: v.url,
      };
    })
    .filter((x): x is TwitchFeedRow => x !== null);
  return { items };
}

const MAX_PER_SOURCE = 6;
const MAX_MERGED = 9;

/**
 * YouTube（API キー）と Twitch（Client ID + OAuth トークン）から最新をマージして返す。
 * 認証情報が無いソースはスキップする。
 */
export async function fetchLatestActivity(
  signal?: AbortSignal
): Promise<ActivityFetchResult> {
  const ytKey = (import.meta.env.VITE_YOUTUBE_API_KEY ?? '').trim();
  const twitchClientId = (import.meta.env.VITE_TWITCH_CLIENT_ID ?? '').trim();
  const twitchToken = normalizeTwitchAccessToken(
    import.meta.env.VITE_TWITCH_ACCESS_TOKEN ?? ''
  );
  const { youtubeChannelId, twitchLogin } = socialIds;

  type FeedChunk =
    | { source: 'youtube'; items: ActivityItem[]; error?: string }
    | { source: 'twitch'; items: ActivityItem[]; error?: string };
  const tasks: Promise<FeedChunk>[] = [];

  if (youtubeChannelId && ytKey) {
    tasks.push(
      fetchYouTubeLatest(
        youtubeChannelId,
        ytKey,
        MAX_PER_SOURCE,
        signal
      )
        .then((res) => ({ source: 'youtube' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'youtube' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'YouTube の取得に失敗しました。',
        }))
    );
  }

  if (twitchLogin && twitchClientId && twitchToken) {
    tasks.push(
      fetchTwitchLatest(
        twitchLogin,
        twitchClientId,
        twitchToken,
        MAX_PER_SOURCE,
        signal
      )
        .then((res) => ({ source: 'twitch' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'twitch' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'Twitch の取得に失敗しました。',
        }))
    );
  }

  if (tasks.length === 0) return { items: [] };

  const chunks = await Promise.all(tasks);
  let youtubeError: string | undefined;
  let twitchError: string | undefined;

  const flatItems: ActivityItem[] = [];
  for (const chunk of chunks) {
    flatItems.push(...chunk.items);
    if (chunk.source === 'youtube' && chunk.error) youtubeError = chunk.error;
    if (chunk.source === 'twitch' && chunk.error) twitchError = chunk.error;
  }

  flatItems.sort((a, b) => b.publishedAt - a.publishedAt);
  const items = flatItems.slice(0, MAX_MERGED);

  return {
    items,
    ...(youtubeError && items.length === 0 ? { youtubeError } : {}),
    ...(twitchError && items.length === 0 ? { twitchError } : {}),
  };
}
