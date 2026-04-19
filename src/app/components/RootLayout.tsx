import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import TunnelBackground from './TunnelBackground';

export default function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <TunnelBackground />
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
