import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import TunnelBackground from './TunnelBackground';
import NavigationLoading from './NavigationLoading';

export default function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <TunnelBackground />
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
