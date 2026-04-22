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

/** カード用サムネイル（`src/app/assets/images/highlight-thumbs/`） */
const bundledThumbnails = import.meta.glob<string>(
  '../assets/images/highlight-thumbs/*.{jpg,jpeg,png,webp,gif}',
  { eager: true, import: 'default' }
);

const thumbUrlByFileName = new Map<string, string>();
for (const [path, url] of Object.entries(bundledThumbnails)) {
  const name = path.split('/').pop();
  if (name) thumbUrlByFileName.set(name, url);
}

export type AboutHighlight = {
  /** カード・モーダルに表示するタイトル（動画ファイル名ではなく任意の文言） */
  title: string;
  /** 動画のソース */
  source: 'nico' | 'twitch';
  /** ニコニコ動画の視聴ページ URL */
  videoUrl: string;
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
   * カード上のサムネイル画像。`src/app/assets/images/highlight-thumbs/` 直下のファイル名。
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
export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    title: '世界の屁こき隊（仮）',
    source: 'nico',
    videoUrl: 'https://www.nicovideo.jp/watch/sm22878531',
    fileName: 'sm22878531.webm',
    fallbackSrc: '/videos/sm22878531.webm',
    thumbnailFile: 'sm22878531.webp',
  },
  {
    title: '思い通りにならないとキレる配信者さん',
    source: 'twitch',
    videoUrl: 'https://www.twitch.tv/sakanine/clip/BlazingDelightfulOrangeDAESuppy-_2O6ewN9B_aGyp01',
    fileName: '1220406362.webm',
    fallbackSrc: '/videos/1220406362.mp4',
    thumbnailFile: '1220406362.webp',
  },
  {
    title: '！！？！？！？！？！？！？！？',
    source: 'twitch',
    videoUrl: 'https://www.twitch.tv/sakanine/clip/LightWonderfulSrirachaMoreCowbell',
    fileName: '900088467.webm',
    fallbackSrc: '/videos/900088467.webm',
    thumbnailFile: '900088467.webp',
  },
  {
    title: '世界の屁こき隊:ライジングキャノンUC',
    source: 'nico',
    videoUrl: 'https://www.nicovideo.jp/watch/sm22891428',
    fileName: 'sm22891428.mp4',
    fallbackSrc: '/videos/sm22891428.mp4',
    thumbnailFile: 'sm22891428.webp',
  },
];

export function resolveHighlightVideoSrc(h: AboutHighlight): string {
  return urlByFileName.get(h.fileName) ?? h.fallbackSrc;
}

/** カード・動画 poster 用。assets に無いときは `thumbnailFallbackSrc` */
export function resolveHighlightThumbnailSrc(
  h: AboutHighlight
): string | null {
  const name = h.thumbnailFile?.trim();
  if (!name) return h.thumbnailFallbackSrc?.trim() ?? null;
  return thumbUrlByFileName.get(name) ?? h.thumbnailFallbackSrc?.trim() ?? null;
}
