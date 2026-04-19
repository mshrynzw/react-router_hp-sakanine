/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWITCH: string;
  /**
   * Twitch 埋め込みの `parent` に追加するホスト（カンマ区切り）。
   * カスタムドメインを Pages に割り当てたとき、`pages.dev` に加えてここに `example.com` 等を書く。
   */
  readonly VITE_TWITCH_EMBED_EXTRA_PARENTS?: string;
  readonly VITE_YOUTUBE: string;
  readonly VITE_X: string;
  readonly VITE_DONERU: string;
  /** フッター等に表示する連絡用メールアドレス */
  readonly VITE_CONTACT_EMAIL?: string;
  /** フッター「サカナインのサーバー」のリンク先（招待 URL 推奨。`https://` で始まるときのみリンク化） */
  readonly VITE_DISCORD_LINE?: string;
  /** YouTube Data API v3（チャンネル動画取得。Google Cloud で発行しリファラー制限推奨） */
  readonly VITE_YOUTUBE_API_KEY?: string;
  /** Twitch Developer Console の Client ID（Helix API 用） */
  readonly VITE_TWITCH_CLIENT_ID?: string;
  /**
   * Twitch Helix 用 OAuth トークン（ユーザーまたはアプリトークン）。
   * Client ID とセットで指定しないと Twitch 側の取得はスキップされます。
   */
  readonly VITE_TWITCH_ACCESS_TOKEN?: string;
  /**
   * `"true"` または `"1"` のとき、アクティビティカードのサムネを常に `assets/images/dummy` の画像にする。
   * 未設定またはそれ以外のときは API のサムネを優先し、なければダミーをフォールバック。
   */
  readonly VITE_USE_DUMMY_ACTIVITY_THUMBS?: string;
}

declare module 'perlin.js' {
  const Perlin: { perlin2: (x: number, y: number) => number };
  export default Perlin;
}
