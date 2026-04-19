import { createBrowserRouter } from 'react-router';
import RootLayout from './components/RootLayout';
import TopPage from './pages/TopPage';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: TopPage },
      { path: 'about', Component: AboutPage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'support', Component: SupportPage },
      { path: 'contact', Component: ContactPage },
      { path: 'privacy', Component: PrivacyPage },
    ],
  },
]);
