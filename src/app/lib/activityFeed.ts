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

export interface ActivityFetchResult {
  items: ActivityItem[];
  /** YouTube を試みたが失敗したとき（403 等。UI に表示用） */
  youtubeError?: string;
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
    .filter((x): x is ActivityItem => x !== null);

  return { items };
}

async function fetchTwitchUserId(
  login: string,
  clientId: string,
  accessToken: string,
  signal: AbortSignal | undefined
): Promise<string | null> {
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
  if (!res.ok) return null;
  const data = (await res.json()) as { data?: Array<{ id?: string }> };
  return data.data?.[0]?.id ?? null;
}

async function fetchTwitchLatest(
  login: string,
  clientId: string,
  accessToken: string,
  maxResults: number,
  signal: AbortSignal | undefined
): Promise<ActivityItem[]> {
  const userId = await fetchTwitchUserId(login, clientId, accessToken, signal);
  if (!userId) return [];

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
  if (!res.ok) return [];

  const data = (await res.json()) as {
    data?: Array<{
      id?: string;
      title?: string;
      created_at?: string;
      thumbnail_url?: string;
      url?: string;
    }>;
  };

  return (data.data ?? [])
    .map((v) => {
      if (!v.id || !v.title || !v.created_at || !v.url) return null;
      return {
        id: v.id,
        platform: 'twitch' as const,
        title: v.title,
        publishedAt: new Date(v.created_at).getTime(),
        thumbnail: twitchThumbUrl(v.thumbnail_url),
        url: v.url,
      };
    })
    .filter((x): x is ActivityItem => x !== null);
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
  const twitchClientId = import.meta.env.VITE_TWITCH_CLIENT_ID ?? '';
  const twitchToken = import.meta.env.VITE_TWITCH_ACCESS_TOKEN ?? '';
  const { youtubeChannelId, twitchLogin } = socialIds;

  const tasks: Promise<ActivityItem[] | { items: ActivityItem[]; error?: string }>[] = [];

  if (youtubeChannelId && ytKey) {
    tasks.push(
      fetchYouTubeLatest(
        youtubeChannelId,
        ytKey,
        MAX_PER_SOURCE,
        signal
      ).catch((e: unknown) => ({
        items: [] as ActivityItem[],
        error:
          e instanceof Error ? e.message : 'YouTube の取得に失敗しました。',
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
      ).catch(() => [])
    );
  }

  if (tasks.length === 0) return { items: [] };

  const chunks = await Promise.all(tasks);
  let youtubeError: string | undefined;

  const flatItems: ActivityItem[] = [];
  for (const chunk of chunks) {
    if (Array.isArray(chunk)) {
      flatItems.push(...chunk);
    } else {
      flatItems.push(...chunk.items);
      if (chunk.error) youtubeError = chunk.error;
    }
  }

  flatItems.sort((a, b) => b.publishedAt - a.publishedAt);
  const items = flatItems.slice(0, MAX_MERGED);

  return {
    items,
    ...(youtubeError && items.length === 0 ? { youtubeError } : {}),
  };
}
