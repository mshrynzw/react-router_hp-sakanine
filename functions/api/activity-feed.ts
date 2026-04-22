type ActivityPlatform = 'youtube' | 'twitch' | 'x';

type ActivityItem = {
  id: string;
  platform: ActivityPlatform;
  tagLabel?: string;
  title: string;
  publishedAt: number;
  thumbnail: string | null;
  url: string;
};

type ActivityFetchResult = {
  items: ActivityItem[];
  youtubeError?: string;
  twitchError?: string;
};

type Env = {
  VITE_YOUTUBE?: string;
  YOUTUBE_API_KEY?: string;
  VITE_TWITCH?: string;
  TWITCH_LOGIN?: string;
  TWITCH_CLIENT_ID?: string;
  TWITCH_ACCESS_TOKEN?: string;
  ACTIVITY_FEED_CACHE_TTL_SECONDS?: string;
};

const MAX_PER_SOURCE = 6;
const MAX_MERGED = 9;
const DEFAULT_CACHE_TTL_SECONDS = 120;

function resolveCacheTtlSeconds(env: Env): number {
  const raw = (env.ACTIVITY_FEED_CACHE_TTL_SECONDS ?? '').trim();
  if (!raw) return DEFAULT_CACHE_TTL_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_CACHE_TTL_SECONDS;
  return parsed;
}

function jsonResponse(data: ActivityFetchResult, cacheControl: string): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  });
}

function normalizeToken(raw: string): string {
  return raw.replace(/^Bearer\s+/i, '').trim();
}

