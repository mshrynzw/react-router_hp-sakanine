const dummyImageModules = import.meta.glob<string>(
  '../assets/images/dummy/*.{jpg,jpeg,png,webp,gif,svg}',
  { eager: true, import: 'default' }
);

function fileNameFromGlobPath(globPath: string): string {
  const seg = globPath.split('/');
  return seg[seg.length - 1] ?? globPath;
}

const urlByFileName = new Map<string, string>();
for (const [path, url] of Object.entries(dummyImageModules)) {
  urlByFileName.set(fileNameFromGlobPath(path), url);
}

/**
 * `src/app/assets/images/dummy/` 直下のファイル名（例: `activity_x_1.jpg`）から Vite の URL を返す。
 * 見つからないときは `null`。
 */
export function getDummyImageUrlByFileName(fileName: string): string | null {
  const trimmed = fileName.trim();
  if (!trimmed) return null;
  return urlByFileName.get(trimmed) ?? null;
}

/**
 * サムネをファイル名で指定しないときのローテーション用（パス名ソート順）。
 */
export const DUMMY_IMAGE_URLS_ROTATION = Object.keys(dummyImageModules)
  .sort()
  .map((key) => dummyImageModules[key]);
