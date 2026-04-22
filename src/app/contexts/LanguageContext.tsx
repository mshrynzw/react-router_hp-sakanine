import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ja' | 'en' | 'zh' | 'ko';

interface Translations {
  nav: {
    top: string;
    about: string;
    schedule: string;
    support: string;
    contact: string;
  };
  hero: {
    live: string;
    offline: string;
    streamerName: string;
  };
  activityFeed: {
    title: string;
    latest: string;
    loading: string;
    empty: string;
    /** VITE_USE_DUMMY_ACTIVITY_THUMBS 時、API 結果が空のときのカードタイトル */
    dummyCardTitle: string;
    /** 上記ダミーカード表示時、API 失敗を説明する注記 */
    dummyFeedNotice: string;
  };
  about: {
    title: string;
    profile: string;
    highlights: string;
    niconicoHighlights: string;
    /** ハイライト動画モーダル内のニコニコへのリンク */
    niconicoOpenExternal: string;
    /** 再生ボタンの説明（アクセシビリティ） */
    playHighlight: string;
    pastGames: string;
    bio: string;
  };
  schedule: {
    title: string;
    upcoming: string;
    noSchedule: string;
  };
  support: {
    title: string;
    cta: string;
    modalTitle: string;
    modalMessage: string;
    doneruButton: string;
    close: string;
  };
  contact: {
    title: string;
    /** 問い合わせページ冒頭の案内（案件募集など） */
    intro: string;
    name: string;
    email: string;
    message: string;
    budget: string;
    submit: string;
    success: string;
  };
  footer: {
    social: string;
    email: string;
    discord: string;
    privacy: string;
  };
}

