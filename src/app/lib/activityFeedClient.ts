import type { ActivityItem } from './activityFeed';

export interface ActivityFetchResult {
  items: ActivityItem[];
  youtubeError?: string;
  twitchError?: string;
}

export async function fetchLatestActivityFromApi(
  signal?: AbortSignal
): Promise<ActivityFetchResult> {
  const res = await fetch('/api/activity-feed', {
    method: 'GET',
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    return {
      items: [],
      twitchError: `Activity API ${res.status}: ${res.statusText || 'Failed'}`,
    };
  }
  const body = (await res.json()) as ActivityFetchResult;
  return {
    items: Array.isArray(body.items) ? body.items : [],
    ...(body.youtubeError ? { youtubeError: body.youtubeError } : {}),
    ...(body.twitchError ? { twitchError: body.twitchError } : {}),
  };
}
