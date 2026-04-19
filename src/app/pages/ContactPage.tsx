import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '', budget: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest flex items-center gap-3">
          <Mail className="w-8 h-8" />
          {t.contact.title}
        </h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide">
        {t.contact.intro}
      </p>

      <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-8 shadow-xl shadow-primary/10">
        {submitted ? (
          <div className="text-center py-12 animate-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="mb-4 glow-text">{t.contact.success}</h2>
            <p className="text-muted-foreground">
              I'll get back to you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm tracking-wider">
                {t.contact.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm tracking-wider">
                {t.contact.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm tracking-wider">
                {t.contact.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block mb-2 text-sm tracking-wider">
                {t.contact.budget}
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border border-primary/50 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="tracking-widest">{t.contact.submit}</span>
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-muted/10 border border-primary/10 backdrop-blur-sm">
          <h3 className="mb-3 tracking-wider">Email</h3>
          <p className="text-muted-foreground">contact@streamer.example</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/10 border border-primary/10 backdrop-blur-sm">
          <h3 className="mb-3 tracking-wider">Discord</h3>
          <p className="text-muted-foreground">streamer#1234</p>
        </div>
      </div>
    </div>
  );
}
