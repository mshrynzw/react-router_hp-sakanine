import { createBrowserRouter } from 'react-router';
import RootLayout from './components/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: () => import('./pages/TopPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'about',
        lazy: () => import('./pages/AboutPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'schedule',
        lazy: () => import('./pages/SchedulePage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'support',
        lazy: () => import('./pages/SupportPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'contact',
        lazy: () => import('./pages/ContactPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'privacy',
        lazy: () => import('./pages/PrivacyPage').then((m) => ({ Component: m.default })),
      },
    ],
  },
]);
