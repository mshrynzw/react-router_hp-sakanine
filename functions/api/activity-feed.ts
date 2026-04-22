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
  twitchError?: string;
  xError?: string;
};

type Env = {
  VITE_TWITCH?: string;
  TWITCH_LOGIN?: string;
  TWITCH_CLIENT_ID?: string;
  TWITCH_ACCESS_TOKEN?: string;
  X_BEARER_TOKEN?: string;
  X_USER_ID?: string;
  ACTIVITY_FEED_CACHE_TTL_SECONDS?: string;
  ACTIVITY_FEED_FETCH_INTERVAL_SECONDS?: string;
  ACTIVITY_FEED_MAX_PER_SOURCE?: string;
  ACTIVITY_FEED_MAX_MERGED?: string;
  ACTIVITY_FEED_X_MAX_RESULTS?: string;
};

const DEFAULT_MAX_PER_SOURCE = 6;
const DEFAULT_MAX_MERGED = 9;
const DEFAULT_CACHE_TTL_SECONDS = 120;

function resolveCacheTtlSeconds(env: Env): number {
  const raw = (
    env.ACTIVITY_FEED_FETCH_INTERVAL_SECONDS ??
    env.ACTIVITY_FEED_CACHE_TTL_SECONDS ??
    ''
  ).trim();
  if (!raw) return DEFAULT_CACHE_TTL_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_CACHE_TTL_SECONDS;
  return parsed;
}

function resolveMaxPerSource(env: Env): number {
  const raw = (env.ACTIVITY_FEED_MAX_PER_SOURCE ?? '').trim();
  if (!raw) return DEFAULT_MAX_PER_SOURCE;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_PER_SOURCE;
  return parsed;
}

function resolveMaxMerged(env: Env): number {
  const raw = (env.ACTIVITY_FEED_MAX_MERGED ?? '').trim();
  if (!raw) return DEFAULT_MAX_MERGED;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_MERGED;
  return parsed;
}

