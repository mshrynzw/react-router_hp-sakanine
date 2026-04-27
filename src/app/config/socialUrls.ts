/**
 * Cloudflare の Preview ビルドなどで `VITE_TWITCH` が渡らないことがある。
 * そのとき埋め込み・リンクが空にならないよう、サイト既定のチャンネル名をフォールバックする。
 * （別チャンネルにしたい場合は Cloudflare の Production と Preview の両方に `VITE_TWITCH` を設定する）
 */
const FALLBACK_TWITCH_LOGIN = 'sakanine';

const twitch =
  (import.meta.env.VITE_TWITCH && String(import.meta.env.VITE_TWITCH).trim()) ||
  FALLBACK_TWITCH_LOGIN;
const youtubeChannelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID ?? '';
const xHandle = (import.meta.env.VITE_X ?? '').trim().replace(/^@+/, '');
const doneruName = import.meta.env.VITE_DONERU ?? '';

/** 本番ドメイン等を追加で `parent` に渡す（カンマ区切り。カスタムドメインを Pages に割り当てたとき用） */
export function extraTwitchEmbedParentsFromEnv(): string[] {
  const raw = import.meta.env.VITE_TWITCH_EMBED_EXTRA_PARENTS ?? '';
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** アクティビティ取得・外部リンク用（.env の VITE_* と対応） */
export const socialIds = {
  twitchLogin: twitch,
  youtubeChannelId,
  xHandle,
  doneruName,
} as const;

export const socialProfileUrls = {
  twitch: twitch ? `https://www.twitch.tv/${twitch}` : 'https://www.twitch.tv',
  youtube: youtubeChannelId ? `https://www.youtube.com/channel/${youtubeChannelId}` : 'https://www.youtube.com',
  x: xHandle ? `https://x.com/${xHandle}` : 'https://x.com',
  doneru: doneruName ? `https://doneru.jp/${doneruName}` : 'https://doneru.jp/',
} as const;

/**
 * Twitch Interactive Embed 用の `player.twitch.tv` URL。
 * - `parent` はホストごとに必須（複数指定可）。`hostname` と本番用ドメインを渡すこと。
 * - `muted=true` は自動再生まわりの要件（visibility / ブラウザ方針）で外しにくいためデフォルトにする。
 * @see https://dev.twitch.tv/docs/embed/video-and-clips/
 */
export function buildTwitchPlayerEmbedSrc(parentHostnames: string[]): string | null {
  const channel = twitch.trim();
  if (!channel) return null;

  const parents = [...new Set(parentHostnames.map((h) => h.trim()).filter(Boolean))];
  if (parents.length === 0) return null;

  const params = new URLSearchParams();
  params.set('channel', channel);
  params.set('muted', 'true');
  for (const p of parents) {
    params.append('parent', p);
  }
  return `https://player.twitch.tv/?${params.toString()}`;
}
