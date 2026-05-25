import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import { AD_SLOTS } from '@/lib/adSlots';

const quickLinks = [
  { label: 'Return to base', to: '/' },
  { label: 'Tools array', to: '/tools' },
  // Hidden during AdSense review — re-enable when the blog returns.
  // { label: 'Field guides (blog)', to: '/blog' },
  { label: 'Tutorials', to: '/tutorials' },
];

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Card className="max-w-3xl mx-auto my-12 sci-fi-frame">
        <CardContent className="p-10 md:p-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Telemetry lost
          </p>
          <h1
            className="font-glitch text-[5rem] md:text-[8rem] leading-none text-card-foreground"
            aria-label="404"
          >
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-card-foreground mt-4">
            This sector of the ship doesn't exist
          </h2>
          <p className="text-muted-foreground mt-3">
            The coordinates you punched in don't map to anything on the navigation
            console. Try one of the routes below — or head back to the main bridge
            and pick a tool that does exist.
          </p>

          <nav
            aria-label="Recovery routes"
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.not_found_footer}
          adFormat="leaderboard"
          adPosition="not_found_footer"
          utmMedium="not_found_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default NotFoundPage;
