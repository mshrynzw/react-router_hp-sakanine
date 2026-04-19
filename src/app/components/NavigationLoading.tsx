import { useNavigation } from 'react-router';

/**
 * ルート遷移中（チャンク読み込み・データ取得など）に表示するインジケーター。
 * RootLayout 配下でマウントすること。
 */
export default function NavigationLoading() {
  const navigation = useNavigation();
  const busy = navigation.state === 'loading' || navigation.state === 'submitting';

  if (!busy) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200]"
      role="progressbar"
      aria-busy="true"
      aria-valuetext="Loading"
    >
      <div className="relative h-0.5 w-full overflow-hidden bg-primary/15">
        <div className="animate-nav-loading-bar absolute inset-y-0 left-0 w-[45%] rounded-full bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_12px_var(--glow-blue)]" />
      </div>
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-80"
        aria-hidden
      />
    </div>
  );
}
