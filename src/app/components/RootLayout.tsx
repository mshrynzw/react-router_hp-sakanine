import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
// import TunnelBackground from './TunnelBackground';
import NavigationLoading from './NavigationLoading';

export default function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/*
        <TunnelBackground />
        NOTE: 後で復活させる可能性があるためコメントアウト。
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020617]"
      >
        {/* 上が明るめ、下が暗めの青系グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700/35 via-blue-950/35 to-black" />
        {/* 画面上部の柔らかい光 */}
        <div className="absolute -top-[35%] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(closest-side,rgba(56,189,248,0.25),rgba(14,116,144,0.10),transparent_70%)] blur-2xl" />
        {/* 斜め方向の深い色味 */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,132,199,0.10),transparent_35%,rgba(30,58,138,0.10))]" />
        {/* 軽いビネット（下側を強め） */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.70)_100%)]" />
      </div>
      <NavigationLoading />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
