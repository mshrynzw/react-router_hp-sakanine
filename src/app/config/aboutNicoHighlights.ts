/** `images/videos` と `videos` の両方を対象（実体はどちらに置いても可） */
const bundledVideos = {
  ...import.meta.glob<string>('../assets/images/videos/*.{webm,mp4}', {
    eager: true,
    import: 'default',
  }),
  ...import.meta.glob<string>('../assets/videos/*.{webm,mp4}', {
    eager: true,
    import: 'default',
  }),
};

const urlByFileName = new Map<string, string>();
for (const [path, url] of Object.entries(bundledVideos)) {
  const name = path.split('/').pop();
  if (name) urlByFileName.set(name, url);
}

/** カード用サムネイル（`src/app/assets/images/nico-highlight-thumbs/`） */
const bundledThumbnails = import.meta.glob<string>(
  '../assets/images/nico-highlight-thumbs/*.{jpg,jpeg,png,webp,gif}',
  { eager: true, import: 'default' }
);

const thumbUrlByFileName = new Map<string, string>();
for (const [path, url] of Object.entries(bundledThumbnails)) {
  const name = path.split('/').pop();
  if (name) thumbUrlByFileName.set(name, url);
}

export type AboutNiconicoHighlight = {
  /** カード・モーダルに表示するタイトル（動画ファイル名ではなく任意の文言） */
  title: string;
  /** ニコニコ動画の視聴ページ URL */
  nicovideoUrl: string;
  /**
   * `src/app/assets/videos/` または `src/app/assets/images/videos/` 直下のファイル名（例: `sm18474594.webm`）。
   * ビルドに含まれるとその URL を優先。無い場合は `fallbackSrc`。
   */
  fileName: string;
  /**
   * assets にファイルが無いときの動画 URL（例: `public/videos/` を `/videos/...` で参照）。
   */
  fallbackSrc: string;
  /**
   * カード上のサムネイル画像。`src/app/assets/images/nico-highlight-thumbs/` 直下のファイル名。
   * 例: `sm18474594.webp`。省略時やファイルが無いときはプレースホルダー表示。
   */
  thumbnailFile?: string;
  /**
   * サムネを assets に置かない場合の URL（例: `public/nico-thumbs/sm.webp` → `/nico-thumbs/sm.webp`）。
   */
  thumbnailFallbackSrc?: string;
};

/**
 * ABOUT のハイライト（ニコニコのみ）。
 * 見出しは `title`、紐づけは `fileName` / `nicovideoUrl` で行います（`title` は自由に変更可）。
 */
export const ABOUT_NICONICO_HIGHLIGHTS: AboutNiconicoHighlight[] = [
  {
    title: '世界の屁こき隊（仮）',
    nicovideoUrl: 'https://www.nicovideo.jp/watch/sm18474594',
    // mp4 のみ同梱（.webm は ~42MiB で Cloudflare Pages の 25MiB/ファイル制限を超えるため置かない）
    fileName: 'sm18474594.mp4',
    fallbackSrc: '/videos/sm18474594.mp4',
    thumbnailFile: 'sm18474594.webp',
  },
  {
    title: '世界の屁こき隊 アイマス2最終回 ラストのshiny smile',
    nicovideoUrl: 'https://www.nicovideo.jp/watch/sm22867255',
    fileName: 'sm22867255.webm',
    fallbackSrc: '/videos/sm22867255.webm',
    thumbnailFile: 'sm22867255.webp',
  },
  {
    title: '築地の中のマグロネット',
    nicovideoUrl: 'https://www.nicovideo.jp/watch/sm26292478',
    fileName: 'sm26292478.webm',
    fallbackSrc: '/videos/sm26292478.webm',
    thumbnailFile: 'sm26292478.webp',
  },
  {
    title: '世界の屁こき隊:ライジングキャノンUC',
    nicovideoUrl: 'https://www.nicovideo.jp/watch/sm22891428',
    fileName: 'sm22891428.mp4',
    fallbackSrc: '/videos/sm22891428.mp4',
    thumbnailFile: 'sm22891428.webp',
  },
];

export function resolveHighlightVideoSrc(h: AboutNiconicoHighlight): string {
  return urlByFileName.get(h.fileName) ?? h.fallbackSrc;
}

/** カード・動画 poster 用。assets に無いときは `thumbnailFallbackSrc` */
export function resolveHighlightThumbnailSrc(
  h: AboutNiconicoHighlight
): string | null {
  const name = h.thumbnailFile?.trim();
  if (!name) return h.thumbnailFallbackSrc?.trim() ?? null;
  return thumbUrlByFileName.get(name) ?? h.thumbnailFallbackSrc?.trim() ?? null;
}
