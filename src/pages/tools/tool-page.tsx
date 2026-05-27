import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ToolLandingPage from './tool-landing-page';
import { useLocalization } from '@/i18n/useLocalization';
import { useToolPages } from '@/i18n/useToolPages';

/**
 * Single-slug wrapper around ToolLandingPage. Looks the tool up from
 * the localized content map; renders a friendly fallback if the slug is unknown.
 */
const ToolPage: React.FC = () => {
  const { t } = useLocalization('interface');
  const { getToolBySlug } = useToolPages();
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <Card className="max-w-3xl mx-auto my-8 sci-fi-frame">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            {t('toolPage.notFoundTitle')}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t('toolPage.notFoundBody')}
          </p>
          <Link
            to="/tools"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            {t('toolPage.browseAll')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <ToolLandingPage tool={tool} />;
};

export default ToolPage;
