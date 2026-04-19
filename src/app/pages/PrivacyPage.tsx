import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { privacyPolicyByLang } from '../config/privacyPolicy';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const p = privacyPolicyByLang[language];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest text-center">{p.title}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <p className="text-sm text-muted-foreground text-center mb-10">{p.lastUpdated}</p>

      <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-8 md:p-10 shadow-xl shadow-primary/10 space-y-10">
        {p.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-base font-medium text-foreground tracking-wide border-b border-primary/20 pb-2">
              {section.heading}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-center">
        <Link
          to="/"
          className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
        >
          TOP
        </Link>
      </p>
    </div>
  );
}
