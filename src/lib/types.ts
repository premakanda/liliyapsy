export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage: string | null;
  coverAlt: string | null;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
  author: string;
  content: string;
}
export interface Topic {
  slug: string;
  title: string;
  description: string;
  cardTitle: string;
  intro: string;
  workProcess: string;
  important: string;
  published: boolean;
}
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  publish: boolean;
}
export interface SiteContent {
  site: {
    brandName: string;
    role: string;
    domain: string;
    siteUrl: string | null;
    siteLanguage: "ru";
    hero: {
      eyebrow: string;
      headline: string[];
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    contacts: {
      phone: string | null;
      email: string | null;
      telegramUrl: string | null;
      instagramUrl: string | null;
      whatsappUrl: string | null;
      viberUrl: string | null;
    };
    about: {
      title: string;
      introduction: string;
      approachLabel: string;
      approachTitle: string;
      features: { icon: string; title: string; description: string }[];
      educationTitle: string;
      educationText: string;
      experienceTitle: string;
      experienceText: string;
      sessionsLabel: string;
    };
    booking: {
      title: string;
      description: string;
      telegramLabel: string;
      facebookLabel: string;
      instagramLabel: string;
      facebookUrl: string | null;
      detailsTitle: string;
      format: string;
      durationMinutes: number;
      language: string;
      paymentNote: string;
    };
    footer: {
      legalIdentity: string;
      taxId: string;
      consultationNote: string;
      schedule: string;
      telegramHandle: string;
      telegramUrl: string;
      email: string;
      copyright: string;
      informationNotice: string;
      topics: string[];
    };
    consultations: {
      format: string | null;
      durationMinutes: number | null;
      priceAmount: number | null;
      currency: string | null;
      bookingUrl: string | null;
      timeZone: string | null;
      availability: string | null;
    };
    professional: {
      education: unknown;
      credentials: unknown;
      experienceYears: number | null;
      jurisdiction: string | null;
      worksWithMinors: boolean | null;
      offersCouples: boolean | null;
    };
    publication: {
      servicesVerified: boolean;
      legalReviewed: boolean;
      portraitIsAuthentic: boolean;
      reviewsApproved: boolean;
    };
  };
  articles: Article[];
  topics: Topic[];
  faq: FaqItem[];
  faqIntroduction: string;
  faqHomeIds: string[];
  preview: boolean;
}