const translations: Record<Language, Translations> = {
  ja: {
    nav: {
      top: 'TOP',
      about: 'ABOUT',
      schedule: 'SCHEDULE',
      support: 'SUPPORT',
      contact: 'CONTACT',
    },
    hero: {
      live: 'ライブ配信中',
      offline: 'オフライン',
      streamerName: 'サカナイン',
    },
    activityFeed: {
      title: '最新アクティビティ',
      latest: '最新',
      loading: '読み込み中…',
      empty: '表示できるアクティビティがありません。APIキー等の設定をご確認ください。',
      dummyCardTitle: 'プレビュー（ダミー）',
      dummyFeedNotice:
        'API から取得できなかったため、ローカルのダミー画像で表示しています。',
    },
    about: {
      title: 'ABOUT',
      profile: 'プロフィール',
      highlights: 'ハイライト',
      niconicoHighlights: 'ニコニコ動画 - ベストモーメント',
      niconicoOpenExternal: 'ニコニコ大百科（外部リンク）',
      pastGames: '過去のゲーム',
      playHighlight: '動画を再生',
      bio: '2011年から配信を開始。ゲーム配信者として、日々エンターテインメントをお届けしています。主にアクションゲームやRPGを中心に配信中です。現在はTwitchで配信中です。',
    },
    schedule: {
      title: '配信スケジュール',
      upcoming: '今後の配信予定',
      noSchedule: 'スケジュールは近日公開予定です',
    },
    support: {
      title: 'SUPPORT',
      cta: '応援する / 寄付',
      modalTitle: '応援ありがとうございます',
      modalMessage: 'Doneruを通じて配信を応援していただけます',
      doneruButton: 'Doneruで応援する',
      close: '閉じる',
    },
    contact: {
      title: 'CONTACT',
      intro: '現在、案件のご依頼を募集しております。お気軽にお問い合わせください。',
      name: '名前',
      email: 'メールアドレス',
      message: 'メッセージ',
      budget: '予算（任意）',
      submit: '送信',
      success: 'メッセージを送信しました！',
    },
    footer: {
      social: 'SNS',
      email: 'メール',
      discord: 'Discord',
      privacy: 'プライバシーポリシー',
    },
  },
  en: {
    nav: {
      top: 'TOP',
      about: 'ABOUT',
      schedule: 'SCHEDULE',
      support: 'SUPPORT',
      contact: 'CONTACT',
    },
    hero: {
      live: 'LIVE NOW',
      offline: 'OFFLINE',
      streamerName: 'Sakanine',
    },
    activityFeed: {
      title: 'Latest Activity',
      latest: 'Latest',
      loading: 'Loading…',
      empty: 'No activity to show. Check your API keys and environment variables.',
      dummyCardTitle: 'Preview (dummy)',
      dummyFeedNotice:
        'Could not load activity from the API. Showing local placeholder images.',
    },
    about: {
      title: 'ABOUT',
      profile: 'Profile',
      highlights: 'Highlights',
      niconicoHighlights: 'NicoNico - Best Moments',
      niconicoOpenExternal: 'NicoNico Encyclopedia (External Link)',
      pastGames: 'Past Games',
      playHighlight: 'Play video',
      bio: 'Started streaming in 2011. As a game streamer, I deliver entertainment daily. Streaming mainly action games and RPGs. I\'m currently streaming on Twitch.',
    },
    schedule: {
      title: 'Stream Schedule',
      upcoming: 'Upcoming Streams',
      noSchedule: 'Schedule coming soon',
    },
    support: {
      title: 'SUPPORT',
      cta: 'Support / Donate',
      modalTitle: 'Thank You for Your Support',
      modalMessage: 'You can support my stream via Doneru',
      doneruButton: 'Support via Doneru',
      close: 'Close',
    },
    contact: {
      title: 'CONTACT',
      intro: "I'm open to commissions and project work. Feel free to reach out.",
      name: 'Name',
      email: 'Email',
      message: 'Message',
      budget: 'Budget (Optional)',
      submit: 'Submit',
      success: 'Message sent successfully!',
    },
    footer: {
      social: 'SNS',
      email: 'Email',
      discord: 'Discord',
      privacy: 'Privacy Policy',
    },
  },
  zh: {
    nav: {
      top: 'TOP',
      about: 'ABOUT',
      schedule: 'SCHEDULE',
      support: 'SUPPORT',
      contact: 'CONTACT',
    },
    hero: {
      live: '正在直播',
      offline: '离线',
      streamerName: 'Sakanine',
    },
    activityFeed: {
      title: '最新动态',
      latest: '最新',
      loading: '加载中…',
      empty: '暂无动态。请检查 API 密钥与环境变量配置。',
      dummyCardTitle: '预览（占位）',
      dummyFeedNotice: '无法从 API 获取动态，正在显示本地占位图片。',
    },
    about: {
      title: 'ABOUT',
      profile: '个人资料',
      highlights: '精彩集锦',
      niconicoHighlights: 'NicoNico - 精彩时刻',
      niconicoOpenExternal: 'NicoNico 大百科（外部链接）',
      pastGames: 'Past Games',
      playHighlight: '播放视频',
      bio: '配信始于2011年。作为游戏主播，我每天为大家带来娱乐内容。主要直播动作游戏和RPG游戏。我目前正在Twitch上直播。',
    },
    schedule: {
      title: '直播时间表',
      upcoming: '即将直播',
      noSchedule: '时间表即将公布',
    },
    support: {
      title: 'SUPPORT',
      cta: '支持 / 捐赠',
      modalTitle: '感谢您的支持',
      modalMessage: '您可以通过Doneru支持我的直播',
      doneruButton: '通过Doneru支持',
      close: '关闭',
    },
    contact: {
      title: 'CONTACT',
      intro: '目前正接受项目与合作咨询，欢迎与我们联系。',
      name: '姓名',
      email: '邮箱',
      message: '消息',
      budget: '预算（可选）',
      submit: '提交',
      success: '消息发送成功！',
    },
    footer: {
      social: 'SNS',
      email: '邮箱',
      discord: 'Discord',
      privacy: '隐私政策',
    },
  },
  ko: {
    nav: {
      top: 'TOP',
      about: 'ABOUT',
      schedule: 'SCHEDULE',
      support: 'SUPPORT',
      contact: 'CONTACT',
    },
    hero: {
      live: '라이브 중',
      offline: '오프라인',
      streamerName: 'Sakanine',
    },
    activityFeed: {
      title: '최신 활동',
      latest: '최신',
      loading: '불러오는 중…',
      empty: '표시할 활동이 없습니다. API 키와 환경 변수를 확인해 주세요.',
      dummyCardTitle: '미리보기(더미)',
      dummyFeedNotice:
        'API에서 활동을 불러오지 못해 로컬 더미 이미지로 표시합니다.',
    },
    about: {
      title: 'ABOUT',
      profile: '프로필',
      highlights: '하이라이트',
      niconicoHighlights: 'NicoNico - 베스트 모먼트',
      niconicoOpenExternal: 'NicoNico 대백과사전（외부 링크）',
      pastGames: 'Past Games',
      playHighlight: '동영상 재생',
      bio: '방송 시작일 2011년. 게임 스트리머로서 매일 엔터테인먼트를 제공합니다. 주로 액션 게임과 RPG를 방송합니다. 현재는 Twitch로 전송 중입니다.',
    },
    schedule: {
      title: '방송 일정',
      upcoming: '다가오는 방송',
      noSchedule: '일정이 곧 공개됩니다',
    },
    support: {
      title: 'SUPPORT',
      cta: '후원하기 / 기부',
      modalTitle: '후원해 주셔서 감사합니다',
      modalMessage: 'Doneru를 통해 방송을 후원할 수 있습니다',
      doneruButton: 'Doneru로 후원하기',
      close: '닫기',
    },
    contact: {
      title: 'CONTACT',
      intro: '현재 프로젝트·의뢰를 받고 있습니다. 편하게 문의해 주세요.',
      name: '이름',
      email: '이메일',
      message: '메시지',
      budget: '예산 (선택사항)',
      submit: '제출',
      success: '메시지가 성공적으로 전송되었습니다!',
    },
    footer: {
      social: 'SNS',
      email: '이메일',
      discord: 'Discord',
      privacy: '개인정보 보호정책',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const GEO_COUNTRY_ENDPOINT =
  (import.meta.env.VITE_GEO_COUNTRY_ENDPOINT ?? '').trim() ||
  'https://get.geojs.io/v1/ip/country.json';
const GEO_COUNTRY_OVERRIDE = (import.meta.env.VITE_GEO_COUNTRY_OVERRIDE ?? '').trim();

function mapCountryCodeToLanguage(countryCode: string): Language {
  if (countryCode === 'JP') return 'ja';
  if (countryCode === 'CN') return 'zh';
  if (countryCode === 'KR') return 'ko';
  return 'en';
}

function readCountryOverride(): string | undefined {
  const fromEnv = GEO_COUNTRY_OVERRIDE.toUpperCase();
  if (fromEnv) return fromEnv;

  const fromQuery = new URLSearchParams(window.location.search).get('geoCountry');
  if (fromQuery) return fromQuery.toUpperCase();

  const fromStorage = localStorage.getItem('geoCountryOverride');
  if (fromStorage) return fromStorage.toUpperCase();

  return undefined;
}

async function detectLanguageFromCountry(): Promise<Language | undefined> {
  const overrideCountry = readCountryOverride();
  if (overrideCountry) return mapCountryCodeToLanguage(overrideCountry);

  const ac = new AbortController();
  const timeoutId = window.setTimeout(() => ac.abort(), 2500);
  try {
    const res = await fetch(GEO_COUNTRY_ENDPOINT, {
      method: 'GET',
      signal: ac.signal,
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as Record<string, unknown>;
    const country =
      typeof data.country === 'string'
        ? data.country
        : typeof data.countryCode === 'string'
          ? data.countryCode
          : typeof data.country_code === 'string'
            ? data.country_code
            : undefined;
    if (!country) return undefined;
    return mapCountryCodeToLanguage(country.toUpperCase());
  } catch {
    return undefined;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function detectLanguageFromBrowser(): Language {
  const intlLocale =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().locale
      : undefined;
  const htmlLang =
    typeof document !== 'undefined' ? document.documentElement.lang : undefined;

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
    intlLocale,
    htmlLang,
  ]
    .filter((lang): lang is string => Boolean(lang))
    .map((lang) => lang.toLowerCase());

  for (const lang of candidates) {
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('ko')) return 'ko';
  }

  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => detectLanguageFromBrowser());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    localStorage.setItem('languagePreferenceMode', 'manual');
  };

  useEffect(() => {
    const mode = localStorage.getItem('languagePreferenceMode');
    const saved = localStorage.getItem('language') as Language;
    if (mode === 'manual' && saved && ['ja', 'en', 'zh', 'ko'].includes(saved)) {
      setLanguageState(saved);
      return;
    }
    const detectedByBrowser = detectLanguageFromBrowser();
    setLanguageState(detectedByBrowser);
    localStorage.setItem('language', detectedByBrowser);
    localStorage.setItem('languagePreferenceMode', 'auto');

    let cancelled = false;
    void (async () => {
      const detectedByCountry = await detectLanguageFromCountry();
      if (cancelled || !detectedByCountry) return;
      if (localStorage.getItem('languagePreferenceMode') !== 'auto') return;
      setLanguageState(detectedByCountry);
      localStorage.setItem('language', detectedByCountry);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
