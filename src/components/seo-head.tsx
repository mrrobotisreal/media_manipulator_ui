import { useSeoMeta } from '@/lib/seo';

/**
 * Declarative SEO updater for non-routed views. Most callers should rely
 * on the Router's RouteAnalytics + useSeoMeta integration instead.
 */
const SeoHead: React.FC<{ path: string }> = ({ path }) => {
  useSeoMeta(path);
  return null;
};

export default SeoHead;
