import { MetadataRoute } from 'next'

const DOMAIN = 'https://v0-timezone-eight.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/api/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}
