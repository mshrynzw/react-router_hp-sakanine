/// <reference types="vite/client" />

declare module '*.md?raw' {
  const src: string;
  export default src;
}

/** Vite の `import x from '...?raw'`（拡張子問わず） */
declare module '*?raw' {
  const src: string;
  export default src;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
   * ダミーサムネの利用。未設定時はオン（`dummyActivityFeed.ts` の `isDummyActivityThumbsEnabled`）。
   * `false` / `0` / `no` でオフ。
   */
  readonly VITE_USE_DUMMY_ACTIVITY_THUMBS?: string;
  /**
   * アクセス元の国コードを返す API エンドポイント。
   * 期待するレスポンス例: `{ "country": "JP" }` or `{ "countryCode": "JP" }`
   */
  readonly VITE_GEO_COUNTRY_ENDPOINT?: string;
  /** 開発検証用の国コード上書き（例: `KR`）。設定時はIP判定より優先される。 */
  readonly VITE_GEO_COUNTRY_OVERRIDE?: string;
}

declare module 'perlin.js' {
  const Perlin: { perlin2: (x: number, y: number) => number };
  export default Perlin;
}
