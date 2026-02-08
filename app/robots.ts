import { MetadataRoute } from 'next'

const DOMAIN = 'https://www.timezone-world-v0.com';

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
