import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, X } from 'lucide-react';
import { socialProfileUrls } from '../config/socialUrls';

const doneruBannerUrl = new URL('../assets/images/doneru_bunner.webp', import.meta.url).href;
const shopImageUrl = new URL('../assets/images/shop.webp', import.meta.url).href;
const amazonImageUrl = new URL('../assets/images/amazon.webp', import.meta.url).href;
const shopUrl = import.meta.env.VITE_SHOP_URL;
const amazonUrl = import.meta.env.VITE_AMAZON_URL;

export default function SupportPage() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="tracking-widest">{t.support.title}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary to-transparent" />
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-lg border border-primary/30 p-12 shadow-xl shadow-primary/10 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 mb-8">
          <Heart className="w-12 h-12 text-accent" />
        </div>

        <h2 className="mb-4 glow-text">{t.support.thankYouHeading}</h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          {t.support.thankYouBody}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 border border-accent/50 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:-translate-y-1"
        >
          <span className="tracking-widest flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {t.support.cta}
          </span>
        </button>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div className="p-4 rounded-lg bg-muted/10 border border-primary/10 hover:text-foreground transition-all duration-300">
            <a href={shopUrl} className="block w-full rounded-xs" target="_blank" rel="noopener noreferrer">
              <img src={shopImageUrl} alt="shop link image" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
              <p className="text-center mt-2">{t.support.shopMessage}</p>
            </a>
          </div>
          <div className="p-4 rounded-lg bg-muted/10 border border-primary/10 hover:text-foreground transition-all duration-300">
            <a href={amazonUrl} className="block w-full rounded-xs" target="_blank" rel="noopener noreferrer">
              <img src={amazonImageUrl} alt="Amazon wishlist link image" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
              <p className="text-center mt-2">{t.support.amazonWishlistMessage}</p>
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-card/95 backdrop-blur-md rounded-lg border border-primary/30 shadow-2xl shadow-primary/20 max-w-md w-full p-8 animate-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/20 hover:bg-muted/40 border border-primary/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 mb-6">
                <Heart className="w-8 h-8 text-accent" />
              </div>

              <h3 className="mb-4 tracking-wider">{t.support.modalTitle}</h3>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t.support.modalMessage}
              </p>

              <a
                href={socialProfileUrls.doneru}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block max-w-full rounded-lg border border-accent/50 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <img
                  src={doneruBannerUrl}
                  alt={t.support.doneruButton}
                  className="block w-full max-w-xs mx-auto h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </a>

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full px-6 py-3 rounded-lg bg-muted/20 hover:bg-muted/30 border border-primary/20 transition-colors"
              >
                {t.support.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
