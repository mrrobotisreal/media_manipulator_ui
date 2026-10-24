import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /dr is the private Double Raven partner portal — keep it out of search
        // indexes entirely (also noindex'd via metadata; excluded from sitemap).
        // /r/ is the MM32 result share-link route: private by construction,
        // never indexable (also noindex via metadata when the route lands).
        disallow: ['/admin/', '/private/', '/dr', '/r/'],
      },
      { userAgent: 'Mediapartners-Google', allow: '/' },
      { userAgent: 'Google-Display-Ads-Bot', allow: '/' },
      { userAgent: 'AdsBot-Google', allow: '/' },
      { userAgent: 'AdsBot-Google-Mobile', allow: '/' },
    ],
    sitemap: SITE_ORIGIN + '/sitemap.xml',
  };
}