function twitchThumbUrl(raw: string | undefined): string | null {
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

function parseTwitchApiError(status: number, body: unknown): string {
  const o = body as { message?: string; error?: string };
  if (o?.message) return `Twitch API ${status}: ${o.message}`;
  if (o?.error) return `Twitch API ${status}: ${o.error}`;
  return `Twitch API ${status}: Unknown error`;
}

async function fetchYouTubeLatest(
  channelId: string,
  apiKey: string
): Promise<{ items: ActivityItem[]; error?: string }> {
  const maxResults = MAX_PER_SOURCE;
  const chUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  chUrl.searchParams.set('part', 'contentDetails');
  chUrl.searchParams.set('id', channelId);
  chUrl.searchParams.set('key', apiKey);

  const chRes = await fetch(chUrl.toString());
  const chJson = await chRes.json();
  if (!chRes.ok) return { items: [], error: parseGoogleApiError(chJson) };

  const uploadsId = (
    chJson as {
      items?: Array<{
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }>;
    }
  ).items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsId) {
    return { items: [], error: 'YouTube uploads playlist not found.' };
  }

  const plUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  plUrl.searchParams.set('part', 'snippet');
  plUrl.searchParams.set('playlistId', uploadsId);
  plUrl.searchParams.set('maxResults', String(maxResults));
  plUrl.searchParams.set('key', apiKey);
  const plRes = await fetch(plUrl.toString());
  const plJson = await plRes.json();
  if (!plRes.ok) return { items: [], error: parseGoogleApiError(plJson) };

  const rows = (
    plJson as {
      items?: Array<{
        snippet?: {
          title?: string;
          publishedAt?: string;
          thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
          resourceId?: { videoId?: string };
        };
      }>;
    }
  ).items;

  const items: ActivityItem[] = [];
  for (const row of rows ?? []) {
    const sn = row.snippet;
    const videoId = sn?.resourceId?.videoId;
    if (!videoId || !sn?.title || !sn?.publishedAt) continue;
    const thumb = sn.thumbnails?.medium?.url ?? sn.thumbnails?.default?.url ?? null;
    items.push({
      id: videoId,
      platform: 'youtube',
      title: sn.title,
      publishedAt: new Date(sn.publishedAt).getTime(),
      thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }
  return { items };
}

async function fetchTwitchUserId(
  login: string,
  clientId: string,
  accessToken: string
): Promise<{ userId: string | null; error?: string }> {
  const res = await fetch(
    `https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`,
    {
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const body = (await res.json()) as { data?: Array<{ id?: string }> };
  if (!res.ok) return { userId: null, error: parseTwitchApiError(res.status, body) };
  return { userId: body.data?.[0]?.id ?? null };
}

async function fetchTwitchLatest(
  login: string,
  clientId: string,
  accessToken: string
): Promise<{ items: ActivityItem[]; error?: string }> {
  const { userId, error: userIdError } = await fetchTwitchUserId(
    login,
    clientId,
    accessToken
  );
  if (!userId) return { items: [], ...(userIdError ? { error: userIdError } : {}) };

  const res = await fetch(
    `https://api.twitch.tv/helix/videos?user_id=${encodeURIComponent(userId)}&first=${MAX_PER_SOURCE}&type=archive`,
    {
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const body = (await res.json()) as {
    data?: Array<{
      id?: string;
      title?: string;
      created_at?: string;
      published_at?: string;
      thumbnail_url?: string;
      url?: string;
    }>;
  };
  if (!res.ok) return { items: [], error: parseTwitchApiError(res.status, body) };

  const items: ActivityItem[] = [];
  for (const v of body.data ?? []) {
    const published = v.published_at ?? v.created_at;
    if (!v.id || !v.title || !published || !v.url) continue;
    items.push({
      id: v.id,
      platform: 'twitch',
      title: v.title,
      publishedAt: new Date(published).getTime(),
      thumbnail: twitchThumbUrl(v.thumbnail_url),
      url: v.url,
    });
  }
  return { items };
}

async function buildActivityFeed(env: Env): Promise<ActivityFetchResult> {
  const youtubeChannelId = (env.VITE_YOUTUBE ?? '').trim();
  const youtubeApiKey = (env.YOUTUBE_API_KEY ?? '').trim();
  const twitchLogin = (env.TWITCH_LOGIN ?? env.VITE_TWITCH ?? '').trim();
  const twitchClientId = (env.TWITCH_CLIENT_ID ?? '').trim();
  const twitchToken = normalizeToken(env.TWITCH_ACCESS_TOKEN ?? '');

  const tasks: Array<Promise<{ source: 'youtube' | 'twitch'; items: ActivityItem[]; error?: string }>> = [];

  if (youtubeChannelId && youtubeApiKey) {
    tasks.push(
      fetchYouTubeLatest(youtubeChannelId, youtubeApiKey)
        .then((res) => ({ source: 'youtube' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'youtube' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'YouTube fetch failed.',
        }))
    );
  }

  if (twitchLogin && twitchClientId && twitchToken) {
    tasks.push(
      fetchTwitchLatest(twitchLogin, twitchClientId, twitchToken)
        .then((res) => ({ source: 'twitch' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'twitch' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'Twitch fetch failed.',
        }))
    );
  }

  if (tasks.length === 0) return { items: [] };

  const chunks = await Promise.all(tasks);
  const allItems: ActivityItem[] = [];
  let youtubeError: string | undefined;
  let twitchError: string | undefined;

  for (const chunk of chunks) {
    allItems.push(...chunk.items);
    if (chunk.source === 'youtube' && chunk.error) youtubeError = chunk.error;
    if (chunk.source === 'twitch' && chunk.error) twitchError = chunk.error;
  }

  allItems.sort((a, b) => b.publishedAt - a.publishedAt);
  const items = allItems.slice(0, MAX_MERGED);
  return {
    items,
    ...(youtubeError && items.length === 0 ? { youtubeError } : {}),
    ...(twitchError && items.length === 0 ? { twitchError } : {}),
  };
}

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const cacheTtlSeconds = resolveCacheTtlSeconds(context.env);
  const cacheKey = new Request(context.request.url, { method: 'GET' });
  const cache = (caches as unknown as { default: Cache }).default;

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const result = await buildActivityFeed(context.env);
  const response = jsonResponse(
    result,
    `public, max-age=0, s-maxage=${cacheTtlSeconds}, stale-while-revalidate=60`
  );
  await cache.put(cacheKey, response.clone());
  return response;
};
