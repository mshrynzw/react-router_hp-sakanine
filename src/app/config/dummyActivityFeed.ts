import type { ActivityPlatform } from '../lib/activityFeed';
import { socialProfileUrls } from './socialUrls';

/**
 * ダミーサムネ表示のオン／オフ。
 * Cloudflare の Preview などで `VITE_*` がビルドに乗らないことがあるため、**未設定のときはオン（true）** とする。
 * オフにしたい場合は `VITE_USE_DUMMY_ACTIVITY_THUMBS=false` または `0` を明示。
 */
export function isDummyActivityThumbsEnabled(): boolean {
  const raw = import.meta.env.VITE_USE_DUMMY_ACTIVITY_THUMBS;
  if (raw === undefined || raw === '') return true;
  const v = String(raw).trim().toLowerCase();
  if (v === 'false' || v === '0' || v === 'no') return false;
  return v === 'true' || v === '1' || v === 'yes';
}

/**
 * API からアクティビティが取得できず、かつ `VITE_USE_DUMMY_ACTIVITY_THUMBS=true` のときに
 * 最新アクティビティ欄へ出すカード内容（1要素＝1カード）。
 *
 * タグ・タイトル・日付（publishedAt）・リンクをカードごとに編集してください。
 * サムネは `thumbnailFile` で `assets/images/dummy/` 内のファイル名を指定。
 * 省略時は同フォルダ内の画像がカード順でローテーション割当。
 */
export type DummyActivityCardConfig = {
  platform: ActivityPlatform;
  /**
   * 右上バッジ。省略時は `platform` から `YOUTUBE` / `TWITCH` を自動表示。
   */
  tag?: string;
  title: string;
  /** 相対表示「○日前」等の基準になる日時（Unix ミリ秒） */
  publishedAt: number;
  url: string;
  /**
   * `src/app/assets/images/dummy/` 直下のファイル名（例: `activity_x_1.jpg`）。
   * ビルドに含まれる必要があります。省略時はダミー画像を順に使用。
   */
  thumbnailFile?: string;
};

export const DUMMY_ACTIVITY_CARD_CONFIGS: DummyActivityCardConfig[] = [
  {
    platform: 'twitch',
    tag: 'Twitch',
    title: '【パワプロ2012】サクセス継承選手二人目作成厳選',
    publishedAt: new Date('2026-04-18T20:00:00+09:00').getTime(),
    url: socialProfileUrls.youtube,
    thumbnailFile: 'activity_twitch_1.webp',
  },
  {
    platform: 'x',
    tag: 'X',
    title: 'おはようございます！本日配信お休みします！よろしくどうぞ。',
    publishedAt: new Date('2026-04-18T19:59:00+09:00').getTime(),
    url: socialProfileUrls.twitch,
    thumbnailFile: 'activity_x_1.webp',
  },
  {
    platform: 'twitch',
    title: '【パワプロ2012】サクセス継承選手二人目作成厳選（見ながら）',
    publishedAt: new Date('2026-04-17T10:00:00+09:00').getTime(),
    url: socialProfileUrls.youtube,
    thumbnailFile: 'activity_twitch_2.webp',
  },
  {
    platform: 'twitch',
    tag: 'Twitch',
    title: '【パワプロ2012】サクセス継承選手二人目作成厳選（パリーグの試合見ながら）',
    publishedAt: new Date('2026-04-15T22:00:00+09:00').getTime(),
    url: socialProfileUrls.twitch,
    thumbnailFile: 'activity_twitch_3.webp',
  },
];
