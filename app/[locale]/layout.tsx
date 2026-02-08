import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { notFound } from 'next/navigation'
import { translations } from '@/lib/translations'
import '../globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const DOMAIN = 'https://www.timezone-world-v0.com';


type Locale = 'en' | 'zh';

const locales: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export async function generateMetadata(
  props: { params: Promise<{ locale: Locale }> }
): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale === 'zh' ? 'zh' : 'en';
  const t = translations[locale];

  return {
    title: t.tdk.title,
    description: t.tdk.description,
    keywords: [
      'timezone converter',
      'time zone conversion',
      'world clock',
      'UTC converter',
      'international time converter',
      'timezone calculator',
      '时区转换',
      '世界时钟',
    ],
    creator: 'TimeZone Converter',
    publisher: 'TimeZone Converter',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: `${DOMAIN}/${locale}`,
      siteName: t.siteNames,
      title: t.tdk.title,
      description: t.tdk.description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.siteNames,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.tdk.title,
      description: t.tdk.description,
      images: ['/og-image.png'],
      creator: '@timezoneconverter',
    },
    alternates: {
      canonical: `${DOMAIN}/${locale}`,
      languages: {
        'en': `${DOMAIN}/en`,
        'zh': `${DOMAIN}/zh`,
      },
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    manifest: '/site.webmanifest',
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TimeZone Converter',
  url: DOMAIN,
  description: 'Fast and accurate timezone conversion for developers, business professionals, and travelers.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
  }
) {
  const params = await props.params;
  const locale = params.locale;

  if (!locales[locale]) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="x-default" content={DOMAIN} />
      </head>
      <body className={`font-sans antialiased`}>
        {props.children}
        <Analytics />
      </body>
    </html>
  )
}