function resolveXMaxResults(env: Env): number {
  const raw = (env.ACTIVITY_FEED_X_MAX_RESULTS ?? '').trim();
  if (!raw) return 10;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
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

function parseTwitchApiError(status: number, body: unknown): string {
  const o = body as { message?: string; error?: string };
  if (o?.message) return `Twitch API ${status}: ${o.message}`;
  if (o?.error) return `Twitch API ${status}: ${o.error}`;
  return `Twitch API ${status}: Unknown error`;
}

function parseXApiError(status: number, body: unknown): string {
  const o = body as {
    title?: string;
    detail?: string;
    errors?: Array<{ message?: string }>;
  };
  const message = o.detail ?? o.errors?.[0]?.message ?? o.title;
  if (message) return `X API ${status}: ${message}`;
  return `X API ${status}: Unknown error`;
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
  accessToken: string,
  maxPerSource: number
): Promise<{ items: ActivityItem[]; error?: string }> {
  const { userId, error: userIdError } = await fetchTwitchUserId(
    login,
    clientId,
    accessToken
  );
  if (!userId) return { items: [], ...(userIdError ? { error: userIdError } : {}) };

  const res = await fetch(
    `https://api.twitch.tv/helix/videos?user_id=${encodeURIComponent(userId)}&first=${maxPerSource}&type=archive`,
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

async function fetchXLatest(
  xUserId: string,
  bearerToken: string,
  maxResults: number
): Promise<{ items: ActivityItem[]; error?: string }> {
  if (!xUserId.trim()) {
    return { items: [], error: 'X user is not configured. Set X_USER_ID.' };
  }

  const url = new URL(`https://api.x.com/2/users/${encodeURIComponent(xUserId)}/tweets`);
  url.searchParams.set('max_results', String(maxResults));
  url.searchParams.set(
    'tweet.fields',
    'created_at,attachments,entities'
  );
  url.searchParams.set(
    'expansions',
    'attachments.media_keys'
  );
  url.searchParams.set(
    'media.fields',
    'type,url,preview_image_url'
  );
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  const body = (await res.json()) as {
    data?: Array<{
      id?: string;
      text?: string;
      created_at?: string;
      entities?: { urls?: Array<{ expanded_url?: string }> };
      attachments?: { media_keys?: string[] };
    }>;
    includes?: {
      media?: Array<{
        media_key?: string;
        type?: string;
        url?: string;
        preview_image_url?: string;
      }>;
    };
    title?: string;
    detail?: string;
    errors?: Array<{ message?: string }>;
  };
  if (!res.ok) return { items: [], error: parseXApiError(res.status, body) };

  const mediaMap = new Map<string, string>();
  for (const media of body.includes?.media ?? []) {
    if (!media.media_key) continue;
    const thumb = media.preview_image_url ?? media.url;
    if (!thumb) continue;
    mediaMap.set(media.media_key, thumb);
  }

  const items: ActivityItem[] = [];
  for (const tweet of body.data ?? []) {
    if (!tweet.id || !tweet.text || !tweet.created_at) continue;
    const title = tweet.text.replace(/\s+/g, ' ').trim();
    const firstUrl = tweet.entities?.urls?.[0]?.expanded_url;
    const url = firstUrl ?? `https://x.com/i/web/status/${tweet.id}`;
    const mediaKey = tweet.attachments?.media_keys?.[0];
    items.push({
      id: tweet.id,
      platform: 'x',
      title,
      publishedAt: new Date(tweet.created_at).getTime(),
      thumbnail: mediaKey ? mediaMap.get(mediaKey) ?? null : null,
      url,
    });
  }

  return { items };
}

async function buildActivityFeed(env: Env): Promise<ActivityFetchResult> {
  const twitchLogin = (env.TWITCH_LOGIN ?? env.VITE_TWITCH ?? '').trim();
  const twitchClientId = (env.TWITCH_CLIENT_ID ?? '').trim();
  const twitchToken = normalizeToken(env.TWITCH_ACCESS_TOKEN ?? '');
  const xUserId = (env.X_USER_ID ?? '').trim();
  const xBearerToken = normalizeToken(env.X_BEARER_TOKEN ?? '');

  const maxPerSource = resolveMaxPerSource(env);
  const maxMerged = resolveMaxMerged(env);
  const xMaxResults = resolveXMaxResults(env);

  const tasks: Array<Promise<{ source: 'twitch' | 'x'; items: ActivityItem[]; error?: string }>> = [];

  if (twitchLogin && twitchClientId && twitchToken) {
    tasks.push(
      fetchTwitchLatest(twitchLogin, twitchClientId, twitchToken, maxPerSource)
        .then((res) => ({ source: 'twitch' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'twitch' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'Twitch fetch failed.',
        }))
    );
  }
  if (xBearerToken && xUserId) {
    tasks.push(
      fetchXLatest(xUserId, xBearerToken, xMaxResults)
        .then((res) => ({ source: 'x' as const, ...res }))
        .catch((e: unknown) => ({
          source: 'x' as const,
          items: [] as ActivityItem[],
          error: e instanceof Error ? e.message : 'X fetch failed.',
        }))
    );
  }

  if (tasks.length === 0) return { items: [] };

  const chunks = await Promise.all(tasks);
  const allItems: ActivityItem[] = [];
  let twitchError: string | undefined;
  let xError: string | undefined;

  for (const chunk of chunks) {
    allItems.push(...chunk.items);
    if (chunk.source === 'twitch' && chunk.error) twitchError = chunk.error;
    if (chunk.source === 'x' && chunk.error) xError = chunk.error;
  }

  allItems.sort((a, b) => b.publishedAt - a.publishedAt);
  const items = allItems.slice(0, maxMerged);
  return {
    items,
    ...(twitchError && items.length === 0 ? { twitchError } : {}),
    ...(xError && items.length === 0 ? { xError } : {}),
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
