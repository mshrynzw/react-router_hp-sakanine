const twitch = import.meta.env.VITE_TWITCH ?? '';
const youtubeChannelId = import.meta.env.VITE_YOUTUBE ?? '';
const xHandle = import.meta.env.VITE_X ?? '';
const doneruName = import.meta.env.VITE_DONERU ?? '';

/** アクティビティ取得・外部リンク用（.env の VITE_* と対応） */
export const socialIds = {
  twitchLogin: twitch,
  youtubeChannelId,
  xHandle,
  doneruName,
} as const;

export const socialProfileUrls = {
  twitch: twitch ? `https://www.twitch.tv/${twitch}` : '#',
  youtube: youtubeChannelId
    ? `https://www.youtube.com/channel/${youtubeChannelId}`
    : '#',
  x: xHandle ? `https://x.com/${xHandle}` : '#',
  doneru: doneruName ? `https://doneru.jp/${doneruName}` : 'https://doneru.jp/',
} as const;

export function getTwitchPlayerSrc(): string {
  const parent =
    typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const params = new URLSearchParams({
    channel: twitch,
    parent,
    muted: 'false',
  });
  return `https://player.twitch.tv/?${params.toString()}`;
}
