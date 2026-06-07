import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/'],
      },
      { userAgent: 'Mediapartners-Google', allow: '/' },
      { userAgent: 'Google-Display-Ads-Bot', allow: '/' },
      { userAgent: 'AdsBot-Google', allow: '/' },
      { userAgent: 'AdsBot-Google-Mobile', allow: '/' },
    ],
    sitemap: SITE_ORIGIN + '/sitemap.xml',
  };
}
