import { useLanguage } from '../contexts/LanguageContext';
import { Calendar } from 'lucide-react';

const scheduleDummyImage = new URL('../assets/images/dummy/schedule_twicth.webp', import.meta.url).href;

export default function SchedulePage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          {t.schedule.title}
        </h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-8 shadow-xl shadow-primary/10">
        <h2 className="mb-8 text-center tracking-wider">{t.schedule.upcoming}</h2>

        <div className="overflow-hidden rounded-lg border border-primary/20">
          <img
            src={scheduleDummyImage}
            alt={t.schedule.upcoming}
            className="w-full h-auto block"
          />
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Schedule synced with Twitch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
