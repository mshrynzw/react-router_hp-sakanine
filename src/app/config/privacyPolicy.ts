import type { Language } from '../contexts/LanguageContext';

export interface PrivacyPolicySection {
  heading: string;
  paragraphs: string[];
}

export interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
}

export const privacyPolicyByLang: Record<Language, PrivacyPolicyContent> = {
  ja: {
    title: 'プライバシーポリシー',
    lastUpdated: '最終更新日：2026年4月19日',
    sections: [
      {
        heading: '1. はじめに',
        paragraphs: [
          '本ウェブサイト（以下「当サイト」といいます）を運営する者（以下「運営者」といいます）は、利用者の個人情報の保護に努めます。本ポリシーは、当サイトにおける個人情報等の取扱いについて定めるものです。',
        ],
      },
      {
        heading: '2. 収集する情報',
        paragraphs: [
          '当サイトでは、次の情報を取得する場合があります。',
          '・お問い合わせフォーム等を通じて、利用者が任意で入力した氏名、メールアドレス、メッセージの内容',
          '・アクセス解析のための Cookie および類似の技術に基づく閲覧履歴・端末情報（ブラウザの種類、参照元、日時など）',
          '・外部サービス（下記「第三者提供」参照）が提供する、公開プロフィールに関する情報や利用状況に関する統計情報',
        ],
      },
      {
        heading: '3. 利用目的',
        paragraphs: [
          '取得した情報は、次の目的の範囲内で利用します。',
          '・お問い合わせへの対応、連絡のため',
          '・当サイトの表示・機能改善、不正利用の防止、セキュリティ確保のため',
          '・アクセス状況の把握・分析のため（匿名化された統計として取り扱う場合があります）',
        ],
      },
      {
        heading: '4. 第三者提供・外部サービス',
        paragraphs: [
          '当サイトは、ホスティングやアクセス解析、埋め込みコンテンツの表示などのため、第三者が提供するサービスを利用する場合があります。例として、動画・配信プラットフォーム（YouTube、Twitch 等）、ソーシャルメディア、決済・寄付プラットフォーム、ホスティング事業者などが該当し得ます。これらのサービスは、各提供者のプライバシーポリシーに従い、独自に Cookie やログを取得する場合があります。',
          '法令に基づく開示請求等の場合を除き、運営者は利用者の同意なく、個人を特定できる情報を第三者に販売・貸与することはありません。',
        ],
      },
      {
        heading: '5. 保存期間',
        paragraphs: [
          'お問い合わせ内容は、対応完了後、合理的な期間を経て削除します。ログや解析データは、サービス運営に必要な期間保存し、不要となった場合は削除または匿名化します。',
        ],
      },
      {
        heading: '6. セキュリティ',
        paragraphs: [
          '運営者は、個人情報の漏えい、滅失、毀損の防止のため、適切な安全管理措置を講じます。ただし、インターネット上の通信は完全な安全性を保証できないことをご了承ください。',
        ],
      },
      {
        heading: '7. 利用者の権利',
        paragraphs: [
          'ご本人からの個人情報の開示・訂正・削除・利用停止等のご請求が法令に照らし適切であると判断した場合、合理的な範囲で対応します。ご請求は、当サイトのお問い合わせ窓口からご連絡ください。',
        ],
      },
      {
        heading: '8. 本ポリシーの変更',
        paragraphs: [
          '運営者は、法令の改正や当サイトの運営上の必要に応じ、本ポリシーを変更することがあります。変更後のポリシーは、当サイト上に掲載した時点から効力を生じるものとします。',
        ],
      },
      {
        heading: '9. お問い合わせ',
        paragraphs: [
          '本ポリシーに関するお問い合わせは、当サイトのお問い合わせページに記載の方法にてご連絡ください。',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: April 19, 2026',
    sections: [
      {
        heading: '1. Introduction',
        paragraphs: [
          'This privacy policy describes how the operator of this website (the "Site") handles personal information and related data when you use the Site.',
        ],
      },
      {
        heading: '2. Information we collect',
        paragraphs: [
          'We may collect the following types of information:',
          '• Information you voluntarily provide through contact or inquiry forms, such as your name, email address, and message content.',
          '• Technical data such as cookies, browser type, referrer, and access time for analytics and security.',
          '• Aggregated or public information related to embedded services (see "Third-party services" below).',
        ],
      },
      {
        heading: '3. How we use information',
        paragraphs: [
          'We use collected information only for purposes such as:',
          '• Responding to inquiries and communicating with you.',
          '• Operating and improving the Site, preventing abuse, and maintaining security.',
          '• Understanding traffic and usage in aggregated or anonymized form where applicable.',
        ],
      },
      {
        heading: '4. Third-party services',
        paragraphs: [
          'The Site may use third-party services for hosting, analytics, embedded video or streams (e.g. YouTube, Twitch), social features, or donation platforms. Those providers may set their own cookies and collect data under their respective privacy policies.',
          'We do not sell or rent your personal information to third parties for their marketing purposes, except as required by law or with your consent where applicable.',
        ],
      },
      {
        heading: '5. Retention',
        paragraphs: [
          'Inquiry records are kept only as long as needed to handle your request and for a reasonable period thereafter. Logs and analytics data are retained for a limited period consistent with operational needs and then deleted or anonymized.',
        ],
      },
      {
        heading: '6. Security',
        paragraphs: [
          'We take reasonable measures to protect personal information. However, no transmission over the internet can be guaranteed to be completely secure.',
        ],
      },
      {
        heading: '7. Your rights',
        paragraphs: [
          'Depending on applicable law, you may have the right to access, correct, delete, or restrict processing of your personal data. Please contact us through the Site’s contact channels to make a request.',
        ],
      },
      {
        heading: '8. Changes',
        paragraphs: [
          'We may update this policy from time to time. The revised policy will be effective when posted on this page.',
        ],
      },
      {
        heading: '9. Contact',
        paragraphs: [
          'For questions about this privacy policy, please use the contact method described on the Site’s contact page.',
        ],
      },
    ],
  },
  zh: {
    title: '隐私政策',
    lastUpdated: '最后更新：2026年4月19日',
    sections: [
      {
        heading: '1. 引言',
        paragraphs: [
          '本政策说明本网站（以下简称「本站」）在运营过程中如何收集、使用和保护您的个人信息及相关数据。',
        ],
      },
      {
        heading: '2. 收集的信息',
        paragraphs: [
          '我们可能收集以下信息：',
          '• 您通过联系或咨询表单自愿提供的信息，例如姓名、电子邮箱与留言内容。',
          '• 为分析与安全目的而收集的 Cookie、浏览器类型、来源页面、访问时间等技术信息。',
          '• 与嵌入服务（见下文「第三方服务」）相关的汇总或公开信息。',
        ],
      },
      {
        heading: '3. 使用目的',
        paragraphs: [
          '我们仅在以下目的范围内使用所收集的信息：',
          '• 回复咨询并与您联系。',
          '• 运营与改进本站、防止滥用并维护安全。',
          '• 在适当情况下以匿名或汇总方式了解访问情况。',
        ],
      },
      {
        heading: '4. 第三方服务',
        paragraphs: [
          '本站可能使用第三方提供的托管、分析、嵌入视频或直播（例如 YouTube、Twitch）、社交或捐赠等服务。这些服务可能根据其隐私政策自行设置 Cookie 并收集数据。',
          '除法律要求或征得您同意的情况外，我们不会将可识别您个人身份的信息出售或出租给第三方用于其营销目的。',
        ],
      },
      {
        heading: '5. 保存期限',
        paragraphs: [
          '咨询记录在妥善处理完毕并经过合理期间后将予以删除。日志与分析数据仅在运营所需期限内保存，之后将删除或匿名化处理。',
        ],
      },
      {
        heading: '6. 安全',
        paragraphs: [
          '我们采取合理措施保护个人信息，但通过互联网传输无法保证绝对安全。',
        ],
      },
      {
        heading: '7. 您的权利',
        paragraphs: [
          '在适用法律允许的范围内，您可就个人数据的访问、更正、删除或限制处理等向我们提出申请。请通过本站提供的联系方式与我们联系。',
        ],
      },
      {
        heading: '8. 政策变更',
        paragraphs: [
          '我们可能不时更新本政策。更新后的政策自发布于本页面时起生效。',
        ],
      },
      {
        heading: '9. 联系方式',
        paragraphs: [
          '如对本隐私政策有疑问，请通过本站联系页面所载方式与我们联系。',
        ],
      },
    ],
  },
  ko: {
    title: '개인정보 처리방침',
    lastUpdated: '최종 수정일: 2026년 4월 19일',
    sections: [
      {
        heading: '1. 개요',
        paragraphs: [
          '본 방침은 본 웹사이트(이하「사이트」) 운영자가 이용자의 개인정보 및 관련 데이터를 어떻게 취급하는지 설명합니다.',
        ],
      },
      {
        heading: '2. 수집하는 정보',
        paragraphs: [
          '다음과 같은 정보를 수집할 수 있습니다.',
          '• 문의 양식 등을 통해 이용자가 자발적으로 입력한 이름, 이메일 주소, 메시지 내용',
          '• 분석·보안을 위한 쿠키, 브라우저 종류, 유입 경로, 접속 시각 등 기술 정보',
          '• 임베드된 서비스(아래「제3자 서비스」 참고)와 관련된 공개 또는 집계 정보',
        ],
      },
      {
        heading: '3. 이용 목적',
        paragraphs: [
          '수집한 정보는 다음 목적 범위에서만 이용합니다.',
          '• 문의 대응 및 연락',
          '• 사이트 운영·개선, 부정 이용 방지 및 보안 유지',
          '• 필요한 경우 익명·통계 형태로 접속 상황 파악',
        ],
      },
      {
        heading: '4. 제3자 서비스',
        paragraphs: [
          '호스팅, 분석, 동영상·방송 임베드(예: YouTube, Twitch), 소셜·기부 플랫폼 등 제3자 서비스를 이용할 수 있으며, 해당 제공자는 자체 개인정보처리방침에 따라 쿠키 등을 설정할 수 있습니다.',
          '법령에 따른 경우 등을 제외하고, 운영자는 이용자의 동의 없이 식별 가능한 개인정보를 제3자에게 판매·대여하지 않습니다.',
        ],
      },
      {
        heading: '5. 보관 기간',
        paragraphs: [
          '문의 내용은 처리 완료 후 합리적인 기간이 지나면 삭제합니다. 로그·분석 데이터는 운영에 필요한 기간 동안만 보관한 뒤 삭제하거나 익명화합니다.',
        ],
      },
      {
        heading: '6. 보안',
        paragraphs: [
          '개인정보 유출·멸실·훼손 방지를 위해 적절한 조치를 취합니다. 다만 인터넷상의 통신은 완전한 안전을 보장할 수 없습니다.',
        ],
      },
      {
        heading: '7. 이용자의 권리',
        paragraphs: [
          '관련 법령에 따라 개인정보 열람·정정·삭제·처리 정지 등을 요청하실 수 있습니다. 사이트에 안내된 연락 방법으로 문의해 주세요.',
        ],
      },
      {
        heading: '8. 방침의 변경',
        paragraphs: [
          '본 방침은 법령 또는 운영상 필요에 따라 변경될 수 있으며, 변경된 내용은 본 페이지에 게시한 시점부터 효력이 있습니다.',
        ],
      },
      {
        heading: '9. 문의',
        paragraphs: [
          '본 개인정보 처리방침에 관한 문의는 사이트 연락처 안내에 따라 해 주시기 바랍니다.',
        ],
      },
    ],
  },
};
